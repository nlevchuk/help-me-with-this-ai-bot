import type { NextFunction } from 'grammy'
import { getMainText } from '@nlevchuk/tg-misc'

import type { CustomContext } from '../types.js'
import logger from '../logger.js'

const isTelegramCommand = (text: string): boolean => text[0] === '/';

export const blockOtherCommands = () => {
  return async (ctx: CustomContext, next: NextFunction): Promise<void> => {
    const { msg } = ctx;
    const text = getMainText(msg);

    if (text && isTelegramCommand(text)) {
      logger.warn(`It is a command: ${text}`);
      return;
    }

    await next();
  }
}
