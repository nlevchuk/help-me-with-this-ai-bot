import { Bot } from 'grammy'

import type { CustomContext } from './types.js'

const bot = new Bot<CustomContext>(process.env.TELEGRAM_BOT_TOKEN);

export default bot;
