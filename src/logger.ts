import { createLogger, format, transports } from 'winston'

import type { Logger } from './types.js'

let myTransports;
if (process.env.NODE_ENV === 'development') {
  myTransports = [new transports.Console()];
} else {
  myTransports = [
    new transports.File({ filename: 'logs/hmwt_error.log', level: 'error' }),
    new transports.File({ filename: 'logs/hmwt_combined.log' }),
  ];
}

const logger: Logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: myTransports,
});

export default logger;
