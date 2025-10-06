import parseEnvArray from '../utils/parseEnvArray.js'

const { TRANSLATION_LANGUAGES, TRANSLATION_PROMPT } = process.env;

export const messageTranslatorConfig = {
  availableLanguages: parseEnvArray(TRANSLATION_LANGUAGES),
  aiInstructions: TRANSLATION_PROMPT,
}
