import type { Context } from 'grammy'
import { HydrateFlavor } from '@grammyjs/hydrate'

import { User } from './entity/User.js'

type AppContext = {
  appCtx: {
    user?: User;
  };
}
export type CustomContext = HydrateFlavor<Context & AppContext>;

export type Logger = {
  info(msg: string):  void;
  warn(msg: string):  void;
  error(msg: string): void;
}

export type TextFormatter = {
  info(msg: string):   string;
  warn(msg: string):   string;
  status(msg: string): string;
  error(msg: string):  string;
}
