import type { OpenAI } from 'openai'

import logger from '../logger.js'
import { aiConfig } from '../config/ai.js';

const {
  model,
  temperature,
  maxTokens,
  topP,
  frequencyPenalty,
  presencePenalty,
  defaultPrompt,
} = aiConfig;

export type AiRequest = {
  userMessage: string,
  instructions?: string,
}

type AiResponseMetadata = {
  model: string;
  promptTokens: number;
  completionTokens: number;
}
export type AiResponse = {
  content: string;
  metadata: AiResponseMetadata;
}

const prepareResponse = (
  { model, usage, choices }: OpenAI.Chat.ChatCompletion
): AiResponse => {
  const content = choices[0].message.content;
  const promptTokens = usage.prompt_tokens;
  const completionTokens = usage.completion_tokens;

  return {
    content,
    metadata: { model, promptTokens, completionTokens },
  };
}

export const createAiAdapter = (ai) => {
  return {
    sendRequest: async (aiRequest: AiRequest): Promise<AiResponse> => {
      const {
        userMessage,
        instructions = defaultPrompt,
      } = aiRequest;

      const prompt = [
        { role: 'system', content: instructions },
        { role: 'user', content: userMessage },
      ];

      const completion = await ai.chat.completions.create({
        model,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        messages: prompt,
      });

      return prepareResponse(completion);
    },
  };
};

export type AiAdapter = ReturnType<typeof createAiAdapter>;
