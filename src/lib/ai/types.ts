/**
 * AI Provider Abstraction Layer - Core Types
 */

// Provider type (claude or gemini family)
export type AIProviderType = 'claude' | 'gemini';

// Specific model identifiers for A/B testing
export type AIModelId =
  | 'claude-opus-4.5'
  | 'gemini-3-pro'
  | 'gemini-3-flash';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIToolCall {
  name: string;
  input: Record<string, unknown>;
}

export interface AIResponse {
  content: string;
  toolCalls?: AIToolCall[];
  stopReason: 'end_turn' | 'tool_use' | 'max_tokens' | 'error';
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface AIRequestOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  tools?: AIToolDefinition[];
  stream?: boolean;
}

export interface AIToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

/**
 * Chunk yielded during streaming responses
 */
export interface AIStreamChunk {
  content: string;
  done: boolean;
  // Usage data available in final chunk (done=true)
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface AIProvider {
  type: AIProviderType;
  chat(messages: AIMessage[], options?: AIRequestOptions): Promise<AIResponse>;
  chatStream?(messages: AIMessage[], options?: AIRequestOptions): AsyncGenerator<AIStreamChunk, void, unknown>;
  isAvailable(): boolean;
}

export interface RequestMetrics {
  provider: AIProviderType;
  operation: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  success: boolean;
  error?: string;
  timestamp: Date;
}

export interface ABTestConfig {
  enabled: boolean;
  defaultProvider: AIProviderType;
  trafficSplit: {
    claude: number;
    gemini: number;
  };
}
