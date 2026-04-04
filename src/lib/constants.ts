// === Proteção ===
export const PROTECTION_TYPES = {
  MARCA: 'MARCA',
  PATENTE: 'PATENTE',
  DESENHO_INDUSTRIAL: 'DESENHO_INDUSTRIAL',
} as const

export type ProtectionType = (typeof PROTECTION_TYPES)[keyof typeof PROTECTION_TYPES]

export const PROTECTION_LABELS: Record<ProtectionType, string> = {
  MARCA: 'Registro de Marca',
  PATENTE: 'Registro de Patente',
  DESENHO_INDUSTRIAL: 'Registro de Desenho Industrial',
}

export const PROTECTION_DESCRIPTIONS: Record<ProtectionType, string> = {
  MARCA: 'Protege nomes, logotipos e sinais que identificam produtos ou serviços.',
  PATENTE: 'Protege invenções e modelos de utilidade — o jeito como algo funciona.',
  DESENHO_INDUSTRIAL: 'Protege a aparência visual e ornamental de um produto.',
}

// === Links Oficiais ===
export const OFFICIAL_LINKS = {
  INPI_HOME: 'https://www.gov.br/inpi',
  E_INPI_CADASTRO: 'https://www.gov.br/inpi/pt-br/servicos/sistemas/e-inpi',
  E_MARCAS: 'https://www.gov.br/inpi/pt-br/servicos/marcas',
  BUSCA_MARCAS: 'https://busca.inpi.gov.br/pePI/jsp/marcas/Pesquisa_classe_702.jsp',
  BUSCA_PATENTES: 'https://busca.inpi.gov.br/pePI/jsp/patentes/PatenteSearchBasico.jsp',
  GRU: 'https://www.gov.br/inpi/pt-br/servicos/tabelas-de-retribuicao',
  REVISTA_PI: 'http://revistas.inpi.gov.br/rpi/',
  NICE_CLASSIFICATION: 'https://www.gov.br/inpi/pt-br/servicos/marcas/classificacao-de-produtos-e-servicos',
}

// === Planos ===
export const PLAN_TIERS = {
  FREE: 'FREE',
  PLUS: 'PLUS',
  PREMIUM: 'PREMIUM',
} as const

export type PlanTier = (typeof PLAN_TIERS)[keyof typeof PLAN_TIERS]

export const PLAN_FEATURES: Record<PlanTier, string[]> = {
  FREE: [
    'Triagem inteligente',
    'Checklist básico',
    'Links oficiais',
    'Progresso simples',
    'Até 1 jornada ativa',
  ],
  PLUS: [
    'Tudo do plano Grátis',
    'PDF avançado com resumo',
    'Notificações e lembretes',
    'Histórico completo',
    'Recomendações extras',
    'Até 3 jornadas ativas',
  ],
  PREMIUM: [
    'Tudo do plano Plus',
    'Revisão por especialista',
    'Apoio na montagem documental',
    'Apoio estratégico',
    'Acompanhamento premium',
    'Jornadas ilimitadas',
  ],
}

// === Etapas por Tipo ===
export const MARCA_STEPS = [
  { order: 1, slug: 'o-que-e', title: 'O que é marca', description: 'Entenda o que pode ser registrado como marca' },
  { order: 2, slug: 'o-que-pode', title: 'O que pode e não pode', description: 'Regras para registro de marca' },
  { order: 3, slug: 'busca-previa', title: 'Busca prévia', description: 'Verifique se sua marca já existe' },
  { order: 4, slug: 'classe-nice', title: 'Classificação Nice', description: 'Escolha a categoria certa' },
  { order: 5, slug: 'documentos', title: 'Documentos', description: 'Organize o que é necessário' },
  { order: 6, slug: 'cadastro-einpi', title: 'Cadastro no e-INPI', description: 'Crie sua conta no sistema do INPI' },
  { order: 7, slug: 'gru', title: 'Emissão da GRU', description: 'Gere o boleto de pagamento' },
  { order: 8, slug: 'pagamento', title: 'Pagamento', description: 'Pague a taxa de registro' },
  { order: 9, slug: 'protocolo', title: 'Protocolo no e-Marcas', description: 'Envie o pedido oficial' },
  { order: 10, slug: 'acompanhamento', title: 'Acompanhamento', description: 'Acompanhe seu pedido' },
  { order: 11, slug: 'oposicao', title: 'Oposição e Exigência', description: 'Saiba o que fazer se houver contestação' },
  { order: 12, slug: 'concessao', title: 'Concessão', description: 'Sua marca foi aprovada!' },
  { order: 13, slug: 'renovacao', title: 'Renovação', description: 'Mantenha seu registro válido' },
] as const

export const PATENTE_STEPS = [
  { order: 1, slug: 'quando-patentear', title: 'Quando faz sentido patentear', description: 'Avalie se a patente é o caminho' },
  { order: 2, slug: 'tipos', title: 'Invenção vs Modelo de Utilidade', description: 'Entenda os dois tipos de patente' },
  { order: 3, slug: 'busca-anterioridade', title: 'Busca de anterioridade', description: 'Veja se já existe algo parecido' },
  { order: 4, slug: 'sigilo', title: 'Sigilo antes do depósito', description: 'Mantenha sua invenção em segredo' },
  { order: 5, slug: 'documentos', title: 'Documentos técnicos', description: 'Prepare a documentação necessária' },
  { order: 6, slug: 'relatorio', title: 'Relatório descritivo', description: 'Descreva sua invenção em detalhes' },
  { order: 7, slug: 'reivindicacoes', title: 'Reivindicações', description: 'Defina exatamente o que quer proteger' },
  { order: 8, slug: 'resumo', title: 'Resumo', description: 'Escreva o resumo da patente' },
  { order: 9, slug: 'desenhos', title: 'Desenhos técnicos', description: 'Prepare os desenhos da invenção' },
  { order: 10, slug: 'cadastro', title: 'Cadastro e pagamento', description: 'Cadastro no e-INPI e GRU' },
  { order: 11, slug: 'deposito', title: 'Depósito', description: 'Envie o pedido oficial' },
  { order: 12, slug: 'acompanhamento', title: 'Acompanhamento', description: 'Acompanhe o exame da patente' },
  { order: 13, slug: 'exame', title: 'Exame técnico', description: 'Entenda o processo de análise' },
  { order: 14, slug: 'concessao', title: 'Concessão e manutenção', description: 'Patente concedida e anuidades' },
] as const

export const DI_STEPS = [
  { order: 1, slug: 'o-que-e', title: 'O que é Desenho Industrial', description: 'Entenda o que é DI' },
  { order: 2, slug: 'quando-usar', title: 'Quando usar DI', description: 'DI vs Patente — qual escolher' },
  { order: 3, slug: 'preparacao', title: 'O que preparar', description: 'Documentos e materiais necessários' },
  { order: 4, slug: 'desenhos', title: 'Desenhos e fotos', description: 'Prepare as representações visuais' },
  { order: 5, slug: 'cadastro', title: 'Cadastro e GRU', description: 'Cadastro no e-INPI e pagamento' },
  { order: 6, slug: 'deposito', title: 'Depósito', description: 'Envie o pedido oficial' },
  { order: 7, slug: 'acompanhamento', title: 'Acompanhamento', description: 'Acompanhe seu pedido' },
  { order: 8, slug: 'concessao', title: 'Concessão e renovação', description: 'DI concedido e como renovar' },
] as const

// === Analytics Events ===
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  CTA_CLICK: 'cta_click',
  TRIAGE_START: 'triage_start',
  TRIAGE_QUESTION_ANSWERED: 'triage_question_answered',
  TRIAGE_COMPLETE: 'triage_complete',
  TRIAGE_RESULT: 'triage_result',
  SIGNUP_START: 'signup_start',
  SIGNUP_COMPLETE: 'signup_complete',
  LOGIN: 'login',
  JOURNEY_START: 'journey_start',
  JOURNEY_STEP_VIEW: 'journey_step_view',
  JOURNEY_STEP_COMPLETE: 'journey_step_complete',
  JOURNEY_ABANDONED: 'journey_abandoned',
  JOURNEY_RESUMED: 'journey_resumed',
  JOURNEY_COMPLETE: 'journey_complete',
  CHECKLIST_GENERATED: 'checklist_generated',
  CHECKLIST_ITEM_CHECKED: 'checklist_item_checked',
  PDF_GENERATED: 'pdf_generated',
  OFFICIAL_LINK_CLICK: 'official_link_click',
  HELP_CLICK: 'help_click',
  NOT_UNDERSTOOD_CLICK: 'not_understood_click',
  CONTINUE_LATER_CLICK: 'continue_later_click',
  EMAIL_OPENED: 'email_opened',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  LEAD_MAGNET_DOWNLOAD: 'lead_magnet_download',
  UPGRADE_CTA_CLICK: 'upgrade_cta_click',
} as const
