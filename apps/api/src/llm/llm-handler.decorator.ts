import { SetMetadata } from '@nestjs/common';
import { LLM_HANDLER_TYPE } from './llm-handler.constant';

export function LlmHandler(type: string) {
  return SetMetadata(LLM_HANDLER_TYPE, type);
}
