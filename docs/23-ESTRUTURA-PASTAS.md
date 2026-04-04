# Estrutura de Pastas do Projeto — Registrar Certo

```
registrar-certo/
│
├── .env.example                    # Variáveis de ambiente (modelo)
├── .gitignore
├── docker-compose.yml              # Postgres + Redis para dev
├── docker-compose.prod.yml         # Produção completa
├── Dockerfile                      # App principal
├── Dockerfile.worker               # Worker de filas
├── next.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── vitest.config.ts
├── playwright.config.ts
│
├── prisma/
│   ├── schema.prisma               # Schema do banco
│   ├── seed.ts                     # Dados iniciais
│   └── migrations/                 # Migrations geradas
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── og-image.jpg
│   ├── robots.txt
│   └── images/
│       ├── icons/                  # Ícones de etapas e categorias
│       └── illustrations/          # Ilustrações do site
│
├── docs/                           # Documentação do projeto
│   ├── 01-MAPA-DO-PRODUTO.md
│   ├── 02-FLUXOGRAMA-USUARIO.md
│   ├── 03-SITEMAP-E-TELAS.md
│   ├── 05-WIREFRAMES-TEXTUAIS.md
│   ├── 06-CONTEUDO-TEXTUAL.md
│   ├── 08-ARQUITETURA-TECNICA.md
│   ├── 09-ARQUITETURA-IA.md
│   ├── 10-ARQUITETURA-INTEGRACOES.md
│   ├── 12-PLANO-CLONE-API-CONSULTA.md
│   ├── 15-CHECKLIST-DESENVOLVIMENTO.md
│   ├── 16-CHECKLIST-JURIDICO-EDITORIAL.md
│   ├── 17-PAINEL-ADMIN.md
│   ├── 18-ESTRATEGIA-SEO.md
│   ├── 19-ESTRATEGIA-FUNIL.md
│   ├── 23-ESTRUTURA-PASTAS.md
│   └── 29-PLANO-DEPLOY.md
│
├── src/
│   │
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Layout raiz
│   │   ├── page.tsx                # Home
│   │   ├── globals.css             # Estilos globais + Tailwind
│   │   ├── not-found.tsx           # Página 404
│   │   ├── error.tsx               # Página de erro
│   │   ├── loading.tsx             # Loading global
│   │   ├── sitemap.ts              # Sitemap dinâmico
│   │   ├── robots.ts               # Robots.txt dinâmico
│   │   │
│   │   ├── (auth)/                 # Grupo de rotas de autenticação
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── cadastro/
│   │   │   │   └── page.tsx
│   │   │   ├── esqueci-senha/
│   │   │   │   └── page.tsx
│   │   │   └── verificar-email/
│   │   │       └── page.tsx
│   │   │
│   │   ├── triagem/                # Triagem inteligente
│   │   │   ├── page.tsx            # Wizard
│   │   │   └── resultado/
│   │   │       └── page.tsx        # Resultado
│   │   │
│   │   ├── marca/                  # Fluxo de Marca
│   │   │   ├── page.tsx            # Hub
│   │   │   ├── layout.tsx          # Layout com barra de progresso
│   │   │   ├── o-que-e/
│   │   │   │   └── page.tsx
│   │   │   ├── busca-previa/
│   │   │   │   └── page.tsx
│   │   │   ├── classe-nice/
│   │   │   │   └── page.tsx
│   │   │   ├── documentos/
│   │   │   │   └── page.tsx
│   │   │   ├── cadastro-einpi/
│   │   │   │   └── page.tsx
│   │   │   ├── gru/
│   │   │   │   └── page.tsx
│   │   │   ├── pagamento/
│   │   │   │   └── page.tsx
│   │   │   ├── protocolo/
│   │   │   │   └── page.tsx
│   │   │   ├── acompanhamento/
│   │   │   │   └── page.tsx
│   │   │   ├── oposicao/
│   │   │   │   └── page.tsx
│   │   │   ├── concessao/
│   │   │   │   └── page.tsx
│   │   │   └── renovacao/
│   │   │       └── page.tsx
│   │   │
│   │   ├── patente/                # Fluxo de Patente
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── quando-patentear/
│   │   │   ├── tipos/
│   │   │   ├── busca-anterioridade/
│   │   │   ├── sigilo/
│   │   │   ├── documentos/
│   │   │   ├── relatorio/
│   │   │   ├── reivindicacoes/
│   │   │   ├── resumo/
│   │   │   ├── desenhos/
│   │   │   ├── cadastro/
│   │   │   ├── deposito/
│   │   │   └── acompanhamento/
│   │   │
│   │   ├── desenho-industrial/     # Fluxo de Desenho Industrial
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── o-que-e/
│   │   │   ├── quando-usar/
│   │   │   ├── preparacao/
│   │   │   ├── desenhos/
│   │   │   ├── cadastro/
│   │   │   ├── deposito/
│   │   │   └── acompanhamento/
│   │   │
│   │   ├── meu-passo-a-passo/      # Painel do usuário
│   │   │   ├── page.tsx
│   │   │   └── [journeyId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── checklist/
│   │   │   └── page.tsx
│   │   │
│   │   ├── resumo/
│   │   │   └── page.tsx
│   │   │
│   │   ├── ajuda/
│   │   │   └── page.tsx
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── sobre/
│   │   │   └── page.tsx
│   │   │
│   │   ├── termos/
│   │   │   └── page.tsx
│   │   │
│   │   ├── privacidade/
│   │   │   └── page.tsx
│   │   │
│   │   ├── admin/                  # Painel Admin
│   │   │   ├── layout.tsx          # Layout admin (sidebar)
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── conteudo/
│   │   │   │   └── page.tsx
│   │   │   ├── faqs/
│   │   │   │   └── page.tsx
│   │   │   ├── blog/
│   │   │   │   └── page.tsx
│   │   │   ├── links/
│   │   │   │   └── page.tsx
│   │   │   ├── integracoes/
│   │   │   │   └── page.tsx
│   │   │   ├── usuarios/
│   │   │   │   └── page.tsx
│   │   │   ├── metricas/
│   │   │   │   └── page.tsx
│   │   │   ├── logs/
│   │   │   │   └── page.tsx
│   │   │   └── configuracoes/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                    # API Routes
│   │       ├── auth/
│   │       │   ├── register/route.ts
│   │       │   ├── [...nextauth]/route.ts
│   │       │   ├── forgot-password/route.ts
│   │       │   └── reset-password/route.ts
│   │       ├── journeys/
│   │       │   ├── route.ts          # GET (list), POST (create)
│   │       │   └── [id]/
│   │       │       ├── route.ts      # GET, PATCH
│   │       │       ├── steps/
│   │       │       │   └── [stepId]/
│   │       │       │       └── complete/route.ts
│   │       │       ├── answers/route.ts
│   │       │       ├── checklist/
│   │       │       │   ├── route.ts
│   │       │       │   └── items/
│   │       │       │       └── [itemId]/route.ts
│   │       │       └── report/route.ts
│   │       ├── triage/route.ts
│   │       ├── inpi/
│   │       │   ├── marcas/route.ts
│   │       │   └── nices/route.ts
│   │       ├── notifications/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── read/route.ts
│   │       ├── analytics/
│   │       │   └── event/route.ts
│   │       ├── health/route.ts
│   │       ├── faqs/route.ts
│   │       ├── blog/
│   │       │   ├── route.ts
│   │       │   └── [slug]/route.ts
│   │       └── admin/
│   │           ├── stats/route.ts
│   │           ├── users/route.ts
│   │           ├── journeys/route.ts
│   │           ├── content/route.ts
│   │           ├── faqs/route.ts
│   │           ├── blog/route.ts
│   │           ├── links/route.ts
│   │           ├── ai-prompts/route.ts
│   │           ├── feature-flags/
│   │           │   ├── route.ts
│   │           │   └── [id]/route.ts
│   │           ├── integration-logs/route.ts
│   │           ├── audit-logs/route.ts
│   │           ├── error-logs/route.ts
│   │           └── funnel/route.ts
│   │
│   ├── components/                 # Componentes React
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── PageHeader.tsx
│   │   │
│   │   ├── triage/
│   │   │   ├── TriageWizard.tsx
│   │   │   ├── TriageQuestion.tsx
│   │   │   └── TriageResult.tsx
│   │   │
│   │   ├── journey/
│   │   │   ├── StepCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StepList.tsx
│   │   │   ├── JourneyCard.tsx
│   │   │   └── ChecklistGenerator.tsx
│   │   │
│   │   ├── ui/                     # shadcn/ui + custom
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── Disclaimer.tsx
│   │   │   ├── ExplanationLayers.tsx
│   │   │   ├── GlossaryTooltip.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   │
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProtectionCards.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── TrustSection.tsx
│   │   │   ├── FaqPreview.tsx
│   │   │   ├── BlogPreview.tsx
│   │   │   └── NewsletterSignup.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── FunnelChart.tsx
│   │   │   └── StatusBadge.tsx
│   │   │
│   │   └── shared/
│   │       ├── SEOHead.tsx
│   │       ├── BreadcrumbNav.tsx
│   │       ├── CookieBanner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── lib/                        # Utilitários client-side
│   │   ├── utils.ts                # cn(), formatters
│   │   ├── constants.ts            # Constantes globais
│   │   ├── analytics.ts            # Track events
│   │   └── hooks/
│   │       ├── useJourney.ts
│   │       ├── useChecklist.ts
│   │       ├── useTriage.ts
│   │       └── useAuth.ts
│   │
│   ├── server/                     # Backend
│   │   ├── lib/
│   │   │   ├── prisma.ts           # Prisma client singleton
│   │   │   ├── redis.ts            # Redis client
│   │   │   ├── logger.ts           # Pino logger
│   │   │   ├── feature-flags.ts
│   │   │   ├── audit-logger.ts
│   │   │   └── queue.ts            # BullMQ setup
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rate-limit.ts
│   │   │   └── validate.ts         # Zod validation
│   │   │
│   │   ├── engines/
│   │   │   ├── journey-engine.ts
│   │   │   ├── triage-engine.ts
│   │   │   ├── checklist-engine.ts
│   │   │   ├── pdf-engine.ts
│   │   │   ├── notification-engine.ts
│   │   │   └── ai-engine.ts
│   │   │
│   │   ├── adapters/
│   │   │   ├── inpi-search-adapter.ts
│   │   │   ├── email-adapter.ts
│   │   │   └── storage-adapter.ts
│   │   │
│   │   ├── data/
│   │   │   ├── step-definitions.ts   # Definições de etapas por tipo
│   │   │   ├── triage-questions.ts   # Perguntas da triagem
│   │   │   ├── nice-classes.ts       # Classes Nice
│   │   │   ├── glossary.ts           # Glossário simplificado
│   │   │   └── checklist-templates.ts # Templates de checklist
│   │   │
│   │   ├── worker.ts                 # BullMQ worker
│   │   └── routes.md                 # Documentação de rotas
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── types/
│       ├── journey.ts
│       ├── triage.ts
│       ├── checklist.ts
│       ├── user.ts
│       └── api.ts
│
├── services/                       # Microserviços separados
│   └── inpi-search/
│       ├── Dockerfile
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts            # Fastify server
│       │   ├── routes/
│       │   │   ├── marcas.ts
│       │   │   └── nices.ts
│       │   ├── providers/
│       │   │   └── inpi-scraper.ts
│       │   ├── cache.ts
│       │   ├── circuit-breaker.ts
│       │   └── logger.ts
│       └── tests/
│           └── marcas.test.ts
│
├── tests/
│   ├── unit/
│   │   ├── triage-engine.test.ts
│   │   ├── journey-engine.test.ts
│   │   ├── checklist-engine.test.ts
│   │   └── feature-flags.test.ts
│   ├── integration/
│   │   ├── api/
│   │   │   ├── auth.test.ts
│   │   │   ├── journeys.test.ts
│   │   │   └── triage.test.ts
│   │   └── setup.ts
│   └── e2e/
│       ├── triage-flow.spec.ts
│       ├── signup-flow.spec.ts
│       ├── journey-flow.spec.ts
│       └── admin-flow.spec.ts
│
├── scripts/
│   ├── seed-links.ts               # Popula links oficiais
│   ├── seed-nice-classes.ts        # Popula classes Nice
│   ├── seed-faqs.ts                # Popula FAQs iniciais
│   ├── check-links-health.ts       # Health check dos links
│   └── backup-db.sh                # Script de backup
│
└── nginx/
    ├── nginx.conf                  # Configuração Nginx
    └── ssl/                        # Certificados SSL
```
