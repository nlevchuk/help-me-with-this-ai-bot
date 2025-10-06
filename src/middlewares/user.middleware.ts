import type { NextFunction } from 'grammy'

import logger from '../logger.js'
import textFormatter from '../textFormatter.js'
import type { CustomContext } from '../types.js'
import type { DbAdapter } from '../adapters/db.adapter.js'

type TelegramUser = {
  first_name: string;
  last_name?: string;
  username?: string;
}
const prepareLoggingUsersInfo = (telegramUser: TelegramUser): string => {
  const { first_name, last_name, username } = telegramUser;
  return `${first_name} ${last_name || '<empty>'} (${username || '<empty>'})`;
}

export const findCurrentUser = (
  db: Pick<DbAdapter, 'findActiveUserByTelegramId'>
) => {
  return async (ctx: CustomContext, next: NextFunction): Promise<void> => {
    const telegramId = String(ctx.from.id);
    ctx.appCtx.user = await db.findActiveUserByTelegramId(telegramId);
    await next();
  }
}

export const authenticateUser = () => {
  return async (ctx: CustomContext, next: NextFunction): Promise<void> => {
    const { appCtx: { user } } = ctx;

    if (!user) {
      const userInfo = prepareLoggingUsersInfo(ctx.msg.from);
      logger.error(`Unauthorized access from ${userInfo}`);

      await ctx.reply(
        textFormatter.status('Unauthorized access'),
        { parse_mode: 'HTML' },
      );

      return;
    }

    await next();
  }
}
