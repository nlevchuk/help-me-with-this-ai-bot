import type { NextFunction } from 'grammy'

import logger from '../logger.js'
import textFormatter from '../textFormatter.js'
import { type CustomContext } from '../types.js'
import type { DbAdapter } from '../adapters/db.adapter.js'

export const initAppContext = () => {
  return async (ctx: CustomContext, next: NextFunction): Promise<void> => {
    ctx.appCtx = {};

    await next();
  }
}

type StartCommandDbMethods = Pick<
  DbAdapter,
  | 'findActiveInvitationToken'
  | 'createUser'
  | 'findUserById'
  | 'deactivateInvitationTokenById'
>

export const startCommand = (db: StartCommandDbMethods) => {
  return async (ctx: CustomContext): Promise<void> => {
    const user = ctx.appCtx.user;
    if (user) {
      await ctx.reply(
        textFormatter.status('You have already started it'),
        { parse_mode: 'HTML' },
      );
      return;
    }

    const token = String(ctx.match);
    if (!token) {
      logger.warn('Missing token');
      await ctx.reply(
        textFormatter.warn('Missing token'),
        { parse_mode: 'HTML' },
      );
      return;
    }

    const invitationToken = await db.findActiveInvitationToken(token);
    if (!invitationToken) {
      logger.error('Missing invitation');
      await ctx.reply(
        textFormatter.warn('Missing invitation'),
        { parse_mode: 'HTML' },
      );
      return; 
    }

    const userId = await db.createUser({
      telegramId: String(ctx.from.id),
      invitationTokenId: invitationToken.id,
      apiCallsLimit: invitationToken.defaultApiCallsLimit,
      maxMessageLength: invitationToken.defaultMaxMessageLength,
    });
    // Don't forget to add created user to the app context
    ctx.appCtx.user = await db.findUserById(userId);

    if (!invitationToken.allowedMultipleInvites) {
      await db.deactivateInvitationTokenById(invitationToken.id);
    }

    ctx.reply(
      textFormatter.status('You are in'),
      { parse_mode: 'HTML' },
    );
  }
}
