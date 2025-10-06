import type { TextFormatter } from './types.js'

const textFormatter: TextFormatter = {
  info: (text) => text,
  warn: (text) => `<i>${text}</i>`,
  error: (text) => `<i>(${text})</i>`,
  status: (text) => `<i>${text}</i>`,
}

export default textFormatter;
