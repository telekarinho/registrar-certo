/**
 * Classificação de Nice (NCL) — versão simplificada
 * Usada para sugerir classes de proteção de marca baseado no negócio.
 */

export interface NiceClass {
  number: number
  type: 'product' | 'service'
  title: string
  shortDescription: string
  examples: string[]
  keywords: string[]
}

export const NICE_CLASSES: NiceClass[] = [
  {
    number: 25,
    type: 'product',
    title: 'Roupas, calçados e acessórios',
    shortDescription: 'Vestuário, calçados, chapéus',
    examples: ['camisetas', 'tênis', 'bonés', 'jaquetas'],
    keywords: ['roupa', 'camiseta', 'calçado', 'tênis', 'moda', 'vestuário', 'sapato', 'boné'],
  },
  {
    number: 29,
    type: 'product',
    title: 'Alimentos: carnes, laticínios, conservas',
    shortDescription: 'Carnes, peixes, ovos, leite, óleos comestíveis',
    examples: ['queijo', 'iogurte', 'manteiga', 'carne'],
    keywords: ['queijo', 'iogurte', 'leite', 'manteiga', 'carne', 'frango', 'peixe', 'ovo'],
  },
  {
    number: 30,
    type: 'product',
    title: 'Alimentos: cafés, doces, sorvetes, açaí',
    shortDescription: 'Café, chá, açúcar, doces, sorvetes, chocolates, sobremesas geladas',
    examples: ['sorvete', 'chocolate', 'açaí em produto pronto', 'doces', 'milkshake', 'café', 'bolo'],
    keywords: ['sorvete', 'açaí', 'chocolate', 'doce', 'milkshake', 'milk shake', 'café', 'bolo', 'biscoito', 'sobremesa', 'gelado', 'pão'],
  },
  {
    number: 32,
    type: 'product',
    title: 'Bebidas não alcoólicas',
    shortDescription: 'Sucos, refrigerantes, águas, energéticos',
    examples: ['suco', 'refrigerante', 'água mineral', 'energético'],
    keywords: ['suco', 'bebida', 'refrigerante', 'água', 'energético', 'isotônico'],
  },
  {
    number: 33,
    type: 'product',
    title: 'Bebidas alcoólicas',
    shortDescription: 'Vinhos, cervejas, destilados (exceto cerveja: classe 32)',
    examples: ['vinho', 'cachaça', 'gin', 'destilados'],
    keywords: ['vinho', 'cerveja', 'cachaça', 'gin', 'whisky', 'destilado'],
  },
  {
    number: 35,
    type: 'service',
    title: 'Serviços de franquia, publicidade, gestão',
    shortDescription: 'Franquias, publicidade, varejo, gestão de negócios',
    examples: ['rede de franquias', 'loja virtual', 'agência de marketing'],
    keywords: ['franquia', 'franchising', 'publicidade', 'marketing', 'gestão', 'varejo', 'e-commerce', 'loja online'],
  },
  {
    number: 41,
    type: 'service',
    title: 'Educação, treinamento, entretenimento',
    shortDescription: 'Cursos, escolas, eventos, entretenimento',
    examples: ['curso online', 'escola', 'evento', 'show'],
    keywords: ['curso', 'escola', 'educação', 'treinamento', 'evento', 'show', 'entretenimento'],
  },
  {
    number: 42,
    type: 'service',
    title: 'Tecnologia, software, design',
    shortDescription: 'Desenvolvimento de software, design, consultoria de TI',
    examples: ['app', 'site', 'sistema', 'consultoria de TI'],
    keywords: ['software', 'app', 'aplicativo', 'site', 'desenvolvimento', 'tecnologia', 'design', 'TI', 'sistema'],
  },
  {
    number: 43,
    type: 'service',
    title: 'Restaurantes, lanchonetes, sorveterias, cafés',
    shortDescription: 'Serviços de fornecimento de alimentos e bebidas',
    examples: ['restaurante', 'lanchonete', 'sorveteria', 'café', 'açaiteria', 'food truck'],
    keywords: ['restaurante', 'lanchonete', 'sorveteria', 'açaiteria', 'café', 'cafeteria', 'bar', 'food truck', 'delivery', 'comida'],
  },
  {
    number: 44,
    type: 'service',
    title: 'Saúde, beleza, estética',
    shortDescription: 'Serviços médicos, estética, salões',
    examples: ['salão de beleza', 'clínica', 'spa', 'barbearia'],
    keywords: ['salão', 'beleza', 'estética', 'clínica', 'médico', 'spa', 'barbearia', 'cabeleireiro'],
  },
  {
    number: 45,
    type: 'service',
    title: 'Serviços jurídicos, segurança, sociais',
    shortDescription: 'Advocacia, segurança privada, agências matrimoniais',
    examples: ['escritório de advocacia', 'segurança privada'],
    keywords: ['advogado', 'jurídico', 'segurança', 'lei', 'direito'],
  },
]

/**
 * Detecta classes Nice prováveis baseado em descrição livre do negócio.
 * Retorna ordenado por relevância (mais matches primeiro).
 */
export function detectNiceClasses(businessDescription: string): NiceClass[] {
  const text = businessDescription.toLowerCase()
  const scored: { class: NiceClass; score: number }[] = []

  for (const niceClass of NICE_CLASSES) {
    let score = 0
    for (const keyword of niceClass.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += 1
      }
    }
    if (score > 0) {
      scored.push({ class: niceClass, score })
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .map((s) => s.class)
}

/**
 * Sugestões pré-mapeadas para tipos de negócio comuns.
 * Use quando o usuário escolhe uma categoria pronta.
 */
export const BUSINESS_PRESETS: Record<string, { name: string; classes: number[]; description: string }> = {
  'sorveteria-acaiteria': {
    name: 'Sorveteria / Açaiteria / Milkshake',
    description: 'Loja física que vende sorvete, açaí ou milkshake na hora',
    classes: [30, 43],
  },
  'franquia-alimentos': {
    name: 'Franquia de alimentos / bebidas',
    description: 'Rede de franquias do ramo alimentício (sorveteria, hamburgueria, etc.)',
    classes: [30, 35, 43],
  },
  'restaurante': {
    name: 'Restaurante / Lanchonete',
    description: 'Estabelecimento que serve refeições',
    classes: [43],
  },
  'cafeteria': {
    name: 'Cafeteria',
    description: 'Cafeteria que serve cafés, salgados e doces',
    classes: [30, 43],
  },
  'roupas': {
    name: 'Loja de roupas',
    description: 'Loja física ou online de vestuário',
    classes: [25, 35],
  },
  'app-software': {
    name: 'App ou Software',
    description: 'Aplicativo, plataforma digital ou software',
    classes: [9, 42],
  },
  'curso-educacao': {
    name: 'Curso ou Escola',
    description: 'Educação, treinamento, cursos online ou presenciais',
    classes: [41],
  },
  'salao-beleza': {
    name: 'Salão de beleza / Estética',
    description: 'Salão, barbearia, clínica de estética',
    classes: [44],
  },
  'consultoria': {
    name: 'Consultoria / Serviços profissionais',
    description: 'Consultoria empresarial, assessoria',
    classes: [35],
  },
  'outro': {
    name: 'Outro tipo de negócio',
    description: 'Vou descrever meu negócio',
    classes: [],
  },
}
