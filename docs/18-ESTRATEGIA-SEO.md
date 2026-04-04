# 18 - Estrategia SEO | Registrar Certo

> Documento de referencia para toda a estrategia de otimizacao para mecanismos de busca do Registrar Certo.
> Ultima atualizacao: Abril 2026

---

## Indice

1. [Arquitetura de URLs](#1-arquitetura-de-urls)
2. [Schema Markup (Dados Estruturados)](#2-schema-markup-dados-estruturados)
3. [SEO Tecnico](#3-seo-tecnico)
4. [Clusters de Conteudo](#4-clusters-de-conteudo)
5. [Estrategia de Links Internos](#5-estrategia-de-links-internos)
6. [Templates de SEO On-Page](#6-templates-de-seo-on-page)

---

## 1. Arquitetura de URLs

### 1.1 Principios

- URLs curtas, descritivas, em portugues, sem acentos e sem caracteres especiais.
- Hierarquia reflete a estrutura de conteudo (hub > spoke).
- Paginas que NAO devem ser indexadas recebem `<meta name="robots" content="noindex">`.
- Todas as URLs usam HTTPS e terminam sem barra final (trailing slash).

### 1.2 Mapa Completo de URLs

```
PAGINAS PUBLICAS (indexaveis)
==============================

/                                   Home (landing principal)
/triagem                            Wizard de triagem (qual tipo de registro?)
/marca                              Hub de registro de marca
/marca/busca-previa                 Passo: busca previa no INPI
/marca/escolha-classe-nice          Passo: escolher classe Nice
/marca/preparar-documentos          Passo: preparar documentos
/marca/preencher-formulario         Passo: preencher e-Marcas
/marca/gerar-gru                    Passo: gerar e pagar GRU
/marca/acompanhar-pedido            Passo: acompanhar pedido
/marca/responder-exigencia          Passo: responder exigencia
/marca/renovacao                    Passo: renovacao de marca
/patente                            Hub de registro de patente
/patente/busca-anterioridade        Passo: busca de anterioridade
/patente/relatorio-descritivo       Passo: escrever relatorio descritivo
/patente/reivindicacoes             Passo: elaborar reivindicacoes
/patente/desenhos-tecnicos          Passo: preparar desenhos tecnicos
/patente/deposito                   Passo: depositar no INPI
/patente/acompanhar-pedido          Passo: acompanhar pedido
/desenho-industrial                 Hub de desenho industrial
/desenho-industrial/preparar-imagens    Passo: preparar imagens/representacoes
/desenho-industrial/classificacao       Passo: classificacao de Locarno
/desenho-industrial/deposito            Passo: depositar no INPI
/desenho-industrial/acompanhar-pedido   Passo: acompanhar pedido
/blog                               Indice do blog
/blog/[slug]                        Artigo individual
/ajuda                              Central de ajuda / FAQ
/ajuda/[categoria-slug]             Categoria de FAQ
/sobre                              Sobre o Registrar Certo
/termos                             Termos de uso
/privacidade                        Politica de privacidade

PAGINAS PRIVADAS / NOINDEX
==============================

/login                              Login (noindex)
/cadastro                           Cadastro (noindex)
/meu-passo-a-passo                  Dashboard do usuario (noindex)
/meu-passo-a-passo/[jornada-id]     Jornada especifica (noindex)
/admin/*                            Painel administrativo (noindex, nofollow)
```

### 1.3 Regras de Canonicalizacao

| Cenario | Canonical |
|---------|-----------|
| Pagina padrao | Self-referencing canonical |
| Parametros UTM ou query strings | Canonical aponta para URL limpa |
| Paginacao do blog (/blog?page=2) | Canonical aponta para /blog (com rel=next/prev) |
| Versoes www vs. non-www | Redirect 301 para non-www |
| HTTP vs. HTTPS | Redirect 301 para HTTPS |
| Trailing slash vs. sem | Redirect 301 para versao sem trailing slash |

### 1.4 Paginas Noindex

```html
<!-- Aplicar em /login, /cadastro, /meu-passo-a-passo, /meu-passo-a-passo/* -->
<meta name="robots" content="noindex, follow">

<!-- Aplicar em /admin/* -->
<meta name="robots" content="noindex, nofollow">
```

---

## 2. Schema Markup (Dados Estruturados)

### 2.1 Organization (todas as paginas)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Registrar Certo",
  "url": "https://registrarcerto.com.br",
  "logo": "https://registrarcerto.com.br/images/logo.png",
  "description": "Plataforma que guia voce no registro de marcas, patentes e desenhos industriais no INPI, passo a passo.",
  "foundingDate": "2026",
  "sameAs": [
    "https://www.instagram.com/registrarcerto",
    "https://www.linkedin.com/company/registrarcerto",
    "https://www.youtube.com/@registrarcerto"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "contato@registrarcerto.com.br",
    "availableLanguage": "Portuguese"
  }
}
```

### 2.2 WebApplication (pagina home)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Registrar Certo",
  "url": "https://registrarcerto.com.br",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Plataforma gratuita que guia voce no registro de marcas, patentes e desenhos industriais no INPI.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL",
    "description": "Plano gratuito com guia passo a passo completo"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  }
}
```

### 2.3 BreadcrumbList (todas as paginas, exceto home)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://registrarcerto.com.br"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Registro de Marca",
      "item": "https://registrarcerto.com.br/marca"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Busca Previa no INPI",
      "item": "https://registrarcerto.com.br/marca/busca-previa"
    }
  ]
}
```

### 2.4 HowTo (paginas de passo a passo /marca/[step], /patente/[step], /desenho-industrial/[step])

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Como fazer a busca previa de marca no INPI",
  "description": "Guia passo a passo para verificar se sua marca ja existe no banco de dados do INPI antes de solicitar o registro.",
  "totalTime": "PT15M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "BRL",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Acessar o sistema de busca do INPI",
      "text": "Acesse busca.inpi.gov.br e selecione 'Marca'.",
      "url": "https://registrarcerto.com.br/marca/busca-previa#passo-1"
    },
    {
      "@type": "HowToStep",
      "name": "Inserir o nome da marca",
      "text": "Digite o nome da marca que deseja registrar no campo de busca.",
      "url": "https://registrarcerto.com.br/marca/busca-previa#passo-2"
    }
  ]
}
```

### 2.5 FAQPage (paginas de FAQ /ajuda e secoes FAQ dentro de artigos)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quanto custa registrar uma marca no INPI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O custo basico da taxa federal (GRU) para pessoa fisica, MEI ou ME e de R$ 142,00. Para demais empresas, o valor e de R$ 355,00. Alem da taxa de deposito, ha a taxa de concessao ao final do processo."
      }
    },
    {
      "@type": "Question",
      "name": "Quanto tempo demora para registrar uma marca?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O processo de registro de marca no INPI leva em media de 6 a 12 meses, podendo se estender caso haja exigencias ou oposicoes."
      }
    }
  ]
}
```

### 2.6 Article (posts do blog /blog/[slug])

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Como registrar marca no INPI: guia completo 2026",
  "description": "Aprenda passo a passo como registrar sua marca no INPI, desde a busca previa ate o acompanhamento do pedido.",
  "image": "https://registrarcerto.com.br/images/blog/como-registrar-marca.webp",
  "author": {
    "@type": "Person",
    "name": "Equipe Registrar Certo",
    "url": "https://registrarcerto.com.br/sobre"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Registrar Certo",
    "logo": {
      "@type": "ImageObject",
      "url": "https://registrarcerto.com.br/images/logo.png"
    }
  },
  "datePublished": "2026-04-01",
  "dateModified": "2026-04-01",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://registrarcerto.com.br/blog/como-registrar-marca-inpi"
  }
}
```

### 2.7 Plano de Implementacao

| Pagina | Schemas a implementar |
|--------|-----------------------|
| / (home) | Organization, WebApplication, BreadcrumbList |
| /marca (hub) | Organization, BreadcrumbList, FAQPage (se houver FAQ) |
| /marca/[step] | Organization, BreadcrumbList, HowTo |
| /patente (hub) | Organization, BreadcrumbList, FAQPage |
| /patente/[step] | Organization, BreadcrumbList, HowTo |
| /desenho-industrial (hub) | Organization, BreadcrumbList, FAQPage |
| /desenho-industrial/[step] | Organization, BreadcrumbList, HowTo |
| /blog/[slug] | Organization, BreadcrumbList, Article, FAQPage (se tiver secao FAQ) |
| /ajuda | Organization, BreadcrumbList, FAQPage |
| /triagem | Organization, BreadcrumbList |
| /sobre | Organization, BreadcrumbList |

---

## 3. SEO Tecnico

### 3.1 Sitemap XML

Estrutura com multiplos sitemaps para melhor organizacao e monitoramento:

```xml
<!-- /sitemap-index.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://registrarcerto.com.br/sitemap-pages.xml</loc>
    <lastmod>2026-04-04</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://registrarcerto.com.br/sitemap-blog.xml</loc>
    <lastmod>2026-04-04</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://registrarcerto.com.br/sitemap-help.xml</loc>
    <lastmod>2026-04-04</lastmod>
  </sitemap>
</sitemaps>
```

**sitemap-pages.xml** -- Paginas estaticas e hubs:
- /, /triagem, /marca, /marca/*, /patente, /patente/*, /desenho-industrial, /desenho-industrial/*, /sobre, /termos, /privacidade

**sitemap-blog.xml** -- Todos os posts do blog:
- /blog, /blog/[slug] (atualizado automaticamente ao publicar novo post)

**sitemap-help.xml** -- Central de ajuda:
- /ajuda, /ajuda/[categoria-slug]

### 3.2 robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /meu-passo-a-passo/
Disallow: /login
Disallow: /cadastro
Disallow: /api/

Sitemap: https://registrarcerto.com.br/sitemap-index.xml
```

### 3.3 Canonical URLs

```html
<!-- Toda pagina indexavel DEVE ter canonical self-referencing -->
<link rel="canonical" href="https://registrarcerto.com.br/marca/busca-previa" />

<!-- Paginas com parametros UTM -->
<!-- URL acessada: /marca?utm_source=google&utm_medium=cpc -->
<!-- Canonical: -->
<link rel="canonical" href="https://registrarcerto.com.br/marca" />
```

**Regras de implementacao:**
- Canonical SEMPRE com URL absoluta (incluindo https://)
- Canonical SEMPRE sem parametros de query string
- Canonical SEMPRE sem trailing slash
- Canonical SEMPRE na versao non-www

### 3.4 Hreflang

Como o site e exclusivamente em portugues brasileiro:

```html
<link rel="alternate" hreflang="pt-BR" href="https://registrarcerto.com.br/marca" />
<link rel="alternate" hreflang="x-default" href="https://registrarcerto.com.br/marca" />
```

> Nota: Implementar hreflang em todas as paginas indexaveis. Se no futuro houver versao em espanhol ou ingles, expandir o mapeamento.

### 3.5 Open Graph Tags (Template)

```html
<!-- Template para paginas de hub -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Como Registrar Marca no INPI - Guia Passo a Passo | Registrar Certo" />
<meta property="og:description" content="Aprenda a registrar sua marca no INPI sem advogado. Guia gratuito com todos os passos, documentos e custos atualizados." />
<meta property="og:url" content="https://registrarcerto.com.br/marca" />
<meta property="og:image" content="https://registrarcerto.com.br/images/og/marca-hub.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:site_name" content="Registrar Certo" />

<!-- Template para posts do blog -->
<meta property="og:type" content="article" />
<meta property="og:title" content="[Titulo do Post] | Registrar Certo" />
<meta property="og:description" content="[Descricao do post em ate 160 caracteres]" />
<meta property="og:url" content="https://registrarcerto.com.br/blog/[slug]" />
<meta property="og:image" content="https://registrarcerto.com.br/images/blog/[slug].webp" />
<meta property="article:published_time" content="2026-04-01T00:00:00Z" />
<meta property="article:modified_time" content="2026-04-04T00:00:00Z" />
<meta property="article:author" content="Equipe Registrar Certo" />
```

### 3.6 Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Mesmo do og:title]" />
<meta name="twitter:description" content="[Mesmo do og:description]" />
<meta name="twitter:image" content="[Mesmo do og:image]" />
<meta name="twitter:site" content="@registrarcerto" />
```

### 3.7 Templates de Meta Description por Tipo de Pagina

| Tipo de pagina | Formula da meta description |
|----------------|---------------------------|
| Home | "Registre sua marca, patente ou desenho industrial no INPI sem advogado. Guia gratuito passo a passo com checklist, documentos e custos atualizados [ano]." |
| Hub de marca | "Aprenda a registrar sua marca no INPI do zero. Guia completo com busca previa, classes Nice, documentos, GRU e acompanhamento. Comece agora gratuitamente." |
| Hub de patente | "Registre sua patente no INPI por conta propria. Guia passo a passo com busca de anterioridade, relatorio descritivo, reivindicacoes e deposito." |
| Hub de desenho industrial | "Proteja seu desenho industrial no INPI. Guia completo com imagens, classificacao de Locarno, deposito e acompanhamento do pedido." |
| Pagina de passo | "[Verbo no imperativo] [acao do passo] no INPI. [Beneficio ou detalhe]. Guia com prints, exemplos e dicas para nao errar." |
| Blog post | "[Resumo da promessa do artigo em 1 frase]. [Dado ou estatistica de credibilidade]. Leia o guia completo." |
| FAQ/Ajuda | "Tire suas duvidas sobre [topico]. Respostas claras e atualizadas sobre registro de marcas, patentes e desenhos industriais no INPI." |
| Triagem | "Descubra em 2 minutos qual tipo de registro voce precisa no INPI. Responda algumas perguntas e receba seu caminho personalizado." |

### 3.8 Estrategia de Alt Text para Imagens

**Regras:**
- Toda imagem DEVE ter alt text descritivo em portugues.
- Alt text deve descrever o conteudo da imagem E incluir contexto relevante para SEO.
- Nao fazer keyword stuffing no alt text.
- Screenshots de telas do INPI devem descrever a acao sendo realizada.
- Icones decorativos usam `alt=""` (vazio).

**Formulas por tipo de imagem:**

| Tipo | Formula de alt text |
|------|-------------------|
| Screenshot do INPI | "Tela do sistema [nome do sistema] mostrando [acao especifica]" |
| Diagrama de fluxo | "Fluxograma do processo de [registro/deposito] de [marca/patente/DI] no INPI" |
| Imagem ilustrativa | "Ilustracao de [descricao da cena relacionada ao contexto]" |
| Grafico/tabela | "[Tipo de grafico] mostrando [dado principal] sobre [tema]" |
| Logo | "Logo do Registrar Certo" |
| Icone decorativo | "" (alt vazio) |

### 3.9 Core Web Vitals -- Metas

| Metrica | Mobile | Desktop | Meta |
|---------|--------|---------|------|
| LCP (Largest Contentful Paint) | < 2.5s | < 2.0s | Bom |
| INP (Interaction to Next Paint) | < 200ms | < 150ms | Bom |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.05 | Bom |

**Estrategias para atingir as metas:**

1. **LCP**
   - Usar Next.js Image com lazy loading e priority para hero images
   - Servir imagens em WebP/AVIF
   - Preconnect para fontes e CDN
   - SSR/SSG para conteudo critico above-the-fold
   - Font-display: swap para fontes customizadas

2. **INP**
   - Minimizar JavaScript no bundle principal
   - Usar React.lazy() e dynamic imports para componentes pesados
   - Debounce em inputs e event handlers
   - Evitar layout thrashing em interacoes

3. **CLS**
   - Definir width/height explicitos em todas as imagens e videos
   - Reservar espaco para componentes carregados dinamicamente
   - Evitar insercao de conteudo acima do viewport apos render inicial
   - Fontes com font-display: optional ou swap com fallback dimensionado

### 3.10 Plano de Teste de Dados Estruturados

| Ferramenta | Frequencia | O que testar |
|------------|------------|-------------|
| Google Rich Results Test | A cada deploy de nova pagina | Validacao de todos os schemas |
| Schema.org Validator | Mensal | Conformidade com especificacao |
| Google Search Console (Melhorias) | Semanal | Erros e avisos de dados estruturados |
| Lighthouse (aba SEO) | A cada sprint | Score SEO geral + structured data |
| Ahrefs Site Audit | Mensal | Cobertura e erros tecnicos |

**Checklist de validacao pre-deploy:**
- [ ] Schema JSON-LD valido (sem erros de sintaxe)
- [ ] Todos os campos obrigatorios preenchidos
- [ ] URLs absolutas nos campos de URL
- [ ] Imagens acessiveis e com dimensoes corretas
- [ ] Datas no formato ISO 8601
- [ ] Teste no Rich Results Test do Google sem erros
- [ ] Breadcrumb schema reflete a hierarquia real

---

## 4. Clusters de Conteudo

### 4.1 Cluster 1: Registrar Marca (Pilar: /marca)

#### Pagina Pilar
- **URL**: /marca
- **Titulo**: Como Registrar Marca no INPI: Guia Completo Passo a Passo [2026]
- **Intencao de busca**: Informacional + Comercial
- **Palavras-chave primarias**: "como registrar marca no INPI", "registrar marca", "registro de marca"
- **Volume estimado**: 8.000-12.000 buscas/mes (agregado)
- **CTA principal**: "Comece sua jornada de registro" -> /triagem

#### Conteudos de Suporte (Blog + Paginas de Passo)

| # | Palavra-chave | Vol. Est. | Tipo | URL Alvo | Prioridade |
|---|--------------|-----------|------|----------|------------|
| 1 | como registrar marca no INPI | 6.600 | Pilar | /marca | Critica |
| 2 | como registrar marca de roupa | 1.300 | Blog | /blog/como-registrar-marca-de-roupa | Alta |
| 3 | como registrar marca de alimento | 880 | Blog | /blog/como-registrar-marca-de-alimento | Alta |
| 4 | quanto custa registrar marca no INPI 2026 | 2.400 | Blog | /blog/quanto-custa-registrar-marca-inpi | Critica |
| 5 | pessoa fisica pode registrar marca | 1.000 | Blog | /blog/pessoa-fisica-pode-registrar-marca | Alta |
| 6 | como saber se uma marca ja existe | 1.600 | Blog + Passo | /blog/como-saber-se-marca-ja-existe | Critica |
| 7 | como escolher classe Nice | 720 | Blog + Passo | /blog/como-escolher-classe-nice | Alta |
| 8 | o que e classe Nice | 590 | Blog | /blog/o-que-e-classificacao-nice | Media |
| 9 | como preencher formulario e-Marcas | 480 | Blog + Passo | /blog/como-preencher-formulario-e-marcas | Alta |
| 10 | como pagar GRU do INPI | 390 | Blog + Passo | /blog/como-pagar-gru-inpi | Media |
| 11 | como acompanhar pedido de marca no INPI | 720 | Blog + Passo | /blog/como-acompanhar-pedido-marca-inpi | Alta |
| 12 | quanto tempo demora registro de marca | 1.900 | Blog | /blog/quanto-tempo-demora-registro-marca | Critica |
| 13 | o que e oposicao de marca | 480 | Blog | /blog/o-que-e-oposicao-de-marca | Media |
| 14 | como renovar marca no INPI | 320 | Blog + Passo | /blog/como-renovar-marca-inpi | Media |

#### Interlinking do Cluster Marca

```
/marca (pilar)
  |-- link para /marca/busca-previa
  |-- link para /marca/escolha-classe-nice
  |-- link para /marca/preparar-documentos
  |-- link para /marca/preencher-formulario
  |-- link para /marca/gerar-gru
  |-- link para /marca/acompanhar-pedido
  |
  |-- link para /blog/quanto-custa-registrar-marca-inpi
  |-- link para /blog/quanto-tempo-demora-registro-marca
  |-- link para /blog/pessoa-fisica-pode-registrar-marca

/blog/como-registrar-marca-de-roupa
  |-- link para /marca (pilar)
  |-- link para /marca/escolha-classe-nice
  |-- link para /blog/como-escolher-classe-nice

/blog/quanto-custa-registrar-marca-inpi
  |-- link para /marca (pilar)
  |-- link para /marca/gerar-gru
  |-- link para /blog/pessoa-fisica-pode-registrar-marca (desconto PF)
```

### 4.2 Cluster 2: Registrar Patente (Pilar: /patente)

#### Pagina Pilar
- **URL**: /patente
- **Titulo**: Como Registrar Patente no INPI: Guia Completo para Inventores [2026]
- **Intencao de busca**: Informacional + Comercial
- **Palavras-chave primarias**: "como registrar patente no INPI", "registrar patente", "patentear invencao"
- **Volume estimado**: 3.500-5.000 buscas/mes (agregado)
- **CTA principal**: "Comece sua jornada de patente" -> /triagem

#### Conteudos de Suporte

| # | Palavra-chave | Vol. Est. | Tipo | URL Alvo | Prioridade |
|---|--------------|-----------|------|----------|------------|
| 1 | como registrar patente no INPI | 3.600 | Pilar | /patente | Critica |
| 2 | diferenca entre patente de invencao e modelo de utilidade | 1.200 | Blog | /blog/diferenca-patente-invencao-modelo-utilidade | Alta |
| 3 | quanto custa patentear uma invencao | 1.800 | Blog | /blog/quanto-custa-patentear-invencao | Critica |
| 4 | como fazer busca de anterioridade | 880 | Blog + Passo | /blog/como-fazer-busca-anterioridade-patente | Alta |
| 5 | o que sao reivindicacoes de patente | 590 | Blog + Passo | /blog/o-que-sao-reivindicacoes-patente | Alta |
| 6 | relatorio descritivo de patente | 480 | Blog + Passo | /blog/como-escrever-relatorio-descritivo-patente | Alta |
| 7 | sigilo antes do deposito de patente | 320 | Blog | /blog/sigilo-antes-deposito-patente | Media |

#### Interlinking do Cluster Patente

```
/patente (pilar)
  |-- link para /patente/busca-anterioridade
  |-- link para /patente/relatorio-descritivo
  |-- link para /patente/reivindicacoes
  |-- link para /patente/desenhos-tecnicos
  |-- link para /patente/deposito
  |
  |-- link para /blog/quanto-custa-patentear-invencao
  |-- link para /blog/diferenca-patente-invencao-modelo-utilidade
  |-- link para /blog/sigilo-antes-deposito-patente
```

### 4.3 Cluster 3: Desenho Industrial (Pilar: /desenho-industrial)

#### Pagina Pilar
- **URL**: /desenho-industrial
- **Titulo**: Como Registrar Desenho Industrial no INPI: Guia Completo [2026]
- **Intencao de busca**: Informacional
- **Palavras-chave primarias**: "como registrar desenho industrial no INPI", "registro de desenho industrial"
- **Volume estimado**: 1.200-2.000 buscas/mes (agregado)
- **CTA principal**: "Comece sua jornada de desenho industrial" -> /triagem

#### Conteudos de Suporte

| # | Palavra-chave | Vol. Est. | Tipo | URL Alvo | Prioridade |
|---|--------------|-----------|------|----------|------------|
| 1 | como registrar desenho industrial no INPI | 880 | Pilar | /desenho-industrial | Critica |
| 2 | diferenca entre desenho industrial e patente | 590 | Blog | /blog/diferenca-desenho-industrial-e-patente | Alta |
| 3 | o que e desenho industrial | 720 | Blog | /blog/o-que-e-desenho-industrial | Alta |
| 4 | quando usar desenho industrial | 260 | Blog | /blog/quando-usar-desenho-industrial | Media |

### 4.4 Cluster 4: Conceitos e Diferencas (Pilar: /blog/propriedade-industrial-guia-completo)

#### Pagina Pilar
- **URL**: /blog/propriedade-industrial-guia-completo
- **Titulo**: Propriedade Industrial no Brasil: Tudo Que Voce Precisa Saber [2026]
- **Intencao de busca**: Informacional (topo de funil)
- **Volume estimado**: 2.000-3.000 buscas/mes (agregado)
- **CTA principal**: "Descubra o que voce precisa registrar" -> /triagem

#### Conteudos de Suporte

| # | Palavra-chave | Vol. Est. | Tipo | URL Alvo | Prioridade |
|---|--------------|-----------|------|----------|------------|
| 1 | diferenca entre marca e patente | 2.400 | Blog | /blog/diferenca-entre-marca-e-patente | Critica |
| 2 | diferenca entre patente e desenho industrial | 480 | Blog | /blog/diferenca-patente-desenho-industrial | Alta |
| 3 | o que e propriedade industrial | 1.300 | Blog (pilar) | /blog/propriedade-industrial-guia-completo | Critica |
| 4 | tipos de protecao no INPI | 390 | Blog | /blog/tipos-de-protecao-inpi | Alta |

#### Interlinking entre Clusters

O Cluster 4 funciona como conector entre os tres pilares principais:

```
/blog/diferenca-entre-marca-e-patente
  |-- link para /marca (pilar marca)
  |-- link para /patente (pilar patente)
  |-- link para /triagem

/blog/tipos-de-protecao-inpi
  |-- link para /marca
  |-- link para /patente
  |-- link para /desenho-industrial
  |-- link para /triagem
```

### 4.5 Calendario Editorial -- Prioridade de Publicacao

**Fase 1 (Mes 1-2): Fundacao**
1. /marca (pagina pilar)
2. /patente (pagina pilar)
3. /desenho-industrial (pagina pilar)
4. /blog/diferenca-entre-marca-e-patente
5. /blog/quanto-custa-registrar-marca-inpi
6. /blog/quanto-tempo-demora-registro-marca

**Fase 2 (Mes 2-3): Cluster Marca (maior volume)**
7. /blog/pessoa-fisica-pode-registrar-marca
8. /blog/como-saber-se-marca-ja-existe
9. /blog/como-escolher-classe-nice
10. /blog/como-registrar-marca-de-roupa
11. /blog/como-registrar-marca-de-alimento

**Fase 3 (Mes 3-4): Cluster Patente + Desenho Industrial**
12. /blog/quanto-custa-patentear-invencao
13. /blog/diferenca-patente-invencao-modelo-utilidade
14. /blog/como-fazer-busca-anterioridade-patente
15. /blog/o-que-e-desenho-industrial
16. /blog/diferenca-desenho-industrial-e-patente

**Fase 4 (Mes 4-5): Conteudo de profundidade**
17. /blog/o-que-sao-reivindicacoes-patente
18. /blog/como-escrever-relatorio-descritivo-patente
19. /blog/como-preencher-formulario-e-marcas
20. /blog/o-que-e-oposicao-de-marca
21. /blog/propriedade-industrial-guia-completo
22. /blog/tipos-de-protecao-inpi

**Fase 5 (Mes 5+): Conteudo complementar + atualizacoes**
23. /blog/como-pagar-gru-inpi
24. /blog/como-acompanhar-pedido-marca-inpi
25. /blog/como-renovar-marca-inpi
26. /blog/sigilo-antes-deposito-patente
27. /blog/quando-usar-desenho-industrial
28. /blog/o-que-e-classificacao-nice

---

## 5. Estrategia de Links Internos

### 5.1 Modelo Hub-and-Spoke

```
                    /  (Home)
                   /|\
                  / | \
                 /  |  \
               /    |    \
     /marca    /patente    /desenho-industrial
      / | \       / | \         / | \
     /  |  \     /  |  \       /  |  \
   step step   step step     step step
   blog blog   blog blog     blog blog
          \      |      /
           \     |     /
        Cluster 4 (Conceitos)
         /blog/diferenca-*
         /blog/propriedade-*
```

### 5.2 Regras de Linkagem Interna

1. **Paginas pilar (/marca, /patente, /desenho-industrial)**
   - Recebem links de TODOS os posts do seu cluster
   - Recebem links da home e do menu de navegacao
   - Linkam para todos os passos e posts do cluster
   - Minimo: 8 links internos por pagina pilar

2. **Paginas de passo (/marca/[step])**
   - Linkam para o pilar (hub) correspondente
   - Linkam para o passo anterior e o proximo (navegacao sequencial)
   - Linkam para posts de blog relacionados ao passo
   - Minimo: 5 links internos por pagina de passo

3. **Posts do blog (/blog/[slug])**
   - SEMPRE linkam para o pilar do cluster correspondente
   - Linkam para 2-3 posts relacionados do mesmo cluster
   - Linkam para posts de outros clusters quando relevante
   - Incluem CTA com link para /triagem ou pagina de passo relevante
   - Minimo: 4 links internos por post

4. **Home (/)**
   - Linka para os 3 pilares
   - Linka para /triagem
   - Linka para os 3-5 posts mais recentes/importantes
   - Linka para /ajuda

5. **Triagem (/triagem)**
   - Resultado da triagem linka para o pilar correto
   - Linka para /marca, /patente ou /desenho-industrial conforme resultado

### 5.3 Posicionamento de CTAs no Conteudo

| Posicao | Tipo de CTA | Destino |
|---------|-------------|---------|
| Apos introducao (acima da dobra) | Banner suave | /triagem ("Descubra qual registro voce precisa") |
| Apos secao "Quanto custa" | Botao inline | /marca ou /patente (passo relevante) |
| Sidebar (desktop) | Card fixo | /triagem ou /cadastro |
| Final do artigo | Box com CTA forte | /triagem + /cadastro |
| Dentro de listas/passos | Link contextual | Pagina de passo correspondente |

### 5.4 Implementacao de Breadcrumbs

```
Home > Registro de Marca > Busca Previa no INPI
Home > Blog > Como Registrar Marca de Roupa
Home > Central de Ajuda > Custos e Taxas
```

**Regras:**
- Breadcrumb visivel em todas as paginas (exceto home)
- Breadcrumb schema (BreadcrumbList) sincronizado com breadcrumb visivel
- Links clicaveis em todos os niveis exceto o atual
- Usar nomes curtos e descritivos (nao repetir titulo completo da pagina)

---

## 6. Templates de SEO On-Page

### 6.1 Formula de Title Tag por Tipo de Pagina

| Tipo | Formula | Exemplo | Limite |
|------|---------|---------|--------|
| Home | [Proposta de valor] \| [Marca] | Registre Marca, Patente e Desenho Industrial no INPI \| Registrar Certo | 50-60 chars |
| Hub de marca | Como Registrar [Tipo] no INPI: Guia Passo a Passo [Ano] \| [Marca] | Como Registrar Marca no INPI: Guia Passo a Passo 2026 \| Registrar Certo | 50-60 chars |
| Pagina de passo | [Acao]: [Detalhe do Passo] no INPI \| [Marca] | Busca Previa: Como Verificar se Sua Marca Ja Existe \| Registrar Certo | 50-60 chars |
| Blog post | [Keyword Principal] - [Complemento/Ano] \| [Marca] | Quanto Custa Registrar Marca no INPI em 2026 \| Registrar Certo | 50-60 chars |
| FAQ | [Topico] - Perguntas Frequentes \| [Marca] | Registro de Marca - Perguntas Frequentes \| Registrar Certo | 50-60 chars |
| Triagem | Descubra Qual Registro Voce Precisa no INPI \| [Marca] | Descubra Qual Registro Voce Precisa no INPI \| Registrar Certo | 50-60 chars |

### 6.2 Formula de Meta Description

| Tipo | Formula | Limite |
|------|---------|--------|
| Home | [O que fazemos] + [Para quem] + [Diferencial] + [CTA] | 150-160 chars |
| Hub | [Promessa] + [O que o guia cobre] + [Beneficio] | 150-160 chars |
| Passo | [O que o usuario vai aprender] + [Detalhe pratico] + [CTA] | 150-160 chars |
| Blog | [Resposta direta a intencao de busca] + [Dado credivel] + [CTA] | 150-160 chars |
| FAQ | [Promessa de resposta] + [Topicos cobertos] + [CTA] | 150-160 chars |

### 6.3 Hierarquia de Headings (H1, H2, H3)

**Pagina Pilar (ex: /marca):**
```
H1: Como Registrar Marca no INPI: Guia Completo Passo a Passo
  H2: O Que Voce Precisa Saber Antes de Comecar
    H3: Quem Pode Registrar uma Marca?
    H3: Quanto Custa o Registro?
    H3: Quanto Tempo Demora?
  H2: Passo 1: Faca a Busca Previa
    H3: Como Usar o Sistema de Busca do INPI
    H3: O Que Fazer se Encontrar Marca Semelhante
  H2: Passo 2: Escolha a Classe Nice Correta
    H3: O Que e a Classificacao Nice
    H3: Como Identificar Sua Classe
  H2: Passo 3: Prepare Seus Documentos
  H2: Passo 4: Preencha o Formulario e-Marcas
  H2: Passo 5: Gere e Pague a GRU
  H2: Passo 6: Acompanhe Seu Pedido
  H2: Perguntas Frequentes sobre Registro de Marca
    H3: [Pergunta 1 do PAA]
    H3: [Pergunta 2 do PAA]
```

**Post de Blog (ex: /blog/quanto-custa-registrar-marca-inpi):**
```
H1: Quanto Custa Registrar uma Marca no INPI em 2026?
  H2: Resumo dos Custos (tabela para featured snippet)
  H2: Taxa de Deposito (GRU)
    H3: Valor para Pessoa Fisica e MEI
    H3: Valor para Empresas
  H2: Taxa de Concessao
  H2: Custos Adicionais Possiveis
    H3: Oposicao e Recurso
    H3: Renovacao
  H2: Como Pagar a GRU do INPI
  H2: Vale a Pena Registrar Marca Sozinho?
  H2: Perguntas Frequentes
```

**Regras de headings:**
- Exatamente 1 H1 por pagina
- H1 inclui a keyword principal
- H2s cobrem subtopicos e perguntas do "People Also Ask"
- H3s detalham os H2s
- Nunca pular niveis (H1 > H3 sem H2)
- Usar numeros e dados nos headings quando possivel

### 6.4 Otimizacao de Imagens

| Aspecto | Regra |
|---------|-------|
| Formato | WebP como padrao, AVIF onde suportado, PNG como fallback |
| Tamanho maximo | 100KB para imagens inline, 200KB para hero images |
| Dimensoes | Responsivas com srcset (320w, 640w, 1024w, 1280w) |
| Alt text | Descritivo em portugues (ver secao 3.8) |
| Nomeacao do arquivo | kebab-case descritivo: `busca-previa-marca-inpi.webp` |
| Lazy loading | `loading="lazy"` para todas exceto LCP (hero image) |
| LCP image | `loading="eager"` + `fetchpriority="high"` + preload |
| Aspect ratio | Sempre definir width/height no HTML para evitar CLS |

### 6.5 Minimo de Links Internos por Tipo de Pagina

| Tipo de pagina | Links internos minimos | Destinos obrigatorios |
|----------------|----------------------|----------------------|
| Home | 10+ | 3 pilares + triagem + blog recente |
| Pilar (hub) | 8+ | Todos os passos + 3 posts do cluster + triagem |
| Passo | 5+ | Hub pilar + passo anterior + proximo + 1 post blog |
| Blog post | 4+ | Hub pilar do cluster + 2 posts relacionados + triagem/CTA |
| FAQ | 6+ | 3 pilares + triagem + posts mais relevantes |
| Triagem | 3+ | 3 pilares (como resultado) |

### 6.6 Checklist Final de SEO On-Page (para cada pagina)

```
PRE-PUBLICACAO
- [ ] Title tag: 50-60 chars, keyword principal inclusa
- [ ] Meta description: 150-160 chars, CTA incluso
- [ ] Canonical URL: self-referencing, URL absoluta
- [ ] H1 unico com keyword principal
- [ ] H2-H3 em hierarquia logica
- [ ] Keyword principal nos primeiros 100 palavras
- [ ] Links internos: minimo atingido (ver tabela)
- [ ] Links externos: 1-2 para fontes autoritativas (INPI, legislacao)
- [ ] Imagens: alt text, compressao, formato WebP
- [ ] Schema JSON-LD: tipo correto implementado
- [ ] Open Graph tags: title, description, image
- [ ] Twitter Card tags
- [ ] Breadcrumb: visivel + schema
- [ ] URL: limpa, descritiva, sem acentos
- [ ] Mobile: layout responsivo verificado
- [ ] Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Rich Results Test: sem erros

POS-PUBLICACAO
- [ ] Pagina aparece no sitemap XML
- [ ] URL submetida via Search Console (Inspecionar URL > Solicitar indexacao)
- [ ] Links internos de paginas existentes apontam para nova pagina
- [ ] Monitoramento de posicao configurado para keywords alvo
```

---

## Apendice A: Palavras-chave Completas por Prioridade

### Prioridade Critica (publicar primeiro)

| Keyword | Volume Est. | KD Est. | Cluster |
|---------|-------------|---------|---------|
| como registrar marca no INPI | 6.600 | 45 | Marca |
| quanto custa registrar marca no INPI | 2.400 | 35 | Marca |
| diferenca entre marca e patente | 2.400 | 25 | Conceitos |
| quanto tempo demora registro de marca | 1.900 | 30 | Marca |
| como registrar patente no INPI | 3.600 | 50 | Patente |
| quanto custa patentear uma invencao | 1.800 | 35 | Patente |
| como saber se uma marca ja existe | 1.600 | 30 | Marca |
| o que e propriedade industrial | 1.300 | 20 | Conceitos |

### Prioridade Alta

| Keyword | Volume Est. | KD Est. | Cluster |
|---------|-------------|---------|---------|
| como registrar marca de roupa | 1.300 | 25 | Marca |
| diferenca entre patente de invencao e modelo de utilidade | 1.200 | 30 | Patente |
| pessoa fisica pode registrar marca | 1.000 | 20 | Marca |
| como registrar desenho industrial no INPI | 880 | 35 | DI |
| como fazer busca de anterioridade | 880 | 30 | Patente |
| como registrar marca de alimento | 880 | 25 | Marca |
| como acompanhar pedido de marca no INPI | 720 | 20 | Marca |
| como escolher classe Nice | 720 | 25 | Marca |
| o que e desenho industrial | 720 | 20 | DI |

### Prioridade Media

| Keyword | Volume Est. | KD Est. | Cluster |
|---------|-------------|---------|---------|
| o que e classe Nice | 590 | 15 | Marca |
| diferenca entre desenho industrial e patente | 590 | 20 | DI |
| o que sao reivindicacoes de patente | 590 | 30 | Patente |
| como preencher formulario e-Marcas | 480 | 20 | Marca |
| relatorio descritivo de patente | 480 | 35 | Patente |
| o que e oposicao de marca | 480 | 20 | Marca |
| tipos de protecao no INPI | 390 | 15 | Conceitos |
| como pagar GRU do INPI | 390 | 15 | Marca |
| sigilo antes do deposito de patente | 320 | 25 | Patente |
| como renovar marca no INPI | 320 | 20 | Marca |
| quando usar desenho industrial | 260 | 15 | DI |

---

## Apendice B: Oportunidades de Featured Snippet

Palavras-chave onde a estrutura de conteudo pode capturar featured snippets:

| Keyword | Tipo de Snippet Alvo | Formato Recomendado |
|---------|---------------------|---------------------|
| quanto custa registrar marca no INPI | Tabela | Tabela com valores por tipo (PF, MEI, empresa) |
| quanto tempo demora registro de marca | Paragrafo | Resposta direta em 40-60 palavras |
| diferenca entre marca e patente | Tabela | Tabela comparativa lado a lado |
| diferenca entre patente e desenho industrial | Tabela | Tabela comparativa |
| pessoa fisica pode registrar marca | Paragrafo | Resposta direta "Sim, ..." |
| o que e classe Nice | Paragrafo | Definicao concisa em 40-50 palavras |
| o que e propriedade industrial | Paragrafo | Definicao + lista de tipos |
| como registrar marca no INPI | Lista ordenada | Lista de 6-8 passos numerados |
| como registrar patente no INPI | Lista ordenada | Lista de 5-7 passos numerados |

**Estrategia para captura:**
1. Responder a pergunta de forma direta nos primeiros 50 palavras abaixo do H2
2. Usar a keyword exata no H2 em formato de pergunta
3. Para tabelas: usar `<table>` semantico com headers claros
4. Para listas: usar `<ol>` com passos concisos (maximo 8 itens)
5. Para paragrafos: manter entre 40-60 palavras, linguagem objetiva
