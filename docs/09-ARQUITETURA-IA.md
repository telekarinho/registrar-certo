# Arquitetura de IA --- Registrar Certo

## Visao Geral

A camada de IA do Registrar Certo opera em **5 niveis complementares** que, juntos, transformam um processo burocratico e intimidador em uma jornada simples e acessivel.

**Principio fundamental:** A IA NUNCA emite pareceres juridicos definitivos. Ela classifica, orienta, resume e educa de forma segura. Toda interacao inclui disclaimers e a opcao de consultar um especialista humano.

**Stack de IA:**
- Provider primario: OpenAI API (GPT-4o-mini para tarefas rotineiras, GPT-4o para casos complexos)
- Provider secundario (fallback): Anthropic Claude API
- Cache: Redis para consultas repetidas
- Armazenamento de prompts: Banco de dados com versionamento e suporte a testes A/B

```
Usuario
  |
  v
[Nivel 1: Triagem Inteligente] --> Classificacao do tipo de protecao
  |
  v
[Nivel 2: Explicador Simplificado] --> Termos tecnicos em linguagem simples
  |
  v
[Nivel 3: Gerador de Checklist] --> Lista personalizada de documentos/passos
  |
  v
[Nivel 4: Gerador de Resumo Final] --> Resumo completo + PDF
  |
  v
[Nivel 5: Motor de Conversao] --> Personalizacao de marketing e reengajamento
```

---

## Nivel 1 --- Triagem Inteligente

### Objetivo

Determinar automaticamente se o caso do usuario se enquadra em **MARCA**, **PATENTE**, **DESENHO_INDUSTRIAL** ou **NENHUM** (caso nao se encaixe em nenhuma categoria do INPI).

### Fluxo de Decisao

```
Entrada: Respostas do wizard (6-7 perguntas)
    |
    v
[Motor de Regras com Pontuacao]
    |
    +--> Confianca > 0.8 --> Resultado direto
    |
    +--> Confianca 0.5 - 0.8 --> Resultado com ressalva + sugestao de revisao
    |
    +--> Confianca < 0.5 --> Consulta ao LLM para desambiguacao
              |
              +--> LLM confiante --> Resultado com ressalva
              |
              +--> LLM incerto --> Sugerir consulta com especialista
```

### Motor de Regras (Primeira Camada)

O motor de regras processa as respostas do wizard atribuindo pontuacao a cada tipo de protecao. Cada resposta contribui com peso para uma ou mais categorias.

```typescript
interface TriageInput {
  q1_what: 'nome_logo' | 'invencao' | 'design_forma' | 'outro';
  q2_purpose: 'identificar_produto' | 'resolver_problema' | 'aparencia' | 'outro';
  q3_novelty: 'sim_novo' | 'nao_existe' | 'nao_sei';
  q4_category: 'produto' | 'servico' | 'processo' | 'objeto';
  q5_visual: 'sim_elemento_visual' | 'nao_apenas_funcional';
  q6_already_public: 'sim' | 'nao' | 'nao_sei';
  q7_business_type: 'pessoa_fisica' | 'mei' | 'empresa' | 'startup';
}

interface TriageOutput {
  classification: 'MARCA' | 'PATENTE' | 'DESENHO_INDUSTRIAL' | 'NENHUM';
  confidence: number; // 0.0 a 1.0
  explanation: string;
  suggestExpert: boolean;
  alternativeClassifications: Array<{
    type: string;
    confidence: number;
  }>;
}
```

**Tabela de pontuacao:**

| Resposta | MARCA | PATENTE | DESENHO_INDUSTRIAL |
|----------|-------|---------|--------------------|
| q1 = nome_logo | +3 | 0 | 0 |
| q1 = invencao | 0 | +3 | 0 |
| q1 = design_forma | 0 | 0 | +3 |
| q2 = identificar_produto | +2 | 0 | 0 |
| q2 = resolver_problema | 0 | +3 | 0 |
| q2 = aparencia | 0 | 0 | +2 |
| q3 = sim_novo | 0 | +2 | +1 |
| q3 = nao_existe | +1 | 0 | 0 |
| q4 = produto | +1 | +1 | +1 |
| q4 = servico | +2 | 0 | 0 |
| q4 = processo | 0 | +2 | 0 |
| q4 = objeto | 0 | +1 | +2 |
| q5 = sim_elemento_visual | +1 | 0 | +2 |
| q5 = nao_apenas_funcional | 0 | +2 | 0 |

**Calculo de confianca:** `confianca = pontuacao_vencedor / (pontuacao_total * fator_normalizacao)`

### Prompt de Classificacao (Fallback LLM)

```
SISTEMA:
Voce e um assistente especializado em propriedade intelectual brasileira.
Sua funcao e classificar o caso do usuario em uma das categorias do INPI.

IMPORTANTE:
- Voce NAO e advogado e NAO emite pareceres juridicos.
- Voce apenas classifica com base nas informacoes fornecidas.
- Sempre indique o nivel de confianca da sua classificacao.
- Na duvida, sugira que o usuario consulte um especialista.

CATEGORIAS POSSIVEIS:
1. MARCA - Nome, logo, simbolo ou combinacao que identifica produtos ou servicos
   no mercado. Exemplos: nome da empresa, logo, slogan.
2. PATENTE - Invencao tecnica nova que resolve um problema de forma inovadora.
   Pode ser patente de invencao (PI) ou modelo de utilidade (MU).
   Exemplos: novo mecanismo, formula, processo industrial.
3. DESENHO_INDUSTRIAL - Forma plastica ornamental de um objeto ou padrao
   ornamental que possa ser aplicado a um produto. Protege a APARENCIA,
   nao a funcao. Exemplos: design de movel, formato de embalagem.
4. NENHUM - O caso nao se encaixa em nenhuma categoria acima.

RESPOSTAS DO USUARIO:
{respostas_formatadas}

INSTRUCAO:
Analise as respostas acima e retorne um JSON com:
{
  "classificacao": "MARCA" | "PATENTE" | "DESENHO_INDUSTRIAL" | "NENHUM",
  "confianca": 0.0 a 1.0,
  "explicacao": "Explicacao simples de por que esta categoria foi escolhida",
  "motivos": ["motivo 1", "motivo 2"],
  "ressalvas": ["ressalva 1 se houver"],
  "sugerir_especialista": true/false
}
```

### Limiares de Confianca

| Faixa | Acao | Mensagem ao Usuario |
|-------|------|---------------------|
| > 0.8 | Resultado direto | "Com base nas suas respostas, seu caso se encaixa em **{tipo}**." |
| 0.5 - 0.8 | Resultado com ressalva | "Suas respostas indicam que pode ser um caso de **{tipo}**, mas recomendamos revisar com atencao os detalhes antes de prosseguir." |
| < 0.5 | Sugerir especialista | "Seu caso tem caracteristicas que podem se encaixar em mais de uma categoria. Recomendamos conversar com um especialista para ter mais seguranca." |

---

## Nivel 2 --- Explicador Simplificado

### Objetivo

Reescrever termos juridicos e tecnicos do INPI em portugues ultra-simples, acessivel a qualquer pessoa sem conhecimento previo de propriedade intelectual.

### Glossario Pre-construido

O glossario contem mais de 50 termos com explicacoes simples. Ele e consultado ANTES de qualquer chamada ao LLM, reduzindo custos e latencia.

```typescript
interface GlossaryEntry {
  term: string;
  simple: string;
  context?: string; // quando usar esta explicacao
  relatedTerms?: string[];
}
```

| Termo Tecnico | Explicacao Simples |
|---------------|-------------------|
| Reivindicacoes | A parte que diz exatamente o que voce quer proteger na sua invencao |
| Anterioridade | Verificar se alguem ja registrou algo parecido antes de voce |
| Classe Nice | A categoria do produto ou servico que a marca identifica (sao 45 no total) |
| GRU | A taxa que voce paga ao governo para fazer o pedido no INPI |
| Exigencia | Quando o INPI pede que voce corrija ou complete algo no seu pedido |
| Oposicao | Quando alguem contesta seu pedido de registro porque acha que prejudica a marca dele |
| Registro de marca | O documento oficial que prova que aquele nome ou logo e seu por 10 anos |
| Patente de invencao (PI) | Protecao para algo totalmente novo que resolve um problema tecnico --- dura 20 anos |
| Modelo de utilidade (MU) | Protecao para uma melhoria pratica em algo que ja existe --- dura 15 anos |
| Desenho industrial (DI) | Protecao para a aparencia visual de um produto, nao para como ele funciona |
| Depositante | A pessoa ou empresa que faz o pedido de registro no INPI |
| Procuracao | Documento que autoriza outra pessoa a cuidar do seu pedido no INPI |
| Deferimento | Quando o INPI aprova seu pedido --- boa noticia! |
| Indeferimento | Quando o INPI rejeita seu pedido --- mas da para recorrer |
| Recurso | Quando voce nao concorda com a decisao do INPI e pede para revisarem |
| Nulidade | Quando um registro e cancelado porque nao deveria ter sido concedido |
| Caducidade | Quando uma marca perde o registro porque o dono nao usou por 5 anos seguidos |
| Cessao | Transferir a propriedade de uma marca ou patente para outra pessoa ou empresa |
| Licenciamento | Dar permissao para outra pessoa usar sua marca ou patente (como um aluguel) |
| Apostilamento | Fazer pequenas alteracoes nos dados do registro, como endereco ou nome |
| Busca previa | Pesquisa no banco de dados do INPI para ver se ja existe algo parecido |
| Especificacao | A descricao detalhada dos produtos ou servicos que a marca vai identificar |
| Natureza da marca | Se a marca e de produto, de servico, coletiva ou de certificacao |
| Apresentacao da marca | Como a marca aparece: so palavra, so figura, as duas juntas, ou em 3D |
| Marca nominativa | Marca formada apenas por palavras, sem desenho |
| Marca figurativa | Marca formada apenas por imagem ou simbolo, sem palavra |
| Marca mista | Marca que combina palavra e imagem juntas |
| Marca tridimensional | Marca que e a propria forma do produto ou da embalagem |
| Relatorio descritivo | O texto que explica em detalhes como sua invencao funciona |
| Desenhos (patente) | As ilustracoes tecnicas que mostram sua invencao visualmente |
| Resumo (patente) | Um texto curto que resume o que sua invencao faz |
| Quadro reivindicatorio | A lista organizada de tudo que voce quer proteger na invencao |
| Estado da tecnica | Tudo que ja existe e e conhecido publicamente na area da sua invencao |
| Atividade inventiva | O quanto sua invencao e diferente e nao obvia comparada ao que ja existe |
| Aplicacao industrial | Se sua invencao pode ser fabricada ou usada na industria |
| Prioridade unionista | Direito de usar a data de um pedido feito em outro pais como se fosse a data do pedido brasileiro |
| PCT | Tratado internacional que facilita pedir patente em varios paises ao mesmo tempo |
| Protocolo de Madri | Tratado que facilita registrar marca em varios paises ao mesmo tempo |
| Exame formal | Primeira analise do INPI, verificando se a documentacao esta completa |
| Exame tecnico | Analise mais profunda onde o INPI avalia se voce realmente tem direito ao registro |
| Publicacao na RPI | Quando seu pedido aparece na Revista do INPI, avisando todo mundo |
| RPI | Revista da Propriedade Industrial --- o "jornal oficial" do INPI publicado toda terca |
| Despacho | A decisao ou comunicacao oficial do INPI sobre seu pedido |
| Sobrestamento | Quando o INPI pausa a analise do seu pedido temporariamente |
| Concessao | O momento em que o INPI oficialmente te da o registro ou patente |
| Vigencia | O periodo durante o qual seu registro ou patente esta valido |
| Retribuicao quinquenal | Taxa que voce paga a cada 5 anos para manter o registro de desenho industrial ativo |
| Anuidade (patente) | Taxa anual que voce paga para manter a patente ativa |
| Carta-patente | O documento oficial que comprova que voce e dono da patente |
| Certificado de registro | O documento oficial que comprova que voce e dono da marca |
| Cumprimento de exigencia | Responder ao INPI com as correcoes ou documentos que ele pediu |
| Prazo | O tempo limite que voce tem para responder ao INPI (geralmente 60 dias) |
| Peticao | Qualquer solicitacao formal que voce faz ao INPI |

### Componente Tooltip

O componente de tooltip funciona em cascata:

1. Verifica o glossario local (instantaneo, custo zero)
2. Se nao encontrar, consulta o cache Redis (rapido, custo zero)
3. Se nao encontrar, chama o LLM para gerar explicacao simples (mais lento, custo por token)
4. Salva o resultado no cache para proximas consultas

```typescript
async function getSimpleExplanation(term: string): Promise<string> {
  // 1. Glossario local
  const glossaryEntry = glossary.find(t => t.term === term);
  if (glossaryEntry) return glossaryEntry.simple;

  // 2. Cache Redis
  const cached = await redis.get(`glossary:${normalize(term)}`);
  if (cached) return cached;

  // 3. LLM
  const explanation = await callLLM({
    prompt: SIMPLIFICATION_PROMPT,
    variables: { term },
    model: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 150,
  });

  // 4. Salvar no cache (expira em 7 dias)
  await redis.set(`glossary:${normalize(term)}`, explanation, 'EX', 604800);

  return explanation;
}
```

### Prompt de Simplificacao Dinamica

```
SISTEMA:
Voce e um assistente que explica termos de propriedade intelectual brasileira
em linguagem ultra-simples.

REGRAS:
- Use frases curtas (maximo 2 linhas).
- Imagine que esta explicando para alguem que nunca ouviu falar do INPI.
- Evite qualquer outro termo tecnico na explicacao.
- Se possivel, use uma analogia do dia a dia.
- NAO invente informacoes. Se nao souber, diga "Termo tecnico do INPI.
  Recomendamos consultar o site oficial do INPI para mais detalhes."

TERMO: {term}
CONTEXTO DE USO (se disponivel): {context}

Responda APENAS com a explicacao simples, sem introducao.
```

---

## Nivel 3 --- Gerador de Checklist

### Objetivo

Gerar checklists dinamicos e personalizados com base no tipo de protecao identificado e no perfil do usuario.

### Arquitetura

```
[Checklists Base por Tipo] --> [Motor de Personalizacao] --> [Checklist Final]
                                      ^
                                      |
                              [Perfil do Usuario]
                              - pessoa_fisica / juridica / MEI
                              - com/sem procurador
                              - primeira vez ou nao
                              - ja tem busca previa
                              - estado do Brasil
```

### Checklist Base --- MARCA (15 itens)

```typescript
const CHECKLIST_MARCA = [
  {
    id: 'marca_01',
    title: 'Definir o nome ou logo da marca',
    description: 'Ter claro qual nome, simbolo ou combinacao voce quer registrar.',
    required: true,
    helpText: 'Pode ser so o nome (nominativa), so o desenho (figurativa), ou os dois juntos (mista).',
    estimatedTime: '5 min',
    order: 1,
  },
  {
    id: 'marca_02',
    title: 'Fazer a busca previa no INPI',
    description: 'Pesquisar no banco de dados do INPI se ja existe marca igual ou parecida.',
    required: true,
    helpText: 'Acesse busca.inpi.gov.br e pesquise pelo nome. Verifique tambem variacoes e marcas semelhantes.',
    estimatedTime: '30 min',
    order: 2,
  },
  {
    id: 'marca_03',
    title: 'Identificar a classe Nice correta',
    description: 'Escolher a categoria (classe) dos produtos ou servicos que a marca identifica.',
    required: true,
    helpText: 'Sao 45 classes no total (34 de produtos e 11 de servicos). Uma marca pode ser registrada em mais de uma classe, mas cada uma gera uma taxa separada.',
    estimatedTime: '20 min',
    order: 3,
  },
  {
    id: 'marca_04',
    title: 'Escrever a especificacao de produtos/servicos',
    description: 'Descrever quais produtos ou servicos a marca vai identificar dentro da classe escolhida.',
    required: true,
    helpText: 'Seja especifico. Em vez de "roupas", escreva "camisetas, calcas jeans e jaquetas de couro".',
    estimatedTime: '15 min',
    order: 4,
  },
  {
    id: 'marca_05',
    title: 'Definir a natureza da marca',
    description: 'Escolher se a marca e de produto, servico, coletiva ou de certificacao.',
    required: true,
    helpText: 'A maioria das marcas e de produto ou de servico. Marcas coletivas e de certificacao sao para associacoes e entidades.',
    estimatedTime: '5 min',
    order: 5,
  },
  {
    id: 'marca_06',
    title: 'Definir a apresentacao da marca',
    description: 'Escolher como a marca sera apresentada: nominativa, figurativa, mista ou tridimensional.',
    required: true,
    helpText: 'Nominativa = so palavras. Figurativa = so imagem. Mista = palavras + imagem. Tridimensional = forma 3D.',
    estimatedTime: '5 min',
    order: 6,
  },
  {
    id: 'marca_07',
    title: 'Preparar a imagem da marca (se figurativa ou mista)',
    description: 'Criar arquivo JPG ou PNG da marca nas dimensoes e resolucao exigidas pelo INPI.',
    required: false,
    conditionalOn: 'apresentacao !== "nominativa"',
    helpText: 'Formato JPEG ou PNG. Dimensao minima: 945x945 pixels. Fundo branco. Imagem nitida.',
    estimatedTime: '30 min',
    order: 7,
  },
  {
    id: 'marca_08',
    title: 'Reunir documentos pessoais do depositante',
    description: 'Separar CPF e RG (pessoa fisica) ou CNPJ e contrato social (pessoa juridica).',
    required: true,
    helpText: 'Pessoa fisica: CPF + RG. Pessoa juridica: CNPJ + contrato social ou ultima alteracao.',
    estimatedTime: '10 min',
    order: 8,
  },
  {
    id: 'marca_09',
    title: 'Criar cadastro no e-INPI',
    description: 'Fazer o cadastro no sistema eletronico do INPI para poder protocolar pedidos.',
    required: true,
    helpText: 'Acesse www.gov.br/inpi e clique em "Acesse o e-INPI". O cadastro e gratuito.',
    estimatedTime: '15 min',
    order: 9,
  },
  {
    id: 'marca_10',
    title: 'Emitir e pagar a GRU (taxa do governo)',
    description: 'Gerar o boleto da taxa federal e efetuar o pagamento antes de protocolar o pedido.',
    required: true,
    helpText: 'O valor da taxa depende do tipo de depositante. Pessoa fisica, MEI e microempresa tem desconto. A taxa basica para registro de marca custa a partir de R$ 142,00 (com desconto) ou R$ 355,00 (sem desconto). Valores sujeitos a atualizacao pelo INPI.',
    estimatedTime: '10 min',
    order: 10,
  },
  {
    id: 'marca_11',
    title: 'Preparar procuracao (se usar representante)',
    description: 'Assinar procuracao caso outra pessoa va protocolar o pedido em seu nome.',
    required: false,
    conditionalOn: 'usaProcurador === true',
    helpText: 'Pode ser procuracao simples com firma reconhecida. O INPI disponibiliza modelo no site.',
    estimatedTime: '20 min',
    order: 11,
  },
  {
    id: 'marca_12',
    title: 'Preencher o formulario eletronico no e-INPI',
    description: 'Acessar o sistema e-INPI e preencher todos os campos do formulario de pedido de registro.',
    required: true,
    helpText: 'Tenha todos os documentos anteriores em maos. O formulario pede dados do depositante, da marca e dos produtos/servicos.',
    estimatedTime: '30 min',
    order: 12,
  },
  {
    id: 'marca_13',
    title: 'Protocolar o pedido e guardar o numero',
    description: 'Enviar o pedido e anotar o numero do protocolo para acompanhamento.',
    required: true,
    helpText: 'Apos protocolar, voce recebe um numero de processo. Guarde-o com cuidado --- e com ele que voce acompanha tudo.',
    estimatedTime: '5 min',
    order: 13,
  },
  {
    id: 'marca_14',
    title: 'Acompanhar a publicacao na RPI',
    description: 'Monitorar a Revista da Propriedade Industrial toda semana para ver atualizacoes do seu pedido.',
    required: true,
    helpText: 'A RPI e publicada toda terca-feira. Voce pode consultar pelo numero do processo no site do INPI.',
    estimatedTime: '5 min/semana',
    order: 14,
  },
  {
    id: 'marca_15',
    title: 'Ficar atento a prazos de exigencias',
    description: 'Caso o INPI faca alguma exigencia, voce tem 60 dias para responder. Nao perca o prazo.',
    required: true,
    helpText: 'Se perder o prazo, o pedido pode ser arquivado. Configure lembretes para nao esquecer.',
    estimatedTime: 'Continuo',
    order: 15,
  },
];
```

### Checklist Base --- PATENTE (20 itens)

```typescript
const CHECKLIST_PATENTE = [
  {
    id: 'pat_01',
    title: 'Definir se e Patente de Invencao (PI) ou Modelo de Utilidade (MU)',
    description: 'Entender se sua criacao e algo totalmente novo (PI) ou uma melhoria pratica em algo existente (MU).',
    required: true,
    helpText: 'PI = invencao nova e com atividade inventiva. MU = melhoria funcional em objeto existente. PI dura 20 anos; MU dura 15 anos.',
    estimatedTime: '15 min',
    order: 1,
  },
  {
    id: 'pat_02',
    title: 'Verificar se a invencao e patenteavel',
    description: 'Confirmar que a invencao atende os 3 requisitos: novidade, atividade inventiva e aplicacao industrial.',
    required: true,
    helpText: 'Nao sao patenteaveis: ideias abstratas, metodos de negocio, obras artisticas, programas de computador em si, seres vivos (exceto microorganismos transgenicos).',
    estimatedTime: '20 min',
    order: 2,
  },
  {
    id: 'pat_03',
    title: 'Fazer busca de anterioridade',
    description: 'Pesquisar no banco de dados do INPI e em bases internacionais se ja existe patente semelhante.',
    required: true,
    helpText: 'Pesquise no INPI (busca.inpi.gov.br), Google Patents, Espacenet (EPO) e WIPO. Anote patentes semelhantes encontradas.',
    estimatedTime: '2-4 horas',
    order: 3,
  },
  {
    id: 'pat_04',
    title: 'Verificar se a invencao ja foi divulgada publicamente',
    description: 'Se voce ja mostrou, publicou ou vendeu a invencao, o pedido pode ser prejudicado.',
    required: true,
    helpText: 'No Brasil, existe um "periodo de graca" de 12 meses. Se divulgou ha menos de 12 meses, ainda pode pedir. Mas o ideal e pedir ANTES de divulgar.',
    estimatedTime: '10 min',
    order: 4,
  },
  {
    id: 'pat_05',
    title: 'Redigir o relatorio descritivo',
    description: 'Escrever o texto tecnico que descreve a invencao em detalhes suficientes para que alguem da area consiga reproduzi-la.',
    required: true,
    helpText: 'Deve conter: campo da invencao, estado da tecnica, problema resolvido, descricao detalhada, vantagens, exemplos de realizacao.',
    estimatedTime: '4-8 horas',
    order: 5,
  },
  {
    id: 'pat_06',
    title: 'Redigir as reivindicacoes',
    description: 'Escrever de forma clara e precisa o que exatamente voce quer proteger.',
    required: true,
    helpText: 'As reivindicacoes definem o escopo da protecao. Devem ser claras, concisas e fundamentadas no relatorio descritivo. Comece com reivindicacoes independentes, depois adicione as dependentes.',
    estimatedTime: '2-4 horas',
    order: 6,
  },
  {
    id: 'pat_07',
    title: 'Elaborar os desenhos tecnicos',
    description: 'Criar ilustracoes tecnicas que mostram a invencao de diferentes angulos e detalhes.',
    required: false,
    helpText: 'Para PI: opcionais, mas altamente recomendados. Para MU: obrigatorios. Devem ser em preto e branco, sem sombras artisticas, com numeracao das partes.',
    estimatedTime: '2-6 horas',
    order: 7,
  },
  {
    id: 'pat_08',
    title: 'Escrever o resumo da invencao',
    description: 'Redigir um texto de ate 200 palavras que resume o essencial da invencao.',
    required: true,
    helpText: 'O resumo deve conter: area tecnica, problema resolvido, solucao proposta e principal aplicacao. Sera publicado na RPI.',
    estimatedTime: '30 min',
    order: 8,
  },
  {
    id: 'pat_09',
    title: 'Preparar o quadro reivindicatorio',
    description: 'Organizar as reivindicacoes em formato adequado (independentes e dependentes).',
    required: true,
    helpText: 'Reivindicacao independente: define a invencao completa. Reivindicacao dependente: detalha aspectos especificos. Cada reivindicacao deve ser uma frase unica.',
    estimatedTime: '1-2 horas',
    order: 9,
  },
  {
    id: 'pat_10',
    title: 'Reunir documentos do inventor e do depositante',
    description: 'Separar documentos pessoais de todos os inventores e do depositante.',
    required: true,
    helpText: 'CPF de todos os inventores. CNPJ se o depositante for empresa. Se o inventor nao e o depositante, e necessaria uma cessao de direitos.',
    estimatedTime: '15 min',
    order: 10,
  },
  {
    id: 'pat_11',
    title: 'Preparar documento de cessao de direitos (se aplicavel)',
    description: 'Se o inventor e o depositante sao pessoas diferentes, formalizar a transferencia de direitos.',
    required: false,
    conditionalOn: 'inventor !== depositante',
    helpText: 'Comum quando o inventor e funcionario de empresa. A cessao deve ser assinada por ambas as partes.',
    estimatedTime: '30 min',
    order: 11,
  },
  {
    id: 'pat_12',
    title: 'Preparar declaracao de inventor (se aplicavel)',
    description: 'Listar todos os inventores e suas contribuicoes para a invencao.',
    required: true,
    helpText: 'Todos os inventores devem ser listados. Omitir um inventor pode invalidar a patente futuramente.',
    estimatedTime: '15 min',
    order: 12,
  },
  {
    id: 'pat_13',
    title: 'Criar cadastro no e-INPI',
    description: 'Fazer o cadastro no sistema eletronico do INPI.',
    required: true,
    helpText: 'Acesse www.gov.br/inpi e clique em "Acesse o e-INPI". O cadastro e gratuito.',
    estimatedTime: '15 min',
    order: 13,
  },
  {
    id: 'pat_14',
    title: 'Emitir e pagar a GRU de deposito',
    description: 'Gerar e pagar a taxa de deposito do pedido de patente.',
    required: true,
    helpText: 'O valor depende do tipo (PI ou MU) e se ha desconto (pessoa fisica, MEI, microempresa, instituicao de ensino). Deposito de PI custa a partir de R$ 175,00 (com desconto). Valores sujeitos a atualizacao.',
    estimatedTime: '10 min',
    order: 14,
  },
  {
    id: 'pat_15',
    title: 'Protocolar o pedido no e-INPI',
    description: 'Fazer o upload de todos os documentos e submeter o pedido pelo sistema eletronico.',
    required: true,
    helpText: 'Antes de protocolar, revise todos os documentos. Apos o deposito, alteracoes sao muito limitadas.',
    estimatedTime: '30 min',
    order: 15,
  },
  {
    id: 'pat_16',
    title: 'Pedir exame tecnico (em ate 36 meses)',
    description: 'Apos o deposito, voce tem ate 36 meses para pedir que o INPI analise tecnicamente o pedido.',
    required: true,
    helpText: 'O deposito sozinho nao inicia a analise. Voce precisa pedir o exame e pagar outra taxa. Se nao pedir em 36 meses, o pedido e arquivado.',
    estimatedTime: '15 min',
    order: 16,
  },
  {
    id: 'pat_17',
    title: 'Pagar anuidades a partir do 3o ano',
    description: 'A partir do terceiro ano do deposito, voce paga uma anuidade para manter o pedido ativo.',
    required: true,
    helpText: 'A anuidade e paga no inicio de cada ano contado a partir da data do deposito. O nao pagamento pode levar ao arquivamento.',
    estimatedTime: '10 min/ano',
    order: 17,
  },
  {
    id: 'pat_18',
    title: 'Acompanhar publicacoes na RPI',
    description: 'Monitorar semanalmente a Revista da Propriedade Industrial.',
    required: true,
    helpText: 'O INPI publica despachos sobre seu pedido na RPI. Fique atento a exigencias e prazos.',
    estimatedTime: '10 min/semana',
    order: 18,
  },
  {
    id: 'pat_19',
    title: 'Responder exigencias do INPI (se houver)',
    description: 'Caso o examinador faca exigencias, prepare respostas tecnicas dentro do prazo.',
    required: false,
    helpText: 'O prazo geralmente e de 90 dias. Responda de forma tecnica e fundamentada.',
    estimatedTime: '4-8 horas',
    order: 19,
  },
  {
    id: 'pat_20',
    title: 'Pagar taxa de concessao (se aprovada)',
    description: 'Apos a aprovacao, pagar a taxa de expedicao da carta-patente.',
    required: true,
    helpText: 'O INPI concede a patente apos o pagamento. Voce recebe a carta-patente oficial.',
    estimatedTime: '10 min',
    order: 20,
  },
];
```

### Checklist Base --- DESENHO INDUSTRIAL (10 itens)

```typescript
const CHECKLIST_DI = [
  {
    id: 'di_01',
    title: 'Confirmar que e um desenho industrial (e nao patente ou marca)',
    description: 'Verificar que voce quer proteger a APARENCIA do produto, nao a funcao dele.',
    required: true,
    helpText: 'DI protege a forma visual/ornamental. Se voce quer proteger como o produto funciona, e patente. Se quer proteger um nome ou logo, e marca.',
    estimatedTime: '10 min',
    order: 1,
  },
  {
    id: 'di_02',
    title: 'Verificar se o design e original',
    description: 'Confirmar que o design e novo e nao e copia de algo ja existente.',
    required: true,
    helpText: 'Pesquise produtos similares no mercado e no banco de dados do INPI. O design precisa ter aparencia propria e distinta.',
    estimatedTime: '1-2 horas',
    order: 2,
  },
  {
    id: 'di_03',
    title: 'Preparar as imagens/desenhos tecnicos do produto',
    description: 'Criar representacoes visuais de alta qualidade mostrando o design de diferentes angulos.',
    required: true,
    helpText: 'Necessarias: vista frontal, posterior, laterais, superior e inferior. Podem ser fotos ou desenhos tecnicos. Fundo neutro, sem sombras.',
    estimatedTime: '2-4 horas',
    order: 3,
  },
  {
    id: 'di_04',
    title: 'Redigir o campo de aplicacao',
    description: 'Descrever em qual tipo de produto o desenho sera aplicado.',
    required: true,
    helpText: 'Exemplo: "Configuracao aplicada em cadeira" ou "Padrao ornamental aplicado em tecido". Seja especifico.',
    estimatedTime: '15 min',
    order: 4,
  },
  {
    id: 'di_05',
    title: 'Redigir o relatorio descritivo (opcional, mas recomendado)',
    description: 'Texto descrevendo as caracteristicas visuais do design.',
    required: false,
    helpText: 'Nao e obrigatorio para DI, mas ajuda a delimitar o que voce quer proteger. Descreva as formas, linhas e detalhes ornamentais.',
    estimatedTime: '30 min',
    order: 5,
  },
  {
    id: 'di_06',
    title: 'Reunir documentos do depositante',
    description: 'Separar CPF/RG (pessoa fisica) ou CNPJ/contrato social (pessoa juridica).',
    required: true,
    helpText: 'Se o criador do design nao e o depositante, e necessario um documento de cessao de direitos.',
    estimatedTime: '10 min',
    order: 6,
  },
  {
    id: 'di_07',
    title: 'Criar cadastro no e-INPI',
    description: 'Fazer o cadastro no sistema eletronico do INPI.',
    required: true,
    helpText: 'Acesse www.gov.br/inpi e clique em "Acesse o e-INPI". O cadastro e gratuito.',
    estimatedTime: '15 min',
    order: 7,
  },
  {
    id: 'di_08',
    title: 'Emitir e pagar a GRU de deposito',
    description: 'Gerar e pagar a taxa de deposito de desenho industrial.',
    required: true,
    helpText: 'DI permite ate 20 variacoes do mesmo design em um unico pedido (pedido multiplo). O valor da taxa varia conforme o numero de variacoes. Valores sujeitos a atualizacao pelo INPI.',
    estimatedTime: '10 min',
    order: 8,
  },
  {
    id: 'di_09',
    title: 'Protocolar o pedido no e-INPI',
    description: 'Fazer upload das imagens e documentos e submeter o pedido.',
    required: true,
    helpText: 'DI tem exame formal mais rapido que patente. Se a documentacao estiver correta, o registro pode sair em meses.',
    estimatedTime: '30 min',
    order: 9,
  },
  {
    id: 'di_10',
    title: 'Pagar retribuicoes quinquenais para manter o registro',
    description: 'A cada 5 anos, pagar a taxa de manutencao para manter o registro ativo.',
    required: true,
    helpText: 'O registro de DI dura 10 anos (prorrogavel por mais 3 periodos de 5 anos, totalizando 25 anos). O pagamento deve ser feito no ultimo ano de cada quinquenio.',
    estimatedTime: '10 min a cada 5 anos',
    order: 10,
  },
];
```

### Personalizacao por IA

A IA ajusta o checklist base com base no perfil do usuario:

```typescript
interface UserProfile {
  tipoPessoa: 'fisica' | 'juridica' | 'mei';
  usaProcurador: boolean;
  primeiraVez: boolean;
  jaFezBuscaPrevia: boolean;
  estado: string;
  tipoProtecao: 'MARCA' | 'PATENTE' | 'DESENHO_INDUSTRIAL';
}

function personalizeChecklist(
  baseChecklist: ChecklistItem[],
  profile: UserProfile
): ChecklistItem[] {
  let checklist = [...baseChecklist];

  // Remover itens condicionais nao aplicaveis
  checklist = checklist.filter(item => {
    if (item.conditionalOn) {
      return evaluateCondition(item.conditionalOn, profile);
    }
    return true;
  });

  // Adicionar itens extras conforme perfil
  if (profile.primeiraVez) {
    checklist.unshift({
      id: 'extra_01',
      title: 'Ler o guia basico do INPI para iniciantes',
      description: 'Como e sua primeira vez, recomendamos ler o guia oficial do INPI antes de comecar.',
      required: false,
      helpText: 'O INPI tem manuais gratuitos em seu site que explicam o passo a passo.',
      estimatedTime: '30 min',
      order: 0,
    });
  }

  if (profile.tipoPessoa === 'mei') {
    checklist.push({
      id: 'extra_02',
      title: 'Verificar se voce tem direito ao desconto de MEI na GRU',
      description: 'MEIs tem desconto de 60% nas taxas do INPI. Confirme que seu CCMEI esta ativo.',
      required: true,
      helpText: 'Para ter o desconto, voce precisa comprovar a condicao de MEI no momento do pagamento.',
      estimatedTime: '10 min',
      order: 9.5,
    });
  }

  if (profile.tipoPessoa === 'fisica') {
    checklist.push({
      id: 'extra_03',
      title: 'Verificar se voce tem direito ao desconto de pessoa fisica na GRU',
      description: 'Pessoas fisicas tem desconto de 60% nas taxas do INPI.',
      required: true,
      helpText: 'O desconto e automatico ao selecionar "pessoa fisica" no momento de gerar a GRU.',
      estimatedTime: '5 min',
      order: 9.5,
    });
  }

  return checklist.sort((a, b) => a.order - b.order);
}
```

---

## Nivel 4 --- Gerador de Resumo Final

### Objetivo

Gerar um resumo abrangente da jornada do usuario, cobrindo todos os aspectos de forma clara e acionavel.

### Saidas do Resumo

O gerador produz 6 tipos de saida diferentes:

#### 4.1 Resumo Simples (~200 palavras)

**Prompt:**

```
SISTEMA:
Voce e um assistente que resume processos de propriedade intelectual brasileira
em linguagem simples e acessivel.

REGRAS:
- Use linguagem clara, como se estivesse conversando com um amigo.
- Maximo 200 palavras.
- Nao use termos tecnicos sem explicar entre parenteses.
- Organize em paragrafos curtos.
- Inclua: o que o usuario quer proteger, que tipo de protecao, e os proximos passos.
- NAO de pareceres juridicos. Apenas resuma o que foi discutido.
- Termine com uma frase motivadora.

DADOS DA JORNADA DO USUARIO:
- Tipo de protecao identificado: {tipo_protecao}
- Confianca da classificacao: {confianca}
- O que o usuario quer proteger: {descricao_usuario}
- Perfil: {tipo_pessoa}, {estado}
- Itens do checklist ja concluidos: {itens_concluidos}
- Itens pendentes: {itens_pendentes}

INSTRUCAO:
Gere um resumo simples e amigavel da jornada do usuario.
Comece com "Aqui esta o resumo do seu caso:" e termine com o proximo passo mais importante.
```

#### 4.2 Resumo Tecnico

**Prompt:**

```
SISTEMA:
Voce e um assistente tecnico que redige resumos formais sobre processos de
propriedade intelectual brasileira.

REGRAS:
- Use linguagem tecnica e formal correta.
- Use os termos juridicos adequados (depositante, reivindicacoes, anterioridade, etc.).
- Organize em secoes: Qualificacao, Objeto, Enquadramento, Status, Pendencias.
- Seja preciso e objetivo.
- NAO emita opiniao juridica.
- Referencie artigos da LPI (Lei 9.279/96) quando aplicavel.

DADOS DA JORNADA DO USUARIO:
- Classificacao: {tipo_protecao}
- Score de confianca: {confianca}
- Descricao do objeto: {descricao_usuario}
- Qualificacao do depositante: {tipo_pessoa}, CNPJ/CPF: {documento}
- UF: {estado}
- Checklist concluido: {percentual_concluido}%
- Itens pendentes criticos: {itens_criticos}

INSTRUCAO:
Gere um resumo tecnico-formal do caso. Estruture em secoes claras.
Use formatacao Markdown.
```

#### 4.3 Checklist Final

**Prompt:**

```
SISTEMA:
Voce gera checklists de status para processos de propriedade intelectual.

REGRAS:
- Use emojis de status: feito, pendente, atencao
- Agrupe por categoria: Documentacao, Financeiro, Protocolo, Acompanhamento
- Inclua prazo estimado para itens pendentes
- Destaque itens urgentes ou com prazo proximo
- NAO adicione itens que nao estejam nos dados fornecidos

DADOS:
- Tipo: {tipo_protecao}
- Itens concluidos: {lista_concluidos}
- Itens pendentes: {lista_pendentes}
- Datas relevantes: {datas}

INSTRUCAO:
Gere o checklist final de status organizado por categoria.
Formato Markdown com checkboxes.
```

#### 4.4 Proximo Passo

**Prompt:**

```
SISTEMA:
Voce identifica e descreve o proximo passo mais importante para o usuario
em um processo de propriedade intelectual brasileira.

REGRAS:
- Identifique UMA unica acao prioritaria.
- Descreva o que fazer, como fazer, e quanto tempo leva.
- Inclua link ou referencia ao recurso necessario (site do INPI, etc.).
- Use linguagem simples e direta.
- Se houver prazo legal, destaque com urgencia.

DADOS:
- Tipo: {tipo_protecao}
- Ultimo item concluido: {ultimo_concluido}
- Proximo item pendente: {proximo_pendente}
- Dias desde o ultimo progresso: {dias_parado}

INSTRUCAO:
Gere uma descricao clara do proximo passo. Comece com o verbo de acao.
Maximo 100 palavras.
```

#### 4.5 Alertas de Erro

**Prompt:**

```
SISTEMA:
Voce identifica erros comuns e riscos em processos de propriedade intelectual
brasileira com base no perfil e progresso do usuario.

REGRAS:
- Liste ate 5 alertas relevantes ao caso especifico do usuario.
- Cada alerta deve ter: titulo curto, descricao do risco, como evitar.
- Ordene por gravidade (mais grave primeiro).
- Baseie-se em erros reais e frequentes no INPI.
- NAO invente riscos que nao se aplicam ao caso.

DADOS:
- Tipo: {tipo_protecao}
- Perfil: {tipo_pessoa}
- Progresso: {itens_concluidos} de {total_itens}
- Respostas do wizard: {respostas}

EXEMPLOS DE ERROS COMUNS:
- Marca: escolher classe Nice errada, nao fazer busca previa, especificacao generica demais
- Patente: divulgar invencao antes de depositar, reivindicacoes vagas, nao pedir exame em 36 meses
- DI: confundir funcionalidade com aparencia, imagens fora do padrao, nao pagar quinquenal

INSTRUCAO:
Gere uma lista de alertas especificos para este usuario. Formato Markdown.
```

#### 4.6 Versao PDF

**Pipeline de geracao:**

```
[Prompt de conteudo] --> [LLM gera conteudo estruturado em JSON]
        |
        v
[Template Engine (Handlebars)] --> [Monta HTML com CSS de impressao]
        |
        v
[Puppeteer/Playwright] --> [Renderiza HTML para PDF]
        |
        v
[PDF salvo no storage] --> [Link de download para usuario]
```

**Prompt para conteudo do PDF:**

```
SISTEMA:
Voce gera o conteudo estruturado para um PDF de resumo de processo de
propriedade intelectual. O conteudo sera inserido em um template formatado.

REGRAS:
- Retorne um JSON valido com as secoes abaixo.
- Cada secao deve ter titulo e conteudo.
- Use linguagem clara mas profissional.
- Inclua todos os dados relevantes do usuario.
- NAO inclua pareceres juridicos.
- Inclua o disclaimer obrigatorio.

DADOS DO USUARIO:
{todos_os_dados_da_jornada}

ESTRUTURA JSON ESPERADA:
{
  "cabecalho": {
    "titulo": "Resumo do Processo de Registro",
    "subtitulo": "{tipo_protecao}",
    "data": "{data_geracao}",
    "protocolo_interno": "{id_usuario}"
  },
  "resumo_executivo": "Texto de 2-3 paragrafos...",
  "dados_depositante": {
    "nome": "",
    "documento": "",
    "tipo": "",
    "estado": ""
  },
  "classificacao": {
    "tipo": "",
    "confianca": "",
    "justificativa": ""
  },
  "checklist_status": [
    { "item": "", "status": "concluido|pendente", "observacao": "" }
  ],
  "proximo_passo": "Descricao do proximo passo...",
  "alertas": ["Alerta 1", "Alerta 2"],
  "disclaimer": "Este documento e meramente informativo e educacional. NAO constitui parecer juridico nem substitui a consulta a um advogado especializado em propriedade intelectual. O Registrar Certo nao se responsabiliza por decisoes tomadas com base exclusivamente neste resumo. Consulte sempre um profissional qualificado."
}
```

---

## Nivel 5 --- Motor de Conversao

### Objetivo

Personalizar elementos de marketing e conversao ao longo de toda a jornada do usuario, usando IA para maximizar engajamento e reducao de abandono.

### 5.1 Headlines Dinamicas (Teste A/B)

```typescript
interface HeadlineVariant {
  id: string;
  text: string;
  targetAudience: string;
  conversionGoal: string;
}

const HEADLINE_VARIANTS: Record<string, HeadlineVariant[]> = {
  homepage: [
    {
      id: 'hp_a',
      text: 'Registre sua marca no INPI sem complicacao',
      targetAudience: 'geral',
      conversionGoal: 'iniciar_wizard',
    },
    {
      id: 'hp_b',
      text: 'Proteja seu negocio: registre sua marca em minutos',
      targetAudience: 'empreendedor',
      conversionGoal: 'iniciar_wizard',
    },
    {
      id: 'hp_c',
      text: 'Nao deixe outra pessoa registrar o nome da sua empresa',
      targetAudience: 'urgencia',
      conversionGoal: 'iniciar_wizard',
    },
  ],
};
```

**Prompt para geracao de headlines:**

```
SISTEMA:
Voce e um copywriter especializado em conversao para o mercado brasileiro.
Gere headlines para uma plataforma que ajuda pessoas a registrar marcas,
patentes e desenhos industriais no INPI.

REGRAS:
- Maximo 12 palavras por headline.
- Use linguagem simples e direta.
- Evite termos juridicos na headline (eles assustam).
- Foque no beneficio, nao no processo.
- Gere 3 variantes com abordagens diferentes:
  A) Beneficio direto
  B) Dor/medo de perda
  C) Simplicidade/facilidade

CONTEXTO:
- Pagina: {nome_pagina}
- Origem do usuario: {utm_source}
- Tipo de protecao (se conhecido): {tipo_protecao}
- Dispositivo: {device}

Retorne JSON: [{"id": "a", "text": "...", "approach": "..."}]
```

### 5.2 CTAs Dinamicos

```typescript
const CTA_MAP: Record<string, Record<string, string>> = {
  inicio: {
    default: 'Comecar agora --- e gratis',
    returning: 'Continuar de onde parei',
    from_google: 'Descobrir meu tipo de protecao',
  },
  meio_wizard: {
    default: 'Proximo passo',
    slow_user: 'Sem pressa --- vamos ao proximo passo',
    fast_user: 'Continuar',
  },
  fim_wizard: {
    default: 'Ver meu resumo completo',
    engaged: 'Gerar meu guia personalizado',
  },
  checklist: {
    default: 'Baixar meu checklist em PDF',
    incomplete: 'Salvar progresso e continuar depois',
  },
};
```

### 5.3 Linhas de Assunto de Email

**Prompt:**

```
SISTEMA:
Voce e um especialista em email marketing para o mercado brasileiro.
Gere linhas de assunto para emails transacionais e de engajamento de uma
plataforma de registro de propriedade intelectual.

REGRAS:
- Maximo 50 caracteres (ideal para mobile).
- Use o nome do usuario quando disponivel.
- Evite palavras que ativam filtros de spam (gratis, urgente, clique).
- Gere 3 variantes para teste A/B.
- Personalize com base no estagio do usuario.

TIPO DE EMAIL: {tipo_email}
NOME DO USUARIO: {nome}
ESTAGIO: {estagio}
TIPO DE PROTECAO: {tipo_protecao}
DIAS DESDE ULTIMA ACAO: {dias_inativo}

Retorne JSON com 3 variantes.
```

**Tipos de email e exemplos de assuntos:**

| Tipo de Email | Exemplo Variante A | Exemplo Variante B | Exemplo Variante C |
|---|---|---|---|
| Boas-vindas | "{nome}, seu primeiro passo esta dado" | "Bem-vindo ao Registrar Certo" | "Sua jornada de protecao comecou" |
| Lembrete 24h | "{nome}, voce parou na etapa 3" | "Seu checklist esta esperando voce" | "Falta pouco para completar" |
| Lembrete 72h | "Nao perca o progresso, {nome}" | "Sua marca ainda precisa de voce" | "3 itens pendentes no seu checklist" |
| Checklist pronto | "Seu guia personalizado esta pronto" | "{nome}, seu checklist ficou pronto" | "Hora de agir: veja seu plano" |
| Dica semanal | "Dica: como evitar o erro mais comum no INPI" | "Sabia que 40% dos pedidos tem problemas?" | "Uma coisa que voce precisa saber" |

### 5.4 Mensagens de Abandono

```typescript
interface AbandonmentMessage {
  stage: string;
  delayHours: number;
  channel: 'email' | 'push' | 'in_app';
  message: string;
}

const ABANDONMENT_FLOW: AbandonmentMessage[] = [
  {
    stage: 'wizard_q1',
    delayHours: 1,
    channel: 'in_app',
    message: 'Voce comecou a descobrir como proteger seu negocio. Quer continuar? Leva menos de 3 minutos.',
  },
  {
    stage: 'wizard_q3',
    delayHours: 24,
    channel: 'email',
    message: 'Voce esta no meio do caminho. Ja identificamos que seu caso pode ser {tipo}. Faltam so {n} perguntas.',
  },
  {
    stage: 'checklist_view',
    delayHours: 48,
    channel: 'email',
    message: 'Seu checklist personalizado para {tipo} esta pronto. {n} itens para revisar. Quer ver o proximo passo?',
  },
  {
    stage: 'checklist_50pct',
    delayHours: 72,
    channel: 'email',
    message: 'Voce ja completou metade do seu checklist. O proximo item e: {proximo_item}. Vamos la?',
  },
  {
    stage: 'summary_view',
    delayHours: 48,
    channel: 'email',
    message: 'Seu resumo esta pronto para download. E o guia completo para o seu caso de {tipo}.',
  },
];
```

### 5.5 Reformulacao "Nao Entendi"

Quando o usuario clica no botao "Nao entendi" em qualquer explicacao, a IA reformula a explicacao de forma ainda mais simples.

**Prompt:**

```
SISTEMA:
O usuario clicou em "Nao entendi" em uma explicacao. Voce precisa reformular
de forma AINDA MAIS SIMPLES.

REGRAS:
- Use frases curtissimas (maximo 10 palavras por frase).
- Use analogias do dia a dia.
- Evite QUALQUER termo tecnico.
- Se possivel, use exemplos concretos.
- Fale como se estivesse explicando para uma crianca de 12 anos.
- Maximo 3 frases.

EXPLICACAO ORIGINAL:
{explicacao_original}

TERMO EM QUESTAO:
{termo}

CONTEXTO:
{contexto_na_pagina}

Retorne apenas a nova explicacao, sem introducao.
```

### 5.6 Framework de Teste A/B

```typescript
interface ABTest {
  id: string;
  element: 'headline' | 'cta' | 'email_subject' | 'explanation';
  variants: Array<{
    id: string;
    content: string;
    weight: number; // 0-1, soma = 1
  }>;
  metric: 'click_rate' | 'completion_rate' | 'conversion_rate';
  minSampleSize: number;
  status: 'running' | 'completed' | 'paused';
}

// Selecao de variante com base em hashing deterministico
function selectVariant(userId: string, testId: string, variants: Variant[]): Variant {
  const hash = murmurHash3(`${userId}:${testId}`);
  const normalized = (hash % 1000) / 1000;
  let cumulative = 0;
  for (const variant of variants) {
    cumulative += variant.weight;
    if (normalized < cumulative) return variant;
  }
  return variants[variants.length - 1];
}
```

---

## Arquitetura Tecnica

### Provedores de LLM

| Tarefa | Modelo | Justificativa |
|--------|--------|---------------|
| Triagem (fallback) | GPT-4o-mini | Rapido, barato, suficiente para classificacao |
| Explicacao de termos | GPT-4o-mini | Respostas curtas, baixa complexidade |
| Geracao de checklist | GPT-4o-mini | Template-based, baixa variabilidade |
| Resumo simples | GPT-4o-mini | Texto curto e padronizado |
| Resumo tecnico | GPT-4o | Requer precisao em termos juridicos |
| Alertas de erro | GPT-4o | Requer raciocinio sobre riscos |
| Conteudo PDF | GPT-4o | Saida estruturada complexa |
| Headlines/CTAs | GPT-4o-mini | Criativo mas curto |
| Reformulacao | GPT-4o-mini | Respostas curtissimas |

**Fallback:** Se a API da OpenAI estiver indisponivel, todas as chamadas sao redirecionadas para a API Claude da Anthropic (claude-3-5-haiku para tarefas simples, claude-3-5-sonnet para tarefas complexas).

### Configuracao de Temperatura por Tarefa

| Tarefa | Temperatura | Justificativa |
|--------|-------------|---------------|
| Triagem/classificacao | 0.1 | Maxima consistencia |
| Glossario/explicacao | 0.3 | Leve variacao, mas preciso |
| Checklist | 0.2 | Consistente mas adaptavel |
| Resumos | 0.4 | Linguagem natural, mas fiel |
| Headlines/CTAs | 0.7 | Criativo para variacoes |
| Reformulacao | 0.5 | Criativo mas compreensivel |

### Caching (Redis)

```typescript
const CACHE_CONFIG = {
  // Glossario: cache longo (termos nao mudam com frequencia)
  glossary: { ttl: 604800, prefix: 'glossary:' }, // 7 dias

  // Triagem: cache por combinacao de respostas
  triage: { ttl: 86400, prefix: 'triage:' }, // 24 horas

  // Headlines/CTAs: cache medio (testes A/B precisam de variacao)
  marketing: { ttl: 3600, prefix: 'mkt:' }, // 1 hora

  // Resumos: nao cachear (personalizados por usuario)
  summary: { ttl: 0, prefix: 'summary:' },
};
```

### Rate Limiting

```typescript
const RATE_LIMITS = {
  // Por usuario
  perUser: {
    triagem: { requests: 5, window: '1h' },
    glossario: { requests: 50, window: '1h' },
    checklist: { requests: 10, window: '1h' },
    resumo: { requests: 3, window: '1h' },
    pdf: { requests: 2, window: '1h' },
  },
  // Global
  global: {
    allRequests: { requests: 1000, window: '1m' },
    pdfGeneration: { requests: 100, window: '1m' },
  },
};
```

### Controle de Tokens

```typescript
const TOKEN_BUDGETS = {
  triage: { maxInput: 500, maxOutput: 300 },
  glossary: { maxInput: 200, maxOutput: 150 },
  checklist: { maxInput: 800, maxOutput: 1000 },
  simpleSummary: { maxInput: 1000, maxOutput: 500 },
  technicalSummary: { maxInput: 1000, maxOutput: 800 },
  alerts: { maxInput: 800, maxOutput: 600 },
  pdfContent: { maxInput: 1500, maxOutput: 2000 },
  headline: { maxInput: 300, maxOutput: 200 },
  reformulation: { maxInput: 300, maxOutput: 100 },
};
```

### Tratamento de Erros

```typescript
async function callAIWithFallback(request: AIRequest): Promise<AIResponse> {
  try {
    // Tentar provider primario (OpenAI)
    return await callOpenAI(request);
  } catch (error) {
    logger.warn('OpenAI falhou, tentando fallback', { error });

    try {
      // Tentar provider secundario (Claude)
      return await callClaude(request);
    } catch (fallbackError) {
      logger.error('Ambos provedores falharam', { error, fallbackError });

      // Degradacao elegante: retornar conteudo pre-escrito
      return getPreWrittenFallback(request.type, request.context);
    }
  }
}
```

Conteudos pre-escritos de fallback existem para cada tipo de tarefa, garantindo que o usuario NUNCA veja uma tela de erro.

### Logging e Monitoramento

```typescript
interface AILog {
  id: string;
  timestamp: Date;
  userId: string;
  level: 1 | 2 | 3 | 4 | 5; // Nivel da IA
  taskType: string;
  provider: 'openai' | 'anthropic' | 'fallback';
  model: string;
  promptVersion: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  cost: number;
  success: boolean;
  userRating?: number; // se o usuario avaliou
  abTestId?: string;
  abVariant?: string;
}
```

### Versionamento de Prompts

Os prompts sao armazenados no banco de dados, nao no codigo. Isso permite:

- Atualizacao de prompts sem deploy
- Teste A/B de prompts diferentes
- Historico completo de versoes
- Rollback rapido em caso de regressao

```typescript
interface PromptVersion {
  id: string;
  promptKey: string; // ex: 'triage_classification'
  version: number;
  content: string;
  variables: string[]; // variaveis esperadas
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  abTestWeight: number; // 0-1 para testes A/B
  createdAt: Date;
  createdBy: string;
  metrics: {
    avgLatency: number;
    avgCost: number;
    userSatisfaction: number;
    errorRate: number;
  };
}
```

---

## Seguranca e Responsabilidade

### Principios Inviolaveis

1. **A IA NUNCA emite pareceres juridicos definitivos.** Toda saida e informativa e educacional.

2. **Toda saida de IA inclui disclaimer.** Texto padrao:
   > "Este conteudo e meramente informativo e educacional. Nao constitui parecer juridico nem substitui a consulta a um advogado especializado em propriedade intelectual."

3. **Classificacoes sempre oferecem a opcao "Falar com especialista."** Independente do nivel de confianca.

4. **A IA nao fabrica regras ou procedimentos do INPI.** Todo conteudo factual e verificado contra a documentacao oficial.

5. **Auditoria completa.** Todas as geracoes de IA sao registradas com input, output, modelo, versao do prompt e metadados.

### Guardrails de Conteudo

```typescript
const CONTENT_GUARDRAILS = {
  // Frases proibidas na saida da IA
  prohibitedPhrases: [
    'voce deve',
    'e obrigatorio que voce',
    'a lei determina que voce',
    'voce tem o direito garantido',
    'com certeza sera aprovado',
    'nao ha risco',
    'eu garanto',
    'pode ficar tranquilo que',
    'isso e um parecer',
    'como seu advogado',
  ],

  // Frases obrigatorias (pelo menos uma deve estar presente)
  requiredPhrases: [
    'recomendamos',
    'sugerimos',
    'e possivel que',
    'de acordo com as informacoes fornecidas',
    'em geral',
    'consulte um especialista',
  ],

  // Verificacao pos-geracao
  async validateOutput(output: string): Promise<ValidationResult> {
    const hasProhibited = this.prohibitedPhrases.some(p =>
      output.toLowerCase().includes(p)
    );
    const hasRequired = this.requiredPhrases.some(p =>
      output.toLowerCase().includes(p)
    );

    if (hasProhibited) {
      return { valid: false, reason: 'Contem linguagem de parecer juridico' };
    }
    if (!hasRequired) {
      return { valid: false, reason: 'Falta linguagem de ressalva' };
    }
    return { valid: true };
  },
};
```

### Verificacao Factual

Todo conteudo que menciona procedimentos, prazos ou valores do INPI e verificado contra uma base de dados interna atualizada mensalmente com informacoes oficiais do INPI.

```typescript
interface INPIFact {
  id: string;
  category: 'prazo' | 'valor' | 'procedimento' | 'requisito';
  content: string;
  source: string; // URL oficial do INPI
  lastVerified: Date;
  nextVerification: Date;
}
```

---

## Modelo de Custos

### Custo por Requisicao (estimativa)

| Nivel | Tarefa | Modelo | Tokens (in+out) | Custo por Requisicao (USD) |
|-------|--------|--------|-----------------|---------------------------|
| 1 | Triagem (regras) | Nenhum | 0 | $0.000 |
| 1 | Triagem (LLM fallback) | GPT-4o-mini | ~800 | $0.0002 |
| 2 | Glossario (cache hit) | Nenhum | 0 | $0.000 |
| 2 | Glossario (LLM) | GPT-4o-mini | ~350 | $0.0001 |
| 3 | Checklist | GPT-4o-mini | ~1800 | $0.0005 |
| 4 | Resumo simples | GPT-4o-mini | ~1500 | $0.0004 |
| 4 | Resumo tecnico | GPT-4o | ~1800 | $0.0135 |
| 4 | Alertas | GPT-4o | ~1400 | $0.0105 |
| 4 | Conteudo PDF | GPT-4o | ~3500 | $0.0263 |
| 5 | Headlines | GPT-4o-mini | ~500 | $0.0001 |
| 5 | Reformulacao | GPT-4o-mini | ~400 | $0.0001 |

**Custo medio por jornada completa de um usuario:** ~$0.05 USD (R$ 0,25)

### Projecoes Mensais

| Volume de Usuarios/Mes | Custo Estimado (USD) | Custo Estimado (BRL) |
|-------------------------|---------------------|---------------------|
| 100 usuarios | $5.00 | R$ 25,00 |
| 500 usuarios | $25.00 | R$ 125,00 |
| 1.000 usuarios | $50.00 | R$ 250,00 |
| 5.000 usuarios | $250.00 | R$ 1.250,00 |
| 10.000 usuarios | $500.00 | R$ 2.500,00 |
| 50.000 usuarios | $2.500.00 | R$ 12.500,00 |

*Nota: Valores em BRL calculados com cotacao estimada de R$ 5,00/USD. O custo real depende da proporcao de tarefas que usam GPT-4o vs GPT-4o-mini e da taxa de cache hit.*

### Estrategias de Otimizacao de Custos

1. **Cache agressivo:** Glossario, triagens comuns e headlines sao cacheados no Redis, eliminando chamadas repetidas ao LLM.

2. **Regras antes de IA:** O motor de regras da triagem resolve 70-80% dos casos sem LLM. Custo zero para a maioria dos usuarios.

3. **Modelo correto para cada tarefa:** GPT-4o-mini para tarefas simples (90% das chamadas), GPT-4o apenas quando necessario.

4. **Limites de tokens:** Cada tipo de tarefa tem orcamento maximo de tokens, evitando respostas excessivamente longas.

5. **Batch processing:** Resumos e PDFs podem ser gerados em horarios de menor custo se a plataforma usar modelos com precificacao variavel.

6. **Monitoramento continuo:** Dashboard de custos com alertas quando o gasto mensal se aproximar do orcamento.

7. **Conteudo pre-escrito:** Fallbacks pre-escritos eliminam custo de IA quando os provedores falham.

---

## Proximos Passos de Implementacao

1. **Fase 1 (MVP):** Nivel 1 (Triagem) + Nivel 2 (Glossario basico) + Nivel 3 (Checklists estaticos)
2. **Fase 2:** Nivel 4 (Resumos) + Nivel 3 (Personalizacao por IA) + Nivel 2 (LLM dinamico)
3. **Fase 3:** Nivel 5 (Motor de Conversao) + Testes A/B + Otimizacoes de custo
4. **Fase 4:** Dashboard de monitoramento + Retraining de prompts + Metricas de satisfacao
