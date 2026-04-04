/**
 * In-memory queue utility (replaces BullMQ + Redis).
 * In demo mode, jobs are logged to console instead of being queued.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmailJobData {
  userId: string;
  templateSlug: string;
  variables: Record<string, string>;
  to?: string;
}

export interface PdfJobData {
  journeyId: string;
  userId: string;
  reportType: 'SIMPLE_SUMMARY' | 'TECHNICAL_SUMMARY' | 'FULL_PDF';
}

export interface HealthCheckJobData {
  linkId: string;
  url: string;
}

// ---------------------------------------------------------------------------
// No-op queue stubs
// ---------------------------------------------------------------------------

export async function enqueueEmail(data: EmailJobData): Promise<void> {
  console.log('[Queue] Email job enqueued (demo mode):', data.templateSlug, data.userId);
}

export async function enqueuePdf(data: PdfJobData): Promise<void> {
  console.log('[Queue] PDF job enqueued (demo mode):', data.reportType, data.journeyId);
}
