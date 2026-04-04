import type { TriageQuestion } from '@/types/triage'

export const TRIAGE_QUESTIONS: TriageQuestion[] = [
  {
    key: 'q1_what_to_protect',
    question: 'O que você quer proteger?',
    helpText: 'Pense no principal motivo que trouxe você aqui.',
    options: [
      {
        value: 'nome_logo',
        label: 'Um nome, logotipo ou símbolo',
        description: 'Algo que identifica seu produto, serviço ou empresa.',
        example: 'Ex: o nome "Café Bom Dia", o logo da sua loja, um símbolo que representa sua marca.',
        scores: { MARCA: 3 },
      },
      {
        value: 'invencao',
        label: 'Uma invenção ou processo novo',
        description: 'Algo que funciona de um jeito que nunca foi feito antes.',
        example: 'Ex: um mecanismo de filtragem de água, um novo tipo de fechadura, um processo químico.',
        scores: { PATENTE: 3 },
      },
      {
        value: 'visual',
        label: 'O visual ou aparência de um produto',
        description: 'O formato, design ou aparência externa de algo.',
        example: 'Ex: o formato de uma garrafa, o design de uma cadeira, a aparência de uma embalagem.',
        scores: { DESENHO_INDUSTRIAL: 3 },
      },
      {
        value: 'nao_sei',
        label: 'Não tenho certeza',
        description: 'Vamos descobrir juntos nas próximas perguntas.',
        scores: {},
      },
    ],
  },
  {
    key: 'q2_best_description',
    question: 'O que melhor descreve o que você criou?',
    helpText: 'Escolha a opção que mais se aproxima da sua situação.',
    options: [
      {
        value: 'identifica_negocio',
        label: 'Um nome ou imagem que identifica meu negócio',
        description: 'As pessoas reconhecem seu produto ou serviço por esse nome ou imagem.',
        scores: { MARCA: 2 },
      },
      {
        value: 'funciona_diferente',
        label: 'Algo que funciona de um jeito novo',
        description: 'Você inventou ou melhorou a forma como algo funciona tecnicamente.',
        scores: { PATENTE: 2 },
      },
      {
        value: 'melhoria_pratica',
        label: 'Uma melhoria prática em algo que já existe',
        description: 'Você encontrou uma forma mais simples ou eficiente de fazer algo que já existia.',
        scores: { PATENTE: 1 },
      },
      {
        value: 'formato_design',
        label: 'Um formato visual ou design exclusivo',
        description: 'O que diferencia é a aparência, não o funcionamento.',
        scores: { DESENHO_INDUSTRIAL: 2 },
      },
    ],
  },
  {
    key: 'q3_main_aspect',
    question: 'Sobre a parte principal da sua proteção:',
    helpText: 'Pense no que é mais importante proteger.',
    options: [
      {
        value: 'reconhecimento',
        label: 'Como as pessoas reconhecem meu produto ou serviço',
        description: 'O foco é na identidade e no reconhecimento no mercado.',
        scores: { MARCA: 2 },
      },
      {
        value: 'funcionamento',
        label: 'Como meu produto funciona tecnicamente',
        description: 'O foco é no mecanismo, processo ou tecnologia.',
        scores: { PATENTE: 2 },
      },
      {
        value: 'aparencia',
        label: 'Como meu produto se parece visualmente',
        description: 'O foco é no design, formato ou estética.',
        scores: { DESENHO_INDUSTRIAL: 2 },
      },
    ],
  },
  {
    key: 'q4_prior_search',
    question: 'Você já pesquisou se existe algo parecido registrado?',
    helpText: 'Antes de registrar, é importante verificar se não existe algo similar.',
    options: [
      {
        value: 'sim',
        label: 'Sim, já pesquisei',
        description: 'Ótimo! Isso ajuda a evitar problemas no futuro.',
        scores: {},
      },
      {
        value: 'nao',
        label: 'Não, ainda não',
        description: 'Sem problema — vamos te ajudar com isso no passo a passo.',
        scores: {},
      },
    ],
  },
  {
    key: 'q5_person_type',
    question: 'Você é:',
    helpText: 'Isso influencia os documentos necessários e os valores das taxas.',
    options: [
      {
        value: 'pf',
        label: 'Pessoa Física',
        description: 'CPF — tem desconto nas taxas do INPI.',
        scores: {},
      },
      {
        value: 'pj',
        label: 'Pessoa Jurídica',
        description: 'CNPJ de empresa — valores padrão das taxas.',
        scores: {},
      },
      {
        value: 'mei',
        label: 'MEI (Microempreendedor Individual)',
        description: 'Tem desconto significativo nas taxas do INPI.',
        scores: {},
      },
    ],
  },
  {
    key: 'q6_in_use',
    question: 'Seu produto ou marca já está em uso no mercado?',
    helpText: 'Isso pode influenciar a urgência e o tipo de proteção.',
    options: [
      {
        value: 'sim',
        label: 'Sim, já está em uso',
        description: 'Importante proteger o quanto antes para evitar problemas.',
        scores: {},
      },
      {
        value: 'nao',
        label: 'Ainda não',
        description: 'Ótimo momento para garantir a proteção antes de lançar.',
        scores: {},
      },
      {
        value: 'desenvolvimento',
        label: 'Em desenvolvimento',
        description: 'Considere proteger antes de mostrar para outros.',
        scores: {},
      },
    ],
  },
]
