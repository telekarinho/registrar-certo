import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  personType: string | null;
}

export interface AuthenticatedRequest extends NextRequest {
  user: AuthenticatedUser;
}

interface SessionData {
  userId: string;
  role: UserRole;
  createdAt: number;
  expiresAt: number;
}

// ---------------------------------------------------------------------------
// In-memory session store (replaces Redis)
// ---------------------------------------------------------------------------

const sessions = new Map<string, SessionData>();

/** Session TTL in seconds (default: 7 days) */
const SESSION_TTL = parseInt(process.env.SESSION_TTL ?? '604800', 10);

const SESSION_COOKIE_NAME = 'rc_session';

// ---------------------------------------------------------------------------
// In-memory user store for demo
// ---------------------------------------------------------------------------

const demoUsers: AuthenticatedUser[] = [
  {
    id: 'demo-user-1',
    email: 'demo@registrarcerto.com.br',
    name: 'Usuario Demo',
    role: 'USER',
    personType: 'PF',
  },
];

// ---------------------------------------------------------------------------
// Session helpers
// ---------------------------------------------------------------------------

async function getSession(token: string): Promise<SessionData | null> {
  const session = sessions.get(`session:${token}`);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(`session:${token}`);
    return null;
  }
  return session;
}

export async function createSession(userId: string, role: UserRole): Promise<string> {
  const { randomUUID } = await import('crypto');
  const token = randomUUID();
  const now = Date.now();

  sessions.set(`session:${token}`, {
    userId,
    role,
    createdAt: now,
    expiresAt: now + SESSION_TTL * 1000,
  });

  return token;
}

export async function destroySession(token: string): Promise<void> {
  sessions.delete(`session:${token}`);
}

// ---------------------------------------------------------------------------
// Authentication middleware
// ---------------------------------------------------------------------------

export async function withAuth(
  req: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
): Promise<NextResponse> {
  const token = extractToken(req);

  if (!token) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Sessao nao encontrada. Faca login.' } },
      { status: 401 },
    );
  }

  const session = await getSession(token);

  if (!session) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Sessao expirada. Faca login novamente.' } },
      { status: 401 },
    );
  }

  // Look up user from in-memory store
  const user = demoUsers.find((u) => u.id === session.userId) ?? null;

  if (!user) {
    await destroySession(token);
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Usuario nao encontrado.' } },
      { status: 401 },
    );
  }

  const authenticatedReq = req as AuthenticatedRequest;
  authenticatedReq.user = { ...user };

  return handler(authenticatedReq);
}

// ---------------------------------------------------------------------------
// Role authorization middleware
// ---------------------------------------------------------------------------

export function withRole(...allowedRoles: UserRole[]) {
  return async function (
    req: NextRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  ): Promise<NextResponse> {
    return withAuth(req, async (authReq) => {
      if (!allowedRoles.includes(authReq.user.role)) {
        return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: 'Voce nao tem permissao para acessar este recurso.' } },
          { status: 403 },
        );
      }
      return handler(authReq);
    });
  };
}

export function withAdmin(
  req: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
): Promise<NextResponse> {
  return withRole('ADMIN', 'SUPER_ADMIN')(req, handler);
}

export function withSuperAdmin(
  req: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
): Promise<NextResponse> {
  return withRole('SUPER_ADMIN')(req, handler);
}

// ---------------------------------------------------------------------------
// CSRF validation
// ---------------------------------------------------------------------------

export async function validateCSRF(req: NextRequest): Promise<boolean> {
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true;

  const csrfToken = req.headers.get('X-CSRF-Token');
  const sessionToken = extractToken(req);

  if (!csrfToken || !sessionToken) return false;

  const { createHash } = await import('crypto');
  const expected = createHash('sha256')
    .update(`${sessionToken}:${process.env.CSRF_SECRET ?? 'registrar-certo-csrf'}`)
    .digest('hex');

  return csrfToken === expected;
}

export async function generateCSRFToken(sessionToken: string): Promise<string> {
  const { createHash } = await import('crypto');
  return createHash('sha256')
    .update(`${sessionToken}:${process.env.CSRF_SECRET ?? 'registrar-certo-csrf'}`)
    .digest('hex');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractToken(req: NextRequest): string | null {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  if (cookie?.value) return cookie.value;

  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);

  return null;
}
