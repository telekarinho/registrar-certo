import type { ProtectionType } from '@/types/journey'

export interface ChecklistTemplate {
  category: string
  items: ChecklistItemTemplate[]
}

export interface ChecklistItemTemplate {
  key: string
  label: string
  description: string
  isRequired: boolean
  conditions?: {
    personType?: ('pf' | 'pj' | 'mei')[]
    brandType?: ('nominativa' | 'figurativa' | 'mista')[]
  }
}

export const CHECKLIST_TEMPLATES: Record<ProtectionType, ChecklistTemplate[]> = {
  MARCA: [
    {
      category: 'Preparação',
      items: [
        {
          key: 'marca_definida',
          label: 'Definir o nome ou logo da marca',
          description: 'Tenha clareza sobre o que será registrado: nome, imagem ou ambos.',
          isRequired: true,
        },
        {
          key: 'busca_previa',
          label: 'Fazer busca prévia no INPI',
          description: 'Verificar se já existe marca igual ou semelhante registrada.',
          isRequired: true,
        },
        {
          key: 'classe_nice',
          label: 'Escolher a classe Nice correta',
          description: 'Identificar em qual categoria de produto ou serviço sua marca se encaixa.',
          isRequired: true,
        },
        {
          key: 'tipo_marca',
          label: 'Definir o tipo de marca',
          description: 'Nominativa (só nome), figurativa (só imagem) ou mista (nome + imagem).',
          isRequired: true,
        },
      ],
    },
    {
      category: 'Documentos',
      items: [
        {
          key: 'cpf_rg',
          label: 'CPF e RG (pessoa física)',
          description: 'Documentos de identificação pessoal.',
          isRequired: true,
          conditions: { personType: ['pf'] },
        },
        {
          key: 'cnpj',
          label: 'CNPJ e Contrato Social',
          description: 'Documentos da empresa.',
          isRequired: true,
          conditions: { personType: ['pj'] },
        },
        {
          key: 'ccmei',
          label: 'CCMEI (Certificado de MEI)',
          description: 'Certificado de Condição de Microempreendedor Individual.',
          isRequired: true,
          conditions: { personType: ['mei'] },
        },
        {
          key: 'logotipo_hd',
          label: 'Logotipo em alta resolução (JPG, 945x945px)',
          description: 'Necessário para marcas figurativas ou mistas. Formato JPG, dimensão 945x945 pixels.',
          isRequired: true,
          conditions: { brandType: ['figurativa', 'mista'] },
        },
        {
          key: 'procuracao',
          label: 'Procuração (se usar representante)',
          description: 'Documento que autoriza outra pessoa a agir em seu nome no INPI.',
          isRequired: false,
        },
      ],
    },
    {
      category: 'Cadastro e Pagamento',
      items: [
        {
          key: 'cadastro_einpi',
          label: 'Criar cadastro no e-INPI',
          description: 'Cadastro no sistema eletrônico do INPI em gov.br/inpi.',
          isRequired: true,
        },
        {
          key: 'gru_emitida',
          label: 'Emitir a GRU (taxa de registro)',
          description: 'Gerar o boleto de pagamento da taxa no sistema do INPI.',
          isRequired: true,
        },
        {
          key: 'gru_paga',
          label: 'Pagar a GRU',
          description: 'Pagar o boleto antes de enviar o pedido. O pagamento precisa ser confirmado.',
          isRequired: true,
        },
      ],
    },
    {
      category: 'Protocolo',
      items: [
        {
          key: 'formulario_emarcas',
          label: 'Preencher formulário no e-Marcas',
          description: 'Acessar o sistema e-Marcas e preencher todos os campos do pedido.',
          isRequired: true,
        },
        {
          key: 'protocolo_enviado',
          label: 'Enviar o pedido e anotar o número do protocolo',
          description: 'Após enviar, anote o número do processo para acompanhamento.',
          isRequired: true,
        },
      ],
    },
    {
      category: 'Acompanhamento',
      items: [
        {
          key: 'acompanhar_rpi',
          label: 'Acompanhar a Revista da Propriedade Industrial',
          description: 'Verificar semanalmente se há publicações sobre seu pedido.',
          isRequired: true,
        },
        {
          key: 'responder_exigencias',
          label: 'Responder exigências (se houver)',
          description: 'Se o INPI solicitar correções, responder dentro do prazo de 60 dias.',
          isRequired: false,
        },
        {
          key: 'responder_oposicao',
          label: 'Responder oposição (se houver)',
          description: 'Se alguém contestar seu pedido, responder dentro do prazo.',
          isRequired: false,
        },
      ],
    },
  ],

  PATENTE: [
    {
      category: 'Avaliação Inicial',
      items: [
        {
          key: 'tipo_patente',
          label: 'Definir tipo: Invenção ou Modelo de Utilidade',
          description: 'Invenção = algo completamente novo. Modelo de Utilidade = melhoria prática.',
          isRequired: true,
        },
        {
          key: 'busca_anterioridade',
          label: 'Fazer busca de anterioridade',
          description: 'Pesquisar se já existe patente similar no Brasil e no mundo.',
          isRequired: true,
        },
        {
          key: 'avaliar_novidade',
          label: 'Avaliar requisitos: novidade, atividade inventiva, aplicação industrial',
          description: 'Sua invenção precisa atender aos 3 requisitos obrigatórios.',
          isRequired: true,
        },
        {
          key: 'sigilo_garantido',
          label: 'Garantir sigilo da invenção',
          description: 'NÃO divulgar a invenção antes do depósito. Isso é essencial!',
          isRequired: true,
        },
      ],
    },
    {
      category: 'Documentos Técnicos',
      items: [
        {
          key: 'relatorio_descritivo',
          label: 'Escrever relatório descritivo',
          description: 'Documento que explica em detalhes como a invenção funciona.',
          isRequired: true,
        },
        {
          key: 'reivindicacoes',
          label: 'Escrever reivindicações',
          description: 'Definir exatamente o que você quer proteger. Independentes e dependentes.',
          isRequired: true,
        },
        {
          key: 'resumo_patente',
          label: 'Escrever resumo da patente',
          description: 'Resumo de até 200 palavras descrevendo a invenção.',
          isRequired: true,
        },
        {
          key: 'desenhos_tecnicos',
          label: 'Preparar desenhos técnicos',
          description: 'Ilustrações técnicas da invenção, seguindo as regras de formato do INPI.',
          isRequired: true,
        },
        {
          key: 'listagem_sequencias',
          label: 'Listagem de sequências (se aplicável)',
          description: 'Necessário para invenções envolvendo sequências biológicas.',
          isRequired: false,
        },
      ],
    },
    {
      category: 'Documentos Pessoais',
      items: [
        {
          key: 'docs_identificacao',
          label: 'Documentos de identificação',
          description: 'CPF/RG (PF), CNPJ/Contrato Social (PJ), ou CCMEI (MEI).',
          isRequired: true,
        },
        {
          key: 'declaracao_inventores',
          label: 'Declaração de inventores',
          description: 'Documento listando todos os inventores e suas contribuições.',
          isRequired: true,
        },
        {
          key: 'cessao_direitos',
          label: 'Cessão de direitos (se aplicável)',
          description: 'Se o inventor não é o depositante, precisa de documento de cessão.',
          isRequired: false,
        },
      ],
    },
    {
      category: 'Cadastro e Pagamento',
      items: [
        {
          key: 'cadastro_einpi',
          label: 'Criar cadastro no e-INPI',
          description: 'Cadastro no sistema eletrônico do INPI.',
          isRequired: true,
        },
        {
          key: 'gru_emitida_paga',
          label: 'Emitir e pagar a GRU',
          description: 'Gerar e pagar o boleto da taxa de depósito.',
          isRequired: true,
        },
      ],
    },
    {
      category: 'Depósito e Acompanhamento',
      items: [
        {
          key: 'deposito_realizado',
          label: 'Realizar o depósito',
          description: 'Enviar o pedido completo pelo sistema de peticionamento do INPI.',
          isRequired: true,
        },
        {
          key: 'acompanhar_publicacoes',
          label: 'Acompanhar publicações na RPI',
          description: 'Monitorar a Revista da Propriedade Industrial semanalmente.',
          isRequired: true,
        },
        {
          key: 'pagar_anuidades',
          label: 'Pagar anuidades (a partir do 3o ano)',
          description: 'Taxas anuais de manutenção da patente.',
          isRequired: true,
        },
      ],
    },
  ],

  DESENHO_INDUSTRIAL: [
    {
      category: 'Preparação',
      items: [
        {
          key: 'definir_di',
          label: 'Definir o que será protegido como DI',
          description: 'A aparência visual/ornamental do produto — formato, cores, linhas.',
          isRequired: true,
        },
        {
          key: 'verificar_originalidade',
          label: 'Verificar originalidade',
          description: 'O design precisa ser novo e não pode ser resultado apenas de função técnica.',
          isRequired: true,
        },
      ],
    },
    {
      category: 'Representações Visuais',
      items: [
        {
          key: 'desenhos_vistas',
          label: 'Preparar desenhos ou fotos com múltiplas vistas',
          description: 'Vista frontal, traseira, lateral esquerda, lateral direita, superior e inferior.',
          isRequired: true,
        },
        {
          key: 'formato_correto',
          label: 'Verificar formato das imagens',
          description: 'Seguir as especificações de formato, resolução e fundo do INPI.',
          isRequired: true,
        },
        {
          key: 'vista_perspectiva',
          label: 'Incluir vista em perspectiva',
          description: 'Uma imagem mostrando o produto em perspectiva 3D.',
          isRequired: true,
        },
      ],
    },
    {
      category: 'Documentos',
      items: [
        {
          key: 'docs_identificacao',
          label: 'Documentos de identificação',
          description: 'CPF/RG (PF), CNPJ/Contrato Social (PJ), ou CCMEI (MEI).',
          isRequired: true,
        },
        {
          key: 'relatorio_descritivo_di',
          label: 'Relatório descritivo (opcional mas recomendado)',
          description: 'Descrição da forma ornamental do objeto.',
          isRequired: false,
        },
      ],
    },
    {
      category: 'Cadastro e Depósito',
      items: [
        {
          key: 'cadastro_einpi',
          label: 'Criar cadastro no e-INPI',
          description: 'Cadastro no sistema eletrônico do INPI.',
          isRequired: true,
        },
        {
          key: 'gru_emitida_paga',
          label: 'Emitir e pagar a GRU',
          description: 'Gerar e pagar o boleto da taxa de depósito de DI.',
          isRequired: true,
        },
        {
          key: 'deposito_realizado',
          label: 'Realizar o depósito',
          description: 'Enviar o pedido pelo sistema do INPI.',
          isRequired: true,
        },
      ],
    },
    {
      category: 'Acompanhamento',
      items: [
        {
          key: 'acompanhar_processo',
          label: 'Acompanhar o processo',
          description: 'Monitorar publicações na Revista da PI.',
          isRequired: true,
        },
        {
          key: 'renovar_di',
          label: 'Renovar registro (a cada 5 anos, até 25 anos)',
          description: 'O DI pode ser renovado por até 3 períodos de 5 anos.',
          isRequired: true,
        },
      ],
    },
  ],
}
