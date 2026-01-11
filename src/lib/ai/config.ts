/**
 * AI Provider Configuration
 */

import type { AIProviderType, AIModelId, ABTestConfig } from './types';

// Model configurations
export const MODEL_CONFIG: Record<AIModelId, { provider: AIProviderType; modelName: string }> = {
  'claude-opus-4.5': {
    provider: 'claude',
    modelName: 'claude-opus-4-5-20251101',
  },
  'gemini-3-pro': {
    provider: 'gemini',
    modelName: 'gemini-3-pro-preview',
  },
  'gemini-3-flash': {
    provider: 'gemini',
    modelName: 'gemini-3-flash-preview',
  },
};

// Cost per 1M tokens (USD) - Updated 2026-01
export const COST_PER_MILLION_TOKENS: Record<AIModelId, { input: number; output: number }> = {
  'claude-opus-4.5': {
    input: 5,      // $5/MTok input
    output: 25,    // $25/MTok output
  },
  'gemini-3-pro': {
    input: 2,      // $2/MTok input (<=200k context)
    output: 12,    // $12/MTok output (including thinking)
  },
  'gemini-3-flash': {
    input: 0.5,    // $0.50/MTok input
    output: 3,     // $3/MTok output (including thinking)
  },
};

// Legacy provider config (for backwards compatibility)
export const PROVIDER_CONFIG = {
  claude: {
    model: process.env.CLAUDE_MODEL || 'claude-opus-4-5-20251101',
    apiKeyEnvVar: 'ANTHROPIC_API_KEY',
  },
  gemini: {
    // Default to Gemini 3 Pro (best quality/cost balance)
    model: process.env.GEMINI_MODEL || 'gemini-3-pro-preview',
    apiKeyEnvVar: 'GOOGLE_AI_API_KEY',
  },
} as const;

export function getABTestConfig(): ABTestConfig {
  const claudeSplit = parseInt(process.env.AI_TRAFFIC_SPLIT_CLAUDE || '0', 10);
  const geminiSplit = parseInt(process.env.AI_TRAFFIC_SPLIT_GEMINI || '100', 10);

  return {
    enabled: process.env.AI_AB_TEST_ENABLED === 'true',
    // Default to Gemini (Pro) - best quality/cost balance
    defaultProvider: (process.env.AI_DEFAULT_PROVIDER || 'gemini') as AIProviderType,
    trafficSplit: {
      claude: claudeSplit,
      gemini: geminiSplit,
    },
  };
}

export function selectProvider(config: ABTestConfig, forceProvider?: AIProviderType): AIProviderType {
  // If forced, use that provider
  if (forceProvider) {
    return forceProvider;
  }

  // If A/B test disabled, use default
  if (!config.enabled) {
    return config.defaultProvider;
  }

  // A/B test: random selection based on traffic split
  const random = Math.random() * 100;
  if (random < config.trafficSplit.claude) {
    return 'claude';
  }
  return 'gemini';
}

// Get model ID from model name
export function getModelId(modelName: string): AIModelId {
  if (modelName.includes('opus')) return 'claude-opus-4.5';
  if (modelName.includes('gemini-3-flash')) return 'gemini-3-flash';
  if (modelName.includes('gemini-3-pro') || modelName.includes('gemini-3')) return 'gemini-3-pro';
  // Default fallback
  return 'claude-opus-4.5';
}
