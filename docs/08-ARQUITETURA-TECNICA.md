# 08 - Arquitetura Tecnica do Registrar Certo

## 1. Visao Geral

O **Registrar Certo** e um SaaS brasileiro voltado para guiar usuarios no processo de registro de propriedade intelectual junto ao INPI. A arquitetura segue o padrao de **monolito modular** -- uma unica aplicacao deployavel com separacao interna rigorosa por modulos, preparada para extracao futura de microsservicos quando (e se) necessario.

### 1.1 Principios Arquiteturais

| Principio | Descricao |
|-----------|-----------|
| Monolito modular | Deploy unico, modulos com fronteiras claras e contratos definidos |
| Domain-first | Modelagem orientada ao dominio de registro de PI, nao a tecnologia |
| Reversibilidade | Decisoes faceis de mudar sao preferidas sobre decisoes "otimas" |
| Complexidade justificada | Cada abstracao deve provar que resolve um problema real |
| LGPD by design | Privacidade e protecao de dados sao requisitos arquiteturais, nao afterthoughts |

---

## 2. Stack Tecnologica

### 2.1 Frontend e Framework

| Tecnologia | Versao | Justificativa |
|------------|--------|---------------|
| **Next.js** | 14+ (App Router) | SSR, RSC, API routes integradas, excelente DX |
| **TypeScript** | 5.x | Tipagem estatica, contratos entre modulos |
| **Tailwind CSS** | 3.x | Utility-first, consistencia visual, bundle otimizado |
| **shadcn/ui** | latest | Componentes acessiveis, customizaveis, sem lock-in |

### 2.2 Backend e Dados

| Tecnologia | Justificativa |
|------------|---------------|
| **Prisma** | ORM type-safe, migrations versionadas, introspeccao de schema |
| **PostgreSQL** | ACID, JSONB para dados semi-estruturados, full-text search nativo |
| **NextAuth.js** | Autenticacao flexivel, provedores multiplos, session management |
| **Redis** | Cache, filas (via BullMQ), rate limiting, session store |
| **BullMQ** | Filas robustas com retry, dead letter queues, dashboard |
| **S3-compatible** | Armazenamento de arquivos (MinIO local, AWS S3 ou Cloudflare R2 em producao) |

### 2.3 Infraestrutura e DevOps

| Tecnologia | Justificativa |
|------------|---------------|
| **Docker** | Containerizacao para dev e producao |
| **Docker Compose** | Orquestracao local (Postgres, Redis, MinIO, app) |
| **GitHub Actions** | CI/CD |
| **Vercel** ou **Railway** | Deploy da aplicacao principal |
| **Sentry** | Error tracking e performance monitoring |

---

## 3. Estrutura de Pastas

```
src/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Grupo de rotas - autenticacao
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/                  # Grupo de rotas - area logada
│   │   ├── painel/
│   │   ├── jornada/
│   │   │   ├── [journeyId]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── checklist/
│   │   │   │   └── documentos/
│   │   ├── consulta-marca/
│   │   ├── perfil/
│   │   └── configuracoes/
│   ├── (marketing)/                  # Grupo de rotas - paginas publicas
│   │   ├── page.tsx                  # Landing page
│   │   ├── precos/
│   │   ├── como-funciona/
│   │   └── blog/
│   ├── (admin)/                      # Grupo de rotas - administracao
│   │   ├── cms/
│   │   ├── usuarios/
│   │   ├── analytics/
│   │   ├── feature-flags/
│   │   └── logs/
│   ├── api/                          # API Routes (detalhado na secao 5)
│   │   ├── auth/
│   │   ├── v1/
│   │   └── webhooks/
│   ├── layout.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── modules/                          # Modulos de dominio (secao 4)
│   ├── auth/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── session.service.ts
│   │   ├── repositories/
│   │   │   └── user.repository.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   ├── validators/
│   │   │   └── auth.validators.ts
│   │   └── index.ts                  # Public API do modulo
│   ├── user-profile/
│   ├── journey-engine/
│   ├── checklist-engine/
│   ├── ai-engine/
│   ├── official-links-manager/
│   ├── integrations-manager/
│   ├── inpi-search-adapter/
│   ├── notification-engine/
│   ├── pdf-engine/
│   ├── admin-cms/
│   ├── funnel-analytics/
│   ├── audit-log/
│   ├── error-log/
│   └── feature-flags/
│
├── shared/                           # Codigo compartilhado entre modulos
│   ├── lib/
│   │   ├── prisma.ts                 # Instancia singleton do Prisma
│   │   ├── redis.ts                  # Conexao Redis
│   │   ├── s3.ts                     # Cliente S3
│   │   ├── queue.ts                  # Setup BullMQ
│   │   └── logger.ts                 # Logger estruturado
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── csrf.middleware.ts
│   │   ├── logging.middleware.ts
│   │   └── error-handler.middleware.ts
│   ├── types/
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── env.d.ts
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── string.utils.ts
│   │   ├── validation.utils.ts
│   │   └── crypto.utils.ts
│   └── constants/
│       ├── nice-classifications.ts
│       ├── inpi-process-status.ts
│       └── error-codes.ts
│
├── components/                       # Componentes UI reutilizaveis
│   ├── ui/                           # shadcn/ui (gerados)
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── forms/
│   ├── journey/
│   ├── checklist/
│   └── common/
│
├── hooks/                            # React hooks customizados
│   ├── use-journey.ts
│   ├── use-checklist.ts
│   ├── use-feature-flag.ts
│   └── use-debounce.ts
│
├── workers/                          # BullMQ workers
│   ├── notification.worker.ts
│   ├── pdf-generation.worker.ts
│   ├── inpi-sync.worker.ts
│   └── health-check.worker.ts
│
├── config/                           # Configuracao centralizada
│   ├── app.config.ts
│   ├── auth.config.ts
│   ├── queue.config.ts
│   ├── cache.config.ts
│   └── feature-flags.config.ts
│
└── prisma/
    ├── schema.prisma
    ├── migrations/
    └── seed.ts
```

### 3.1 Regra de Importacao entre Modulos

```
PERMITIDO:
  app/* -> modules/*/index.ts     (apenas a API publica)
  app/* -> shared/*
  app/* -> components/*
  modules/* -> shared/*
  workers/* -> modules/*/index.ts
  workers/* -> shared/*

PROIBIDO:
  modules/A -> modules/B/services/*  (acesso direto a internals)
  modules/A -> modules/B             (dependencia cruzada direta)
  shared/* -> modules/*              (shared nao conhece modulos)
  components/* -> modules/*          (UI nao importa dominio diretamente)
```

Quando um modulo precisa de dados de outro, deve usar:
1. **Service layer na API route** que orquestra os modulos
2. **Eventos internos** (in-process event bus) para comunicacao desacoplada
3. **Shared types** para contratos de dados

---

## 4. Modulos Backend

### 4.1 Auth

**Responsabilidade**: Autenticacao, autorizacao, gerenciamento de sessoes.

```typescript
// modules/auth/index.ts (API publica)
export { AuthService } from './services/auth.service'
export { SessionService } from './services/session.service'
export type { AuthUser, AuthSession, LoginCredentials } from './types/auth.types'
```

| Componente | Descricao |
|------------|-----------|
| `auth.service.ts` | Login, registro, recuperacao de senha, verificacao de email |
| `session.service.ts` | Criacao, validacao e revogacao de sessoes (NextAuth + Redis) |
| `user.repository.ts` | Acesso a tabela `users` via Prisma |
| `auth.validators.ts` | Schemas Zod para validacao de inputs |

**Decisoes**:
- NextAuth.js com adapter Prisma para persistencia de sessoes
- Sessoes armazenadas em Redis para acesso rapido
- Suporte a provedores: email/senha + Google OAuth (futuro)
- Rate limiting especifico para endpoints de auth (5 tentativas/minuto)

### 4.2 UserProfile

**Responsabilidade**: Dados do perfil do usuario, preferencias, plano contratado.

| Componente | Descricao |
|------------|-----------|
| `profile.service.ts` | CRUD de perfil, upload de foto, atualizacao de plano |
| `preferences.service.ts` | Preferencias de notificacao, tema, idioma |
| `profile.repository.ts` | Acesso a tabelas `user_profiles` e `user_preferences` |

### 4.3 JourneyEngine

**Responsabilidade**: Motor principal do produto. Gerencia as jornadas de registro (marca, patente, etc.), suas etapas, progresso e transicoes de estado.

| Componente | Descricao |
|------------|-----------|
| `journey.service.ts` | Criar, avancar, pausar, retomar jornadas |
| `step.service.ts` | Logica de cada etapa: validacao, pre-requisitos, dados necessarios |
| `progress.service.ts` | Calculo de progresso, estimativa de prazo |
| `journey.repository.ts` | Acesso a tabelas `journeys`, `journey_steps`, `journey_progress` |
| `journey.state-machine.ts` | Maquina de estados para transicoes validas |

**Estados da jornada**: `draft` -> `in_progress` -> `waiting_inpi` -> `completed` | `abandoned`

### 4.4 ChecklistEngine

**Responsabilidade**: Checklists dinamicos vinculados a etapas da jornada. Itens podem ser auto-verificaveis ou manuais.

| Componente | Descricao |
|------------|-----------|
| `checklist.service.ts` | Gerar, validar, atualizar checklists |
| `template.service.ts` | Templates de checklist por tipo de registro |
| `checklist.repository.ts` | Acesso a tabelas `checklists`, `checklist_items` |

### 4.5 AIEngine

**Responsabilidade**: Integracao com modelos de IA para assistencia ao usuario (sugestoes de classe Nice, revisao de descricao de marca, analise de viabilidade).

| Componente | Descricao |
|------------|-----------|
| `ai.service.ts` | Orquestrador de chamadas a LLMs |
| `prompt.service.ts` | Templates de prompts por funcionalidade |
| `ai-cache.service.ts` | Cache de respostas para consultas similares |

**Decisoes**:
- Abstraction layer sobre provider (OpenAI, Anthropic, ou local)
- Prompts versionados e testados
- Rate limiting por usuario
- Fallback para sugestoes estaticas quando AI indisponivel

### 4.6 OfficialLinksManager

**Responsabilidade**: Gerenciamento de links oficiais do INPI e orgaos relacionados. Links sao atualizaveis via admin sem deploy.

| Componente | Descricao |
|------------|-----------|
| `links.service.ts` | CRUD de links, categorizacao, health check |
| `health-check.service.ts` | Verificacao periodica de links ativos |
| `links.repository.ts` | Acesso a tabela `official_links` |

### 4.7 IntegrationsManager

**Responsabilidade**: Registry central de integracoes externas. Controla status, health, metricas e feature flags de cada integracao.

| Componente | Descricao |
|------------|-----------|
| `registry.service.ts` | Registro e descoberta de integracoes |
| `health.service.ts` | Health check agregado de todas as integracoes |
| `metrics.service.ts` | Metricas por integracao (latencia, erros, uptime) |

### 4.8 INPISearchAdapter

**Responsabilidade**: Adapter para consulta de marcas no INPI. Abstrai a fonte de dados (API oficial futura, microsservico de scraping, ou fallback manual).

| Componente | Descricao |
|------------|-----------|
| `search-adapter.ts` | Interface padrao de busca (adapter pattern) |
| `microservice.adapter.ts` | Implementacao que consulta o microsservico isolado |
| `fallback.adapter.ts` | Implementacao que redireciona para busca manual no INPI |
| `cache.service.ts` | Cache local de resultados de busca |

**Detalhamento completo no documento 12-PLANO-CLONE-API-CONSULTA.md**

### 4.9 NotificationEngine

**Responsabilidade**: Notificacoes multi-canal (email, in-app, push futuro). Processamento assincrono via BullMQ.

| Componente | Descricao |
|------------|-----------|
| `notification.service.ts` | Envio orquestrado por canal |
| `email.service.ts` | Templates de email (React Email) |
| `inapp.service.ts` | Notificacoes in-app com leitura/nao-lida |
| `notification.repository.ts` | Persistencia de notificacoes |

### 4.10 PDFEngine

**Responsabilidade**: Geracao de PDFs (checklists, resumos de jornada, guias passo-a-passo). Processamento assincrono.

| Componente | Descricao |
|------------|-----------|
| `pdf.service.ts` | Orquestrador de geracao |
| `template.service.ts` | Templates por tipo de documento |
| `storage.service.ts` | Upload para S3 apos geracao |

**Tecnologia**: Puppeteer (headless Chrome) para renderizar HTML -> PDF.

### 4.11 AdminCMS

**Responsabilidade**: Gerenciamento de conteudo administrativo (textos da jornada, FAQs, links oficiais, anuncios).

| Componente | Descricao |
|------------|-----------|
| `content.service.ts` | CRUD de conteudo com versionamento |
| `content.repository.ts` | Acesso a tabelas `cms_contents`, `cms_versions` |

### 4.12 FunnelAnalytics

**Responsabilidade**: Tracking de funil de conversao, metricas de uso, eventos de produto.

| Componente | Descricao |
|------------|-----------|
| `event.service.ts` | Registro de eventos de produto |
| `funnel.service.ts` | Calculo de funil e taxas de conversao |
| `report.service.ts` | Geracao de relatorios |
| `analytics.repository.ts` | Acesso a tabelas de analytics |

### 4.13 AuditLog

**Responsabilidade**: Log imutavel de acoes do sistema para compliance e debugging.

| Componente | Descricao |
|------------|-----------|
| `audit.service.ts` | Registro de acoes com ator, recurso, acao, timestamp |
| `audit.repository.ts` | Acesso a tabela `audit_logs` (append-only) |

**Campos**: `actor_id`, `actor_type`, `action`, `resource_type`, `resource_id`, `old_value`, `new_value`, `ip_address`, `user_agent`, `timestamp`

### 4.14 ErrorLog

**Responsabilidade**: Captura e persistencia de erros nao tratados, com integracao ao Sentry.

| Componente | Descricao |
|------------|-----------|
| `error.service.ts` | Captura, classificacao e persistencia de erros |
| `sentry.service.ts` | Integracao com Sentry |
| `error.repository.ts` | Acesso a tabela `error_logs` |

### 4.15 FeatureFlags

**Responsabilidade**: Sistema de feature flags para rollout gradual, kill switches e experimentacao.

| Componente | Descricao |
|------------|-----------|
| `flag.service.ts` | Avaliacao de flags por usuario, plano, percentual |
| `flag.repository.ts` | Acesso a tabela `feature_flags` |
| `flag-cache.service.ts` | Cache de flags em Redis (TTL 60s) |

**Flags criticas**:
- `inpi_search_enabled` - Kill switch do microsservico de busca
- `ai_suggestions_enabled` - Liga/desliga sugestoes de IA
- `new_journey_flow` - Rollout gradual de novo fluxo de jornada

---

## 5. Estrutura de API Routes

```
src/app/api/
├── auth/
│   ├── [...nextauth]/route.ts        # NextAuth handler
│   ├── register/route.ts             # POST - registro
│   ├── verify-email/route.ts         # POST - verificacao
│   └── forgot-password/route.ts      # POST - recuperacao
│
├── v1/
│   ├── users/
│   │   ├── me/route.ts               # GET, PATCH - perfil proprio
│   │   └── me/preferences/route.ts   # GET, PATCH - preferencias
│   │
│   ├── journeys/
│   │   ├── route.ts                  # GET (lista), POST (criar)
│   │   ├── [id]/route.ts             # GET, PATCH, DELETE
│   │   ├── [id]/steps/route.ts       # GET passos da jornada
│   │   ├── [id]/steps/[stepId]/route.ts  # PATCH atualizar passo
│   │   ├── [id]/checklist/route.ts   # GET checklist da jornada
│   │   ├── [id]/progress/route.ts    # GET progresso
│   │   └── [id]/documents/route.ts   # GET, POST documentos
│   │
│   ├── search/
│   │   ├── trademarks/route.ts       # GET - busca de marcas
│   │   ├── trademarks/[processNumber]/route.ts  # GET - por processo
│   │   ├── nice-classes/route.ts     # GET - classes Nice
│   │   └── history/route.ts          # GET - historico de buscas
│   │
│   ├── notifications/
│   │   ├── route.ts                  # GET lista
│   │   ├── [id]/read/route.ts        # PATCH marcar como lida
│   │   └── preferences/route.ts      # GET, PATCH preferencias
│   │
│   ├── documents/
│   │   ├── upload/route.ts           # POST - upload de documento
│   │   ├── [id]/route.ts             # GET, DELETE
│   │   └── [id]/download/route.ts    # GET - download
│   │
│   ├── ai/
│   │   ├── suggest-class/route.ts    # POST - sugestao de classe Nice
│   │   ├── review-description/route.ts  # POST - revisao de descricao
│   │   └── viability/route.ts        # POST - analise de viabilidade
│   │
│   └── pdf/
│       ├── checklist/route.ts        # POST - gerar PDF de checklist
│       └── journey-summary/route.ts  # POST - gerar resumo da jornada
│
├── admin/
│   ├── users/route.ts                # GET lista, gestao de usuarios
│   ├── cms/
│   │   ├── contents/route.ts         # GET, POST
│   │   └── contents/[id]/route.ts    # GET, PATCH, DELETE
│   ├── official-links/
│   │   ├── route.ts                  # GET, POST
│   │   └── [id]/route.ts            # PATCH, DELETE
│   ├── feature-flags/
│   │   ├── route.ts                  # GET, POST
│   │   └── [id]/route.ts            # PATCH, DELETE
│   ├── analytics/
│   │   ├── funnel/route.ts           # GET metricas de funil
│   │   └── usage/route.ts            # GET metricas de uso
│   ├── integrations/
│   │   └── status/route.ts           # GET status de todas integracoes
│   └── logs/
│       ├── audit/route.ts            # GET audit logs
│       └── errors/route.ts           # GET error logs
│
├── webhooks/
│   ├── payment/route.ts              # POST - webhook de pagamento
│   └── inpi-sync/route.ts            # POST - trigger de sync INPI
│
└── health/
    └── route.ts                      # GET - health check
```

### 5.1 Padrao de API Route

```typescript
// Exemplo: src/app/api/v1/journeys/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/shared/middleware/auth.middleware'
import { withRateLimit } from '@/shared/middleware/rate-limit.middleware'
import { withErrorHandler } from '@/shared/middleware/error-handler.middleware'
import { JourneyService } from '@/modules/journey-engine'
import { createJourneySchema } from '@/modules/journey-engine/validators'

async function handler(req: NextRequest) {
  if (req.method === 'GET') {
    const journeys = await JourneyService.listByUser(req.auth.userId)
    return NextResponse.json({ data: journeys })
  }

  if (req.method === 'POST') {
    const body = createJourneySchema.parse(await req.json())
    const journey = await JourneyService.create(req.auth.userId, body)
    return NextResponse.json({ data: journey }, { status: 201 })
  }
}

export const GET = withErrorHandler(withAuth(withRateLimit(handler)))
export const POST = withErrorHandler(withAuth(withRateLimit(handler)))
```

---

## 6. Camadas de Middleware

### 6.1 Pipeline de Middleware

Cada request passa pelas seguintes camadas, nesta ordem:

```
Request
  |-> Error Handler (captura erros nao tratados)
    |-> Logging (registra request/response)
      |-> CSRF Protection (valida token CSRF em mutacoes)
        |-> Rate Limiting (limita requests por IP/usuario)
          |-> Auth (valida sessao, injeta usuario)
            |-> Handler (logica de negocio)
```

### 6.2 Auth Middleware

```typescript
// shared/middleware/auth.middleware.ts
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest) => {
    const session = await getServerSession(authConfig)
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Sessao invalida ou expirada' } },
        { status: 401 }
      )
    }
    req.auth = { userId: session.user.id, role: session.user.role }
    return handler(req)
  }
}
```

### 6.3 Rate Limiting Middleware

```typescript
// shared/middleware/rate-limit.middleware.ts
// Estrategia: sliding window counter via Redis
// Limites padroes:
//   - API geral: 100 requests/minuto por usuario
//   - Auth endpoints: 5 requests/minuto por IP
//   - Search endpoints: 30 requests/minuto por usuario
//   - AI endpoints: 10 requests/minuto por usuario
```

### 6.4 CSRF Middleware

- Token CSRF gerado no login e armazenado na sessao
- Validacao obrigatoria em todos os metodos mutantes (POST, PATCH, PUT, DELETE)
- Excecao: webhooks (validados por assinatura HMAC)

### 6.5 Logging Middleware

```typescript
// Campos registrados em cada request:
{
  timestamp: string,
  requestId: string,      // UUID unico por request
  method: string,
  path: string,
  statusCode: number,
  duration: number,        // ms
  userId?: string,
  ip: string,
  userAgent: string,
  error?: {
    code: string,
    message: string,
    stack?: string         // apenas em desenvolvimento
  }
}
```

### 6.6 Error Handler Middleware

```typescript
// Erros conhecidos retornam status e mensagem estruturados
// Erros desconhecidos retornam 500 e sao logados no ErrorLog + Sentry
// Em producao, stack traces nunca sao expostos ao cliente

// Formato padrao de erro:
{
  error: {
    code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'RATE_LIMITED' | 'INTERNAL_ERROR',
    message: string,
    details?: Record<string, string[]>  // erros de validacao por campo
  }
}
```

---

## 7. Estrategia de Cache com Redis

### 7.1 Camadas de Cache

| Camada | TTL | Uso |
|--------|-----|-----|
| **Sessoes** | 24h | Dados de sessao do usuario (NextAuth) |
| **Feature Flags** | 60s | Avaliacao de flags (atualiza rapido apos mudanca no admin) |
| **Classes Nice** | 7 dias | Lista de classificacoes Nice (dados estaticos) |
| **Resultados de busca INPI** | 24h | Cache de consultas ao microsservico de busca |
| **Links oficiais** | 1h | Lista de links com health status |
| **Conteudo CMS** | 5min | Textos e FAQs gerenciados pelo admin |
| **Rate limiting counters** | 1min | Contadores de sliding window |

### 7.2 Estrategia de Invalidacao

```typescript
// Invalidacao por evento (write-through)
// Quando dados sao atualizados, o cache e invalidado imediatamente

// Exemplo: ao atualizar uma feature flag no admin
async function updateFlag(id: string, data: FlagUpdate) {
  await flagRepository.update(id, data)
  await redis.del(`feature-flag:${id}`)
  await redis.del('feature-flags:all')  // invalida lista completa
}

// Invalidacao por TTL (time-based)
// Dados externos (INPI, links) usam TTL para manter freshness
// sem depender de eventos de invalidacao
```

### 7.3 Padrao de Cache

```typescript
// shared/lib/cache.ts
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const hit = await redis.get(key)
  if (hit) return JSON.parse(hit) as T

  const data = await fetcher()
  await redis.setex(key, ttlSeconds, JSON.stringify(data))
  return data
}
```

---

## 8. Arquitetura de Filas com BullMQ

### 8.1 Filas Definidas

| Fila | Concorrencia | Retry | Descricao |
|------|-------------|-------|-----------|
| `notifications` | 5 | 3x (backoff exponencial) | Envio de emails e notificacoes in-app |
| `pdf-generation` | 2 | 2x | Geracao de PDFs via Puppeteer |
| `inpi-data-sync` | 1 | 3x (backoff 5min) | Sincronizacao de dados abertos do INPI |
| `health-checks` | 3 | 1x | Verificacao de links e integracoes |
| `analytics-events` | 10 | 1x | Processamento de eventos de analytics |

### 8.2 Arquitetura dos Workers

```typescript
// workers/notification.worker.ts
import { Worker, Job } from 'bullmq'
import { NotificationService } from '@/modules/notification-engine'
import { redisConnection } from '@/shared/lib/redis'
import { logger } from '@/shared/lib/logger'

const worker = new Worker(
  'notifications',
  async (job: Job) => {
    const { type, recipientId, payload } = job.data

    switch (type) {
      case 'email':
        await NotificationService.sendEmail(recipientId, payload)
        break
      case 'in-app':
        await NotificationService.sendInApp(recipientId, payload)
        break
    }

    logger.info('Notification sent', {
      jobId: job.id,
      type,
      recipientId,
    })
  },
  {
    connection: redisConnection,
    concurrency: 5,
    limiter: {
      max: 50,
      duration: 60000, // 50 emails/minuto
    },
  }
)
```

### 8.3 Dead Letter Queue

Jobs que falham apos todos os retries sao movidos para uma DLQ dedicada. O admin dashboard exibe jobs na DLQ para investigacao manual.

### 8.4 Jobs Recorrentes (Cron)

| Job | Cron | Descricao |
|-----|------|-----------|
| `sync-inpi-open-data` | `0 3 * * *` (3h da manha) | Sincroniza dados abertos do INPI |
| `check-official-links` | `0 */6 * * *` (a cada 6h) | Verifica health de links oficiais |
| `check-integration-health` | `*/15 * * * *` (a cada 15min) | Health check de integracoes |
| `cleanup-expired-sessions` | `0 2 * * *` (2h da manha) | Remove sessoes expiradas |
| `generate-daily-analytics` | `0 1 * * *` (1h da manha) | Gera metricas diarias |

---

## 9. Arquitetura de Armazenamento de Arquivos

### 9.1 Estrutura de Storage

```
bucket: registrar-certo-files
├── users/{userId}/
│   ├── avatar/
│   │   └── {hash}.{ext}
│   └── documents/
│       ├── {journeyId}/
│       │   ├── logo-marca-{hash}.png
│       │   ├── procuracao-{hash}.pdf
│       │   └── comprovante-{hash}.pdf
│       └── uploads/
│           └── {hash}.{ext}
├── generated/
│   ├── pdfs/
│   │   ├── checklist-{journeyId}-{timestamp}.pdf
│   │   └── resumo-{journeyId}-{timestamp}.pdf
│   └── exports/
│       └── {userId}-{type}-{timestamp}.csv
└── system/
    └── templates/
        └── {templateName}.html
```

### 9.2 Politicas de Upload

| Regra | Valor |
|-------|-------|
| Tamanho maximo por arquivo | 10 MB |
| Tipos permitidos | PDF, PNG, JPG, JPEG, WEBP |
| Validacao | Magic bytes (nao apenas extensao) |
| Nomeacao | Hash SHA-256 do conteudo (deduplicacao) |
| Acesso | Signed URLs com expiracao de 1h |
| Scan de virus | Futuro (ClamAV ou servico externo) |

### 9.3 Compatibilidade S3

```typescript
// shared/lib/s3.ts
import { S3Client } from '@aws-sdk/client-s3'

// Em dev: MinIO (localhost:9000)
// Em prod: AWS S3 ou Cloudflare R2
// A troca e transparente -- apenas variavel de ambiente

export const s3Client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true', // necessario para MinIO
})
```

---

## 10. Seguranca e LGPD

### 10.1 Conformidade LGPD

| Requisito | Implementacao |
|-----------|---------------|
| **Consentimento** | Checkbox explicito no registro, termos versionados |
| **Direito de acesso** | Endpoint `GET /api/v1/users/me/data-export` |
| **Direito de exclusao** | Endpoint `DELETE /api/v1/users/me` com soft delete + purge em 30 dias |
| **Portabilidade** | Export em JSON/CSV via data-export |
| **Minimizacao** | Coletar apenas dados necessarios para o servico |
| **Retencao** | Politica de retencao por tipo de dado (sessoes: 30d, logs: 90d, dados de usuario: enquanto ativo + 30d) |
| **DPO** | Email de contato do encarregado de dados no footer |
| **Registro de tratamento** | Tabela `data_processing_records` documentando cada tratamento |

### 10.2 Criptografia

| Dado | Metodo |
|------|--------|
| Senhas | bcrypt (cost factor 12) |
| Tokens de sessao | Assinados com HMAC-SHA256 |
| Dados sensiveis em repouso | AES-256-GCM (campos PII no banco) |
| Transito | TLS 1.3 obrigatorio |
| Backups | Criptografados em repouso no S3 |

### 10.3 Validacao de Input

```typescript
// Todas as API routes usam Zod para validacao
// Exemplo de schema:
const createJourneySchema = z.object({
  type: z.enum(['trademark', 'patent', 'software', 'industrial_design']),
  name: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  niceClasses: z.array(z.number().int().min(1).max(45)).optional(),
})
```

### 10.4 Protecoes Adicionais

- **SQL Injection**: Prisma parametriza todas as queries automaticamente
- **XSS**: React escapa output por padrao; CSP headers configurados
- **CSRF**: Token-based para forms; SameSite cookies
- **Clickjacking**: X-Frame-Options: DENY
- **Rate Limiting**: Por IP e por usuario, com limites diferenciados por endpoint
- **Dependency scanning**: `npm audit` no CI, Dependabot ativo
- **Secrets**: Nunca em codigo; `.env.local` para dev, secrets manager em producao

---

## 11. Observabilidade

### 11.1 Logging Estruturado

```typescript
// shared/lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: 'registrar-certo',
    environment: process.env.NODE_ENV,
  },
})

// Uso:
logger.info({ userId, journeyId, action: 'journey_created' }, 'Jornada criada')
logger.error({ err, requestId }, 'Falha ao processar pagamento')
```

### 11.2 Error Tracking

- **Sentry** para captura automatica de erros nao tratados
- Source maps enviados no build para stack traces legiveis
- Alertas por Slack/email para erros criticos
- Agrupamento automatico de erros similares

### 11.3 Health Endpoints

```typescript
// GET /api/health
{
  status: 'healthy' | 'degraded' | 'unhealthy',
  timestamp: string,
  version: string,
  checks: {
    database: { status: 'up' | 'down', latency: number },
    redis: { status: 'up' | 'down', latency: number },
    s3: { status: 'up' | 'down', latency: number },
    queues: {
      notifications: { active: number, waiting: number, failed: number },
      pdfGeneration: { active: number, waiting: number, failed: number },
    },
    integrations: {
      inpiSearch: { status: 'up' | 'down' | 'disabled', lastCheck: string },
      inpiOpenData: { status: 'up' | 'down', lastSync: string },
    }
  }
}
```

### 11.4 Metricas Recomendadas

| Metrica | Tipo | Descricao |
|---------|------|-----------|
| `http_request_duration_ms` | Histograma | Latencia por rota |
| `http_requests_total` | Contador | Total de requests por status |
| `queue_job_duration_ms` | Histograma | Duracao de jobs por fila |
| `queue_jobs_failed_total` | Contador | Jobs falhados por fila |
| `cache_hit_rate` | Gauge | Taxa de cache hit por chave |
| `active_users` | Gauge | Usuarios ativos (SSE ou polling) |
| `journey_created_total` | Contador | Jornadas criadas |
| `search_requests_total` | Contador | Buscas INPI realizadas |

---

## 12. Configuracao de Ambiente

### 12.1 Variaveis de Ambiente

```bash
# .env.example

# ===== APP =====
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_SECRET=                            # Chave secreta para HMAC (gerar com openssl rand -hex 32)

# ===== DATABASE =====
DATABASE_URL=postgresql://user:pass@localhost:5432/registrar_certo

# ===== REDIS =====
REDIS_URL=redis://localhost:6379

# ===== AUTH =====
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                       # Gerar com openssl rand -base64 32
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ===== S3 STORAGE =====
S3_ENDPOINT=http://localhost:9000      # MinIO em dev
S3_REGION=us-east-1
S3_BUCKET=registrar-certo-files
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_FORCE_PATH_STYLE=true              # true para MinIO

# ===== AI =====
OPENAI_API_KEY=
AI_MODEL=gpt-4o-mini
AI_MAX_TOKENS=1000

# ===== INPI SEARCH MICROSERVICE =====
INPI_SEARCH_URL=http://localhost:4000
INPI_SEARCH_TIMEOUT=10000             # ms
INPI_SEARCH_ENABLED=true              # Feature flag global

# ===== EMAIL =====
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@registrarcerto.com.br

# ===== SENTRY =====
SENTRY_DSN=
SENTRY_ENVIRONMENT=development

# ===== FEATURE FLAGS =====
FEATURE_FLAGS_CACHE_TTL=60            # segundos

# ===== LOGGING =====
LOG_LEVEL=debug                        # debug | info | warn | error
```

### 12.2 Docker Compose para Desenvolvimento

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: registrar
      POSTGRES_PASSWORD: registrar_dev
      POSTGRES_DB: registrar_certo
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

  minio:
    image: minio/minio
    ports:
      - '9000:9000'
      - '9001:9001'
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

  inpi-search:
    build:
      context: ./services/inpi-search
      dockerfile: Dockerfile
    ports:
      - '4000:4000'
    environment:
      REDIS_URL: redis://redis:6379
      PORT: 4000
    depends_on:
      - redis

volumes:
  postgres_data:
  minio_data:
```

---

## 13. ADRs (Architecture Decision Records)

### ADR-001: Monolito Modular como Arquitetura Inicial

**Status**: Aceito

**Contexto**: Equipe pequena (1-3 devs), produto em fase inicial com dominio ainda sendo descoberto. Microsservicos adicionariam complexidade operacional sem beneficio proporcional.

**Decisao**: Adotar monolito modular com fronteiras claras entre modulos. Cada modulo expoe apenas uma API publica (index.ts). Comunicacao entre modulos via service layer ou event bus interno.

**Consequencias**:
- (+) Deploy e debug simples
- (+) Refactoring de fronteiras de modulo e barato
- (+) Um unico banco de dados simplifica transacoes
- (-) Scaling e uniforme (nao por modulo)
- (-) Extracao futura de microsservico exige esforco (mas e viavel)

### ADR-002: Next.js App Router como Framework Full-Stack

**Status**: Aceito

**Contexto**: Necessidade de SSR para SEO (landing pages, blog), API routes integradas, e DX moderna com React Server Components.

**Decisao**: Usar Next.js 14+ com App Router como framework unico para frontend e backend.

**Consequencias**:
- (+) Um unico projeto, sem BFF separado
- (+) RSC reduz JavaScript enviado ao cliente
- (+) API routes colocadas junto ao codigo que as consome
- (-) Lock-in no ecossistema Vercel (mitigavel com self-host)
- (-) Workers BullMQ precisam rodar em processo separado

### ADR-003: Microsservico Isolado para Busca INPI

**Status**: Aceito

**Contexto**: A busca de marcas no INPI depende de fonte nao-oficial (scraping). Este componente tem risco legal, tecnico e de confiabilidade distintos do restante da aplicacao.

**Decisao**: Isolar a busca INPI em microsservico separado (Docker container proprio), com comunicacao via HTTP, circuit breaker e feature flag de kill switch.

**Consequencias**:
- (+) Falha no scraping nao afeta o restante do sistema
- (+) Pode ser desligado instantaneamente via feature flag
- (+) Substituicao por API oficial e transparente (adapter pattern)
- (-) Complexidade operacional adicional (mais um servico para monitorar)
- (-) Latencia extra da comunicacao HTTP

**Detalhamento completo em 12-PLANO-CLONE-API-CONSULTA.md**

---

## 14. Estrategia de Evolucao

### 14.1 Fase 1 - MVP (Meses 1-3)
- Monolito modular funcionando
- Jornada de registro de marca (tipo principal)
- Checklist e progresso basico
- Auth com email/senha
- Links oficiais gerenciados pelo admin
- Deploy em Vercel + banco gerenciado

### 14.2 Fase 2 - Expansao (Meses 4-6)
- Busca de marcas via microsservico isolado
- Sugestoes de IA (classe Nice, revisao de descricao)
- Notificacoes por email
- Geracao de PDF
- Analytics basico

### 14.3 Fase 3 - Maturidade (Meses 7-12)
- Multiplos tipos de registro (patente, software, desenho industrial)
- Sistema de pagamento
- Dashboard admin completo
- Observabilidade madura (metricas, alertas, dashboards)
- Avaliacao de extracoes de microsservicos conforme necessidade

### 14.4 Criterios para Extracao de Microsservico

Extrair um modulo para microsservico apenas quando:
1. O modulo tem requisitos de escala significativamente diferentes
2. O modulo precisa de deploy independente (ex: ciclo de release diferente)
3. O modulo tem dependencias externas com SLA diferente
4. A equipe cresceu e precisa de autonomia por squad

**Candidatos mais provaveis**: INPISearchAdapter (ja isolado), PDFEngine (CPU-intensivo), NotificationEngine (volume alto).
