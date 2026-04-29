import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { DefaultLlmHandler } from './llm-handler.default';
import { LlmHandlerRegistry } from './llm-handler.registry';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [LlmHandlerRegistry, DefaultLlmHandler],
  exports: [LlmHandlerRegistry],
})
export class LlmModule {}
