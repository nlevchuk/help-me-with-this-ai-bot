import 'dotenv/config'

import { API_CONSTANTS } from 'grammy'
import { hydrate } from '@grammyjs/hydrate'
import { run } from '@grammyjs/runner'
import { autoRetry } from '@grammyjs/auto-retry'
import memwatch from '@airbnb/node-memwatch'

import bot from './src/bot.js'
import logger from './src/logger.js'
import ai from './src/ai.js'
import Honeybadger from './src/honeybadger.js'
import textFormatter from './src/textFormatter.js'
import createComposer from './src/createComposer.js'
import { dataSource } from './src/data-source.js'
import { createDbAdapter } from './src/adapters/db.adapter.js'
import { createAiAdapter } from './src/adapters/ai.adapter.js'
import { initAppContext, startCommand } from './src/middlewares/init.middleware.js'
import {
  findCurrentUser,
  authenticateUser,
} from './src/middlewares/user.middleware.js'
import { showDonationLink } from './src/middlewares/info.middleware.js'
import { blockOtherCommands } from './src/middlewares/command.middleware.js'
import {
  checkAvailableApiCalls,
  checkMessageLength,
} from './src/middlewares/validator.middleware.js'
import { createMessageComposer } from './src/composers/message.composer.js'
import {
  createMessageTranslator,
} from './src/plugins/message-translator.plugin.js'
import {
  createMessageRemoval,
} from './src/plugins/message-removal.plugin.js'
import { botErrorHandler } from './src/errors/bot.error.js'
import customCommands from './src/utils/customCommands.js'

const main = () => {
  const dbAdapter = createDbAdapter(dataSource);
  const aiAdapter = createAiAdapter(ai);

  // Official Plugins
  bot.use(hydrate());
  bot.api.config.use(autoRetry());

  // Custom Middlewares
  bot.use(initAppContext());
  bot.use(findCurrentUser(dbAdapter));

  // Place the following command and a middleware together before any message listeners and predefined commands
  bot.command(customCommands.start, startCommand(dbAdapter))
  bot.use(authenticateUser()); // It's important to ensure that the current user exists

  // List of predefined commands
  bot.command(customCommands.showDonationLink, showDonationLink());

  // 3rd-party plugins
  bot.use(createMessageTranslator(dbAdapter, aiAdapter));
  bot.use(createMessageRemoval());

  // block requests containing commands. It should go last in the list
  bot.use(blockOtherCommands());

  // These middlewares block any manipulations with messages if a check fails
  bot.use(checkAvailableApiCalls());
  bot.use(checkMessageLength());

  bot.use(createMessageComposer(dbAdapter, aiAdapter));

  bot.catch(botErrorHandler);

  // Temporary solution to gather stats
  memwatch.on('stats', function(stats) {
    const usedHeap = stats.used_heap_size / 1024 / 1024;

    logger.info(JSON.stringify(stats));
    Honeybadger.notify(`Memwatch Stats | Used HEAP: ${Math.round(usedHeap)} MB`, {
      context: stats,
    });
  });
  // ==================================

  dataSource.initialize().then(() => {
    logger.info('Data source has been initialized');

    const runner = run(bot, {
      runner: {
        fetch: {
          allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
        },
      },
    });

    // Stop the bot when the Node.js process is about to be terminated
    const stopRunner = () => runner.isRunning() && runner.stop();
    process.once('SIGINT', () => {
      logger.info(`The Node.js process has received a SIGINT signal (isRunning: ${runner.isRunning()})`);
      stopRunner();
    });
    process.once('SIGTERM', () => {
      logger.info(`The Node.js process has received a SIGTERM signal (isRunning: ${runner.isRunning()})`);
      stopRunner();
    });

    logger.info('The bot started in the concurrent mode');
  });
}

main();
