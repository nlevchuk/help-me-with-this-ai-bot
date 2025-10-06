import type { NextFunction } from 'grammy'

import logger from '../logger.js'
import textFormatter from '../textFormatter.js'
import type { CustomContext } from '../types.js'
import type { DbAdapter } from '../adapters/db.adapter.js'

export const findCurrentUser = (db: Pick<DbAdapter, 'findActiveUserByTelegramId'>) => {
  return async (ctx: CustomContext, next: NextFunction): Promise<void> => {
    const telegramId = String(ctx.from.id);
    const user = await db.findActiveUserByTelegramId(telegramId);
    ctx.appCtx.user = user;
    await next();
  }
}

export const authenticateUser = () => {
  return async (ctx: CustomContext, next: NextFunction): Promise<void> => {
    const { appCtx: { user } } = ctx;

    if (!user) {
      logger.error('Unauthorized access to text messaging');
      logger.error(`CTX: ${JSON.stringify(ctx)}`);

      await ctx.reply(
        textFormatter.status('Unauthorized access'),
        { parse_mode: 'HTML' },
      );

      return;
    }

    await next();
  }
}
