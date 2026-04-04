# 12 - Plano do Modulo de Consulta INPI (Nao-Oficial)

## 1. Visao Geral

Este documento detalha o plano de implementacao do microsservico de busca de marcas no INPI -- o componente de Camada B descrito em `10-ARQUITETURA-INTEGRACOES.md`. Por utilizar fontes nao-oficiais, este modulo e tratado como componente de alto risco e e completamente isolado da aplicacao principal.

### 1.1 Decisao Arquitetural (ADR-003)

**Contexto**: A busca de marcas no INPI e funcionalidade central do produto, mas o INPI nao oferece API publica oficial para consulta em tempo real. A alternativa e extrair dados do sistema de busca web do INPI.

**Decisao**: Isolar a busca em microsservico independente, com container Docker proprio, feature flag de kill switch e adapter pattern para swap futuro por API oficial.

**Consequencias**:
- (+) Falha no scraping nao propaga para o app principal
- (+) Desligamento instantaneo sem deploy
- (+) Substituicao transparente quando API oficial existir
- (-) Complexidade operacional de manter servico separado
- (-) Latencia adicional de comunicacao HTTP entre servicos

---

## 2. Isolamento como Microsservico

### 2.1 Separacao Fisica

```
projeto-raiz/
├── src/                          # App principal (Next.js)
│   └── modules/
│       └── inpi-search-adapter/  # Apenas o adapter (cliente HTTP)
│
└── services/
    └── inpi-search/              # Microsservico isolado
        ├── Dockerfile
        ├── docker-compose.yml
        ├── package.json          # Dependencias independentes
        ├── tsconfig.json
        ├── src/
        │   ├── server.ts         # Entry point (Express)
        │   ├── config/
        │   │   ├── app.config.ts
        │   │   └── cache.config.ts
        │   ├── routes/
        │   │   ├── marcas.routes.ts
        │   │   ├── nices.routes.ts
        │   │   └── health.routes.ts
        │   ├── services/
        │   │   ├── scraping.service.ts
        │   │   ├── cache.service.ts
        │   │   ├── queue.service.ts
        │   │   └── nice-class.service.ts
        │   ├── middleware/
        │   │   ├── rate-limiter.ts
        │   │   ├── request-logger.ts
        │   │   └── error-handler.ts
        │   ├── types/
        │   │   └── index.ts
        │   └── utils/
        │       ├── normalizer.ts   # Normalizacao de texto
        │       └── parser.ts       # Parsing de resultados
        └── tests/
            ├── unit/
            └── integration/
```

### 2.2 Docker Container

```dockerfile
# services/inpi-search/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Seguranca: nao rodar como root
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "dist/server.js"]
```

### 2.3 Docker Compose do Microsservico

```yaml
# services/inpi-search/docker-compose.yml
version: '3.8'

services:
  inpi-search:
    build: .
    ports:
      - '4000:4000'
    environment:
      NODE_ENV: production
      PORT: 4000
      REDIS_URL: redis://redis:6379/1       # DB 1 separado do app principal
      LOG_LEVEL: info
      RATE_LIMIT_MAX: 100
      RATE_LIMIT_WINDOW_MS: 60000
      SCRAPING_TIMEOUT_MS: 15000
      SCRAPING_DELAY_MS: 2000               # Delay entre requests ao INPI
      CACHE_DEFAULT_TTL: 86400              # 24h
    depends_on:
      redis:
        condition: service_healthy
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 3
    volumes:
      - redis_data:/data
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru

volumes:
  redis_data:
```

### 2.4 Health Check Proprio

```typescript
// services/inpi-search/src/routes/health.routes.ts
import { Router } from 'express'
import { cacheService } from '../services/cache.service'

const router = Router()

router.get('/health', async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    redis: await checkRedis(),
    scraping: await checkScrapingTarget(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB',
    },
  }

  const isHealthy = checks.redis.status === 'up'
  const status = isHealthy ? 'healthy' : 'degraded'

  res.status(isHealthy ? 200 : 503).json({ status, checks })
})

async function checkRedis(): Promise<{ status: string; latency: number }> {
  const start = Date.now()
  try {
    await cacheService.ping()
    return { status: 'up', latency: Date.now() - start }
  } catch {
    return { status: 'down', latency: -1 }
  }
}

async function checkScrapingTarget(): Promise<{ status: string; latency: number }> {
  const start = Date.now()
  try {
    // HEAD request ao site do INPI (sem scraping real)
    const response = await fetch('https://busca.inpi.gov.br/pePI/', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
    return {
      status: response.ok ? 'up' : 'degraded',
      latency: Date.now() - start,
    }
  } catch {
    return { status: 'down', latency: -1 }
  }
}

export default router
```

---

## 3. Estrategia de Versionamento

### 3.1 Versionamento por URL

```
/api/v1/marcas          # Versao atual
/api/v2/marcas          # Versao futura (quando API oficial for usada)
/health                 # Sem versionamento (infraestrutura)
/metrics                # Sem versionamento (infraestrutura)
```

### 3.2 Politica de Deprecacao

```typescript
// Quando v2 for lancada:
// 1. v1 continua funcionando por 90 dias
// 2. Header de deprecacao adicionado em respostas v1
// 3. Logs registram uso de versao deprecated
// 4. Apos 90 dias, v1 retorna 410 Gone

// Header de deprecacao:
res.setHeader('Deprecation', 'true')
res.setHeader('Sunset', 'Sat, 01 Jan 2027 00:00:00 GMT')
res.setHeader('Link', '</api/v2/marcas>; rel="successor-version"')
```

### 3.3 Contrato de Resposta (v1)

```typescript
// Todas as respostas seguem este envelope
interface APIResponse<T> {
  success: boolean
  data: T | null
  error?: {
    code: string
    message: string
  }
  meta: {
    version: 'v1'
    source: 'cache' | 'live'
    cachedAt?: string           // ISO timestamp se veio do cache
    responseTime: number        // ms
    disclaimer: string          // Sempre presente
  }
  pagination?: {
    page: number
    pageSize: number
    totalResults: number
    totalPages: number
  }
}
```

---

## 4. Desacoplamento do App Principal

### 4.1 Interface do Adapter (Contrato)

```typescript
// src/modules/inpi-search-adapter/types/search-provider.interface.ts

/**
 * Interface que qualquer provider de busca INPI deve implementar.
 * Tanto o microsservico de scraping quanto uma futura API oficial
 * devem respeitar este contrato.
 */
export interface INPISearchProvider {
  searchByName(params: {
    name: string
    niceClass?: number
    page?: number
    pageSize?: number
  }): Promise<TrademarkSearchResult>

  searchByProcess(processNumber: string): Promise<TrademarkDetail | null>

  listNiceClasses(): Promise<NiceClass[]>

  getNiceClass(classNumber: number): Promise<NiceClass | null>

  healthCheck(): Promise<ProviderHealthStatus>
}

export interface TrademarkSearchResult {
  results: TrademarkSummary[]
  totalResults: number
  page: number
  pageSize: number
  source: 'cache' | 'live' | 'fallback'
}

export interface TrademarkSummary {
  processNumber: string
  brandName: string
  applicant: string
  niceClasses: number[]
  status: string
  filingDate: string
}

export interface TrademarkDetail extends TrademarkSummary {
  presentation: string          // Nominativa, Mista, Figurativa
  nature: string                // Produto, Servico, Coletiva
  lastUpdate: string
  events: TrademarkEvent[]
}

export interface TrademarkEvent {
  date: string
  code: string
  description: string
}

export interface NiceClass {
  number: number
  title: string
  description: string
  examples: string[]
}

export interface ProviderHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'disabled'
  latency: number
  message?: string
}
```

### 4.2 Dependency Injection

```typescript
// src/modules/inpi-search-adapter/index.ts

import { INPISearchProvider } from './types/search-provider.interface'
import { MicroserviceSearchProvider } from './providers/microservice.provider'
import { FallbackSearchProvider } from './providers/fallback.provider'
import { FeatureFlagService } from '@/modules/feature-flags'

// Factory que decide qual provider usar
export function createSearchProvider(): INPISearchProvider {
  // Provider real: microsservico de scraping
  const microserviceProvider = new MicroserviceSearchProvider({
    baseUrl: process.env.INPI_SEARCH_URL!,
    timeout: parseInt(process.env.INPI_SEARCH_TIMEOUT || '10000'),
  })

  // Provider fallback: links diretos + dados locais
  const fallbackProvider = new FallbackSearchProvider()

  // Proxy que verifica feature flag e circuit breaker
  return new SearchProviderProxy(microserviceProvider, fallbackProvider)
}

class SearchProviderProxy implements INPISearchProvider {
  constructor(
    private primary: INPISearchProvider,
    private fallback: INPISearchProvider,
  ) {}

  async searchByName(params: Parameters<INPISearchProvider['searchByName']>[0]) {
    const isEnabled = await FeatureFlagService.isEnabled('inpi_search_enabled')
    if (!isEnabled) {
      return this.fallback.searchByName(params)
    }

    try {
      return await this.primary.searchByName(params)
    } catch (error) {
      logger.warn({ error, query: params.name }, 'Busca INPI falhou, usando fallback')
      return this.fallback.searchByName(params)
    }
  }

  // ... mesma logica para outros metodos
}
```

### 4.3 Regra de Importacao

```
CORRETO:
  src/app/api/v1/search/* -> src/modules/inpi-search-adapter/index.ts
  src/modules/inpi-search-adapter/* -> src/modules/inpi-search-adapter/types/*
  src/modules/inpi-search-adapter/* -> src/shared/*

PROIBIDO:
  src/app/* -> services/inpi-search/*          (importar codigo do microsservico)
  src/modules/journey-engine/* -> services/*    (dependencia direta)
  services/inpi-search/* -> src/*              (microsservico nao importa app)
```

O app principal so conhece a **interface** `INPISearchProvider`. Nunca sabe se esta falando com microsservico, API oficial, ou fallback.

---

## 5. Tratamento de Indisponibilidade

### 5.1 Cascata de Fallback

```
Usuario faz busca
     │
     ▼
┌─ Cache Redis tem resultado? ─────── SIM ──> Retorna do cache
│                                              (source: 'cache')
│   NAO
│    │
│    ▼
├─ Feature flag habilitada? ────────── NAO ──> Fallback: link direto INPI
│                                              (source: 'fallback')
│   SIM
│    │
│    ▼
├─ Circuit breaker fechado? ────────── NAO ──> Fallback: dados cache antigo
│                                              ou link direto INPI
│   SIM
│    │
│    ▼
├─ Microsservico responde? ─────────── NAO ──> Incrementa falha do circuit
│                                              breaker + fallback
│   SIM
│    │
│    ▼
└─ Salva no cache + retorna resultado
   (source: 'live')
```

### 5.2 Graceful Degradation na UI

```typescript
// Componente React que exibe resultados de busca
function SearchResults({ query }: { query: string }) {
  const { data, isLoading, error } = useSearchTrademarks(query)

  // Estado: Carregando
  if (isLoading) return <SearchSkeleton />

  // Estado: Servico indisponivel
  if (data?.source === 'fallback') {
    return (
      <FallbackSearchPanel
        query={query}
        fallbackUrl={data.fallbackUrl}
        message="A busca automatica esta temporariamente indisponivel."
        steps={[
          'Acesse o sistema de busca do INPI pelo link abaixo',
          `Pesquise por "${query}"`,
          'Analise os resultados encontrados',
          'Volte aqui para continuar sua jornada',
        ]}
      />
    )
  }

  // Estado: Resultados do cache (pode estar desatualizado)
  if (data?.source === 'cache') {
    return (
      <>
        <CacheNotice cachedAt={data.meta.cachedAt} />
        <SearchResultsList results={data.results} />
        <SearchDisclaimer />
      </>
    )
  }

  // Estado: Resultados ao vivo
  return (
    <>
      <SearchResultsList results={data.results} />
      <SearchDisclaimer />
    </>
  )
}
```

### 5.3 Circuit Breaker Especifico

```typescript
// Configuracao do circuit breaker para o microsservico de busca
const inpiSearchCircuitBreaker = new CircuitBreaker({
  name: 'inpi-search-microservice',
  failureThreshold: 3,          // Abre apos 3 falhas
  successThreshold: 2,           // Fecha apos 2 sucessos em half-open
  timeout: 30000,                // 30s antes de tentar half-open
  onOpen: () => {
    logger.error('Circuit breaker do INPI Search ABRIU')
    // Notificar admin via Slack/email
    NotificationService.alertAdmin('Circuit breaker INPI Search aberto')
  },
  onClose: () => {
    logger.info('Circuit breaker do INPI Search FECHOU')
  },
})
```

---

## 6. Cache Local com Redis

### 6.1 Estrategia de Cache

```typescript
// services/inpi-search/src/services/cache.service.ts

interface CacheConfig {
  // Busca por nome
  searchByName: {
    keyPattern: 'inpi:v1:search:name:{normalizedName}:{niceClass}:{page}',
    ttl: 86400,          // 24 horas
    staleWhileRevalidate: 3600,  // Serve stale por 1h enquanto revalida
  },
  // Busca por processo
  searchByProcess: {
    keyPattern: 'inpi:v1:search:process:{processNumber}',
    ttl: 43200,          // 12 horas (status pode mudar)
  },
  // Classes Nice
  niceClasses: {
    keyPattern: 'inpi:v1:nice:all',
    ttl: 604800,         // 7 dias (dados estaticos)
  },
  // Classe Nice individual
  niceClass: {
    keyPattern: 'inpi:v1:nice:{classNumber}',
    ttl: 604800,         // 7 dias
  },
}
```

### 6.2 Stale-While-Revalidate

Quando um item do cache expira mas ainda esta dentro do periodo de `staleWhileRevalidate`:
1. Retorna o dado "stale" imediatamente ao usuario (rapido)
2. Em background, faz nova busca e atualiza o cache
3. Proximo request ja recebe dado fresco

```typescript
async function cachedSearch(key: string, ttl: number, staleTtl: number, fetcher: () => Promise<any>) {
  const cached = await redis.get(key)

  if (cached) {
    const parsed = JSON.parse(cached)
    const age = Date.now() - parsed.cachedAt

    if (age < ttl * 1000) {
      // Fresco: retorna direto
      return { ...parsed.data, source: 'cache', cachedAt: parsed.cachedAt }
    }

    if (age < (ttl + staleTtl) * 1000) {
      // Stale mas dentro da janela: retorna e revalida em background
      revalidateInBackground(key, ttl, fetcher)
      return { ...parsed.data, source: 'cache', cachedAt: parsed.cachedAt, stale: true }
    }
  }

  // Cache miss ou muito antigo: busca ao vivo
  const data = await fetcher()
  await redis.setex(key, ttl + staleTtl, JSON.stringify({ data, cachedAt: Date.now() }))
  return { ...data, source: 'live' }
}
```

### 6.3 Invalidacao de Cache

| Cenario | Estrategia |
|---------|-----------|
| TTL expirou | Automatica (Redis) |
| Admin solicita refresh | Endpoint `POST /admin/cache/invalidate` |
| Dados sabidamente desatualizados | Invalidacao por pattern `inpi:v1:search:*` |
| Novo sync de dados abertos | Invalida cache de buscas que matcham dados atualizados |
| Deploy nova versao do microsservico | Prefixo de versao no key (`v1:`) evita conflitos |

### 6.4 Metricas de Cache

```typescript
// Metricas expostas no /metrics
{
  'cache_hits_total': number,
  'cache_misses_total': number,
  'cache_stale_serves_total': number,
  'cache_hit_rate': number,           // hits / (hits + misses)
  'cache_size_keys': number,          // Quantidade de keys
  'cache_memory_bytes': number,       // Memoria usada pelo Redis
}
```

---

## 7. Historico de Consultas

### 7.1 Schema da Tabela

```sql
-- No banco PostgreSQL do app principal (nao do microsservico)
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query_type VARCHAR(50) NOT NULL,       -- 'name' | 'process' | 'nice_class'
  query_text VARCHAR(500) NOT NULL,      -- Texto da busca
  query_params JSONB,                    -- Parametros adicionais (classe Nice, pagina)
  result_count INTEGER,                  -- Quantidade de resultados
  source VARCHAR(20) NOT NULL,           -- 'live' | 'cache' | 'fallback'
  response_time_ms INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  INDEX idx_search_queries_user ON search_queries(user_id, created_at DESC),
  INDEX idx_search_queries_text ON search_queries(query_text),
  INDEX idx_search_queries_date ON search_queries(created_at)
);
```

### 7.2 Analytics de Buscas Populares

```sql
-- View materializada para buscas populares (atualizada diariamente)
CREATE MATERIALIZED VIEW popular_searches AS
SELECT
  query_text,
  query_type,
  COUNT(*) as search_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(result_count) as avg_results,
  AVG(response_time_ms) as avg_response_time,
  MAX(created_at) as last_searched_at
FROM search_queries
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY query_text, query_type
ORDER BY search_count DESC;

-- Atualizada via job BullMQ diariamente
REFRESH MATERIALIZED VIEW CONCURRENTLY popular_searches;
```

### 7.3 Uso dos Dados de Historico

| Uso | Descricao |
|-----|-----------|
| Pre-aquecimento de cache | Top 100 buscas populares sao pre-aquecidas diariamente |
| Sugestoes de busca | Autocomplete baseado em buscas anteriores do usuario |
| Analytics de produto | Quais tipos de marca sao mais buscados |
| Deteccao de abuso | Usuarios com volume anormal de buscas |
| Melhoria de UX | Entender padroes de busca para melhorar interface |

---

## 8. Feature Flag -- Kill Switch

### 8.1 Configuracao da Flag

```typescript
// Na tabela feature_flags
{
  key: 'inpi_search_enabled',
  name: 'Busca de Marcas INPI',
  description: 'Habilita/desabilita o microsservico de busca de marcas. Quando desabilitado, usuarios sao direcionados para busca manual no site do INPI.',
  enabled: true,
  rules: [
    // Regra 1: Rollout gradual por porcentagem de usuarios
    {
      type: 'percentage',
      value: 100,         // 100% dos usuarios (ajustar para rollout gradual)
    },
    // Regra 2: Excecao por plano (se necessario, desabilitar para free tier)
    {
      type: 'plan',
      enabledPlans: ['starter', 'professional', 'enterprise'],
    },
  ],
  metadata: {
    owner: 'engineering',
    category: 'integration',
    riskLevel: 'high',
  },
}
```

### 8.2 Operacao do Kill Switch

**Para desativar (emergencia)**:
1. Admin acessa `/admin/feature-flags`
2. Localiza `inpi_search_enabled`
3. Clica "Desativar"
4. Efeito imediato (cache de flags TTL 60s, pior caso)
5. Todos os usuarios passam a usar Camada C (fallback)
6. AuditLog registra quem desativou e quando

**Para rollout gradual**:
1. Iniciar com 10% dos usuarios
2. Monitorar metricas (erros, latencia, satisfacao)
3. Incrementar 10% a cada dia sem incidentes
4. Rollback para 0% se problemas detectados

### 8.3 Monitoramento Pos-Toggle

Apos ativar/desativar a flag, monitorar por 30 minutos:
- Taxa de erro da busca
- Latencia media
- Quantidade de fallbacks ativados
- Feedback de usuarios (se houver canal)

---

## 9. Swap Futuro para API Oficial

### 9.1 Contrato de Interface

A interface `INPISearchProvider` (secao 4.1) e o contrato que tanto o microsservico de scraping quanto uma futura API oficial devem implementar. O swap e feito criando nova implementacao:

```typescript
// src/modules/inpi-search-adapter/providers/official-api.provider.ts

export class OfficialAPISearchProvider implements INPISearchProvider {
  constructor(private config: {
    baseUrl: string          // URL da API oficial do INPI
    apiKey: string           // Credencial de acesso
    timeout: number
  }) {}

  async searchByName(params: SearchByNameParams): Promise<TrademarkSearchResult> {
    // Implementacao usando API oficial
    const response = await fetch(
      `${this.config.baseUrl}/v1/marcas?nome=${params.name}`,
      {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` },
        signal: AbortSignal.timeout(this.config.timeout),
      }
    )
    // Normalizar resposta para o formato do contrato
    return this.normalizeResponse(await response.json())
  }

  // ... outros metodos seguem o mesmo padrao
}
```

### 9.2 Etapas do Swap

```
Fase 1: Implementar OfficialAPISearchProvider
         - Testes unitarios com mocks da API oficial
         - Testes de integracao com sandbox (se disponivel)

Fase 2: Deploy com feature flag em 0%
         - Codigo em producao mas inativo
         - Nenhum usuario afetado

Fase 3: Rollout gradual
         - 5% dos usuarios para o provider oficial
         - 95% continuam no microsservico de scraping
         - Comparar resultados entre os dois providers

Fase 4: Migrar 100%
         - Todos usuarios no provider oficial
         - Microsservico de scraping mantido como fallback

Fase 5: Deprecar microsservico
         - Remover container Docker
         - Simplificar adapter para usar apenas provider oficial
         - Manter fallback da Camada C
```

### 9.3 Periodo de Coexistencia

Durante o swap, ambos providers podem coexistir:

```typescript
// Configuracao via variavel de ambiente + feature flag
const provider = process.env.INPI_SEARCH_PROVIDER // 'microservice' | 'official' | 'auto'

// 'auto': usa feature flag para decidir por usuario
// 'microservice': forca microsservico para todos
// 'official': forca API oficial para todos (apos validacao)
```

---

## 10. Riscos de Scraping e Mitigacoes

### 10.1 Mapeamento de Riscos

| # | Risco | Impacto | Probabilidade | Mitigacao |
|---|-------|---------|---------------|-----------|
| R1 | INPI envia cease & desist | Alto | Baixa | Kill switch instantaneo, microsservico isolado |
| R2 | Bloqueio de IP | Medio | Alta | Rate limiting agressivo, cache longo, IP rotation (avaliando) |
| R3 | Mudanca no HTML do INPI | Alto | Alta | Monitoramento, alertas, fallback automatico |
| R4 | Dados extraidos incorretos | Alto | Media | Validacao de schema, disclaimers, nunca apresentar como oficial |
| R5 | Sobrecarga no INPI | Medio | Baixa | Rate limiting, delay entre requests, horarios de pico evitados |
| R6 | Dados pessoais em resultados | Alto | Media | Filtrar PII, compliance LGPD, nao armazenar dados pessoais |
| R7 | Dependencia de scraping | Medio | Alta | Plano de swap para API oficial, Camada C funcional |

### 10.2 Mitigacoes Detalhadas

**R1 - Resposta juridica**:
- Manter kill switch testado e funcional
- Microsservico pode ser removido em minutos
- App continua funcionando 100% via Camada C
- Consultar advogado sobre termos de uso do INPI
- Considerar pedido formal de acesso a API

**R2 - Bloqueio de IP**:
- Maximo 100 requests/minuto (muito abaixo de DDoS)
- Delay minimo de 2 segundos entre requests
- Cache de 24h reduz drasticamente requests reais
- Respeitar robots.txt
- User-Agent honesto identificando o servico
- NAO usar rotacao de IP (parece evasao de bloqueio)

**R3 - Mudanca de layout**:
- Monitoramento: health check a cada 15 minutos
- Alerta automatico quando parsing falha
- Fallback imediato para Camada C
- Atualizacao do parser em horas (nao semanas)
- Testes de integracao que detectam mudancas

**R4 - Dados incorretos**:
- Validacao de schema em todos os resultados
- Resultados com campos faltando sao descartados
- Disclaimer SEMPRE visivel (nunca ocultavel)
- Log de todos os resultados para auditoria
- Comparacao periodica com dados abertos (Camada A)

**R6 - Dados pessoais**:
- Filtrar CPF/CNPJ de resultados quando possivel
- Nao armazenar dados pessoais no cache
- Log de acesso a dados com PII
- Politica de retencao curta para historico de buscas

### 10.3 Monitoramento de Riscos

```typescript
// Alertas configurados
const riskAlerts = [
  {
    name: 'scraping_blocked',
    condition: 'HTTP 403 do INPI por 3+ requests consecutivos',
    action: 'Abrir circuit breaker + alerta critico para equipe',
    severity: 'critical',
  },
  {
    name: 'parsing_failure',
    condition: 'Taxa de parsing failure > 30% em 1 hora',
    action: 'Alerta para equipe + considerar kill switch',
    severity: 'high',
  },
  {
    name: 'data_validation_failure',
    condition: 'Resultados com campos obrigatorios faltando > 10%',
    action: 'Alerta para equipe + log detalhado',
    severity: 'medium',
  },
  {
    name: 'high_latency',
    condition: 'Latencia P95 > 10 segundos por 15+ minutos',
    action: 'Alerta + considerar backoff',
    severity: 'medium',
  },
]
```

---

## 11. Texto de Disclaimer para Usuarios

### 11.1 Disclaimer na Interface de Busca

```
AVISO: Esta ferramenta realiza buscas em fontes publicas para auxiliar
sua pesquisa de anterioridade. Os resultados tem carater INFORMATIVO e
NAO substituem a consulta oficial no sistema do INPI.

Recomendamos:
- Sempre confirmar resultados no site oficial do INPI (busca.inpi.gov.br)
- Consultar um profissional de propriedade intelectual para analise completa
- Nao tomar decisoes de registro baseadas exclusivamente nesta busca

O Registrar Certo nao garante a completude, precisao ou atualidade
dos dados exibidos.
```

### 11.2 Disclaimer em PDFs e Exports

```
NOTA: Os dados de busca de marcas contidos neste documento foram
obtidos de fontes publicas nao-oficiais na data indicada. Estes dados
podem estar desatualizados ou incompletos. Consulte o INPI
(busca.inpi.gov.br) para informacoes oficiais e atualizadas.
```

### 11.3 Disclaimer nos Termos de Uso

Incluir clausula especifica nos Termos de Uso do Registrar Certo:

```
BUSCA DE MARCAS: O servico de busca de marcas fornecido pelo Registrar
Certo utiliza fontes publicas de informacao e tem carater meramente
informativo e auxiliar. O Registrar Certo nao e afiliado, endossado ou
autorizado pelo INPI. Os resultados de busca nao constituem parecer
tecnico ou juridico. O usuario e o unico responsavel por verificar a
precisao das informacoes e por quaisquer decisoes tomadas com base
nos resultados exibidos.
```

---

## 12. Monitoramento e Alertas

### 12.1 Metricas do Microsservico

| Metrica | Tipo | Alerta |
|---------|------|--------|
| `inpi_search_requests_total` | Counter | - |
| `inpi_search_request_duration_seconds` | Histogram | P95 > 10s |
| `inpi_search_errors_total` | Counter | > 10/min |
| `inpi_search_cache_hit_ratio` | Gauge | < 50% (cache ineficaz) |
| `inpi_search_circuit_state` | Gauge | Estado OPEN |
| `inpi_search_scraping_success_rate` | Gauge | < 80% |
| `inpi_search_queue_size` | Gauge | > 50 (backpressure) |
| `inpi_search_parse_failures_total` | Counter | > 5/hora |

### 12.2 Metricas do Adapter (App Principal)

| Metrica | Tipo | Alerta |
|---------|------|--------|
| `search_adapter_provider_used` | Counter (label: provider) | - |
| `search_adapter_fallback_activated_total` | Counter | > 20/hora |
| `search_adapter_feature_flag_state` | Gauge | Mudanca de estado |

### 12.3 Dashboard de Monitoramento

```
┌──────────────────────────────────────────────────────────────────┐
│  MICROSSERVICO BUSCA INPI                   Status: OPERACIONAL  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Ultimas 24h                                                     │
│  ├─ Requests totais: 1,247                                       │
│  ├─ Cache hits: 978 (78.4%)                                      │
│  ├─ Live fetches: 269 (21.6%)                                    │
│  ├─ Erros: 12 (0.96%)                                            │
│  └─ Fallbacks: 3 (0.24%)                                         │
│                                                                   │
│  Performance                                                     │
│  ├─ Latencia media (cache): 12ms                                 │
│  ├─ Latencia media (live): 2,340ms                               │
│  ├─ Latencia P95 (live): 4,120ms                                 │
│  └─ Latencia P99 (live): 7,890ms                                 │
│                                                                   │
│  Circuit Breaker: CLOSED                                         │
│  Feature Flag: ATIVO (100%)                                      │
│  Redis Memory: 45MB / 128MB                                      │
│  Container CPU: 23% / 50%                                        │
│  Container Memory: 198MB / 512MB                                 │
│                                                                   │
│  [DESATIVAR BUSCA]  [LIMPAR CACHE]  [VER LOGS]                  │
└──────────────────────────────────────────────────────────────────┘
```

### 12.4 Runbook de Incidentes

**Cenario: Circuit breaker abriu**
1. Verificar health check do microsservico (`GET /health`)
2. Verificar se site do INPI esta acessivel
3. Verificar logs do microsservico por erros
4. Se INPI indisponivel: aguardar e monitorar (circuit breaker recupera automaticamente)
5. Se parsing falhou: verificar mudancas no HTML do INPI, atualizar parser
6. Se problema persistir > 1h: considerar ativar kill switch

**Cenario: Taxa de parsing failure alta**
1. Acessar site do INPI manualmente e verificar mudancas
2. Comparar HTML atual com ultimo parsing bem-sucedido
3. Atualizar seletores/parser no microsservico
4. Deploy do microsservico (sem afetar app principal)
5. Monitorar por 30 minutos apos deploy

**Cenario: Kill switch ativado (emergencia)**
1. Confirmar que Camada C esta funcionando (links diretos, guias)
2. Comunicar equipe via Slack
3. Investigar causa raiz
4. Corrigir problema no microsservico
5. Reativar via feature flag com rollout gradual (10% -> 50% -> 100%)

---

## 13. Checklist de Implementacao

### Fase 1 -- Fundacao (Semana 1-2)
- [ ] Criar projeto `services/inpi-search` com Express + TypeScript
- [ ] Configurar Dockerfile e docker-compose
- [ ] Implementar health check endpoint
- [ ] Configurar Redis para cache
- [ ] Implementar rate limiter
- [ ] Implementar request logger
- [ ] Criar interface `INPISearchProvider` no app principal
- [ ] Implementar `FallbackSearchProvider` (Camada C)

### Fase 2 -- Scraping Engine (Semana 3-4)
- [ ] Implementar scraping do sistema de busca do INPI
- [ ] Implementar parser de resultados
- [ ] Implementar normalizacao de dados
- [ ] Validacao de schema nos resultados
- [ ] Endpoint `GET /api/v1/marcas` (busca por nome)
- [ ] Endpoint `GET /api/v1/marcas/processo/{numero}` (busca por processo)
- [ ] Endpoint `GET /api/v1/nices` (classes Nice)
- [ ] Testes unitarios para parser e normalizacao

### Fase 3 -- Integracao com App Principal (Semana 5)
- [ ] Implementar `MicroserviceSearchProvider`
- [ ] Implementar `SearchProviderProxy` com circuit breaker
- [ ] Configurar feature flag `inpi_search_enabled`
- [ ] Integrar com pagina de busca no frontend
- [ ] Implementar componente de fallback na UI
- [ ] Adicionar disclaimers em todos os pontos de exibicao
- [ ] Tabela `search_queries` para historico

### Fase 4 -- Monitoramento e Polimento (Semana 6)
- [ ] Dashboard de monitoramento no admin
- [ ] Alertas configurados (circuit breaker, erros, latencia)
- [ ] Metricas expostas no `/metrics`
- [ ] Testes de integracao end-to-end
- [ ] Testes de resiliencia (simular falhas do INPI)
- [ ] Documentacao de runbook
- [ ] Revisao juridica dos disclaimers
- [ ] Load test para validar rate limiting

### Fase 5 -- Rollout (Semana 7)
- [ ] Deploy do microsservico em producao
- [ ] Feature flag em 10%
- [ ] Monitorar por 3 dias
- [ ] Incrementar para 50%
- [ ] Monitorar por 3 dias
- [ ] Incrementar para 100%
- [ ] Retrospectiva e documentacao de licoes aprendidas
