# Checklist de Desenvolvimento — Registrar Certo

## Fase 1 — Setup e Infraestrutura

- [ ] Criar repositório Git
- [ ] Inicializar Next.js com TypeScript
- [ ] Configurar Tailwind CSS + shadcn/ui
- [ ] Configurar Prisma + PostgreSQL
- [ ] Criar schema do banco e rodar migrations
- [ ] Configurar Redis local (Docker)
- [ ] Configurar ESLint + Prettier
- [ ] Configurar Vitest
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Criar docker-compose.dev.yml (Postgres + Redis)
- [ ] Configurar CI/CD básico (GitHub Actions: lint + test)
- [ ] Criar seed de dados iniciais (links oficiais, FAQs, classes Nice)

## Fase 1 — Autenticação

- [ ] Configurar NextAuth com Prisma Adapter
- [ ] Página de cadastro (e-mail + senha)
- [ ] Página de login
- [ ] Verificação de e-mail
- [ ] Recuperação de senha
- [ ] Middleware de autenticação para API
- [ ] Middleware de autorização (roles: USER, ADMIN)
- [ ] Consentimento LGPD no cadastro
- [ ] Sessão com token seguro

## Fase 1 — Home Page

- [ ] Layout principal (Navbar + Footer)
- [ ] Hero section com CTAs
- [ ] 3 cards de proteção (Marca, Patente, DI)
- [ ] Seção "Como Funciona"
- [ ] Seção de confiança/credibilidade
- [ ] Preview de FAQ
- [ ] Preview de blog
- [ ] Newsletter signup
- [ ] SEO: meta tags, OG, schema markup
- [ ] Mobile responsive
- [ ] Animações suaves (Framer Motion)

## Fase 1 — Triagem Inteligente

- [ ] Componente TriageWizard (multi-step)
- [ ] 6 perguntas com lógica de scoring
- [ ] Transições animadas entre perguntas
- [ ] Barra de progresso
- [ ] Componente TriageResult
- [ ] TriageEngine (lógica de classificação)
- [ ] Testes unitários do TriageEngine
- [ ] Salvar resultado no localStorage (visitante)
- [ ] Salvar resultado no banco (usuário logado)
- [ ] Evento de analytics: triage_start, triage_complete

## Fase 1 — Fluxo de Marca

- [ ] Hub page /marca com lista de etapas
- [ ] JourneyEngine (criar, avançar, pausar)
- [ ] 13 páginas de etapas com conteúdo
- [ ] Componente StepCard ("Seu Próximo Passo")
- [ ] Componente ProgressBar
- [ ] Componente ExplanationLayers (3 camadas)
- [ ] Componente Disclaimer
- [ ] Conteúdo de cada etapa (textos em pt-BR)
- [ ] Links oficiais em cada etapa
- [ ] Botão "Não entendi" em cada etapa
- [ ] Botão "Continuar depois"
- [ ] Autosave de progresso
- [ ] Testes do JourneyEngine

## Fase 1 — Painel do Usuário

- [ ] Página /meu-passo-a-passo
- [ ] Lista de jornadas do usuário
- [ ] Barra de progresso visual
- [ ] Card "Próximo Passo"
- [ ] Lista de etapas com status
- [ ] Botão retomar jornada
- [ ] Checklist básico
- [ ] CTA para gerar PDF (placeholder)

## Fase 1 — SEO

- [ ] Configurar sitemap.xml dinâmico
- [ ] Configurar robots.txt
- [ ] Meta tags por página (title, description)
- [ ] Open Graph tags
- [ ] Schema markup: Organization, BreadcrumbList, FAQPage
- [ ] URLs semânticas e limpas
- [ ] Canonical URLs
- [ ] Criar 5 artigos iniciais de blog

## Fase 1 — Links Oficiais

- [ ] Tabela official_links populada (seed)
- [ ] API CRUD /api/admin/links
- [ ] Componente de botão "Abrir no INPI"
- [ ] Admin: gerenciar links
- [ ] Health check básico de links (cron semanal)

## Fase 1 — Legal e LGPD

- [ ] Página de Termos de Uso
- [ ] Página de Política de Privacidade
- [ ] Banner de cookies
- [ ] Checkbox de consentimento no cadastro
- [ ] Registro de consentimento no banco
- [ ] Campo deletedAt para soft delete
- [ ] Trilha de auditoria básica

---

## Fase 2 — Fluxos Adicionais

- [ ] Fluxo de Patente (14 etapas completas)
- [ ] Fluxo de Desenho Industrial (8 etapas)
- [ ] Conteúdo textual completo para cada etapa
- [ ] Step definitions no JourneyEngine

## Fase 2 — Checklist e PDF

- [ ] ChecklistEngine (geração dinâmica)
- [ ] Componente ChecklistGenerator
- [ ] Checklist diferenciado por PF/PJ/MEI
- [ ] PDFEngine (geração server-side)
- [ ] Template de PDF: resumo + checklist + próximos passos
- [ ] Download de PDF via API
- [ ] Gerador de resumo final (simples + técnico)

## Fase 2 — Notificações

- [ ] NotificationEngine
- [ ] Fila BullMQ para envio de e-mails
- [ ] Worker de processamento
- [ ] Templates de e-mail (Nodemailer)
- [ ] Lembrete de próximo passo (3 dias sem atividade)
- [ ] E-mail de abandono (7 dias)
- [ ] E-mail de boas-vindas
- [ ] Preferências de notificação

## Fase 2 — Central de Ajuda

- [ ] Página /ajuda com FAQ
- [ ] Busca nas FAQs
- [ ] Categorias de FAQ
- [ ] Schema FAQPage
- [ ] Admin: CRUD de FAQs

## Fase 2 — Painel Admin Básico

- [ ] Layout admin (/admin)
- [ ] Dashboard com métricas básicas
- [ ] CRUD de conteúdo (content_pages)
- [ ] CRUD de FAQs
- [ ] CRUD de blog posts
- [ ] Gerenciamento de links oficiais
- [ ] Lista de usuários
- [ ] Visualizar jornadas

## Fase 2 — Dados Abertos INPI

- [ ] Adapter para dados abertos
- [ ] Script de ingestão (cron mensal)
- [ ] Normalização e armazenamento
- [ ] Cache Redis
- [ ] Fallback se indisponível

---

## Fase 3 — IA

- [ ] AiPrompt: CRUD no admin
- [ ] IA Nível 1: Triagem com LLM (ambíguo)
- [ ] IA Nível 2: Glossário + explicador dinâmico
- [ ] IA Nível 3: Checklist personalizado via IA
- [ ] IA Nível 4: Resumo final via IA
- [ ] Logging de todas as gerações
- [ ] Controle de custo (token budget)
- [ ] Fallback se API de IA falhar

## Fase 3 — Busca INPI (Microserviço)

- [ ] Criar microserviço separado (Node/Express ou Fastify)
- [ ] Endpoint /marcas?q=nome
- [ ] Endpoint /marcas/:processo
- [ ] Endpoint /nices
- [ ] Cache Redis (TTL 24h)
- [ ] Rate limiting
- [ ] Circuit breaker
- [ ] Feature flag para ligar/desligar
- [ ] Docker container
- [ ] Adapter no core que chama o microserviço
- [ ] Fallback: link para busca oficial
- [ ] Logs de todas as consultas

## Fase 3 — Admin Avançado

- [ ] Feature flags no admin
- [ ] Métricas de funil (gráfico)
- [ ] Logs de integração
- [ ] Logs de erro
- [ ] Logs de auditoria
- [ ] Status das integrações

## Fase 3 — Analytics

- [ ] Evento de funil em cada ação relevante
- [ ] API POST /api/analytics/event
- [ ] Dashboard de funil no admin
- [ ] Integração com Google Analytics (opcional)

---

## Fase 4 — Monetização

- [ ] Modelo de planos (FREE, PLUS, PREMIUM)
- [ ] Gate de funcionalidades por plano
- [ ] Integração de pagamento (Stripe)
- [ ] Página de preços
- [ ] Upgrade/downgrade de plano
- [ ] Motor de conversão: CTAs dinâmicos
- [ ] Sequências de e-mail automatizadas
- [ ] Lead magnets: PDFs para download
- [ ] A/B testing framework

---

## Testes (contínuo)

- [ ] Cobertura unitária > 80% nos engines
- [ ] Testes de integração para todas as rotas API
- [ ] Testes E2E: triagem, cadastro, jornada, checklist, PDF
- [ ] Testes de acessibilidade (axe-core)
- [ ] Testes de performance (Lighthouse CI)

## Deploy (contínuo)

- [ ] Docker Compose de produção
- [ ] GitHub Actions: test → build → deploy
- [ ] Backup automático do banco
- [ ] SSL com renovação automática
- [ ] Monitoramento e alertas
- [ ] Health check endpoint
