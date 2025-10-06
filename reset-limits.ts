import 'dotenv/config'

import bot from './src/bot.js'
import { dataSource } from './src/data-source.js'
import { createDbAdapter } from './src/adapters/db.adapter.js'
import logger from './src/logger.js'
import textFormatter from './src/textFormatter.js'
import { botErrorHandler } from './src/errors/bot.error.js'

const main = async () => {
  bot.catch(botErrorHandler);

  const db = createDbAdapter(dataSource);

  await dataSource.initialize();

  logger.info('Data source has been initialized');

  const users = await db.findUsersWithAvailableApiCalls();
  await Promise.all(users.map((user) => db.resetApiCallsCount(user.id)));

  logger.info('All limits have been reset');
}

main()
