import type { Composer } from 'grammy'
import {
  messageRemoval,
  type MessageRemovalConfig,
} from '@nlevchuk/tg-message-removal'

import createComposer from '../createComposer.js'
import logger from '../logger.js'
import textFormatter from '../textFormatter.js'
import type { CustomContext } from '../types.js'

export const createMessageRemoval = (): Composer<CustomContext> => { 
  const composer = createComposer();

  const config: MessageRemovalConfig = { logger, textFormatter };
  messageRemoval<CustomContext>(composer, config);

  return composer;
}
