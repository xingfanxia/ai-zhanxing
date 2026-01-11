/**
 * Provider Factory
 */

import type { AIProvider, AIProviderType } from '../types';
import { ClaudeProvider } from './claude-provider';
import { GeminiProvider } from './gemini-provider';

const providers: Map<AIProviderType, AIProvider> = new Map();

export function getProvider(type: AIProviderType): AIProvider {
  let provider = providers.get(type);

  if (!provider) {
    switch (type) {
      case 'claude':
        provider = new ClaudeProvider();
        break;
      case 'gemini':
        provider = new GeminiProvider();
        break;
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
    providers.set(type, provider);
  }

  return provider;
}

export function getAvailableProviders(): AIProviderType[] {
  const types: AIProviderType[] = ['claude', 'gemini'];
  return types.filter(type => {
    try {
      return getProvider(type).isAvailable();
    } catch {
      return false;
    }
  });
}

export { ClaudeProvider } from './claude-provider';
export { GeminiProvider } from './gemini-provider';
export { BaseProvider } from './base-provider';
