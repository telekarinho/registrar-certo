# Registrar Certo - API Routes

> Complete API route reference for the Registrar Certo backend.
> Base URL: `/api`
> All routes return JSON. Authenticated routes require a valid session cookie.

---

## AUTH

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Create a new user account. Body: `{ name, email, password, cpfCnpj?, personType }` |
| POST | `/api/auth/login` | No | Login with email/password. Returns session cookie. Body: `{ email, password }` |
| POST | `/api/auth/logout` | Yes | Destroy the current session. |
| POST | `/api/auth/forgot-password` | No | Request a password reset email. Body: `{ email }` |
| POST | `/api/auth/reset-password` | No | Reset password with token. Body: `{ token, newPassword }` |
| GET | `/api/auth/me` | Yes | Get the currently authenticated user profile. |

### Response: `POST /api/auth/register`
```json
{
  "user": { "id": "uuid", "name": "string", "email": "string", "role": "USER" },
  "message": "Conta criada com sucesso"
}
```

### Response: `POST /api/auth/login`
```json
{
  "user": { "id": "uuid", "name": "string", "email": "string", "role": "USER" },
  "token": "session-token"
}
```

### Response: `GET /api/auth/me`
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "USER | ADMIN | SUPER_ADMIN",
    "personType": "PF | PJ | MEI",
    "createdAt": "ISO8601"
  }
}
```

---

## JOURNEY

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/journeys` | Yes | Create a new registration journey. Body: `{ protectionType, triageAnswers? }` |
| GET | `/api/journeys` | Yes | List all journeys for the current user. Query: `?status=ACTIVE&page=1&limit=10` |
| GET | `/api/journeys/:id` | Yes | Get full journey details including steps, progress, and answers. |
| PATCH | `/api/journeys/:id` | Yes | Update journey metadata (e.g., title, notes). Body: `{ title?, notes? }` |
| POST | `/api/journeys/:id/steps/:stepId/complete` | Yes | Mark a step as completed. Validates prerequisites. |
| POST | `/api/journeys/:id/answers` | Yes | Save or update answers for the journey. Body: `{ answers: Record<string, any> }` |
| GET | `/api/journeys/:id/checklist` | Yes | Get or generate the checklist for this journey. |
| PATCH | `/api/journeys/:id/checklist/items/:itemId` | Yes | Toggle a checklist item. Body: `{ completed: boolean }` |
| POST | `/api/journeys/:id/report` | Yes | Generate and return a PDF report for the journey. |

### Response: `POST /api/journeys`
```json
{
  "journey": {
    "id": "uuid",
    "protectionType": "MARCA | PATENTE | DESENHO_INDUSTRIAL",
    "status": "ACTIVE",
    "currentStepId": "step-1",
    "progress": 0,
    "createdAt": "ISO8601"
  }
}
```

### Response: `GET /api/journeys/:id`
```json
{
  "journey": {
    "id": "uuid",
    "protectionType": "MARCA",
    "status": "ACTIVE | PAUSED | COMPLETED | ABANDONED",
    "currentStepId": "marca-step-3",
    "progress": 23,
    "title": "string | null",
    "answers": {},
    "steps": [
      {
        "id": "marca-step-1",
        "title": "string",
        "description": "string",
        "status": "COMPLETED | CURRENT | LOCKED",
        "completedAt": "ISO8601 | null"
      }
    ],
    "checklist": { "id": "uuid", "progress": 45 },
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

### Response: `POST /api/journeys/:id/report`
```json
{
  "url": "string (presigned S3 URL or inline base64)",
  "expiresAt": "ISO8601"
}
```

---

## TRIAGE

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/triage` | No | Submit triage answers and get IP classification. Body: `{ answers: TriageAnswer[] }` |

### Response: `POST /api/triage`
```json
{
  "classification": {
    "type": "MARCA | PATENTE | DESENHO_INDUSTRIAL | null",
    "confidence": 0.92,
    "explanation": "string",
    "suggestedNextStep": "string"
  }
}
```

---

## INPI SEARCH (Proxied to Microservice)

> These routes proxy to an external INPI search microservice.
> Controlled by feature flag `inpi_search_enabled`.
> All responses cached in Redis (TTL: 1h for search, 24h for Nice classes).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/inpi/marcas` | Yes | Search trademarks. Query: `?q=name&page=1&limit=20` |
| GET | `/api/inpi/marcas/:processo` | Yes | Get trademark by process number. |
| GET | `/api/inpi/nices` | Yes | List all Nice classifications. |
| GET | `/api/inpi/nices/:code` | Yes | Get Nice class details by code (1-45). |

### Response: `GET /api/inpi/marcas?q=example`
```json
{
  "results": [
    {
      "processo": "string",
      "marca": "string",
      "titular": "string",
      "situacao": "string",
      "classesNice": ["string"]
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "source": "microservice | cache"
}
```

### Response: `GET /api/inpi/nices`
```json
{
  "classes": [
    {
      "code": "1",
      "title": "string",
      "description": "string",
      "examples": ["string"]
    }
  ]
}
```

---

## NOTIFICATIONS

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/notifications` | Yes | List user notifications. Query: `?unreadOnly=true&page=1&limit=20` |
| PATCH | `/api/notifications/:id/read` | Yes | Mark a notification as read. |
| POST | `/api/notifications/preferences` | Yes | Update notification preferences. Body: `{ email: boolean, push: boolean, types: string[] }` |

### Response: `GET /api/notifications`
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "STEP_REMINDER | ABANDONMENT_WARNING | SYSTEM_UPDATE | JOURNEY_COMPLETE",
      "title": "string",
      "message": "string",
      "read": false,
      "journeyId": "uuid | null",
      "createdAt": "ISO8601"
    }
  ],
  "unreadCount": 5,
  "total": 23,
  "page": 1
}
```

---

## ADMIN

> All admin routes require `ADMIN` or `SUPER_ADMIN` role.

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/admin/stats` | Yes | ADMIN | Dashboard statistics (users, journeys, conversion rates). |
| GET | `/api/admin/users` | Yes | ADMIN | List all users. Query: `?search=&role=&page=1&limit=20` |
| GET | `/api/admin/journeys` | Yes | ADMIN | List all journeys with filters. Query: `?status=&type=&page=1&limit=20` |

### Content Management (CRUD)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/admin/content` | Yes | ADMIN | List content pages. |
| POST | `/api/admin/content` | Yes | ADMIN | Create content page. |
| PATCH | `/api/admin/content/:id` | Yes | ADMIN | Update content page. |
| DELETE | `/api/admin/content/:id` | Yes | SUPER_ADMIN | Delete content page. |

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/admin/faqs` | Yes | ADMIN | List FAQs. |
| POST | `/api/admin/faqs` | Yes | ADMIN | Create FAQ. |
| PATCH | `/api/admin/faqs/:id` | Yes | ADMIN | Update FAQ. |
| DELETE | `/api/admin/faqs/:id` | Yes | SUPER_ADMIN | Delete FAQ. |

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/admin/blog` | Yes | ADMIN | List blog posts (including drafts). |
| POST | `/api/admin/blog` | Yes | ADMIN | Create blog post. |
| PATCH | `/api/admin/blog/:id` | Yes | ADMIN | Update blog post. |
| DELETE | `/api/admin/blog/:id` | Yes | SUPER_ADMIN | Delete blog post. |

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/admin/links` | Yes | ADMIN | List official links. |
| POST | `/api/admin/links` | Yes | ADMIN | Create official link. |
| PATCH | `/api/admin/links/:id` | Yes | ADMIN | Update official link. |
| DELETE | `/api/admin/links/:id` | Yes | SUPER_ADMIN | Delete official link. |

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/admin/ai-prompts` | Yes | ADMIN | List AI prompts. |
| POST | `/api/admin/ai-prompts` | Yes | ADMIN | Create AI prompt. |
| PATCH | `/api/admin/ai-prompts/:id` | Yes | ADMIN | Update AI prompt. |
| DELETE | `/api/admin/ai-prompts/:id` | Yes | SUPER_ADMIN | Delete AI prompt. |

### Feature Flags

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/admin/feature-flags` | Yes | ADMIN | List all feature flags. |
| PATCH | `/api/admin/feature-flags/:id` | Yes | SUPER_ADMIN | Toggle feature flag. Body: `{ enabled: boolean }` |

### Logs & Analytics

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/admin/integration-logs` | Yes | ADMIN | List integration logs (INPI API calls). Query: `?status=&from=&to=` |
| GET | `/api/admin/audit-logs` | Yes | ADMIN | List audit logs. Query: `?action=&userId=&from=&to=` |
| GET | `/api/admin/error-logs` | Yes | ADMIN | List error logs. Query: `?level=&from=&to=` |
| GET | `/api/admin/funnel` | Yes | ADMIN | Funnel analytics. Query: `?from=&to=&protectionType=` |

### Response: `GET /api/admin/stats`
```json
{
  "totalUsers": 1500,
  "activeJourneys": 320,
  "completedJourneys": 180,
  "abandonedJourneys": 45,
  "conversionRate": 0.56,
  "avgCompletionDays": 12.3,
  "byProtectionType": {
    "MARCA": { "active": 200, "completed": 120 },
    "PATENTE": { "active": 80, "completed": 40 },
    "DESENHO_INDUSTRIAL": { "active": 40, "completed": 20 }
  },
  "recentSignups": 45,
  "period": "last_30_days"
}
```

### Response: `GET /api/admin/funnel`
```json
{
  "funnel": [
    { "step": "TRIAGE_START", "count": 5000, "dropoff": 0 },
    { "step": "TRIAGE_COMPLETE", "count": 3800, "dropoff": 0.24 },
    { "step": "ACCOUNT_CREATED", "count": 2200, "dropoff": 0.42 },
    { "step": "JOURNEY_STARTED", "count": 1800, "dropoff": 0.18 },
    { "step": "FIRST_STEP_COMPLETE", "count": 1500, "dropoff": 0.17 },
    { "step": "CHECKLIST_GENERATED", "count": 1200, "dropoff": 0.20 },
    { "step": "JOURNEY_COMPLETED", "count": 500, "dropoff": 0.58 }
  ],
  "period": { "from": "ISO8601", "to": "ISO8601" }
}
```

---

## ANALYTICS

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/analytics/event` | No* | Track a funnel event. Body: `{ event, properties?, sessionId? }` |

> *Anonymous events are tracked by sessionId; authenticated events are linked to userId.

### Event Types
- `TRIAGE_START` - User starts triage
- `TRIAGE_COMPLETE` - User completes triage
- `ACCOUNT_CREATED` - User creates account
- `JOURNEY_STARTED` - User starts a journey
- `STEP_COMPLETED` - User completes a step
- `CHECKLIST_GENERATED` - Checklist is generated
- `REPORT_DOWNLOADED` - User downloads PDF report
- `JOURNEY_COMPLETED` - User completes entire journey
- `JOURNEY_ABANDONED` - Journey marked as abandoned

---

## PUBLIC

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/faqs` | No | List published FAQs. Query: `?category=&search=` |
| GET | `/api/blog` | No | List published blog posts. Query: `?category=&page=1&limit=10` |
| GET | `/api/blog/:slug` | No | Get a single published blog post by slug. |

### Response: `GET /api/faqs`
```json
{
  "faqs": [
    {
      "id": "uuid",
      "question": "string",
      "answer": "string (HTML)",
      "category": "string",
      "order": 1
    }
  ]
}
```

### Response: `GET /api/blog`
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "excerpt": "string",
      "coverImage": "string | null",
      "category": "string",
      "publishedAt": "ISO8601"
    }
  ],
  "total": 30,
  "page": 1
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message in Portuguese",
    "details": {}
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid session. |
| `FORBIDDEN` | 403 | Insufficient permissions. |
| `NOT_FOUND` | 404 | Resource not found. |
| `VALIDATION_ERROR` | 422 | Invalid request body. |
| `RATE_LIMITED` | 429 | Too many requests. |
| `INTERNAL_ERROR` | 500 | Unexpected server error. |
| `SERVICE_UNAVAILABLE` | 503 | External service (INPI) unavailable. |

---

## Rate Limits

| Route Group | Limit | Window |
|-------------|-------|--------|
| `POST /api/auth/*` | 10 requests | 15 minutes |
| `GET /api/inpi/*` | 30 requests | 1 minute |
| `POST /api/analytics/*` | 100 requests | 1 minute |
| `POST /api/journeys/*/report` | 5 requests | 15 minutes |
| General authenticated | 60 requests | 1 minute |
| General public | 30 requests | 1 minute |

---

## Authentication

- Session-based authentication using HTTP-only secure cookies.
- Session token stored in Redis with configurable TTL (default: 7 days).
- CSRF protection via `X-CSRF-Token` header on mutating requests.
- All mutating admin endpoints also require `X-Admin-Confirm` header.
