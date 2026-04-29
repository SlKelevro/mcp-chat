export type LlmMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface LlmHandlerInterface {
  complete(messages: LlmMessage[]): Promise<string>;
}
