/**
 * AI Provider Abstraction Layer
 *
 * Provides unified interface for multiple AI providers (Claude, Gemini)
 * with A/B testing, metrics tracking, and fallback support.
 */

// Types
export * from './types';

// Config
export {
  getABTestConfig,
  selectProvider,
  PROVIDER_CONFIG,
  COST_PER_MILLION_TOKENS,
  MODEL_CONFIG,
  getModelId,
} from './config';

// Providers
export { getProvider, getAvailableProviders } from './providers';
