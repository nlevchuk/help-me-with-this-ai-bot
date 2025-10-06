import { Composer } from 'grammy'

import type { CustomContext } from './types.js'

const createComposer = () => new Composer<CustomContext>();

export default createComposer;
