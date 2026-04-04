'use client'

import { ANALYTICS_EVENTS } from './constants'

type EventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

interface TrackEventOptions {
  page?: string
  metadata?: Record<string, unknown>
}

export async function trackEvent(eventType: EventName, options?: TrackEventOptions) {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        page: options?.page || window.location.pathname,
        metadata: options?.metadata,
        timestamp: new Date().toISOString(),
        utmSource: getUtmParam('utm_source'),
        utmMedium: getUtmParam('utm_medium'),
        utmCampaign: getUtmParam('utm_campaign'),
      }),
    })
  } catch {
    // Silently fail — analytics should never break the app
  }
}

function getUtmParam(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined
  const params = new URLSearchParams(window.location.search)
  return params.get(name) || undefined
}

// Convenience functions
export const trackPageView = (page?: string) =>
  trackEvent('page_view', { page })

export const trackCtaClick = (ctaName: string) =>
  trackEvent('cta_click', { metadata: { cta: ctaName } })

export const trackTriageStart = () =>
  trackEvent('triage_start')

export const trackTriageComplete = (result: string, confidence: number) =>
  trackEvent('triage_complete', { metadata: { result, confidence } })

export const trackOfficialLinkClick = (linkSlug: string, url: string) =>
  trackEvent('official_link_click', { metadata: { linkSlug, url } })
