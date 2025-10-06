import type { ErrorHandler } from 'grammy'

import Honeybadger from '../honeybadger.js'
import logger from '../logger.js'
import textFormatter from '../textFormatter.js'
import type { CustomContext } from '../types.js'

export const botErrorHandler: ErrorHandler<CustomContext> = ({ ctx, message }) => {
  logger.error(message);
  logger.error(`CTX: ${JSON.stringify(ctx)}`);
  Honeybadger.notify(message);

  // Send error message to the owner of the bot rather than a user who originally initiated the request
  ctx.api.sendMessage(
    process.env.MY_TELEGRAM_USER_ID,
    textFormatter.error(message),
    { parse_mode: 'HTML' },
   );
}
