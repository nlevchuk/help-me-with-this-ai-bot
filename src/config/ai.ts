const {
  OPENAI_MODEL,
  OPENAI_TEMPERATURE,
  OPENAI_MAX_TOKENS,
  OPENAI_TOP_P,
  OPENAI_FREQ_PENALTY,
  OPENAI_PRES_PENALTY,
  OPENAI_PROMPT,
} = process.env;

export const aiConfig = {
  model: OPENAI_MODEL,
  temperature: Number(OPENAI_TEMPERATURE),
  maxTokens: Number(OPENAI_MAX_TOKENS),
  topP: Number(OPENAI_TOP_P),
  frequencyPenalty: Number(OPENAI_FREQ_PENALTY),
  presencePenalty: Number(OPENAI_PRES_PENALTY),
  defaultPrompt: OPENAI_PROMPT,
}
