# Plano de Deploy, Testes, Manutenção e Observabilidade

## 1. Plano de Deploy

### Ambientes

| Ambiente     | Propósito                    | URL                        | Branch    |
|-------------|------------------------------|----------------------------|-----------|
| Local       | Desenvolvimento              | localhost:3000             | feature/* |
| Staging     | Testes e validação           | staging.registrarcerto.com | develop   |
| Production  | Produção                     | registrarcerto.com         | main      |

### Opção A — Deploy em VPS (Recomendado para início)

**Infraestrutura:**
- VPS: Hetzner ou DigitalOcean (4 vCPU, 8GB RAM, 80GB SSD)
- SO: Ubuntu 22.04 LTS
- Docker + Docker Compose
- Nginx como reverse proxy + SSL (Let's Encrypt)
- PostgreSQL 16 em container dedicado
- Redis 7 em container dedicado

**docker-compose.yml (Produção):**
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/registrarcerto
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://registrarcerto.com
    depends_on:
      - db
      - redis
    restart: always

  inpi-search:
    build:
      context: ./services/inpi-search
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    restart: always

  worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/registrarcerto
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: always

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=registrarcerto
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    restart: always

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/certbot:/var/www/certbot
    depends_on:
      - app
    restart: always

volumes:
  pgdata:
  redisdata:
```

**Dockerfile (App):**
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --production=false

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "server.js"]
```

**Pipeline de Deploy (GitHub Actions):**
```yaml
name: Deploy Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm ci && npm test
      - name: Build and push Docker images
        run: |
          docker build -t registrarcerto-app .
          docker build -t registrarcerto-search ./services/inpi-search
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: deploy
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/registrarcerto
            git pull origin main
            docker compose build
            docker compose up -d
            docker compose exec app npx prisma migrate deploy
```

### Opção B — Deploy na Vercel + Serviços Gerenciados

- App: Vercel (Next.js nativo)
- DB: Neon PostgreSQL ou Supabase
- Redis: Upstash
- Worker: Railway ou Render
- Microserviço INPI: Railway ou Fly.io
- Armazenamento: Cloudflare R2 ou AWS S3

### Backups
- PostgreSQL: pg_dump diário às 3h (cron no VPS)
- Retenção: 30 dias locais + 90 dias em object storage
- Teste de restore mensal
- Redis: RDB snapshots a cada 6 horas

### SSL e Domínio
- Domínio: registrarcerto.com.br
- SSL: Let's Encrypt via Certbot (auto-renovação)
- DNS: Cloudflare (CDN + proteção DDoS)

---

## 2. Plano de Testes

### Pirâmide de Testes

```
        /  E2E  \          ← 10% — Playwright
       / Integração \      ← 30% — Vitest + Prisma test DB
      /   Unitários   \   ← 60% — Vitest
```

### Testes Unitários (Vitest)

**O que testar:**
- Engines: TriageEngine, JourneyEngine, ChecklistEngine, PDFEngine
- Adapters: INPISearchAdapter (com mocks)
- Utilitários: feature flags, audit logger, formatters
- Componentes React: renderização, estados, interações

**Exemplos de teste:**
```typescript
// triage-engine.test.ts
describe('TriageEngine', () => {
  it('classifica corretamente como MARCA quando score >= 5', () => {
    const answers = [
      { questionKey: 'q1', answerValue: 'nome_logo' },
      { questionKey: 'q2', answerValue: 'identifica_negocio' },
      { questionKey: 'q3', answerValue: 'reconhecimento' },
    ];
    const result = TriageEngine.classify(answers);
    expect(result.type).toBe('MARCA');
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('retorna INCONCLUSIVO quando scores empatam', () => {
    const answers = [
      { questionKey: 'q1', answerValue: 'nao_sei' },
    ];
    const result = TriageEngine.classify(answers);
    expect(result.type).toBeNull();
    expect(result.confidence).toBeLessThan(0.5);
  });
});
```

### Testes de Integração

**O que testar:**
- API routes com banco de dados real (container de teste)
- Fluxo completo de jornada: criar → avançar → completar
- Geração de checklist e PDF
- Autenticação e autorização
- Envio de notificações (mock do provedor)

**Setup:**
```typescript
// test/setup.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.TEST_DATABASE_URL } }
});

beforeEach(async () => {
  // Limpa banco de teste antes de cada suite
  await prisma.$executeRawUnsafe('TRUNCATE TABLE ... CASCADE');
});
```

### Testes E2E (Playwright)

**Fluxos críticos:**
1. Visitante faz triagem completa e recebe resultado correto
2. Usuário se cadastra, inicia jornada de marca, avança 3 etapas
3. Usuário gera checklist e PDF
4. Admin atualiza link oficial e verifica no front
5. Busca de marca funciona (ou mostra fallback)
6. Fluxo de recuperação de senha

**playwright.config.ts:**
```typescript
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    locale: 'pt-BR',
  },
  projects: [
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

### Testes de Acessibilidade
- axe-core integrado nos testes de componente
- Verificação de contraste, labels, navegação por teclado
- Teste com screen reader (manual, trimestral)

### Cobertura Mínima
- Unitários: 80% de cobertura de statements
- Integração: 100% das rotas de API
- E2E: 100% dos fluxos críticos listados acima

---

## 3. Plano de Observabilidade

### Logging Estruturado

**Biblioteca:** Pino (leve, JSON nativo)

**Formato:**
```json
{
  "level": "info",
  "timestamp": "2025-01-15T10:30:00Z",
  "service": "app",
  "requestId": "req_abc123",
  "userId": "user_xyz",
  "action": "journey.step.complete",
  "journeyId": "journey_456",
  "stepOrder": 4,
  "durationMs": 230
}
```

**Níveis:**
- error: falhas que precisam de ação
- warn: situações inesperadas que não quebraram
- info: ações significativas do usuário
- debug: detalhes técnicos (desligado em produção)

### Métricas

**Métricas de aplicação:**
- Requisições por segundo por rota
- Latência P50, P95, P99
- Taxa de erro por rota
- Jornadas criadas/completadas por dia
- Triagens por resultado (marca/patente/DI)
- PDFs gerados
- Integrações: taxa de sucesso/falha
- Cache hit rate
- Tamanho da fila BullMQ

**Métricas de infra:**
- CPU, memória, disco (VPS)
- Conexões ativas do PostgreSQL
- Memória do Redis
- Tamanho do banco

**Ferramenta:** Prometheus + Grafana (ou Betterstack/Axiom para SaaS)

### Alertas

| Alerta                                  | Condição                    | Canal       |
|----------------------------------------|-----------------------------| ------------|
| App offline                            | Health check falha 3x       | E-mail + SMS|
| Taxa de erro > 5%                      | 5xx/total > 5% em 5 min    | E-mail      |
| Latência P95 > 3s                      | P95 > 3000ms em 5 min      | E-mail      |
| Integração INPI fora                   | Circuit breaker aberto      | E-mail      |
| Banco de dados lento                   | Query > 5s                  | E-mail      |
| Redis offline                          | Conexão falha               | E-mail + SMS|
| Fila acumulando                        | > 1000 jobs pendentes       | E-mail      |
| Disco > 85%                            | df > 85%                    | E-mail      |
| Certificado SSL expirando              | < 14 dias                   | E-mail      |

### Health Checks

```
GET /api/health
{
  "status": "ok",
  "version": "1.2.0",
  "uptime": 86400,
  "services": {
    "database": "ok",
    "redis": "ok",
    "inpiSearch": "ok",       // ou "degraded" ou "down"
    "queue": "ok"
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Error Tracking
- Sentry ou Betterstack para captura de exceções
- Source maps em produção
- Agrupamento automático de erros
- Alertas para novos erros

---

## 4. Plano de Manutenção

### Rotinas Semanais
- [ ] Verificar logs de erro e resolver críticos
- [ ] Verificar status das integrações
- [ ] Revisar métricas de funil
- [ ] Verificar health check dos links oficiais do INPI
- [ ] Limpar logs antigos (> 90 dias)

### Rotinas Mensais
- [ ] Atualizar dependências (npm audit + npm update)
- [ ] Testar restore de backup
- [ ] Revisar e limpar cache Redis
- [ ] Verificar crescimento do banco de dados
- [ ] Revisar custos de infraestrutura
- [ ] Atualizar conteúdo se houver mudança no INPI
- [ ] Rodar testes E2E completos

### Rotinas Trimestrais
- [ ] Atualizar Node.js para última LTS
- [ ] Revisar segurança (dependências, headers, CSRF)
- [ ] Teste de acessibilidade com screen reader
- [ ] Revisão de performance (Core Web Vitals)
- [ ] Revisão de SEO (Search Console, indexação)
- [ ] Revisão de privacidade e LGPD

### Versionamento
- Semver: MAJOR.MINOR.PATCH
- MAJOR: mudanças que quebram compatibilidade
- MINOR: novas funcionalidades
- PATCH: correções de bugs
- Changelog automático via conventional commits

### Incidentes
1. Detectar (alerta automático ou reporte de usuário)
2. Avaliar severidade (S1-S4)
3. Comunicar status (página de status)
4. Resolver
5. Post-mortem (para S1/S2)
6. Implementar prevenção

---

## 5. Roadmap por Fases

### Fase 1 — MVP (Semanas 1-6)
- [x] Setup do projeto (Next.js, Prisma, Tailwind)
- [ ] Banco de dados e migrations
- [ ] Auth (cadastro, login, sessões)
- [ ] Home page
- [ ] Triagem inteligente (regras + UI)
- [ ] Fluxo de Marca (13 etapas — conteúdo + navegação)
- [ ] Painel "Meu Passo a Passo" básico
- [ ] Checklist estático
- [ ] Links oficiais gerenciáveis
- [ ] SEO: meta tags, sitemap, schema markup
- [ ] 5 artigos de blog SEO
- [ ] Deploy em VPS
- [ ] LGPD: termos, privacidade, consentimento
- [ ] Testes unitários dos engines

### Fase 2 — Completude (Semanas 7-12)
- [ ] Fluxo de Patente (14 etapas)
- [ ] Fluxo de Desenho Industrial (8 etapas)
- [ ] Gerador de PDF
- [ ] Checklist dinâmico
- [ ] Gerador de resumo final
- [ ] Notificações por e-mail (lembretes, abandono)
- [ ] Central de Ajuda / FAQ
- [ ] Painel admin: conteúdo, links, usuários
- [ ] Integração dados abertos INPI
- [ ] Mais 10 artigos SEO
- [ ] Testes de integração

### Fase 3 — Inteligência (Semanas 13-18)
- [ ] IA: Triagem com LLM para casos ambíguos
- [ ] IA: Explicador simplificado (glossário + dinâmico)
- [ ] IA: Gerador de checklist personalizado
- [ ] IA: Resumo final inteligente
- [ ] Microserviço de busca INPI (consulta auxiliar)
- [ ] Cache Redis para buscas
- [ ] Feature flags completos
- [ ] Painel admin: métricas, funil, integrações
- [ ] Analytics de funil completo
- [ ] Testes E2E

### Fase 4 — Monetização (Semanas 19-24)
- [ ] Plano Plus: PDF avançado, notificações, histórico
- [ ] Plano Premium: revisão humana, apoio documental
- [ ] Integração de pagamento (Stripe ou similar)
- [ ] Motor de conversão com IA (headlines, CTAs, e-mails)
- [ ] Sequências de e-mail automatizadas
- [ ] Onboarding por e-mail
- [ ] Lead magnets: PDFs, simulador
- [ ] A/B testing
- [ ] Observabilidade completa (Grafana, alertas)

### Fase 5 — Escala (Semanas 25+)
- [ ] Integração oficial INPI (quando disponível)
- [ ] App mobile (PWA ou React Native)
- [ ] Área de especialistas/advogados parceiros
- [ ] Marketplace de serviços
- [ ] API pública para parceiros
- [ ] Internacionalização (outros países)

---

## 6. Branding e Copy da Home

### Nome: **Registrar Certo**

### Tagline
"O jeito mais simples de proteger o que é seu."

### Headline principal
"Descubra o jeito certo de registrar sua marca, invenção ou visual de produto no INPI"

### Subheadline
"Sem confusão. Sem juridiquês pesado. Com passo a passo simples e claro."

### Proposta de valor em 3 pilares
1. **Clareza** — Entenda exatamente o que você precisa, sem confundir marca com patente
2. **Simplicidade** — Passo a passo visual, um de cada vez, no seu ritmo
3. **Segurança** — Baseado nas regras reais do INPI, com links oficiais e avisos claros

### CTAs principais
- "Começar Agora" (primário, verde/azul forte)
- "Fazer Diagnóstico Gratuito" (secundário, outline)
- "Continuar Minha Jornada" (para usuários logados)

### Paleta de cores sugerida
- **Primária:** #1E40AF (azul profundo — confiança, seriedade)
- **Secundária:** #059669 (verde — ação, progresso)
- **Acento:** #F59E0B (âmbar — atenção, destaques)
- **Fundo:** #F8FAFC (cinza muito claro)
- **Texto:** #1E293B (cinza escuro)
- **Erro:** #DC2626
- **Sucesso:** #16A34A

### Tipografia
- Headings: Inter (bold/semibold)
- Body: Inter (regular)
- Monospace (código/processos): JetBrains Mono

### Tom de voz
- Simples como uma conversa
- Direto, sem rodeios
- Acolhedor, nunca condescendente
- Confiável, nunca presunçoso
- "Eu te explico" em vez de "conforme a legislação vigente"
