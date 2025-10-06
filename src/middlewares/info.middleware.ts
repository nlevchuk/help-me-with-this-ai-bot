import textFormatter from '../textFormatter.js'
import { type CustomContext } from '../types.js'

const LINK = process.env.DONATION_LINK;
const TEXT = `Greetings,

This bot relies on ChatGPT to check and translate the messages you send. Since ChatGPT is a paid service, I cannot currently offer more daily requests for free.

If you'd like to increase your daily usage limit and support my work, you can do so here: ${LINK}.
You can choose a one-time option for the next 30 days or a monthly subscription. All payments are secured via PayPal.

Thank you so much for your support!
`

export const showDonationLink = () => {
  return async (ctx: CustomContext): Promise<void> => {
    ctx.reply(
      textFormatter.warn(TEXT),
      { parse_mode: 'HTML' },
    );
  }
}
