# 05 - Wireframes Textuais

> Registrar Certo - Wireframes detalhados para todas as telas principais

---

## Convencoes

```
[COMPONENTE]         = Bloco visual / secao
( texto )            = Texto dentro de um elemento
-> /rota             = Link ou navegacao
{icone}              = Icone ou ilustracao
| ... | ... |        = Elementos lado a lado
---                  = Divisor horizontal
CTA:                 = Botao de acao principal
CTA2:                = Botao de acao secundario
```

---

## 1. HOME (`/`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER]                                                          |
| Logo: Registrar Certo                                             |
| Nav: Triagem | Marca | Patente | DI | Blog | Ajuda               |
| Right: [Entrar] [Criar Conta - destaque]                         |
| [Toggle Tema: claro / escuro / sistema]                          |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [HERO SECTION - fundo com gradiente suave]                       |
|                                                                   |
|  H1: Registre sua marca, invencao ou design no INPI              |
|      do jeito certo - sem complicacao.                            |
|                                                                   |
|  Subtitle: Passo a passo simples, em portugues claro,            |
|  para voce fazer tudo sozinho.                                    |
|                                                                   |
|  [CTA: Comecar Agora ->] [CTA2: Fazer Diagnostico Gratuito ->]  |
|                                                                   |
|  Nota discreta: "Guia educativo. O pedido oficial e feito no     |
|  site do INPI."                                                   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [SECAO: O QUE VOCE QUER PROTEGER?]                              |
|                                                                   |
| H2: O que voce quer proteger?                                    |
|                                                                   |
| +------------------+ +------------------+ +------------------+   |
| | {icone tag}      | | {icone lampada}  | | {icone paleta}   |  |
| | MARCA            | | PATENTE          | | DESENHO IND.     |  |
| |                  | |                  | |                  |   |
| | "Quero proteger  | | "Inventei algo   | | "Quero proteger  |  |
| | um nome, logo    | | novo - produto   | | o visual, forma  |  |
| | ou slogan."      | | ou processo."    | | ou design."      |  |
| |                  | |                  | |                  |   |
| | Exemplo: nome da | | Exemplo: um      | | Exemplo: formato |  |
| | empresa, marca   | | mecanismo, uma   | | de uma garrafa,  |  |
| | de produto       | | formula          | | design de movel  |  |
| |                  | |                  | |                  |   |
| | [Ver passo a     | | [Ver passo a     | | [Ver passo a     |  |
| |  passo ->]       | |  passo ->]       | |  passo ->]       |  |
| +------------------+ +------------------+ +------------------+   |
|                                                                   |
| Centro: "Nao sabe qual e o seu caso? [Faca a triagem ->]"       |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [SECAO: COMO FUNCIONA]                                           |
|                                                                   |
| H2: Como funciona                                                |
|                                                                   |
| Passo 1          Passo 2          Passo 3          Passo 4      |
| {icone busca}    {icone lista}    {icone doc}      {icone check} |
| "Descubra o      "Siga o passo    "Organize seus   "Faca o      |
|  tipo certo"      a passo"         documentos"      pedido"      |
|                                                                   |
| (Linha conectando os 4 passos com seta ->)                       |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [SECAO: CONFIANCA]                                               |
|                                                                   |
| H2: Por que confiar no Registrar Certo?                          |
|                                                                   |
| +-- Stat 1 -----+ +-- Stat 2 -----+ +-- Stat 3 -----+          |
| | "Baseado nas   | | "Linguagem    | | "Gratuito e   |          |
| |  regras        | |  simples, sem | |  sem pegadinha"|          |
| |  oficiais do   | |  juridiques"  | |               |          |
| |  INPI"         | |               | |               |          |
| +----------------+ +----------------+ +----------------+          |
|                                                                   |
| Disclaimer: "Este site e um guia educativo. Nao somos            |
| escritorio de advocacia nem representamos o INPI."               |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [SECAO: FAQ PREVIEW]                                             |
|                                                                   |
| H2: Perguntas frequentes                                         |
|                                                                   |
| [Accordion] Quanto custa registrar uma marca?                    |
| [Accordion] Preciso de advogado para registrar?                  |
| [Accordion] Quanto tempo leva o processo?                        |
|                                                                   |
| [Ver todas as perguntas -> /ajuda]                               |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [SECAO: BLOG PREVIEW]                                            |
|                                                                   |
| H2: Ultimas do blog                                              |
|                                                                   |
| +-- Card 1 ------+ +-- Card 2 ------+ +-- Card 3 ------+       |
| | [thumb]         | | [thumb]         | | [thumb]         |      |
| | Titulo post 1   | | Titulo post 2   | | Titulo post 3   |      |
| | Resumo curto... | | Resumo curto... | | Resumo curto... |      |
| | [Ler mais ->]   | | [Ler mais ->]   | | [Ler mais ->]   |      |
| +----------------+ +----------------+ +----------------+          |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [FOOTER]                                                          |
|                                                                   |
| Col 1: Registrar Certo  | Col 2: Registros  | Col 3: Suporte    |
| Guia educativo para     | Marca             | Central de Ajuda  |
| registro no INPI.       | Patente           | Blog              |
|                         | Desenho Industrial| Contato           |
|                         |                   |                   |
| Col 4: Legal            |                                        |
| Termos de Uso           |                                        |
| Privacidade             |                                        |
|                                                                   |
| [Input: Seu email] [Botao: Receber novidades]                   |
|                                                                   |
| (c) 2026 Registrar Certo. Guia educativo independente.           |
| Nao afiliado ao INPI.                                            |
+------------------------------------------------------------------+
```

### Mobile

```
+-----------------------------------+
| [HEADER MOBILE]                   |
| Logo | [Hamburger Menu]           |
+-----------------------------------+
| [HERO - empilhado]               |
| H1 (menor)                       |
| Subtitle                          |
| [CTA: Comecar Agora] (full width)|
| [CTA2: Diagnostico] (full width) |
+-----------------------------------+
| [3 CARDS - empilhados vertical]  |
| Card Marca (full width)          |
| Card Patente (full width)        |
| Card DI (full width)             |
+-----------------------------------+
| [COMO FUNCIONA - 2x2 grid]      |
+-----------------------------------+
| [FAQ - accordion]                 |
+-----------------------------------+
| [BLOG - scroll horizontal]       |
+-----------------------------------+
| [FOOTER - empilhado]             |
+-----------------------------------+
```

---

## 2. TRIAGEM INTELIGENTE (`/triagem`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER simplificado]                                             |
| Logo | Progresso: Pergunta X de Y | [Sair da triagem]           |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [AREA CENTRAL - largura maxima 640px, centralizada]              |
|                                                                   |
| [BARRA DE PROGRESSO: === === === --- --- --- ]                   |
| "Pergunta 3 de 6"                                                |
|                                                                   |
| H2: [Texto da pergunta atual]                                    |
|                                                                   |
| Exemplo pergunta 1:                                              |
| "O que voce quer proteger?"                                      |
|                                                                   |
| +------------------------------------------------------+         |
| | ( ) Um nome, logo ou slogan da minha empresa/produto |         |
| +------------------------------------------------------+         |
| +------------------------------------------------------+         |
| | ( ) Uma invencao, produto ou processo novo           |         |
| +------------------------------------------------------+         |
| +------------------------------------------------------+         |
| | ( ) O formato visual ou design de um produto         |         |
| +------------------------------------------------------+         |
| +------------------------------------------------------+         |
| | ( ) Nao tenho certeza                                |         |
| +------------------------------------------------------+         |
|                                                                   |
| [Dica contextual em caixa suave]                                 |
| "Marca = nome ou logo. Patente = invencao.                       |
|  Desenho = aparencia visual."                                     |
|                                                                   |
| [<- Voltar]                          [Proximo ->]                |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [FOOTER minimo]                                                   |
| "Registrar Certo - Guia educativo"                               |
+------------------------------------------------------------------+
```

### Comportamento do Wizard

```
Pergunta 1: O que voce quer proteger?
  -> Selecao unica com radio buttons grandes

Pergunta 2: [Condicional - varia conforme resposta 1]
  -> Se marca: "E um nome, logo, simbolo ou slogan?"
  -> Se patente: "O que descreve melhor sua criacao?"
  -> Se DI: "Voce quer proteger a forma externa do produto?"
  -> Se incerto: "Qual dessas opcoes mais se parece com o seu caso?"

Pergunta 3: Ja existe algo parecido no mercado?
  -> Sim / Nao / Nao sei

Pergunta 4: Voce ja usa isso comercialmente?
  -> Sim, ja uso / Estou planejando / Ainda e so ideia

Pergunta 5: Tipo de pessoa
  -> Pessoa fisica / MEI / ME-EPP / Empresa maior

Pergunta 6: Confirmacao
  -> Resumo das respostas com opcao de editar qualquer uma

Transicao: animacao suave de loading -> resultado
```

### Mobile

```
+-----------------------------------+
| Logo | Progresso | [X]            |
+-----------------------------------+
| Pergunta X de Y                   |
| [=======-------]                  |
|                                   |
| H2: Texto da pergunta             |
|                                   |
| [Opcao 1 - full width, tappable] |
| [Opcao 2 - full width, tappable] |
| [Opcao 3 - full width, tappable] |
| [Opcao 4 - full width, tappable] |
|                                   |
| [Dica em caixa]                   |
|                                   |
| [<- Voltar] [Proximo ->]         |
+-----------------------------------+
```

---

## 3. RESULTADO DA TRIAGEM (`/triagem/resultado`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER normal]                                                   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [RESULTADO - centralizado, max 800px]                            |
|                                                                   |
| {icone grande de sucesso / check}                                |
|                                                                   |
| H1: "Pelo que voce descreveu, o registro ideal e:"              |
|                                                                   |
| +----------------------------------------------------------+     |
| | [CARD DESTAQUE]                                           |     |
| |                                                           |     |
| | {icone tipo}  REGISTRO DE MARCA                          |     |
| |                                                           |     |
| | "Voce quer proteger um nome ou logo. Isso e uma marca.   |     |
| |  O registro garante que so voce pode usar esse nome       |     |
| |  no seu segmento em todo o Brasil."                       |     |
| |                                                           |     |
| | Tempo estimado: 12-18 meses (INPI)                       |     |
| | Custo aproximado: R$ 166 (pessoa fisica/MEI)              |     |
| |                                                           |     |
| | [CTA: Comecar o Registro de Marca ->]                    |     |
| +----------------------------------------------------------+     |
|                                                                   |
| H3: "Resumo das suas respostas"                                  |
| - Quer proteger: nome da empresa                                 |
| - Ja usa comercialmente: sim                                     |
| - Tipo: MEI                                                      |
| [Refazer triagem]                                                |
|                                                                   |
| [SECAO: Entenda a diferenca]                                     |
| Tabela comparativa simples:                                       |
| | Marca          | Patente        | Desenho Ind.   |             |
| | Nome, logo     | Invencao       | Forma visual   |             |
| | 10 anos renov. | 20 anos        | 25 anos        |             |
|                                                                   |
| [CTA2: Criar conta e salvar meu resultado]                      |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [FOOTER]                                                          |
+------------------------------------------------------------------+
```

### Variante: Resultado "Nenhum"

```
| {icone atencao}                                                   |
|                                                                   |
| H1: "Hmm, pelo que voce descreveu, pode ser que o INPI          |
|      nao seja o caminho agora."                                   |
|                                                                   |
| "Mas calma - vamos entender melhor:"                             |
|                                                                   |
| - Se e um texto, musica ou arte -> direito autoral               |
|   (nao precisa registrar no INPI)                                |
| - Se e um software -> pode ser registro de programa              |
| - Se e uma ideia sem forma definida -> precisa amadurecer        |
|                                                                   |
| [CTA: Refazer a triagem com outras respostas]                   |
| [CTA2: Ver Central de Ajuda]                                     |
```

---

## 4. HUB DE MARCA (`/marca`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER normal]                                                   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [HERO DO HUB]                                                    |
|                                                                   |
| Breadcrumb: Home > Registro de Marca                             |
|                                                                   |
| H1: Registro de Marca - Passo a Passo Completo                  |
|                                                                   |
| "Siga todas as etapas abaixo para registrar sua marca no INPI.  |
|  Cada etapa tem explicacao detalhada e links oficiais."          |
|                                                                   |
| [Se logado: Barra de progresso - "Voce esta na etapa 3 de 12"]  |
| [Se visitante: "Crie uma conta para salvar seu progresso"]       |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [LAYOUT: Conteudo Principal (2/3) | Sidebar (1/3)]              |
|                                                                   |
| CONTEUDO PRINCIPAL:                                               |
|                                                                   |
| [FASE 1: PREPARACAO]                                             |
|                                                                   |
| +-- Etapa 1 ------------------------------------------------+   |
| | {numero} {status: check/atual/pendente}                     |   |
| | "O que e marca"                                             |   |
| | Resumo: Entenda o que pode ser registrado como marca.       |   |
| | [Abrir etapa ->]                                            |   |
| +------------------------------------------------------------+   |
|                                                                   |
| +-- Etapa 2 ------------------------------------------------+   |
| | {2} {status}                                                |   |
| | "Busca previa"                                              |   |
| | Resumo: Verifique se ja existe marca igual ou parecida.     |   |
| | [Abrir etapa ->]                                            |   |
| +------------------------------------------------------------+   |
|                                                                   |
| +-- Etapa 3 ------------------------------------------------+   |
| | {3} {status}                                                |   |
| | "Classificacao Nice"                                        |   |
| | Resumo: Escolha a classe certa para o seu tipo de negocio.  |   |
| | [Abrir etapa ->]                                            |   |
| +------------------------------------------------------------+   |
|                                                                   |
| +-- Etapa 4 ------------------------------------------------+   |
| | {4} {status}                                                |   |
| | "Documentos necessarios"                                    |   |
| | Resumo: Veja tudo que voce precisa ter em maos.             |   |
| | [Abrir etapa ->]                                            |   |
| +------------------------------------------------------------+   |
|                                                                   |
| [FASE 2: CADASTRO E PAGAMENTO]                                  |
|                                                                   |
| +-- Etapa 5 ------------------------------------------------+   |
| | {5} "Cadastro no e-INPI" -> /marca/cadastro-einpi          |   |
| +------------------------------------------------------------+   |
| +-- Etapa 6 ------------------------------------------------+   |
| | {6} "Emissao da GRU" -> /marca/gru                         |   |
| +------------------------------------------------------------+   |
| +-- Etapa 7 ------------------------------------------------+   |
| | {7} "Pagamento" -> /marca/pagamento                        |   |
| +------------------------------------------------------------+   |
|                                                                   |
| [FASE 3: PROTOCOLO]                                              |
|                                                                   |
| +-- Etapa 8 ------------------------------------------------+   |
| | {8} "Protocolo no e-Marcas" -> /marca/protocolo            |   |
| +------------------------------------------------------------+   |
|                                                                   |
| [FASE 4: APOS O PROTOCOLO]                                      |
|                                                                   |
| +-- Etapa 9 ------------------------------------------------+   |
| | {9} "Acompanhamento" -> /marca/acompanhamento              |   |
| +------------------------------------------------------------+   |
| +-- Etapa 10 -----------------------------------------------+   |
| | {10} "Oposicao e Exigencia" -> /marca/oposicao            |   |
| +------------------------------------------------------------+   |
| +-- Etapa 11 -----------------------------------------------+   |
| | {11} "Concessao" -> /marca/concessao                       |   |
| +------------------------------------------------------------+   |
| +-- Etapa 12 -----------------------------------------------+   |
| | {12} "Renovacao" -> /marca/renovacao                       |   |
| +------------------------------------------------------------+   |
|                                                                   |
|                                                                   |
| SIDEBAR:                                                          |
|                                                                   |
| +-- Seu Proximo Passo --+                                        |
| | {icone seta}          |                                        |
| | "Sua proxima etapa:"  |                                        |
| | "Busca previa"        |                                        |
| | [Ir para etapa ->]    |                                        |
| +-----------------------+                                        |
|                                                                   |
| +-- Precisa de ajuda? --+                                        |
| | "Alguns casos podem   |                                        |
| |  exigir ajuda de um   |                                        |
| |  profissional."       |                                        |
| | [Ver Central de       |                                        |
| |  Ajuda ->]            |                                        |
| +-----------------------+                                        |
|                                                                   |
| +-- Checklist rapido ---+                                        |
| | [ ] Busca feita       |                                        |
| | [ ] Classe escolhida  |                                        |
| | [ ] Docs reunidos     |                                        |
| | [ ] Cadastro e-INPI   |                                        |
| | [ ] GRU paga          |                                        |
| | [Gerar checklist      |                                        |
| |  completo ->]         |                                        |
| +-----------------------+                                        |
|                                                                   |
| +-- Disclaimer ---------+                                        |
| | "Este site e um guia  |                                        |
| |  educativo. O pedido  |                                        |
| |  oficial e feito nos  |                                        |
| |  sistemas do INPI."   |                                        |
| +-----------------------+                                        |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [FOOTER]                                                          |
+------------------------------------------------------------------+
```

### Mobile

```
+-----------------------------------+
| [HEADER]                          |
+-----------------------------------+
| Breadcrumb                        |
| H1: Registro de Marca             |
| Texto intro                       |
| [Barra progresso se logado]       |
+-----------------------------------+
| [Sidebar widgets empilhados ACIMA]|
| "Seu Proximo Passo" card          |
+-----------------------------------+
| [FASE 1: PREPARACAO]             |
| Etapa 1 (card full width)        |
| Etapa 2 (card full width)        |
| Etapa 3 (card full width)        |
| Etapa 4 (card full width)        |
+-----------------------------------+
| [FASE 2: CADASTRO]              |
| Etapa 5...7                       |
+-----------------------------------+
| [FASE 3: PROTOCOLO]             |
| Etapa 8                          |
+-----------------------------------+
| [FASE 4: APOS PROTOCOLO]        |
| Etapa 9...12                      |
+-----------------------------------+
| [Disclaimer]                      |
| [FOOTER]                          |
+-----------------------------------+
```

---

## 5. PAGINA DE ETAPA - Generica (`/marca/[etapa]`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER normal]                                                   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| Breadcrumb: Home > Marca > Busca Previa                          |
|                                                                   |
| [BARRA DE PROGRESSO DO FLUXO]                                    |
| Etapa 2 de 12: Busca Previa                                     |
| [o]--[*]--[ ]--[ ]--[ ]--[ ]--[ ]--[ ]--[ ]--[ ]--[ ]--[ ]     |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [LAYOUT: Conteudo (2/3) | Sidebar (1/3)]                        |
|                                                                   |
| CONTEUDO PRINCIPAL:                                               |
|                                                                   |
| H1: Busca Previa de Marca                                       |
|                                                                   |
| [Caixa destaque]                                                  |
| "Antes de pedir o registro, verifique se ja existe               |
|  uma marca igual ou parecida a sua."                             |
|                                                                   |
| H2: Por que fazer a busca?                                       |
| (Texto explicativo em paragrafos curtos, 2-3 linhas max)         |
|                                                                   |
| H2: Como fazer a busca                                           |
|                                                                   |
| [PASSO A PASSO VISUAL]                                           |
| 1. Acesse o sistema de busca do INPI                             |
|    [Botao: Abrir busca do INPI (link externo) ->]               |
|                                                                   |
| 2. No campo "Marca", digite o nome que voce quer registrar      |
|    [Screenshot / ilustracao do campo]                             |
|                                                                   |
| 3. Analise os resultados                                         |
|    - Nenhum resultado: otimo, caminho livre                      |
|    - Resultados parecidos: leia com atencao                      |
|    - Resultado identico: pode ser problema                       |
|                                                                   |
| [CAIXA: DICA IMPORTANTE]                                         |
| "Se encontrou uma marca parecida mas em classe diferente,        |
|  pode nao ser problema. Cada classe e um segmento diferente."    |
|                                                                   |
| H2: E se ja existir uma marca parecida?                          |
| (Texto com orientacoes)                                           |
|                                                                   |
| [CAIXA: EXEMPLO PRATICO]                                         |
| "A marca 'Sol' existe na classe de bebidas (32) e tambem         |
|  na classe de cosmeticos (3). Sao marcas diferentes porque       |
|  atuam em mercados diferentes."                                   |
|                                                                   |
| ---                                                               |
|                                                                   |
| [NAVEGACAO ENTRE ETAPAS]                                         |
| [<- Etapa anterior: O que e marca]                               |
| [Proxima etapa: Classificacao Nice ->]                           |
|                                                                   |
| [Se logado: checkbox "Marcar como concluida"]                    |
|                                                                   |
|                                                                   |
| SIDEBAR:                                                          |
|                                                                   |
| +-- Nesta etapa --------+                                        |
| | Indice:               |                                        |
| | - Por que fazer       |                                        |
| | - Como fazer          |                                        |
| | - E se ja existir     |                                        |
| +-----------------------+                                        |
|                                                                   |
| +-- Links Oficiais -----+                                        |
| | {icone externo}       |                                        |
| | Busca de Marcas INPI  |                                        |
| | (abre em nova aba)    |                                        |
| +-----------------------+                                        |
|                                                                   |
| +-- Seu Proximo Passo --+                                        |
| | Proxima etapa:        |                                        |
| | Classificacao Nice    |                                        |
| | [Ir para etapa ->]    |                                        |
| +-----------------------+                                        |
|                                                                   |
| +-- Precisa de ajuda? --+                                        |
| | [Ver FAQ ->]          |                                        |
| +-----------------------+                                        |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [FOOTER]                                                          |
+------------------------------------------------------------------+
```

### Mobile

```
+-----------------------------------+
| [HEADER]                          |
+-----------------------------------+
| Breadcrumb                        |
| Etapa 2 de 12 [===---]           |
+-----------------------------------+
| H1: Busca Previa de Marca         |
| [Caixa destaque]                  |
|                                   |
| [Indice da pagina - colapsavel]   |
|                                   |
| Conteudo em coluna unica          |
| (textos, passos, dicas)           |
|                                   |
| [Navegacao entre etapas]          |
| [<- Anterior] [Proxima ->]       |
+-----------------------------------+
| [Links Oficiais - card]           |
| [Proximo Passo - card]            |
+-----------------------------------+
| [FOOTER]                          |
+-----------------------------------+
```

---

## 6. MEU PASSO A PASSO - Dashboard (`/meu-passo-a-passo`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER logado - mostra nome do usuario]                         |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| H1: Meu Passo a Passo                                           |
|                                                                   |
| "Ola, [Nome]! Aqui esta o resumo do seu progresso."             |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [LAYOUT: Conteudo (2/3) | Sidebar (1/3)]                        |
|                                                                   |
| CONTEUDO PRINCIPAL:                                               |
|                                                                   |
| +-- Card Destaque: Proximo Passo ---------------------------+    |
| | {icone seta}                                               |    |
| | "Sua proxima etapa:"                                       |    |
| | H3: "Classificacao Nice"                                   |    |
| | "Escolha a classe certa para o seu tipo de negocio."       |    |
| | [CTA: Continuar de onde parei ->]                          |    |
| +------------------------------------------------------------+   |
|                                                                   |
| H2: Seu progresso                                                |
|                                                                   |
| [BARRA DE PROGRESSO VISUAL: 25% completo]                       |
| "3 de 12 etapas concluidas"                                     |
|                                                                   |
| [LISTA DE ETAPAS COM STATUS]                                    |
| [check] 1. O que e marca                                        |
| [check] 2. Busca previa                                         |
| [check] 3. Classificacao Nice                                   |
| [atual] 4. Documentos necessarios   <- voce esta aqui           |
| [  --  ] 5. Cadastro no e-INPI                                  |
| [  --  ] 6. Emissao da GRU                                      |
| [  --  ] 7. Pagamento                                            |
| [  --  ] 8. Protocolo no e-Marcas                                |
| [  --  ] 9. Acompanhamento                                      |
| [  --  ] 10. Oposicao e Exigencia                                |
| [  --  ] 11. Concessao                                           |
| [  --  ] 12. Renovacao                                           |
|                                                                   |
| H2: Suas anotacoes                                               |
| (area para o usuario salvar informacoes como nome da marca,      |
|  classe escolhida, numero do protocolo)                           |
|                                                                   |
| +-- Nome da marca: [___________________]                         |
| +-- Classe Nice: [___________________]                           |
| +-- Numero do protocolo: [___________________]                   |
| [Salvar anotacoes]                                               |
|                                                                   |
|                                                                   |
| SIDEBAR:                                                          |
|                                                                   |
| +-- Ferramentas --------+                                        |
| | [Gerar Checklist ->]  |                                        |
| | [Gerar Resumo ->]     |                                        |
| +-----------------------+                                        |
|                                                                   |
| +-- Tipo de Registro ---+                                        |
| | Marca                 |                                        |
| | [Trocar tipo ->]      |                                        |
| +-----------------------+                                        |
|                                                                   |
| +-- Ajuda --------------+                                        |
| | [Central de Ajuda ->] |                                        |
| | [Refazer Triagem ->]  |                                        |
| +-----------------------+                                        |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [FOOTER]                                                          |
+------------------------------------------------------------------+
```

---

## 7. GERADOR DE CHECKLIST (`/checklist`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER logado]                                                   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| H1: Sua Checklist Personalizada                                  |
|                                                                   |
| "Tudo que voce precisa ter pronto antes de protocolar            |
|  seu pedido no INPI."                                            |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [CHECKLIST GERADA]                                               |
|                                                                   |
| Tipo: Registro de Marca | Pessoa: MEI                           |
|                                                                   |
| [SECAO: Antes de comecar]                                        |
| [x] Definir o nome ou logo que vai registrar                     |
| [x] Fazer busca previa no site do INPI                           |
| [ ] Escolher a classe Nice correta                                |
| [ ] Preparar imagem do logo (se aplicavel)                       |
|     -> Formato: JPG ou PNG, 945x945px                            |
|                                                                   |
| [SECAO: Documentos]                                              |
| [ ] CPF do titular (ou CNPJ se empresa)                          |
| [ ] Comprovante de MEI (CCMEI)                                   |
| [ ] Procuracao (apenas se usar representante)                    |
|                                                                   |
| [SECAO: Cadastros e pagamentos]                                  |
| [ ] Criar conta no e-INPI                                        |
| [ ] Gerar GRU (taxa do INPI)                                     |
| [ ] Pagar a GRU (guardar comprovante)                            |
|                                                                   |
| [SECAO: Protocolo]                                               |
| [ ] Acessar o e-Marcas                                           |
| [ ] Preencher formulario de deposito                             |
| [ ] Anexar documentos                                            |
| [ ] Enviar e anotar numero do protocolo                          |
|                                                                   |
| ---                                                               |
|                                                                   |
| Progresso: 2 de 13 itens concluidos                              |
| [========-----------------------------]                           |
|                                                                   |
| [CTA: Baixar checklist em PDF]                                   |
| [CTA2: Compartilhar por email]                                   |
+------------------------------------------------------------------+
```

---

## 8. GERADOR DE RESUMO FINAL (`/resumo`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER logado]                                                   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| H1: Resumo Final - Pronto para Protocolar                       |
|                                                                   |
| "Revise todas as informacoes antes de fazer o pedido no INPI."   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [RESUMO COMPILADO]                                               |
|                                                                   |
| +-- Dados do Titular ----------------------------------------+   |
| | Nome: Joao da Silva                                         |   |
| | CPF: ***.***.***-00                                         |   |
| | Tipo: MEI                                                   |   |
| | [Editar ->]                                                 |   |
| +------------------------------------------------------------+   |
|                                                                   |
| +-- Dados da Marca ------------------------------------------+   |
| | Nome: "Cafe Bonito"                                         |   |
| | Tipo: Mista (nome + logo)                                   |   |
| | Classe Nice: 30 - Cafe, cha, cacau                         |   |
| | [Preview do logo se houver]                                 |   |
| | [Editar ->]                                                 |   |
| +------------------------------------------------------------+   |
|                                                                   |
| +-- Busca Previa --------------------------------------------+   |
| | Status: Feita em 01/04/2026                                 |   |
| | Resultado: Nenhuma marca identica encontrada                |   |
| | [Ver detalhes ->]                                           |   |
| +------------------------------------------------------------+   |
|                                                                   |
| +-- Documentos ----------------------------------------------+   |
| | [check] CPF                                                 |   |
| | [check] CCMEI                                               |   |
| | [check] Logo em alta resolucao                              |   |
| | [  --  ] Procuracao (nao necessario)                        |   |
| +------------------------------------------------------------+   |
|                                                                   |
| +-- Pagamento -----------------------------------------------+   |
| | GRU: Gerada                                                 |   |
| | Valor: R$ 166,00 (desconto MEI)                             |   |
| | Status: Paga                                                |   |
| | Comprovante: [anexado]                                      |   |
| +------------------------------------------------------------+   |
|                                                                   |
| [CAIXA DESTAQUE]                                                 |
| "Tudo certo! Agora voce pode fazer o deposito no e-Marcas.      |
|  Lembre-se: o pedido oficial e feito no site do INPI."           |
|                                                                   |
| [CTA: Abrir e-Marcas (link externo) ->]                         |
| [CTA2: Baixar resumo em PDF]                                    |
| [CTA3: Voltar ao Meu Passo a Passo]                             |
|                                                                   |
| [Disclaimer: "Este resumo e para sua organizacao pessoal.        |
|  O Registrar Certo nao protocola pedidos no INPI."]             |
+------------------------------------------------------------------+
```

---

## 9. CENTRAL DE AJUDA / FAQ (`/ajuda`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER normal]                                                   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| H1: Central de Ajuda                                             |
| "Encontre respostas para as duvidas mais comuns."                |
|                                                                   |
| [Campo de busca: "Digite sua duvida..."]                         |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [CATEGORIAS - tabs ou filtros]                                   |
| [Todas] [Marca] [Patente] [Desenho Ind.] [Geral] [INPI]       |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [FAQ - Accordion]                                                |
|                                                                   |
| [CATEGORIA: Geral]                                               |
|                                                                   |
| [v] Quanto custa registrar no INPI?                              |
|     "O custo depende do tipo de registro e do porte da           |
|      empresa. Para marca, pessoa fisica ou MEI paga              |
|      a partir de R$ 166. Veja os valores atualizados..."        |
|                                                                   |
| [>] Preciso de advogado para registrar?                          |
| [>] Quanto tempo demora o registro?                              |
| [>] Qual a diferenca entre marca, patente e desenho industrial?  |
| [>] O Registrar Certo faz o registro para mim?                  |
|                                                                   |
| [CATEGORIA: Marca]                                               |
|                                                                   |
| [>] Posso registrar marca sendo pessoa fisica?                   |
| [>] Minha marca foi recusada. E agora?                           |
| [>] Preciso registrar em mais de uma classe?                     |
|                                                                   |
| [CATEGORIA: Patente]                                             |
|                                                                   |
| [>] Qual a diferenca entre patente de invencao e modelo?         |
| [>] Posso patentear uma ideia?                                   |
|                                                                   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [SECAO: Nao encontrou sua resposta?]                             |
|                                                                   |
| "Se sua duvida nao esta aqui, pode ser um caso especifico.      |
|  Considere consultar um profissional de propriedade intelectual."|
|                                                                   |
| [Links uteis do INPI]                                            |
| - Manual de Marcas do INPI                                       |
| - Guia Basico de Patentes                                        |
| - Tabela de Retribuicoes (taxas)                                 |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [FOOTER]                                                          |
+------------------------------------------------------------------+
```

---

## 10. BLOG INDEX (`/blog`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER normal]                                                   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| H1: Blog Registrar Certo                                        |
| "Artigos e guias sobre registro de marca, patente e              |
|  propriedade intelectual no Brasil."                              |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [FILTROS]                                                         |
| [Todos] [Marca] [Patente] [Desenho Ind.] [Dicas] [Novidades]   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [POST DESTAQUE - full width]                                     |
| +------------------------------------------------------------+   |
| | [Imagem grande]                    | Categoria: Marca      |   |
| |                                    | H2: Titulo do post    |   |
| |                                    | Resumo do artigo...   |   |
| |                                    | Data | Tempo leitura  |   |
| |                                    | [Ler artigo ->]       |   |
| +------------------------------------------------------------+   |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [GRID DE POSTS - 3 colunas]                                     |
|                                                                   |
| +-- Post 2 -----+ +-- Post 3 -----+ +-- Post 4 -----+          |
| | [thumb]        | | [thumb]        | | [thumb]        |         |
| | Categoria      | | Categoria      | | Categoria      |         |
| | H3: Titulo     | | H3: Titulo     | | H3: Titulo     |         |
| | Resumo...      | | Resumo...      | | Resumo...      |         |
| | Data           | | Data           | | Data           |         |
| +----------------+ +----------------+ +----------------+         |
|                                                                   |
| +-- Post 5 -----+ +-- Post 6 -----+ +-- Post 7 -----+          |
| | ...            | | ...            | | ...            |         |
| +----------------+ +----------------+ +----------------+         |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [PAGINACAO]                                                       |
| [<-] [1] [2] [3] ... [12] [->]                                  |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [CTA SECTION]                                                    |
| "Receba novidades no seu email"                                  |
| [Input: email] [Botao: Inscrever]                                |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [FOOTER]                                                          |
+------------------------------------------------------------------+
```

---

## 11. LOGIN / CADASTRO (`/login` e `/cadastro`)

### Login - Desktop

```
+------------------------------------------------------------------+
| [HEADER minimo: Logo + link Home]                                |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [AREA CENTRAL - max 440px, centralizada]                         |
|                                                                   |
| H1: Entrar                                                       |
|                                                                   |
| [Botao: Entrar com Google]                                       |
|                                                                   |
| --- ou ---                                                        |
|                                                                   |
| Label: Email                                                      |
| [Input: seuemail@exemplo.com]                                    |
|                                                                   |
| Label: Senha                                                      |
| [Input: ********] [Mostrar/ocultar]                              |
|                                                                   |
| [Link: Esqueci minha senha]                                      |
|                                                                   |
| [CTA: Entrar - full width]                                       |
|                                                                   |
| ---                                                               |
|                                                                   |
| "Ainda nao tem conta?"                                           |
| [Link: Criar conta gratuita ->]                                  |
+------------------------------------------------------------------+
```

### Cadastro - Desktop

```
+------------------------------------------------------------------+
| [HEADER minimo: Logo + link Home]                                |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [AREA CENTRAL - max 440px, centralizada]                         |
|                                                                   |
| H1: Criar Conta                                                  |
|                                                                   |
| "Acompanhe seu progresso e salve suas informacoes."              |
|                                                                   |
| [Botao: Cadastrar com Google]                                    |
|                                                                   |
| --- ou ---                                                        |
|                                                                   |
| Label: Nome completo                                              |
| [Input: ____________________]                                    |
|                                                                   |
| Label: Email                                                      |
| [Input: ____________________]                                    |
|                                                                   |
| Label: Senha                                                      |
| [Input: ____________________]                                    |
| (Dica: minimo 8 caracteres)                                     |
|                                                                   |
| [ ] Li e aceito os [Termos de Uso] e a                           |
|     [Politica de Privacidade]                                    |
|                                                                   |
| [CTA: Criar minha conta - full width]                            |
|                                                                   |
| ---                                                               |
|                                                                   |
| "Ja tem conta?"                                                  |
| [Link: Entrar ->]                                                |
+------------------------------------------------------------------+
```

### Mobile (ambos)

```
+-----------------------------------+
| Logo                              |
+-----------------------------------+
| [Formulario full width]           |
| Campos empilhados                 |
| Botoes full width                 |
+-----------------------------------+
```

---

## 12. PAINEL ADMIN (`/admin`)

### Desktop

```
+------------------------------------------------------------------+
| [HEADER ADMIN]                                                    |
| Logo: Registrar Certo (Admin) | [Ir para o site] | [Sair]      |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| [LAYOUT: Sidebar Nav (240px) | Conteudo Principal]               |
|                                                                   |
| SIDEBAR NAV:                                                      |
|                                                                   |
| [*] Dashboard                                                     |
| [ ] Conteudo                                                      |
| [ ] Links Oficiais                                                |
| [ ] Integracoes                                                   |
| [ ] Usuarios                                                      |
| [ ] Metricas                                                      |
| [ ] Configuracoes                                                 |
|                                                                   |
|                                                                   |
| CONTEUDO PRINCIPAL:                                               |
|                                                                   |
| H1: Dashboard                                                    |
|                                                                   |
| [GRID DE METRICAS - 4 colunas]                                  |
| +-- Usuarios --+ +-- Triagens -+ +-- Completos-+ +-- Blog ---+  |
| | 1.247         | | 3.891       | | 89           | | 24 posts |  |
| | +12% semana   | | +8% semana  | | +5% semana   | | 3 draft  |  |
| +--------------+ +-------------+ +--------------+ +-----------+  |
|                                                                   |
| [FUNIL DE CONVERSAO - grafico horizontal]                        |
| Visitas:        ==================== 12.400                       |
| Triagem:        ============= 3.891                               |
| Cadastro:       ======= 1.247                                    |
| Iniciou fluxo:  ==== 634                                         |
| Checklist:      == 312                                            |
| Resumo final:   = 89                                              |
|                                                                   |
| [ALERTAS]                                                         |
| [!] Link do e-Marcas pode estar desatualizado (ultima            |
|     verificacao: 7 dias atras)                                    |
| [!] 3 posts em rascunho ha mais de 30 dias                       |
| [i] Valor da GRU de marca atualizado para 2026                  |
|                                                                   |
| [ATIVIDADE RECENTE]                                              |
| - 14:32 - Usuario #1234 completou etapa "Busca previa"          |
| - 14:15 - Novo cadastro: maria@email.com                        |
| - 13:58 - Triagem concluida -> Marca                            |
| - 13:42 - Usuario #1198 gerou checklist                         |
+------------------------------------------------------------------+
```

### Mobile (Admin)

```
+-----------------------------------+
| [HEADER] [Hamburger admin menu]   |
+-----------------------------------+
| [Metricas empilhadas 2x2]        |
+-----------------------------------+
| [Funil simplificado]             |
+-----------------------------------+
| [Alertas]                         |
+-----------------------------------+
| [Atividade recente]               |
+-----------------------------------+
```

---

## Componentes Reutilizaveis

### Componente: Seu Proximo Passo

```
+------------------------------------------------------+
| {icone seta circular}                                 |
| Texto: "Seu proximo passo:"                          |
| H3: [Nome da proxima etapa]                          |
| Descricao curta da etapa (1 linha)                    |
| [CTA: Ir para essa etapa ->]                         |
+------------------------------------------------------+
```

Usado em: Hub, Dashboard, Sidebar de etapas.

### Componente: Disclaimer

```
+------------------------------------------------------+
| {icone info}                                          |
| "Este site e um guia educativo e operacional.        |
|  O pedido oficial de registro e feito nos sistemas    |
|  do INPI. Nao somos escritorio de advocacia."        |
+------------------------------------------------------+
```

Usado em: Footer, Sidebar, paginas de etapa.

### Componente: Card de Tipo de Registro

```
+------------------------------------------------------+
| {icone do tipo}                                       |
| H3: [Marca / Patente / Desenho Industrial]           |
| Descricao em 1-2 linhas                              |
| Exemplo pratico em italico                            |
| [CTA: Ver passo a passo ->]                          |
+------------------------------------------------------+
```

Usado em: Home, Resultado da triagem.

### Componente: Link Externo Oficial

```
+------------------------------------------------------+
| {icone link externo}                                  |
| [Nome do recurso oficial]                             |
| "Voce sera direcionado para o site do INPI"          |
| [Abrir em nova aba ->]                               |
+------------------------------------------------------+
```

Usado em: Etapas que referenciam sistemas do INPI.

### Componente: Barra de Progresso

```
[o]--[o]--[o]--[*]--[ ]--[ ]--[ ]--[ ]--[ ]--[ ]--[ ]--[ ]
  1    2    3   4    5    6    7    8    9   10   11   12

[o] = concluido (verde)
[*] = etapa atual (azul/destaque)
[ ] = pendente (cinza)
```

Usado em: Hub, Etapas, Dashboard.
