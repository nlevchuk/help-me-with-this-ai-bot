import { Composer } from 'grammy'
import {
  messageTranslator,
  type MessageTranslatorConfig,
} from '@nlevchuk/tg-message-translator'

import type { CustomContext } from '../types.js'
import type { DbAdapter } from '../adapters/db.adapter.js'
import type { AiRequest, AiAdapter } from '../adapters/ai.adapter.js'
import logger from '../logger.js'
import createComposer from '../createComposer.js'
import textFormatter from '../textFormatter.js'
import { messageTranslatorConfig } from '../config/message-translator.js'
import { handleUserMessage } from '../services/message.service.js'

const { availableLanguages, aiInstructions } = messageTranslatorConfig;

type SendAiRequest = (
  aiRequest: AiRequest,
  userId: string,
  callback: (content: string) => Promise<void>,
) => Promise<void>;

const sendAiRequestAdapter = (db, ai): SendAiRequest => {
  return (aiRequest, userId, callback) => {
    return handleUserMessage(userId, aiRequest, { db, ai }, callback);
  }
}

export const createMessageTranslator = (
  db: DbAdapter, 
  ai: AiAdapter
): Composer<CustomContext> => {
  const composer = createComposer();

  const config: MessageTranslatorConfig = {
    logger,
    textFormatter,
    aiInstructions,
    availableLanguages,
    postUpdateLanguageHook: db.updateUserLanguage,
    sendAiRequest: sendAiRequestAdapter(db, ai),
  };
  messageTranslator<CustomContext>(composer, config);

  return composer;
}
