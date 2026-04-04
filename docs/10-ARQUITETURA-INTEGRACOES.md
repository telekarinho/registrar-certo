# 10 - Arquitetura de Integracoes do Registrar Certo

## 1. Visao Geral

O Registrar Certo se integra com sistemas do INPI e orgaos relacionados em **tres camadas de confiabilidade**, cada uma com diferentes niveis de risco, garantia e controle. A arquitetura e desenhada para que a aplicacao funcione mesmo quando todas as integracoes externas estao indisponiveis.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        REGISTRAR CERTO                               │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐ │
│  │  JourneyEngine │  │ ChecklistEngine│  │  INPISearchAdapter     │ │
│  └───────┬────────┘  └───────┬────────┘  └───────────┬────────────┘ │
│          │                   │                       │               │
│          │         ┌─────────┴───────────┐           │               │
│          │         │ IntegrationsManager │           │               │
│          │         │    (Registry)       │           │               │
│          │         └─────────┬───────────┘           │               │
│          │                   │                       │               │
├──────────┼───────────────────┼───────────────────────┼───────────────┤
│          │                   │                       │               │
│  ┌───────▼───────┐  ┌───────▼───────┐  ┌────────────▼────────────┐ │
│  │  CAMADA A     │  │  CAMADA A     │  │     CAMADA B            │ │
│  │  Dados        │  │  Links        │  │     Microsservico       │ │
│  │  Abertos INPI │  │  Oficiais     │  │     Busca INPI          │ │
│  └───────┬───────┘  └───────┬───────┘  └────────────┬────────────┘ │
│          │                   │                       │               │
│          ▼                   ▼                       ▼               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    CAMADA C - FALLBACK                         │  │
│  │  Links diretos | Guias passo-a-passo | Progresso local        │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.1 Principio Fundamental

> A jornada do usuario NUNCA deve ser bloqueada por falha de integracao externa. Cada funcionalidade que depende de integracao deve ter um fallback funcional na Camada C.

---

## 2. CAMADA A -- Integracao Oficial

### 2.1 INPI Dados Abertos (dados.gov.br)

O INPI disponibiliza datasets abertos com informacoes sobre marcas, patentes e outros registros. Esses dados sao publicos, legais e confiavel como fonte.

#### 2.1.1 Pipeline de Ingestao

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  INPI    │────>│  Download    │────>│ Normalizacao│────>│ PostgreSQL│
│  Dados   │     │  Agendado    │     │ e Limpeza   │     │ (tabelas  │
│  Abertos │     │  (BullMQ)    │     │             │     │  locais)  │
└──────────┘     └──────────────┘     └─────────────┘     └──────────┘
                       │                     │                   │
                       ▼                     ▼                   ▼
                  Logs de sync        Validacao de       Cache Redis
                  (sucesso/falha)     schema e tipos     (consultas freq.)
```

#### 2.1.2 Detalhamento do Pipeline

**Etapa 1 - Download Agendado**
- Job BullMQ `sync-inpi-open-data` executado diariamente as 3h da manha
- Download incremental quando possivel (verificacao de `Last-Modified` / `ETag`)
- Download completo como fallback mensal
- Timeout de 30 minutos por arquivo
- Armazenamento temporario no filesystem antes de processamento

**Etapa 2 - Normalizacao e Limpeza**
- Parsing de CSV/XML conforme formato do INPI
- Normalizacao de campos de texto (encoding, acentuacao, casing)
- Validacao de tipos e ranges (numeros de processo, datas, codigos NCL)
- Deduplicacao por numero de processo
- Log de registros rejeitados para investigacao

**Etapa 3 - Persistencia**
- Upsert em tabelas locais (`inpi_trademarks`, `inpi_patents`, etc.)
- Indices em campos de busca frequente (nome, numero de processo, classe Nice)
- Full-text search via `tsvector` do PostgreSQL para busca por nome

**Etapa 4 - Cache**
- Resultados de consultas frequentes em Redis (TTL 24h)
- Pre-aquecimento de cache para as 100 buscas mais populares

#### 2.1.3 Schema de Dados Locais

```sql
CREATE TABLE inpi_trademarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_number VARCHAR(20) UNIQUE NOT NULL,
  brand_name VARCHAR(500) NOT NULL,
  brand_name_normalized VARCHAR(500) NOT NULL,  -- lowercase, sem acentos
  brand_name_tsv TSVECTOR,                      -- para full-text search
  applicant_name VARCHAR(500),
  nice_classes INTEGER[],
  filing_date DATE,
  status VARCHAR(100),
  last_update DATE,
  raw_data JSONB,                               -- dados originais completos
  synced_at TIMESTAMP NOT NULL DEFAULT NOW(),

  INDEX idx_trademark_name_tsv USING GIN (brand_name_tsv),
  INDEX idx_trademark_process ON inpi_trademarks(process_number),
  INDEX idx_trademark_nice ON inpi_trademarks USING GIN (nice_classes),
  INDEX idx_trademark_status ON inpi_trademarks(status)
);
```

#### 2.1.4 Monitoramento do Sync

| Metrica | Alerta |
|---------|--------|
| Sync nao executado em 48h | WARNING |
| Taxa de rejeicao > 5% | WARNING |
| Sync falhou 3x consecutivas | CRITICAL |
| Tempo de sync > 2h | WARNING |

### 2.2 Sistema GRU / Pagamento

O INPI utiliza o sistema GRU (Guia de Recolhimento da Uniao) para pagamento de taxas. A integracao permite calcular valores e gerar links de pagamento.

#### 2.2.1 Adapter Pattern

```typescript
// modules/integrations-manager/adapters/gru-payment.adapter.ts

interface GRUPaymentAdapter {
  // Calcula o valor da GRU com base no tipo de servico e perfil do solicitante
  calculateFee(params: {
    serviceCode: string       // Codigo do servico INPI (ex: "901")
    applicantType: 'individual' | 'small_business' | 'micro_entity' | 'standard'
    isElectronic: boolean     // Protocolo eletronico tem desconto
  }): Promise<GRUFeeResult>

  // Gera URL para emissao da GRU no sistema oficial
  generateGRUUrl(params: {
    serviceCode: string
    cpfCnpj: string
    amount: number
  }): string

  // Verifica status de pagamento (se disponivel)
  checkPaymentStatus(gruNumber: string): Promise<PaymentStatus>
}

interface GRUFeeResult {
  amount: number
  currency: 'BRL'
  serviceCode: string
  serviceDescription: string
  discount?: {
    type: string
    percentage: number
  }
  validUntil: Date
  source: 'official_table' | 'cached'
}
```

#### 2.2.2 Versionamento e Tabela de Precos

- Tabela de precos INPI armazenada localmente com versionamento
- Atualizacao manual pelo admin quando INPI publica nova tabela
- Cada versao registrada com data de vigencia
- Calculo sempre usa a versao vigente na data atual
- Cache em Redis (TTL 24h) para consultas frequentes

#### 2.2.3 Tratamento de Falhas

```typescript
// Estrategia de retry para operacoes com GRU
const gruRetryPolicy = {
  maxRetries: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,    // 2s, 4s, 8s
  },
  retryOn: [
    'TIMEOUT',
    'CONNECTION_ERROR',
    'SERVER_ERROR',     // 5xx
  ],
  doNotRetryOn: [
    'VALIDATION_ERROR', // 4xx (dados invalidos)
    'NOT_FOUND',        // GRU nao encontrada
  ],
}
```

#### 2.2.4 Fallback

Quando o sistema GRU esta indisponivel:
1. Exibir tabela de precos local (com aviso de data de atualizacao)
2. Gerar link direto para o site de emissao de GRU do INPI
3. Fornecer instrucoes passo-a-passo para emissao manual
4. Salvar dados preenchidos localmente para o usuario completar depois

### 2.3 Links Oficiais Dinamicos

Links para sistemas, formularios e paginas do INPI que podem mudar sem aviso.

#### 2.3.1 Arquitetura

```typescript
// Tabela de links oficiais
interface OfficialLink {
  id: string
  code: string               // Identificador unico (ex: 'inpi_esearch', 'inpi_gru')
  name: string               // Nome amigavel
  url: string                // URL atual
  category: 'search' | 'payment' | 'form' | 'guide' | 'documentation'
  description: string
  healthStatus: 'up' | 'down' | 'unknown'
  lastCheckedAt: Date
  lastSuccessAt: Date
  updatedBy: string          // Admin que atualizou
  updatedAt: Date
}
```

#### 2.3.2 Health Monitoring

- Job BullMQ a cada 6 horas verifica todos os links
- Verificacao: HTTP HEAD request com timeout de 10s
- Se link retorna 4xx/5xx por 3 verificacoes consecutivas: status `down`
- Alerta para admin quando link fica down
- Dashboard admin com status de todos os links

#### 2.3.3 Atualizacao pelo Admin

- Interface CMS para alterar URL de qualquer link
- Historico de alteracoes no AuditLog
- Cache invalidado imediatamente apos alteracao
- Sem necessidade de deploy para atualizar links

---

## 3. CAMADA B -- Integracao Controlada Nao-Oficial

### 3.1 Microsservico de Busca de Marcas INPI

Microsservico isolado que consulta dados de marcas do INPI atraves de fontes nao-oficiais (inspirado no padrao ampla-api). Este microsservico e o componente de maior risco da arquitetura e por isso e completamente isolado.

**Detalhamento completo em 12-PLANO-CLONE-API-CONSULTA.md**

#### 3.1.1 Endpoints

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/api/v1/marcas?nome={nome}&page={page}` | Busca marcas por nome |
| `GET` | `/api/v1/marcas/processo/{numero}` | Consulta por numero de processo |
| `GET` | `/api/v1/nices` | Lista todas as classes Nice |
| `GET` | `/api/v1/nices/{numero}` | Detalhes de uma classe Nice |
| `GET` | `/health` | Health check do microsservico |
| `GET` | `/metrics` | Metricas de uso (Prometheus format) |

#### 3.1.2 Arquitetura do Microsservico

```
┌─────────────────────────────────────────────────┐
│            MICROSSERVICO BUSCA INPI              │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Express  │  │  Rate    │  │  Request     │  │
│  │  Router   │──│  Limiter │──│  Queue       │  │
│  └──────────┘  └──────────┘  └──────┬───────┘  │
│                                      │          │
│                              ┌───────▼───────┐  │
│                              │  Scraping     │  │
│                              │  Engine       │  │
│                              └───────┬───────┘  │
│                                      │          │
│                              ┌───────▼───────┐  │
│                              │  Redis Cache  │  │
│                              │  (TTL 24h)    │  │
│                              └───────────────┘  │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Circuit  │  │  Logger  │  │  Health      │  │
│  │  Breaker  │  │          │  │  Check       │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘
```

#### 3.1.3 Cache Redis

```typescript
// Estrategia de cache para busca de marcas
const cacheConfig = {
  // Busca por nome: TTL 24h (dados mudam pouco)
  searchByName: {
    keyPattern: 'inpi:search:name:{normalizedQuery}:{page}',
    ttl: 86400, // 24 horas
  },
  // Busca por processo: TTL 12h (status pode mudar)
  searchByProcess: {
    keyPattern: 'inpi:search:process:{processNumber}',
    ttl: 43200, // 12 horas
  },
  // Classes Nice: TTL 7 dias (dados estaticos)
  niceClasses: {
    keyPattern: 'inpi:nice:{classNumber}',
    ttl: 604800, // 7 dias
  },
}
```

#### 3.1.4 Rate Limiting

| Nivel | Limite | Janela |
|-------|--------|--------|
| Global (microsservico) | 100 requests | 1 minuto |
| Por IP de origem | 20 requests | 1 minuto |
| Por endpoint | 50 requests | 1 minuto |

#### 3.1.5 Feature Flag -- Kill Switch

```typescript
// No app principal (INPISearchAdapter)
async function searchTrademarks(query: string): Promise<SearchResult> {
  const isEnabled = await FeatureFlagService.isEnabled('inpi_search_enabled')

  if (!isEnabled) {
    // Fallback: redirecionar para busca manual
    return {
      source: 'fallback',
      data: null,
      fallbackUrl: officialLinksService.getLink('inpi_esearch'),
      message: 'Busca automatica temporariamente indisponivel. Use o link direto do INPI.',
    }
  }

  // Tenta o microsservico com circuit breaker
  return circuitBreaker.execute(() => inpiSearchClient.search(query))
}
```

#### 3.1.6 Logging Completo

Todos os requests e responses do microsservico sao logados:

```typescript
{
  timestamp: string,
  requestId: string,
  endpoint: string,
  query: string,
  source: 'cache' | 'scraping',
  responseTime: number,
  statusCode: number,
  resultCount: number,
  error?: string,
}
```

#### 3.1.7 Circuit Breaker

```typescript
// shared/lib/circuit-breaker.ts
interface CircuitBreakerConfig {
  failureThreshold: 5,        // Abre apos 5 falhas consecutivas
  successThreshold: 3,         // Fecha apos 3 sucessos em half-open
  timeout: 30000,              // 30s em estado aberto antes de tentar half-open
  monitorInterval: 10000,      // Verifica estado a cada 10s
}

// Estados:
// CLOSED  -> requests passam normalmente, falhas sao contadas
// OPEN    -> requests sao rejeitados, fallback e usado
// HALF_OPEN -> permite 1 request de teste para verificar recuperacao
```

#### 3.1.8 Swap para API Oficial

Quando o INPI disponibilizar API oficial, a troca e transparente:

```typescript
// Interface que ambas implementacoes respeitam
interface INPISearchProvider {
  searchByName(name: string, page?: number): Promise<TrademarkSearchResult>
  searchByProcess(processNumber: string): Promise<TrademarkDetail>
  listNiceClasses(): Promise<NiceClass[]>
  getNiceClass(number: number): Promise<NiceClass>
  healthCheck(): Promise<HealthStatus>
}

// Implementacao atual (microsservico de scraping)
class ScrapingINPISearchProvider implements INPISearchProvider { ... }

// Implementacao futura (API oficial)
class OfficialINPISearchProvider implements INPISearchProvider { ... }

// A troca e feita via configuracao, sem alterar codigo consumidor
```

#### 3.1.9 Docker Container

```dockerfile
# services/inpi-search/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --spider http://localhost:4000/health || exit 1

USER node
CMD ["node", "dist/server.js"]
```

---

## 4. CAMADA C -- Fallback sem API

A Camada C garante que o produto funcione mesmo quando TODAS as integracoes externas estao indisponiveis. Esta camada nao depende de nenhuma API ou servico externo.

### 4.1 Links Diretos para Sistemas Oficiais

Quando a integracao automatizada falha, o sistema oferece links diretos com contexto:

```typescript
interface FallbackLink {
  url: string
  title: string
  description: string
  stepByStepGuide: string[]        // Instrucoes passo-a-passo
  screenshotUrls?: string[]        // Screenshots ilustrativos
  estimatedTime: string            // "5 minutos"
  lastVerifiedAt: Date
}

// Exemplo:
const searchFallback: FallbackLink = {
  url: 'https://busca.inpi.gov.br/pePI/',
  title: 'Busca de Marcas no INPI',
  description: 'Acesse o sistema de busca oficial do INPI para verificar marcas registradas.',
  stepByStepGuide: [
    'Acesse o link acima',
    'Selecione "Marca" como tipo de busca',
    'Digite o nome da marca que deseja pesquisar',
    'Filtre por classe Nice se necessario',
    'Analise os resultados encontrados',
    'Anote os numeros de processo relevantes',
  ],
  estimatedTime: '5-10 minutos',
  lastVerifiedAt: new Date(),
}
```

### 4.2 Guias Passo-a-Passo

Para cada etapa da jornada que normalmente usa integracao, existe um guia manual equivalente:

| Etapa | Com Integracao | Fallback (Camada C) |
|-------|---------------|---------------------|
| Busca de marca | Busca automatizada via microsservico | Link para busca INPI + guia passo-a-passo |
| Classificacao Nice | Sugestao automatica via IA | Tabela completa de classes + guia de selecao |
| Calculo de taxa | Calculo automatico | Tabela de precos local + link para GRU |
| Emissao de GRU | Link pre-preenchido | Instrucoes de acesso ao sistema GRU |
| Acompanhamento | Sync automatico de status | Link para consulta + como verificar manualmente |

### 4.3 Progresso Local

Todo progresso do usuario e salvo localmente, independente de integracoes:

```typescript
// O progresso da jornada persiste no PostgreSQL local
// Nenhum dado de progresso depende de API externa
// O usuario pode continuar a jornada a qualquer momento

interface JourneyProgress {
  journeyId: string
  currentStepId: string
  completedSteps: string[]
  stepData: Record<string, unknown>  // Dados preenchidos por etapa
  savedAt: Date
  // Nenhuma dependencia de dados externos para manter o progresso
}
```

### 4.4 Geracao de Checklist sem API

O ChecklistEngine gera checklists completos com base em dados locais:

```typescript
// Templates de checklist sao armazenados localmente
// Dados do INPI enriquecem mas nao sao obrigatorios
interface ChecklistItem {
  id: string
  title: string
  description: string
  required: boolean
  verificationMethod: 'manual' | 'auto' | 'link'
  manualInstructions?: string        // Sempre presente como fallback
  autoVerificationFn?: string        // Usa integracao quando disponivel
  officialLink?: string              // Link para sistema oficial
}
```

### 4.5 Geracao de PDF sem Dependencias Externas

PDFs sao gerados localmente via Puppeteer a partir de templates HTML:

- Templates armazenados no filesystem do app
- Dados do usuario vem do banco local
- Nenhuma chamada externa necessaria para gerar PDF
- PDFs armazenados no S3 local (MinIO) ou compativel

---

## 5. Adapter Pattern para Todas as Integracoes

### 5.1 Interface Base

```typescript
// modules/integrations-manager/types/integration.types.ts

interface IntegrationAdapter<TConfig = unknown> {
  readonly name: string
  readonly version: string
  readonly layer: 'A' | 'B' | 'C'

  initialize(config: TConfig): Promise<void>
  healthCheck(): Promise<HealthCheckResult>
  shutdown(): Promise<void>
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  latency: number           // ms
  message?: string
  checkedAt: Date
  details?: Record<string, unknown>
}
```

### 5.2 Registry de Integracoes

```typescript
// modules/integrations-manager/services/registry.service.ts

class IntegrationRegistry {
  private adapters: Map<string, IntegrationAdapter> = new Map()

  register(adapter: IntegrationAdapter): void {
    this.adapters.set(adapter.name, adapter)
    logger.info({ integration: adapter.name, layer: adapter.layer }, 'Integracao registrada')
  }

  async healthCheckAll(): Promise<Map<string, HealthCheckResult>> {
    const results = new Map<string, HealthCheckResult>()
    for (const [name, adapter] of this.adapters) {
      try {
        results.set(name, await adapter.healthCheck())
      } catch (error) {
        results.set(name, {
          status: 'unhealthy',
          latency: -1,
          message: error.message,
          checkedAt: new Date(),
        })
      }
    }
    return results
  }

  getAdapter<T extends IntegrationAdapter>(name: string): T {
    const adapter = this.adapters.get(name)
    if (!adapter) throw new Error(`Integracao "${name}" nao encontrada no registry`)
    return adapter as T
  }
}

// Uso:
const registry = new IntegrationRegistry()
registry.register(new INPIOpenDataAdapter())
registry.register(new INPISearchMicroserviceAdapter())
registry.register(new GRUPaymentAdapter())
registry.register(new OfficialLinksAdapter())
```

---

## 6. Conceito de Dashboard de Monitoramento

### 6.1 Visao Geral das Integracoes

O admin dashboard exibe o status de todas as integracoes em tempo real:

```
┌─────────────────────────────────────────────────────────────────┐
│  PAINEL DE INTEGRACOES                          Ultima att: 5m  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CAMADA A - Oficiais                                            │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ INPI Dados       │  │ Links Oficiais   │                    │
│  │ Abertos          │  │                  │                    │
│  │ [SAUDAVEL]       │  │ [SAUDAVEL]       │                    │
│  │ Ultimo sync:     │  │ 12/12 links ok   │                    │
│  │ hoje 03:15       │  │ Verificado: 6h   │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
│  CAMADA B - Controladas                                         │
│  ┌──────────────────┐                                           │
│  │ Busca INPI       │                                           │
│  │ (Microsservico)  │                                           │
│  │ [DEGRADADO]      │                                           │
│  │ Latencia: 2.3s   │                                           │
│  │ Cache hit: 78%   │                                           │
│  │ Circuit: CLOSED  │                                           │
│  │ [DESATIVAR]      │                                           │
│  └──────────────────┘                                           │
│                                                                  │
│  CAMADA C - Fallbacks                                           │
│  [SEMPRE DISPONIVEL] - 15 guias | 8 templates de checklist     │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  METRICAS (ultimas 24h)                                         │
│  Buscas realizadas: 342 | Cache hits: 267 (78%)                │
│  Fallbacks ativados: 12 | Erros de integracao: 8               │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Metricas por Integracao

| Metrica | Descricao |
|---------|-----------|
| Uptime (%) | Percentual de health checks com sucesso nos ultimos 30 dias |
| Latencia media | Tempo medio de resposta |
| Latencia P95 | Percentil 95 de latencia |
| Taxa de erro | Percentual de requests que resultaram em erro |
| Cache hit rate | Percentual de requests servidos por cache |
| Fallbacks ativados | Quantas vezes o fallback da Camada C foi usado |

---

## 7. Politicas de Retry

### 7.1 Retry por Camada

| Camada | Tentativas | Backoff | Timeout |
|--------|-----------|---------|---------|
| A - Dados Abertos | 3 | Exponencial (5s, 15s, 45s) | 30s |
| A - Links Oficiais | 2 | Linear (5s, 10s) | 10s |
| B - Busca INPI | 2 | Exponencial (2s, 4s) | 10s |

### 7.2 Erros Retentaveis vs Nao-Retentaveis

```typescript
// Erros que justificam retry
const retryableErrors = [
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ESOCKETTIMEDOUT',
  'EAI_AGAIN',        // DNS temporario
  'HTTP_502',
  'HTTP_503',
  'HTTP_504',
]

// Erros que NAO devem ter retry
const nonRetryableErrors = [
  'HTTP_400',          // Bad request (dados invalidos)
  'HTTP_401',          // Nao autorizado
  'HTTP_403',          // Proibido
  'HTTP_404',          // Nao encontrado
  'HTTP_422',          // Entidade nao processavel
  'RATE_LIMITED',      // Ja estamos sendo limitados
]
```

---

## 8. Implementacao do Circuit Breaker

### 8.1 Maquina de Estados

```
       Falhas >= threshold
  CLOSED ──────────────────> OPEN
    ^                          │
    │                          │ Timeout expira
    │                          ▼
    └──────────────────── HALF_OPEN
       Sucesso >= threshold

  (Se falha em HALF_OPEN -> volta para OPEN)
```

### 8.2 Configuracao por Integracao

| Integracao | Failure Threshold | Recovery Timeout | Success Threshold |
|------------|-------------------|------------------|-------------------|
| INPI Dados Abertos | 5 falhas | 5 minutos | 3 sucessos |
| Busca INPI (microsservico) | 3 falhas | 30 segundos | 2 sucessos |
| GRU Payment | 5 falhas | 2 minutos | 3 sucessos |

### 8.3 Implementacao

```typescript
// shared/lib/circuit-breaker.ts
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

class CircuitBreaker<T> {
  private state: CircuitState = CircuitState.CLOSED
  private failureCount: number = 0
  private successCount: number = 0
  private lastFailureTime: Date | null = null

  constructor(
    private readonly name: string,
    private readonly config: CircuitBreakerConfig,
    private readonly fallback: () => Promise<T>,
  ) {}

  async execute(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN
        logger.info({ circuit: this.name }, 'Circuit breaker HALF_OPEN')
      } else {
        logger.warn({ circuit: this.name }, 'Circuit breaker OPEN, usando fallback')
        return this.fallback()
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure(error)
      if (this.state === CircuitState.OPEN) {
        return this.fallback()
      }
      throw error
    }
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++
      if (this.successCount >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED
        this.failureCount = 0
        this.successCount = 0
        logger.info({ circuit: this.name }, 'Circuit breaker CLOSED')
      }
    } else {
      this.failureCount = 0
    }
  }

  private onFailure(error: Error): void {
    this.failureCount++
    this.lastFailureTime = new Date()
    this.successCount = 0

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN
      logger.error(
        { circuit: this.name, failures: this.failureCount, error: error.message },
        'Circuit breaker OPEN'
      )
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return false
    const elapsed = Date.now() - this.lastFailureTime.getTime()
    return elapsed >= this.config.timeout
  }
}
```

---

## 9. Riscos e Mitigacoes

### 9.1 Riscos de Scraping (Camada B)

| Risco | Severidade | Probabilidade | Mitigacao |
|-------|-----------|---------------|-----------|
| **Juridico**: INPI pode considerar scraping como uso indevido | Alta | Media | Microsservico isolado, kill switch, disclaimers claros |
| **Bloqueio de IP**: INPI pode bloquear requests automatizados | Media | Alta | Rate limiting agressivo, cache longo, fallback para Camada C |
| **Mudanca de layout**: Alteracoes no site quebram o scraping | Alta | Alta | Monitoramento, alertas, fallback automatico |
| **Dados imprecisos**: Scraping pode extrair dados incorretos | Alta | Media | Nunca apresentar como "oficial", disclaimers em toda exibicao |
| **Indisponibilidade**: Site do INPI fora do ar | Media | Media | Cache de 24h, fallback para dados abertos (Camada A) |

### 9.2 Estrategias de Mitigacao

**Isolamento total**:
- Microsservico em container Docker separado
- Base de codigo independente
- Pode ser removido sem afetar o app principal
- Feature flag permite desligar instantaneamente

**Rate limiting agressivo**:
- Maximo de 100 requests/minuto ao INPI
- Intervalo minimo de 2 segundos entre requests
- Cache de 24h para evitar requests repetidos
- Queue com concorrencia limitada

**Fallback automatico**:
- Circuit breaker desvia para Camada C quando microsservico falha
- Dados do cache sao servidos mesmo com microsservico indisponivel
- Usuario sempre pode usar link direto do INPI

**Monitoramento proativo**:
- Health check a cada 15 minutos
- Alerta quando taxa de erro > 20%
- Alerta quando circuit breaker abre
- Dashboard mostra status em tempo real

### 9.3 Disclaimers Obrigatorios

Sempre que resultados da Camada B forem exibidos ao usuario:

```typescript
const SEARCH_DISCLAIMER = `
AVISO IMPORTANTE: Os resultados desta busca sao obtidos de fontes nao-oficiais
e tem carater meramente informativo. NAO substituem a consulta oficial no
sistema do INPI (busca.inpi.gov.br). Recomendamos sempre confirmar os dados
diretamente no INPI antes de tomar qualquer decisao sobre registro de marca.

A precisao e atualidade dos dados nao sao garantidas. O Registrar Certo nao
se responsabiliza por decisoes tomadas com base exclusivamente nestes resultados.
`
```

O disclaimer deve ser:
- Exibido de forma visivel junto aos resultados
- Nao pode ser ocultado ou minimizado na primeira exibicao
- Incluido em PDFs e exports que contenham dados de busca
- Registrado no AuditLog que o usuario visualizou o disclaimer

### 9.4 O que NUNCA Prometer

- Que os dados de busca sao 100% precisos
- Que os dados estao atualizados em tempo real
- Que a busca substitui uma consulta profissional
- Que o resultado garante viabilidade de registro
- Que o servico de busca estara sempre disponivel

---

## 10. Diagrama de Dependencias entre Integracoes

```
                    ┌───────────────────────┐
                    │   USUARIO             │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   INPISearchAdapter   │
                    │   (Adapter Pattern)   │
                    └──┬────────┬────────┬──┘
                       │        │        │
              ┌────────▼──┐  ┌──▼──────┐  ┌▼────────────┐
              │ Camada B  │  │Camada A │  │ Camada C    │
              │ Micro-    │  │ Dados   │  │ Fallback    │
              │ servico   │  │ Abertos │  │ Manual      │
              └─────┬─────┘  └────┬────┘  └─────────────┘
                    │             │
              Circuit Breaker  Sync Job
                    │          (BullMQ)
              ┌─────▼─────┐  ┌────▼────┐
              │ Redis     │  │PostgreSQL│
              │ Cache     │  │ (local) │
              └───────────┘  └─────────┘

  Ordem de tentativa: Camada B (cache) -> Camada B (live) -> Camada A -> Camada C
```

---

## 11. Checklist de Implementacao

### Fase 1 -- Fundacao
- [ ] Implementar IntegrationRegistry
- [ ] Implementar CircuitBreaker generico
- [ ] Implementar adapter base com health check
- [ ] Configurar Redis para cache de integracoes
- [ ] Criar tabela `official_links` e CRUD no admin

### Fase 2 -- Camada A
- [ ] Pipeline de ingestao de dados abertos do INPI
- [ ] Tabela `inpi_trademarks` com full-text search
- [ ] Job BullMQ para sync diario
- [ ] Health monitoring de links oficiais
- [ ] Interface admin para gerenciar links

### Fase 3 -- Camada B
- [ ] Microsservico de busca INPI (container Docker)
- [ ] INPISearchAdapter no app principal
- [ ] Redis cache para resultados de busca
- [ ] Feature flag `inpi_search_enabled`
- [ ] Circuit breaker conectado ao microsservico
- [ ] Logging completo de requests/responses

### Fase 4 -- Camada C e Polimento
- [ ] Guias passo-a-passo para todas as etapas
- [ ] Fallback automatico em todos os pontos de integracao
- [ ] Dashboard de monitoramento no admin
- [ ] Disclaimers em todas as exibicoes de dados nao-oficiais
- [ ] Testes de resiliencia (simular falhas)
- [ ] Documentacao de runbook para incidentes
