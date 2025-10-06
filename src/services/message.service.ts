import type { AiRequest, AiAdapter } from '../adapters/ai.adapter.js'
import type { DbAdapter } from '../adapters/db.adapter.js'

type HandleUserMessageOptions = {
  db: Pick<DbAdapter, 'incrementApiCalls' | 'createApiStats'>;
  ai: Pick<AiAdapter, 'sendRequest'>;
}

export const handleUserMessage = async (
  userId: string,
  aiRequestOptions: AiRequest,
  { ai, db }: HandleUserMessageOptions,
  callback: (content: string) => Promise<void>,
): Promise<void> => {
  const { content, metadata } = await ai.sendRequest(aiRequestOptions);

  try {
    await callback(content) // Reply to client asap
  } catch (error) {
    // FIXME
    // Honeybadger.error
    // console.error
  }

  const { model, promptTokens, completionTokens } = metadata ?? {};
  await Promise.allSettled([
    db.incrementApiCalls(userId),
    db.createApiStats({ userId, model, promptTokens, completionTokens }),
  ]);
}
