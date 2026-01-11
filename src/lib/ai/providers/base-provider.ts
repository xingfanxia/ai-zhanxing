/**
 * Base AI Provider with shared utilities
 */

import type { AIProvider, AIProviderType, AIMessage, AIResponse, AIRequestOptions } from '../types';

export abstract class BaseProvider implements AIProvider {
  abstract type: AIProviderType;
  abstract chat(messages: AIMessage[], options?: AIRequestOptions): Promise<AIResponse>;
  abstract isAvailable(): boolean;

  protected async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 2,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          await this.delay(delayMs * (attempt + 1));
        }
      }
    }

    throw lastError;
  }

  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
