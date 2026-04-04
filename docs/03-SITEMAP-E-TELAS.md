# 03 - Sitemap e Catalogo de Telas

> Registrar Certo - SaaS educativo e operacional para registro de propriedade intelectual no INPI

---

## 1. Sitemap Hierarquico

```
/                              -> Home
|
+-- /triagem                   -> Triagem Inteligente (wizard)
|   +-- /triagem/resultado     -> Resultado da Triagem
|
+-- /marca                     -> Hub: Registro de Marca
|   +-- /marca/o-que-e         -> O que e marca
|   +-- /marca/busca-previa    -> Busca previa
|   +-- /marca/classe-nice     -> Classificacao Nice
|   +-- /marca/documentos      -> Documentos necessarios
|   +-- /marca/cadastro-einpi  -> Cadastro no e-INPI
|   +-- /marca/gru             -> Emissao da GRU
|   +-- /marca/pagamento       -> Pagamento
|   +-- /marca/protocolo       -> Protocolo no e-Marcas
|   +-- /marca/acompanhamento  -> Acompanhamento
|   +-- /marca/oposicao        -> Oposicao e Exigencia
|   +-- /marca/concessao       -> Concessao
|   +-- /marca/renovacao       -> Renovacao
|
+-- /patente                   -> Hub: Registro de Patente
|   +-- /patente/quando-patentear    -> Quando faz sentido patentear
|   +-- /patente/tipos               -> Invencao vs Modelo de Utilidade
|   +-- /patente/busca-anterioridade -> Busca de anterioridade
|   +-- /patente/sigilo              -> Sigilo antes do deposito
|   +-- /patente/documentos          -> Documentos tecnicos
|   +-- /patente/relatorio           -> Relatorio descritivo
|   +-- /patente/reivindicacoes      -> Reivindicacoes
|   +-- /patente/resumo              -> Resumo
|   +-- /patente/desenhos            -> Desenhos tecnicos
|   +-- /patente/cadastro            -> Cadastro e pagamento
|   +-- /patente/deposito            -> Deposito
|   +-- /patente/acompanhamento      -> Acompanhamento
|
+-- /desenho-industrial              -> Hub: Desenho Industrial
|   +-- /desenho-industrial/o-que-e        -> O que e DI
|   +-- /desenho-industrial/quando-usar    -> Quando usar DI
|   +-- /desenho-industrial/preparacao     -> O que preparar
|   +-- /desenho-industrial/desenhos       -> Desenhos e fotos
|   +-- /desenho-industrial/cadastro       -> Cadastro e GRU
|   +-- /desenho-industrial/deposito       -> Deposito
|   +-- /desenho-industrial/acompanhamento -> Acompanhamento
|
+-- /meu-passo-a-passo         -> Painel do usuario
+-- /checklist                  -> Gerador de Checklist
+-- /resumo                     -> Gerador de Resumo Final
|
+-- /ajuda                      -> Central de Ajuda / FAQ
+-- /blog                       -> Blog SEO
|   +-- /blog/[slug]            -> Post individual
|
+-- /sobre                      -> Sobre o Registrar Certo
+-- /termos                     -> Termos de Uso
+-- /privacidade                -> Politica de Privacidade
|
+-- /login                      -> Login
+-- /cadastro                   -> Cadastro
|
+-- /admin                      -> Painel Admin
    +-- /admin/conteudo          -> Gestao de Conteudo
    +-- /admin/links             -> Links Oficiais
    +-- /admin/integracoes       -> Integracoes
    +-- /admin/usuarios          -> Usuarios
    +-- /admin/metricas          -> Metricas e Funil
    +-- /admin/configuracoes     -> Configuracoes
```

---

## 2. Catalogo Completo de Telas

### Legenda de Modo de Usuario

| Sigla | Significado |
|-------|-------------|
| V     | Visitante (sem conta) |
| U     | Usuario logado |
| A     | Administrador |

---

### 2.1 Paginas Publicas (Visitante)

| # | Rota | Nome da Tela | Proposito | Modo |
|---|------|-------------|-----------|------|
| 01 | `/` | Home | Ponto de entrada principal. Apresenta a proposta de valor, direciona para triagem e para os tres tipos de registro. Constroi confianca e orienta o visitante. | V |
| 02 | `/triagem` | Triagem Inteligente | Wizard de 6-7 perguntas para identificar qual tipo de registro o usuario precisa (marca, patente, desenho industrial ou nenhum). Uma pergunta por vez. | V |
| 03 | `/triagem/resultado` | Resultado da Triagem | Exibe o diagnostico com o tipo de registro recomendado, explicacao clara e CTA para iniciar o fluxo correspondente. | V |
| 04 | `/sobre` | Sobre o Registrar Certo | Explica a missao do projeto, quem esta por tras, e reforco de que e um guia educativo (nao escritorio de advocacia). | V |
| 05 | `/termos` | Termos de Uso | Termos legais de uso da plataforma. | V |
| 06 | `/privacidade` | Politica de Privacidade | Politica de tratamento de dados conforme LGPD. | V |

---

### 2.2 Hubs de Registro (Visitante / Usuario)

| # | Rota | Nome da Tela | Proposito | Modo |
|---|------|-------------|-----------|------|
| 07 | `/marca` | Hub: Registro de Marca | Pagina-indice do fluxo de marca. Lista todas as etapas em ordem, mostra progresso (se logado), e permite navegar para qualquer etapa. | V / U |
| 08 | `/patente` | Hub: Registro de Patente | Pagina-indice do fluxo de patente. Mesma estrutura do hub de marca, adaptada para patente. | V / U |
| 09 | `/desenho-industrial` | Hub: Desenho Industrial | Pagina-indice do fluxo de desenho industrial. Mesma estrutura, adaptada para DI. | V / U |

---

### 2.3 Etapas de Marca (Visitante / Usuario)

| # | Rota | Nome da Tela | Proposito | Modo |
|---|------|-------------|-----------|------|
| 10 | `/marca/o-que-e` | O que e marca | Explica o conceito de marca de forma simples, com exemplos do dia a dia. Diferencia de patente e DI. | V / U |
| 11 | `/marca/busca-previa` | Busca previa | Ensina como verificar se a marca ja existe. Link direto para a base do INPI. Explica os resultados possiveis. | V / U |
| 12 | `/marca/classe-nice` | Classificacao Nice | Explica o sistema de classes, ajuda a identificar a classe correta, com exemplos praticos por segmento. | V / U |
| 13 | `/marca/documentos` | Documentos necessarios | Lista completa de documentos: CPF/CNPJ, logotipo, procuracao (se aplicavel). Formato e requisitos de cada um. | V / U |
| 14 | `/marca/cadastro-einpi` | Cadastro no e-INPI | Tutorial passo a passo para criar conta no sistema e-INPI. Capturas de tela e dicas. | V / U |
| 15 | `/marca/gru` | Emissao da GRU | Como gerar a Guia de Recolhimento da Uniao. Valores atualizados. Desconto para MEI/ME/EPP. | V / U |
| 16 | `/marca/pagamento` | Pagamento | Formas de pagar a GRU (banco, internet banking). Prazo de compensacao. O que fazer se perder o prazo. | V / U |
| 17 | `/marca/protocolo` | Protocolo no e-Marcas | Tutorial para fazer o deposito (pedido) no sistema e-Marcas. Passo a passo com imagens. | V / U |
| 18 | `/marca/acompanhamento` | Acompanhamento | Como acompanhar o andamento do pedido na Revista da Propriedade Industrial (RPI). Prazos tipicos. | V / U |
| 19 | `/marca/oposicao` | Oposicao e Exigencia | O que fazer se alguem contestar ou se o INPI pedir correcao. Prazos e estrategias. | V / U |
| 20 | `/marca/concessao` | Concessao | O que acontece quando a marca e aprovada. GRU de concessao. Certificado de registro. | V / U |
| 21 | `/marca/renovacao` | Renovacao | Quando e como renovar. Prazo de 10 anos. Consequencias de nao renovar. | V / U |

---

### 2.4 Etapas de Patente (Visitante / Usuario)

| # | Rota | Nome da Tela | Proposito | Modo |
|---|------|-------------|-----------|------|
| 22 | `/patente/quando-patentear` | Quando faz sentido patentear | Ajuda a avaliar se vale a pena. Custo x beneficio. Alternativas (segredo industrial). | V / U |
| 23 | `/patente/tipos` | Invencao vs Modelo de Utilidade | Diferenca entre PI (patente de invencao) e MU (modelo de utilidade). Exemplos praticos. | V / U |
| 24 | `/patente/busca-anterioridade` | Busca de anterioridade | Como pesquisar se a invencao ja existe. Bases nacionais e internacionais. | V / U |
| 25 | `/patente/sigilo` | Sigilo antes do deposito | Por que nao divulgar antes de protocolar. Periodo de graca. NDA. | V / U |
| 26 | `/patente/documentos` | Documentos tecnicos | Visao geral dos documentos necessarios para o deposito de patente. | V / U |
| 27 | `/patente/relatorio` | Relatorio descritivo | Como escrever o relatorio descritivo. Estrutura e exemplos. | V / U |
| 28 | `/patente/reivindicacoes` | Reivindicacoes | Como redigir as reivindicacoes. Independentes vs dependentes. | V / U |
| 29 | `/patente/resumo` | Resumo | Como fazer o resumo da patente. Regras e limites. | V / U |
| 30 | `/patente/desenhos` | Desenhos tecnicos | Padroes de desenho aceitos pelo INPI. Formatos e dicas. | V / U |
| 31 | `/patente/cadastro` | Cadastro e pagamento | Cadastro no e-INPI e emissao da GRU especifica para patente. | V / U |
| 32 | `/patente/deposito` | Deposito | Como protocolar o pedido de patente. Tutorial passo a passo. | V / U |
| 33 | `/patente/acompanhamento` | Acompanhamento | Como acompanhar o pedido de patente. Exame tecnico e prazos. | V / U |

---

### 2.5 Etapas de Desenho Industrial (Visitante / Usuario)

| # | Rota | Nome da Tela | Proposito | Modo |
|---|------|-------------|-----------|------|
| 34 | `/desenho-industrial/o-que-e` | O que e Desenho Industrial | Explica o conceito de DI. Exemplos visuais (formato de garrafa, design de movel). | V / U |
| 35 | `/desenho-industrial/quando-usar` | Quando usar DI | Diferencia DI de marca e patente. Quando o visual e o que importa. | V / U |
| 36 | `/desenho-industrial/preparacao` | O que preparar | Documentos e materiais necessarios para o deposito de DI. | V / U |
| 37 | `/desenho-industrial/desenhos` | Desenhos e fotos | Requisitos para imagens: angulos, fundo, resolucao. Exemplos bons e ruins. | V / U |
| 38 | `/desenho-industrial/cadastro` | Cadastro e GRU | Cadastro no e-INPI e GRU especifica para DI. | V / U |
| 39 | `/desenho-industrial/deposito` | Deposito | Tutorial para protocolar o pedido de DI. | V / U |
| 40 | `/desenho-industrial/acompanhamento` | Acompanhamento | Como acompanhar o pedido de DI. Prazos e publicacao. | V / U |

---

### 2.6 Ferramentas do Usuario (Requer Login)

| # | Rota | Nome da Tela | Proposito | Modo |
|---|------|-------------|-----------|------|
| 41 | `/meu-passo-a-passo` | Painel do Usuario | Dashboard pessoal. Mostra o progresso no fluxo escolhido, etapas concluidas, proxima etapa, checklist pendente. | U |
| 42 | `/checklist` | Gerador de Checklist | Gera uma lista personalizada de tudo que o usuario precisa com base no tipo de registro e informacoes fornecidas. | U |
| 43 | `/resumo` | Gerador de Resumo Final | Compila todas as informacoes inseridas pelo usuario em um resumo pronto para revisao antes de protocolar no INPI. | U |

---

### 2.7 Conteudo e Suporte (Visitante / Usuario)

| # | Rota | Nome da Tela | Proposito | Modo |
|---|------|-------------|-----------|------|
| 44 | `/ajuda` | Central de Ajuda / FAQ | Perguntas frequentes organizadas por categoria. Busca por palavras-chave. Links para recursos do INPI. | V / U |
| 45 | `/blog` | Blog SEO | Listagem de artigos sobre propriedade intelectual. Filtro por categoria (marca, patente, DI, geral). Paginacao. | V |
| 46 | `/blog/[slug]` | Post Individual | Artigo completo com indice lateral, CTAs contextuais, posts relacionados, e compartilhamento social. | V |

---

### 2.8 Autenticacao (Visitante)

| # | Rota | Nome da Tela | Proposito | Modo |
|---|------|-------------|-----------|------|
| 47 | `/login` | Login | Autenticacao por email + senha ou login social (Google). Recuperacao de senha. | V |
| 48 | `/cadastro` | Cadastro | Criacao de conta com nome, email, senha. Aceite de termos. Opcao de login social. | V |

---

### 2.9 Painel Administrativo (Admin)

| # | Rota | Nome da Tela | Proposito | Modo |
|---|------|-------------|-----------|------|
| 49 | `/admin` | Painel Admin | Dashboard geral: usuarios ativos, funil de conversao, conteudo publicado, alertas de manutencao. | A |
| 50 | `/admin/conteudo` | Gestao de Conteudo | Editor de todas as paginas de etapas e blog. Markdown com preview. Controle de versao. | A |
| 51 | `/admin/links` | Links Oficiais | Gerenciamento dos links para sistemas do INPI. Alerta quando links podem estar desatualizados. | A |
| 52 | `/admin/integracoes` | Integracoes | Configuracao de integracoes: analytics, email marketing, webhooks. | A |
| 53 | `/admin/usuarios` | Usuarios | Lista de usuarios, status de progresso, filtros por tipo de registro. Exportacao. | A |
| 54 | `/admin/metricas` | Metricas e Funil | Funil completo: visita -> triagem -> cadastro -> progresso -> checklist -> resumo -> protocolo. | A |
| 55 | `/admin/configuracoes` | Configuracoes | Configuracoes gerais: valores de GRU, prazos, textos de disclaimers, feature flags. | A |

---

## 3. Fluxos Principais de Navegacao

### Fluxo 1: Visitante Novo (Descoberta)

```
Home -> Triagem -> Resultado -> Hub (Marca/Patente/DI) -> Etapa 1
```

### Fluxo 2: Visitante Direto (Ja sabe o que quer)

```
Home -> Hub (Marca/Patente/DI) -> Etapa especifica
```

### Fluxo 3: Usuario Logado (Continuacao)

```
Login -> Meu Passo a Passo -> Proxima Etapa pendente -> Checklist -> Resumo Final
```

### Fluxo 4: Visitante via Blog (SEO)

```
Google -> Blog Post -> CTA contextual -> Triagem ou Hub -> Cadastro
```

### Fluxo 5: Retorno (Acompanhamento)

```
Login -> Meu Passo a Passo -> Etapa de Acompanhamento
```

---

## 4. Hierarquia de Prioridade para Implementacao

### Fase 1 - MVP (lancamento)
1. Home
2. Triagem + Resultado
3. Hub de Marca + 12 etapas de Marca
4. Login / Cadastro
5. Meu Passo a Passo
6. Checklist
7. Central de Ajuda / FAQ

### Fase 2 - Expansao
8. Hub de Patente + 12 etapas
9. Hub de DI + 7 etapas
10. Resumo Final
11. Blog + Posts

### Fase 3 - Admin e Otimizacao
12. Painel Admin completo
13. Metricas e Funil
14. Gestao de Conteudo
15. Sobre / Termos / Privacidade

---

## 5. Notas Tecnicas

### SEO
- Todas as paginas publicas devem ter meta title, meta description e Open Graph configurados.
- Paginas de etapas usam structured data (HowTo schema).
- Blog usa Article schema.
- URLs sao limpas e semanticas (sem IDs numericos).

### Performance
- Paginas de conteudo sao estaticas ou SSG (Static Site Generation).
- Apenas dashboard e ferramentas usam client-side rendering.
- Imagens otimizadas com lazy loading.

### Responsividade
- Mobile-first para todas as telas.
- Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1280px (large).
- Navegacao mobile com hamburger menu.
- Etapas de wizard otimizadas para touch.

### Acessibilidade
- Nivel minimo: WCAG 2.1 AA.
- Navegacao completa por teclado.
- Labels e ARIA em todos os formularios.
- Contraste adequado em ambos os temas (claro e escuro).
