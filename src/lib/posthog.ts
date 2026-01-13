/**
 * Server-side PostHog client for LLM analytics and custom event tracking
 */

import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null = null

export function getPostHogClient(): PostHog {
  if (!posthogClient) {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_POSTHOG_KEY not set')
    }
    posthogClient = new PostHog(apiKey, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 1, // Flush immediately for serverless environments
      flushInterval: 0,
    })
  }
  return posthogClient
}

/**
 * Track a custom event with PostHog
 */
export function trackEvent(
  distinctId: string,
  eventName: string,
  properties?: Record<string, unknown>
): void {
  try {
    const client = getPostHogClient()
    client.capture({
      distinctId,
      event: eventName,
      properties,
    })
  } catch (error) {
    console.error('PostHog tracking error:', error)
  }
}

/**
 * Identify a user in PostHog
 */
export function identifyUser(
  distinctId: string,
  properties?: Record<string, unknown>
): void {
  try {
    const client = getPostHogClient()
    client.identify({
      distinctId,
      properties,
    })
  } catch (error) {
    console.error('PostHog identify error:', error)
  }
}

/**
 * Shutdown PostHog client (call at end of serverless function)
 */
export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown()
    posthogClient = null
  }
}
