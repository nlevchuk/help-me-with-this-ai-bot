import OpenAI from 'openai'
import { getMainText, getQuoteText } from '@nlevchuk/tg-misc'

import createComposer from '../createComposer.js'
import logger from '../logger.js'
import textFormatter from '../textFormatter.js'
import { handleUserMessage } from '../services/message.service.js'
import type { CustomContext } from '../types.js'
import type { AiAdapter } from '../adapters/ai.adapter.js'
import type { DbAdapter } from '../adapters/db.adapter.js'

const textMessage = (db: DbAdapter, ai: AiAdapter) => {
  return async (ctx: CustomContext): Promise<void> => {
    const { msg, appCtx: { user } } = ctx;
    const userMessage = getQuoteText(msg) || getMainText(msg);
    if (!userMessage) {
      logger.warn('Text is missing');
      return;
    }

    const statusMessage = await ctx.reply(
      textFormatter.status('Retrieving explanation...'),
      { parse_mode: 'HTML' },
    );

    await handleUserMessage(
      user.id,
      { userMessage },
      { ai, db },
      async (response) => {
        await statusMessage.delete().catch(logger.error);

        await ctx.reply(textFormatter.info(response), {
          reply_parameters: { message_id: msg.message_id },
        });
      }
    ).catch(async () => {
      await statusMessage.delete().catch(logger.error);

      await ctx.reply(
        textFormatter.error("We could not handle the request. Try again in 1 minute")
      );
    });
  }
}

export const createMessageComposer = (db, ai) => {
  const composer = createComposer();
  const messageHandler = textMessage(db, ai);
  composer.on('message:text', messageHandler);
  composer.on('message:caption', messageHandler);
  return composer;
}
