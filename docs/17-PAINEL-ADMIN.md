# Estrutura do Painel Admin — Registrar Certo

## Visão Geral

O painel admin é acessível em `/admin` apenas para usuários com role `ADMIN` ou `SUPER_ADMIN`.
Design: sidebar esquerda + conteúdo principal. Responsivo. Usa os mesmos componentes shadcn/ui.

---

## 1. Dashboard (`/admin`)

### Métricas em Cards
- **Usuários hoje**: novos cadastros nas últimas 24h
- **Triagens hoje**: triagens completas
- **Jornadas ativas**: jornadas com status IN_PROGRESS
- **PDFs gerados hoje**
- **Taxa de conclusão**: jornadas COMPLETED / total

### Gráficos
- Funil de conversão (últimos 30 dias)
  - Visitas → Triagens → Cadastros → Jornadas → PDFs
- Distribuição por tipo de proteção (pizza: Marca / Patente / DI)
- Jornadas por status (barra: ativa / pausada / concluída / abandonada)
- Cadastros por dia (linha, últimos 30 dias)

### Alertas Recentes
- Integrações com erro
- Links oficiais com falha no health check
- Erros críticos nas últimas 24h

---

## 2. Gestão de Conteúdo (`/admin/conteudo`)

### Páginas de Conteúdo
- Lista com: título, slug, status, última atualização
- Filtros: status (rascunho/publicado/arquivado), categoria
- Criar/editar página:
  - Título
  - Slug (gerado automaticamente, editável)
  - Meta title e description (SEO)
  - Conteúdo (editor markdown ou rich text)
  - Status: Rascunho / Publicado / Arquivado
  - Versão (incrementa ao salvar)
- Preview antes de publicar
- Histórico de versões

### FAQs
- Lista com: pergunta, categoria, ordem, publicado
- Drag and drop para reordenar
- Criar/editar:
  - Pergunta
  - Resposta (markdown)
  - Categoria
  - Publicado (sim/não)

### Blog
- Lista com: título, slug, status, data publicação
- Criar/editar:
  - Título
  - Slug
  - Meta title e description
  - Excerpt
  - Conteúdo (markdown/rich text)
  - Imagem de capa (upload)
  - Tags
  - Autor
  - Status: Rascunho / Publicado / Arquivado
  - Data de publicação (agendamento)

---

## 3. Links Oficiais (`/admin/links`)

- Lista com: título, URL, categoria, status, último check, saúde
- Status visual: 🟢 OK | 🟡 Lento | 🔴 Fora | ⚪ Não verificado
- Criar/editar:
  - Título
  - Slug
  - URL
  - Descrição
  - Categoria (Marca / Patente / DI / Geral)
  - Ativo (sim/não)
  - Ordem de exibição
- Botão "Verificar agora" (testa o link imediatamente)
- Botão "Verificar todos"
- Histórico de verificações por link

---

## 4. Integrações (`/admin/integracoes`)

### Status das Integrações
- Cards por provider:
  - Nome
  - Status: 🟢 Ativo | 🟡 Manutenção | 🔴 Erro | ⚪ Inativo
  - Última sincronização
  - Taxa de sucesso (últimas 24h)
  - Botão "Testar conexão"
  - Botão "Desativar"

### Logs de Integração
- Tabela com: timestamp, provider, ação, status code, duração, erro
- Filtros: provider, período, apenas erros
- Detalhe: request + response completos (JSON)
- Exportar CSV

### Feature Flags
- Lista com: chave, descrição, status (ligado/desligado)
- Toggle rápido para ligar/desligar
- Configuração avançada:
  - Habilitado para roles específicas
  - Habilitado para usuários específicos
  - Configuração JSON adicional
- Flags principais:
  - `inpi_search_enabled` — Busca auxiliar de marcas
  - `ai_triage_enabled` — IA na triagem
  - `ai_explainer_enabled` — IA explicador
  - `pdf_generation_enabled` — Geração de PDF
  - `email_notifications_enabled` — Envio de e-mails
  - `premium_features_enabled` — Funcionalidades premium

---

## 5. Usuários (`/admin/usuarios`)

- Lista com: nome, e-mail, plano, role, data cadastro, última atividade
- Filtros: plano, role, período de cadastro
- Busca por nome ou e-mail
- Detalhe do usuário:
  - Informações básicas
  - Jornadas (lista com status)
  - Checklists gerados
  - PDFs gerados
  - Eventos de funil
  - Notificações enviadas
  - Data de consentimento LGPD
- Ações:
  - Alterar role
  - Alterar plano
  - Desativar conta (soft delete)
  - Reenviar e-mail de verificação
- **NÃO**: visualizar senha, editar dados pessoais diretamente

---

## 6. Métricas e Funil (`/admin/metricas`)

### Funil de Conversão
- Gráfico de funil interativo
- Etapas:
  1. Visita home
  2. Clique CTA
  3. Início triagem
  4. Final triagem
  5. Cadastro iniciado
  6. Cadastro concluído
  7. Jornada iniciada
  8. Checklist gerado
  9. PDF gerado
  10. Link oficial clicado
- Taxa de conversão entre cada etapa
- Comparação por período

### Métricas por Tipo
- Triagens: total, por resultado (Marca/Patente/DI/Inconclusivo)
- Jornadas: total, por tipo, por status
- Etapas mais abandonadas
- Tempo médio por etapa
- Etapas com mais cliques em "Não entendi"

### Métricas de Aquisição
- Fontes de tráfego (UTM)
- Páginas de entrada mais populares
- Termos de busca (Search Console integration futura)

### Exportação
- Exportar dados em CSV
- Período customizável

---

## 7. Logs (`/admin/logs`)

### Logs de Auditoria
- Tabela: timestamp, usuário, ação, entidade, IP
- Filtros: usuário, tipo de ação, período
- Ações logadas:
  - Login/logout
  - Criação/edição/exclusão de conteúdo
  - Alteração de configurações
  - Alteração de roles/planos
  - Alteração de feature flags
  - Alteração de links oficiais

### Logs de Erro
- Tabela: timestamp, fonte, mensagem, severidade, resolvido
- Filtros: severidade, fonte, período, resolvido/pendente
- Detalhe: stack trace + metadata
- Marcar como resolvido
- Severidades: critical, error, warning

---

## 8. Configurações (`/admin/configuracoes`)

### Configurações Gerais
- Nome do site
- URL do site
- E-mail de contato
- E-mail do remetente (SMTP from)
- Logo (upload)
- Favicon (upload)

### Configurações de IA
- Modelo primário (seleção)
- Modelo fallback
- Temperature por tipo de prompt
- Budget máximo mensal de tokens
- IA habilitada (toggle geral)

### Configurações de Notificação
- E-mail habilitado (toggle)
- Tempo para lembrete de inatividade (dias)
- Tempo para e-mail de abandono (dias)
- Templates de e-mail (CRUD)

### Configurações de Segurança
- Rate limit por IP (req/min)
- Rate limit por usuário (req/min)
- Sessão: tempo de expiração

---

## 9. Navegação do Admin (Sidebar)

```
📊 Dashboard
📝 Conteúdo
   ├── Páginas
   ├── FAQs
   └── Blog
🔗 Links Oficiais
🔌 Integrações
   ├── Status
   ├── Logs
   └── Feature Flags
👥 Usuários
📈 Métricas
   ├── Funil
   └── Relatórios
📋 Logs
   ├── Auditoria
   └── Erros
⚙️ Configurações
```
