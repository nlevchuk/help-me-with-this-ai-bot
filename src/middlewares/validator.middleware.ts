import type { NextFunction } from 'grammy'
import { getMainText } from '@nlevchuk/tg-misc'

import type { CustomContext } from '../types.js'
import logger from '../logger.js'
import textFormatter from '../textFormatter.js'
import customCommands from '../utils/customCommands.js'
import { calculateAvailableApiCalls } from '../services/user-quota.service.js'

export const checkAvailableApiCalls = () => {
  return async (ctx: CustomContext, next: NextFunction): Promise<void> => {
    const { appCtx: { user } } = ctx;

    if (calculateAvailableApiCalls(user) < 1) {
      logger.warn(`The "${user.id}" user has reached the usage limit`);
      await  ctx.reply(
        textFormatter.warn(`You have reached the usage limit. It will be reset at midnight Greenwich Mean Time.\nIf you want to increase the limit, tap the command \/${customCommands.showDonationLink} for details`),
        { parse_mode: 'HTML' },
      );
      return;
    }

    await next();
  }
}

export const checkMessageLength = () => {
  return async (ctx: CustomContext, next: NextFunction): Promise<void> => {
    const { msg, appCtx: { user } } = ctx;
    const text = getMainText(msg);

    if (text && text.length > user.maxMessageLength) {
      logger.warn(`The "${user.id}" has reached the maximum message length. Current value is ${text.length}`);

      await ctx.reply(
        textFormatter.warn(`The length of a message should not exceed ${user.maxMessageLength} symbols`),
        { parse_mode: 'HTML' },
      );

      return;
    }

    await next();
  }
}
