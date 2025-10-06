import type { NextFunction } from 'grammy'
import { getMainText } from '@nlevchuk/tg-misc'

import type { CustomContext } from '../types.js'
import logger from '../logger.js'
import textFormatter from '../textFormatter.js'

const isTelegramCommand = (text: string): boolean => text[0] === '/';

export const blockOtherCommands = () => {
  return async (ctx: CustomContext, next: NextFunction): Promise<void> => {
    const { msg } = ctx;
    const text = getMainText(msg);

    if (text && isTelegramCommand(text)) {
      await ctx.reply(
        textFormatter.warn("The text begins with a '/' and was interpreted as an unknown command"),
        { parse_mode: 'HTML' },
      )
      return;
    }

    await next();
  }
}
