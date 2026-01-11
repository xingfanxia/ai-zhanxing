/**
 * Claude AI Provider (Anthropic)
 */

import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './base-provider';
import type { AIMessage, AIResponse, AIRequestOptions, AIToolCall, AIStreamChunk } from '../types';
import { PROVIDER_CONFIG } from '../config';

export class ClaudeProvider extends BaseProvider {
  type = 'claude' as const;
  private client: Anthropic | null = null;

  private getClient(): Anthropic {
    if (!this.client) {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY not set');
      }
      this.client = new Anthropic({ apiKey });
    }
    return this.client;
  }

  isAvailable(): boolean {
    return !!process.env.ANTHROPIC_API_KEY;
  }

  async chat(messages: AIMessage[], options?: AIRequestOptions): Promise<AIResponse> {
    const client = this.getClient();
    const model = options?.model || PROVIDER_CONFIG.claude.model;

    // Separate system message from conversation
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    // Build request
    const request: Anthropic.MessageCreateParams = {
      model,
      max_tokens: options?.maxTokens || 4096,
      messages: conversationMessages,
    };

    if (systemMessage || options?.systemPrompt) {
      request.system = options?.systemPrompt || systemMessage?.content;
    }

    if (options?.temperature !== undefined) {
      request.temperature = options.temperature;
    }

    // Add tools if provided
    if (options?.tools && options.tools.length > 0) {
      request.tools = options.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema as Anthropic.Tool['input_schema'],
      }));
    }

    const response = await this.withRetry(() => client.messages.create(request));

    return this.convertResponse(response);
  }

  async *chatStream(
    messages: AIMessage[],
    options?: AIRequestOptions
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const client = this.getClient();
    const model = options?.model || PROVIDER_CONFIG.claude.model;

    // Separate system message from conversation
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    // Build request
    const request: Anthropic.MessageCreateParams = {
      model,
      max_tokens: options?.maxTokens || 4096,
      messages: conversationMessages,
    };

    if (systemMessage || options?.systemPrompt) {
      request.system = options?.systemPrompt || systemMessage?.content;
    }

    if (options?.temperature !== undefined) {
      request.temperature = options.temperature;
    }

    const stream = await client.messages.stream(request);

    // Track usage from streaming events
    let inputTokens = 0;
    let outputTokens = 0;

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield { content: event.delta.text, done: false };
      }
      // Capture input tokens from message_start event
      if (event.type === 'message_start' && event.message?.usage) {
        inputTokens = event.message.usage.input_tokens || 0;
      }
      // Capture output tokens from message_delta event (final usage)
      if (event.type === 'message_delta' && event.usage) {
        outputTokens = event.usage.output_tokens || 0;
      }
    }

    // Yield final chunk with usage data
    yield {
      content: '',
      done: true,
      usage: { inputTokens, outputTokens },
    };
  }

  private convertResponse(response: Anthropic.Message): AIResponse {
    const toolCalls: AIToolCall[] = [];
    let textContent = '';

    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text;
      } else if (block.type === 'tool_use') {
        toolCalls.push({
          name: block.name,
          input: block.input as Record<string, unknown>,
        });
      }
    }

    let stopReason: AIResponse['stopReason'] = 'end_turn';
    if (response.stop_reason === 'tool_use') {
      stopReason = 'tool_use';
    } else if (response.stop_reason === 'max_tokens') {
      stopReason = 'max_tokens';
    }

    return {
      content: textContent,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      stopReason,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }
}
