import { registerAs } from '@nestjs/config';

export default registerAs('llm', () => ({
  handlerType: process.env.LLM_HANDLER_TYPE ?? '8ball',
}));
