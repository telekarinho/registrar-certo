export interface GlossaryTerm {
  term: string
  simple: string
  detailed?: string
  legalBasis?: string
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'INPI',
    simple: 'O órgão do governo federal responsável por registros de marcas, patentes e designs.',
    detailed: 'Instituto Nacional da Propriedade Industrial — autarquia federal vinculada ao Ministério do Desenvolvimento, Indústria, Comércio e Serviços.',
  },
  {
    term: 'Propriedade Industrial',
    simple: 'O conjunto de direitos sobre marcas, patentes e designs de produtos.',
    legalBasis: 'Lei 9.279/1996 (Lei da Propriedade Industrial).',
  },
  {
    term: 'Marca',
    simple: 'Um nome, logotipo ou símbolo que identifica um produto ou serviço no mercado.',
    detailed: 'Sinal visualmente perceptível que distingue produtos ou serviços de outros similares.',
    legalBasis: 'Art. 122 da Lei 9.279/1996.',
  },
  {
    term: 'Patente de Invenção',
    simple: 'A proteção para algo completamente novo que funciona de um jeito que nunca foi feito.',
    detailed: 'Produto ou processo que atenda aos requisitos de novidade, atividade inventiva e aplicação industrial.',
    legalBasis: 'Art. 8 da Lei 9.279/1996. Validade: 20 anos.',
  },
  {
    term: 'Modelo de Utilidade',
    simple: 'A proteção para uma melhoria prática em algo que já existe.',
    detailed: 'Objeto de uso prático suscetível de aplicação industrial, que apresente nova forma ou disposição.',
    legalBasis: 'Art. 9 da Lei 9.279/1996. Validade: 15 anos.',
  },
  {
    term: 'Desenho Industrial',
    simple: 'A proteção para a aparência visual de um produto — o formato, as linhas, as cores.',
    detailed: 'Forma plástica ornamental de um objeto ou conjunto ornamental de linhas e cores aplicável a um produto.',
    legalBasis: 'Art. 95 da Lei 9.279/1996. Validade: até 25 anos (com renovações).',
  },
  {
    term: 'GRU',
    simple: 'A taxa que você paga ao governo para fazer o pedido. É como um boleto.',
    detailed: 'Guia de Recolhimento da União — documento para pagamento de taxas federais.',
  },
  {
    term: 'e-INPI',
    simple: 'O cadastro online que você precisa ter no site do INPI para usar os sistemas.',
    detailed: 'Sistema de identificação eletrônica do INPI, necessário para acessar todos os serviços online.',
  },
  {
    term: 'e-Marcas',
    simple: 'O sistema online do INPI onde você faz o pedido de registro de marca.',
    detailed: 'Sistema eletrônico de peticionamento para registro de marcas.',
  },
  {
    term: 'Classe Nice',
    simple: 'A categoria do produto ou serviço que sua marca identifica.',
    detailed: 'Classificação Internacional de Nice — sistema de 45 classes que organiza produtos (1-34) e serviços (35-45).',
  },
  {
    term: 'Busca de anterioridade',
    simple: 'Verificar se alguém já registrou algo parecido com o que você quer proteger.',
    detailed: 'Pesquisa em bases de dados de marcas ou patentes para verificar se já existe registro similar.',
  },
  {
    term: 'Reivindicações',
    simple: 'A parte que diz exatamente o que você quer proteger na patente.',
    detailed: 'Conjunto de definições técnicas que delimitam o escopo de proteção da patente.',
  },
  {
    term: 'Relatório descritivo',
    simple: 'O documento que explica em detalhes como sua invenção funciona.',
    detailed: 'Descrição clara e completa da invenção, que permita a um técnico reproduzi-la.',
  },
  {
    term: 'Oposição',
    simple: 'Quando alguém contesta seu pedido de registro, dizendo que tem direitos sobre algo parecido.',
    detailed: 'Manifestação de terceiro contra o pedido de registro, dentro do prazo legal de 60 dias.',
    legalBasis: 'Art. 158 da Lei 9.279/1996.',
  },
  {
    term: 'Exigência',
    simple: 'Quando o INPI pede que você corrija ou complete algo no seu pedido.',
    detailed: 'Solicitação do INPI para que o requerente esclareça, corrija ou complemente o pedido. Prazo: 60 dias.',
  },
  {
    term: 'Concessão',
    simple: 'Quando o INPI aprova seu registro — parabéns, está protegido!',
    detailed: 'Decisão favorável do INPI que confere o direito de exclusividade sobre a marca, patente ou DI.',
  },
  {
    term: 'Anuidade',
    simple: 'A taxa anual que você paga para manter a patente válida.',
    detailed: 'Retribuição anual devida ao INPI para manutenção da patente a partir do 3o ano do depósito.',
  },
  {
    term: 'Depósito',
    simple: 'O ato de enviar oficialmente seu pedido de registro ao INPI.',
    detailed: 'Apresentação formal do pedido de registro ou patente junto ao INPI, gerando um número de processo.',
  },
  {
    term: 'Sigilo',
    simple: 'Manter sua invenção em segredo até depositar a patente — muito importante!',
    detailed: 'Requisito de novidade: a divulgação antes do depósito pode impedir a concessão da patente.',
    legalBasis: 'Art. 11 da Lei 9.279/1996 (período de graça de 12 meses em alguns casos).',
  },
  {
    term: 'Procuração',
    simple: 'Documento que autoriza outra pessoa (advogado ou agente) a agir no INPI em seu nome.',
  },
  {
    term: 'Revista da Propriedade Industrial',
    simple: 'A publicação semanal do INPI onde saem todas as decisões sobre marcas e patentes.',
    detailed: 'RPI — publicação oficial onde são divulgados os atos relativos à propriedade industrial.',
  },
  {
    term: 'Peticionamento eletrônico',
    simple: 'Enviar documentos e pedidos ao INPI pela internet, sem precisar ir pessoalmente.',
  },
  {
    term: 'Colidência',
    simple: 'Quando duas marcas são parecidas demais e podem confundir o consumidor.',
    detailed: 'Semelhança entre sinais que pode causar confusão ou associação indevida no mercado.',
  },
  {
    term: 'Marca nominativa',
    simple: 'Quando a marca é só o nome escrito, sem desenho ou logo.',
  },
  {
    term: 'Marca figurativa',
    simple: 'Quando a marca é uma imagem ou desenho, sem texto.',
  },
  {
    term: 'Marca mista',
    simple: 'Quando a marca combina nome e imagem juntos.',
  },
  {
    term: 'Novidade',
    simple: 'Para ter patente, sua invenção não pode ter sido divulgada antes em nenhum lugar do mundo.',
    legalBasis: 'Art. 11 da Lei 9.279/1996.',
  },
  {
    term: 'Atividade inventiva',
    simple: 'Sua invenção não pode ser algo óbvio para quem entende do assunto.',
    legalBasis: 'Art. 13 da Lei 9.279/1996.',
  },
  {
    term: 'Aplicação industrial',
    simple: 'Sua invenção precisa ser algo que pode ser fabricado ou usado na prática.',
    legalBasis: 'Art. 15 da Lei 9.279/1996.',
  },
]
