import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  userId?: string | null;
  req?: NextRequest;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface AuditLogQuery {
  action?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}

// ---------------------------------------------------------------------------
// In-memory audit log store
// ---------------------------------------------------------------------------

const auditLogs: AuditLogRecord[] = [];
let logCounter = 1;

// ---------------------------------------------------------------------------
// AuditLogger
// ---------------------------------------------------------------------------

export class AuditLogger {
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      const ipAddress = this.extractIpAddress(entry.req);
      const userAgent = entry.req?.headers.get('user-agent') ?? null;

      auditLogs.push({
        id: `log-${Date.now()}-${logCounter++}`,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        oldValue: entry.oldValue ?? null,
        newValue: entry.newValue ?? null,
        userId: entry.userId ?? null,
        ipAddress,
        userAgent,
        createdAt: new Date(),
      });

      // Keep only last 1000 entries in memory
      if (auditLogs.length > 1000) {
        auditLogs.splice(0, auditLogs.length - 1000);
      }
    } catch (error) {
      console.error('[AuditLogger] Failed to write audit log:', error);
    }
  }

  async query(params: AuditLogQuery): Promise<{ records: AuditLogRecord[]; total: number }> {
    const { action, entityType, entityId, userId, from, to, page = 1, limit = 50 } = params;

    let filtered = [...auditLogs];
    if (action) filtered = filtered.filter((r) => r.action === action);
    if (entityType) filtered = filtered.filter((r) => r.entityType === entityType);
    if (entityId) filtered = filtered.filter((r) => r.entityId === entityId);
    if (userId) filtered = filtered.filter((r) => r.userId === userId);
    if (from) filtered = filtered.filter((r) => r.createdAt >= from);
    if (to) filtered = filtered.filter((r) => r.createdAt <= to);

    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const total = filtered.length;
    const records = filtered.slice((page - 1) * limit, page * limit);

    return { records, total };
  }

  async getEntityHistory(entityType: string, entityId: string): Promise<AuditLogRecord[]> {
    return auditLogs
      .filter((r) => r.entityType === entityType && r.entityId === entityId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 100);
  }

  async getUserActivity(userId: string, limit: number = 50): Promise<AuditLogRecord[]> {
    return auditLogs
      .filter((r) => r.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  private extractIpAddress(req?: NextRequest): string | null {
    if (!req) return null;
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    const realIp = req.headers.get('x-real-ip');
    if (realIp) return realIp;
    return null;
  }
}
