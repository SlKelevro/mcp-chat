import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { LLM_HANDLER_TYPE } from './llm-handler.constant';
import { LlmHandlerInterface } from './llm-handler.interface';

@Injectable()
export class LlmHandlerRegistry implements OnModuleInit {
  private readonly handlers = new Map<string, LlmHandlerInterface>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    const providers = this.discoveryService.getProviders();

    for (const provider of providers) {
      if (!provider.metatype || !provider.instance) {
        continue;
      }

      const type = this.reflector.get<string | undefined>(LLM_HANDLER_TYPE, provider.metatype);

      if (!type) {
        continue;
      }

      if (this.handlers.has(type)) {
        throw new Error(`LLM handler "${type}" is registered more than once`);
      }

      this.handlers.set(type, provider.instance as LlmHandlerInterface);
    }
  }

  get<THandler extends LlmHandlerInterface = LlmHandlerInterface>(type: string): THandler {
    const handler = this.handlers.get(type);

    if (!handler) {
      throw new Error(`LLM handler "${type}" was not found`);
    }

    return handler as THandler;
  }

  has(type: string): boolean {
    return this.handlers.has(type);
  }

  listTypes(): string[] {
    return [...this.handlers.keys()];
  }
}
