/**
 * OpenTelemetry Logger for PostHog integration
 * Sends logs to PostHog via OTLP HTTP exporter
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

let sdk: NodeSDK | null = null;

export function initOtelLogger(): NodeSDK | null {
  // Only initialize once and only if API key is available
  if (sdk) return sdk;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) {
    console.warn('[OTel Logger] NEXT_PUBLIC_POSTHOG_KEY not set, skipping initialization');
    return null;
  }

  try {
    sdk = new NodeSDK({
      resource: new Resource({
        'service.name': 'ai-zhanxing',
        'service.version': '1.0.0',
        'deployment.environment': process.env.NODE_ENV || 'development',
      }),
      logRecordProcessor: new SimpleLogRecordProcessor(
        new OTLPLogExporter({
          url: 'https://us.i.posthog.com/v1/logs',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
      ),
    });

    sdk.start();
    console.log('[OTel Logger] Initialized successfully');

    // Graceful shutdown on process exit
    process.on('SIGTERM', () => {
      sdk?.shutdown()
        .then(() => console.log('[OTel Logger] Shutdown complete'))
        .catch((error) => console.error('[OTel Logger] Shutdown error:', error));
    });

    return sdk;
  } catch (error) {
    console.error('[OTel Logger] Initialization failed:', error);
    return null;
  }
}

export function getOtelSdk(): NodeSDK | null {
  return sdk;
}

export async function shutdownOtelLogger(): Promise<void> {
  if (sdk) {
    await sdk.shutdown();
    sdk = null;
  }
}
