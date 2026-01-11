/**
 * Gemini AI Provider (Google)
 * Uses @google/genai SDK with thinking config support
 */

import { GoogleGenAI, type Content } from '@google/genai';
import { BaseProvider } from './base-provider';
import type { AIMessage, AIResponse, AIRequestOptions, AIToolCall, AIStreamChunk } from '../types';
import { PROVIDER_CONFIG } from '../config';

export class GeminiProvider extends BaseProvider {
  type = 'gemini' as const;
  private client: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    if (!this.client) {
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY not set');
      }
      this.client = new GoogleGenAI({ apiKey });
    }
    return this.client;
  }

  isAvailable(): boolean {
    return !!process.env.GOOGLE_AI_API_KEY;
  }

  async chat(messages: AIMessage[], options?: AIRequestOptions): Promise<AIResponse> {
    const client = this.getClient();
    const modelName = options?.model || PROVIDER_CONFIG.gemini.model;

    // Separate system message from conversation
    const systemMessage = messages.find(m => m.role === 'system');

    // Convert messages to Gemini format
    const contents: Content[] = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    // Determine thinking level based on model
    // - Flash: 'minimal' (fastest, nearly no thinking)
    // - Pro: 'low' (can't disable, minimize latency)
    const thinkingLevel = modelName.includes('flash') ? 'minimal' : 'low';

    // Build config with tools inside
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = {
      maxOutputTokens: options?.maxTokens || 4096,
      // For Gemini 3: use model-appropriate thinking level
      thinkingConfig: {
        thinkingLevel,
        includeThoughts: false,
      },
    };

    if (systemMessage || options?.systemPrompt) {
      config.systemInstruction = options?.systemPrompt || systemMessage?.content;
    }

    if (options?.temperature !== undefined) {
      config.temperature = options.temperature;
    }

    // Add tools if provided (inside config)
    if (options?.tools && options.tools.length > 0) {
      config.tools = options.tools.map(tool => ({
        functionDeclarations: [{
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema,
        }],
      }));
    }

    console.log(`[Gemini chat] Starting request: model=${modelName}, messages=${contents.length}`);

    const result = await this.withRetry(() =>
      client.models.generateContent({
        model: modelName,
        contents,
        config,
      })
    );

    // Debug logging for non-streaming response
    console.log('[Gemini chat] Response received:', JSON.stringify({
      hasCandidates: !!result.candidates,
      candidateCount: result.candidates?.length,
      firstCandidate: result.candidates?.[0] ? {
        hasContent: !!result.candidates[0].content,
        partsCount: result.candidates[0].content?.parts?.length,
        finishReason: result.candidates[0].finishReason,
      } : null,
      usageMetadata: result.usageMetadata,
    }).slice(0, 1000));

    // If no candidates, log the full response for debugging
    if (!result.candidates || result.candidates.length === 0) {
      console.error('[Gemini chat] No candidates in response! Full response:', JSON.stringify(result).slice(0, 2000));
    } else if (!result.candidates[0]?.content?.parts?.length) {
      console.error('[Gemini chat] No parts in candidate! Candidate:', JSON.stringify(result.candidates[0]).slice(0, 1000));
    }

    return this.convertResponse(result);
  }

  async *chatStream(
    messages: AIMessage[],
    options?: AIRequestOptions
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const client = this.getClient();
    const modelName = options?.model || PROVIDER_CONFIG.gemini.model;

    // Separate system message from conversation
    const systemMessage = messages.find(m => m.role === 'system');

    // Convert messages to Gemini format
    const contents: Content[] = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    // Determine thinking level based on model
    // - Flash: 'minimal' (fastest, nearly no thinking)
    // - Pro: 'low' (can't disable, minimize latency)
    const thinkingLevel = modelName.includes('flash') ? 'minimal' : 'low';

    // Build config
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = {
      maxOutputTokens: options?.maxTokens || 4096,
      // For Gemini 3: use model-appropriate thinking level
      thinkingConfig: {
        thinkingLevel,
        includeThoughts: false,
      },
    };

    if (systemMessage || options?.systemPrompt) {
      config.systemInstruction = options?.systemPrompt || systemMessage?.content;
    }

    if (options?.temperature !== undefined) {
      config.temperature = options.temperature;
    }

    const streamResult = await client.models.generateContentStream({
      model: modelName,
      contents,
      config,
    });

    // Iterate through stream chunks
    let chunkCount = 0;
    let hasYieldedText = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lastUsageMetadata: any = null;

    for await (const chunk of streamResult) {
      chunkCount++;

      // Log first chunk for debugging
      if (chunkCount === 1) {
        console.log('[Gemini] First chunk received:', JSON.stringify(chunk).slice(0, 500));
      }

      // Capture usage metadata from each chunk (will have final values in last chunk)
      if (chunk.usageMetadata) {
        lastUsageMetadata = chunk.usageMetadata;
      }

      // Get all parts from the candidate
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) {
        // Log if we got a candidate without parts
        if (chunk.candidates?.[0]) {
          console.log('[Gemini] Candidate without parts:', JSON.stringify(chunk.candidates[0]).slice(0, 300));
        }
        continue;
      }

      // Iterate through all parts, extracting text (skip thought parts)
      for (const part of parts) {
        // Skip if it's a thought part (thought: true) or has no text
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = part as any;
        if (p.thought) continue;
        if (p.text && p.text.length > 0) {
          hasYieldedText = true;
          yield { content: p.text, done: false };
        }
      }
    }

    console.log(`[Gemini] Stream complete: ${chunkCount} chunks, yielded text: ${hasYieldedText}`);

    // If no text was yielded, throw an error so caller knows something went wrong
    if (!hasYieldedText) {
      throw new Error('GEMINI_EMPTY_RESPONSE: AI returned no content. This may be due to content filtering or an API issue.');
    }

    // Yield final chunk with usage data
    yield {
      content: '',
      done: true,
      usage: lastUsageMetadata ? {
        inputTokens: lastUsageMetadata.promptTokenCount || 0,
        outputTokens: lastUsageMetadata.candidatesTokenCount || 0,
      } : undefined,
    };
  }

  private convertResponse(result: Awaited<ReturnType<GoogleGenAI['models']['generateContent']>>): AIResponse {
    const candidate = result.candidates?.[0];

    if (!candidate) {
      console.error('[Gemini convertResponse] No candidate found');
      return {
        content: '',
        stopReason: 'error',
      };
    }

    const toolCalls: AIToolCall[] = [];
    let textContent = '';

    const parts = candidate.content?.parts || [];
    console.log(`[Gemini convertResponse] Processing ${parts.length} parts`);

    for (const part of parts) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = part as any;

      // Skip thought parts (same as streaming)
      if (p.thought) {
        console.log('[Gemini convertResponse] Skipping thought part');
        continue;
      }

      if (part.text) {
        textContent += part.text;
      }
      if (part.functionCall) {
        toolCalls.push({
          name: part.functionCall.name || '',
          input: (part.functionCall.args || {}) as Record<string, unknown>,
        });
      }
    }

    console.log(`[Gemini convertResponse] Extracted text length: ${textContent.length}, toolCalls: ${toolCalls.length}`);

    // Determine stop reason
    let stopReason: AIResponse['stopReason'] = 'end_turn';
    if (toolCalls.length > 0) {
      stopReason = 'tool_use';
    } else if (candidate.finishReason === 'MAX_TOKENS') {
      stopReason = 'max_tokens';
    }

    // Get usage metadata
    const usage = result.usageMetadata;

    return {
      content: textContent,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      stopReason,
      usage: usage
        ? {
            inputTokens: usage.promptTokenCount || 0,
            outputTokens: usage.candidatesTokenCount || 0,
          }
        : undefined,
    };
  }
}
