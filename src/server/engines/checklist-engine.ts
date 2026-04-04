import { prisma } from '@/server/lib/prisma';
import type { ProtectionType } from './journey-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PersonType = 'PF' | 'PJ' | 'MEI';

export interface ChecklistItemDefinition {
  id: string;
  label: string;
  description: string;
  /** Category grouping for UI display */
  category: string;
  /** Order within the category */
  order: number;
  /** Whether this item applies to all person types or specific ones */
  applicableTo: PersonType[] | 'ALL';
  /** Whether this item is conditionally included based on journey answers */
  condition?: (answers: Record<string, unknown>) => boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  category: string;
  order: number;
  completed: boolean;
  completedAt: Date | null;
}

export interface Checklist {
  id: string;
  journeyId: string;
  items: ChecklistItem[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistProgress {
  total: number;
  completed: number;
  percentage: number;
  byCategory: Record<string, { total: number; completed: number }>;
}

// ---------------------------------------------------------------------------
// Checklist templates per protection type
// ---------------------------------------------------------------------------

const MARCA_CHECKLIST: ChecklistItemDefinition[] = [
  // Documentacao Pessoal
  {
    id: 'marca-doc-cpf',
    label: 'CPF do titular',
    description: 'Copia do CPF do titular da marca.',
    category: 'Documentacao Pessoal',
    order: 1,
    applicableTo: ['PF'],
  },
  {
    id: 'marca-doc-cnpj',
    label: 'CNPJ da empresa',
    description: 'Cartao CNPJ atualizado emitido pela Receita Federal.',
    category: 'Documentacao Pessoal',
    order: 1,
    applicableTo: ['PJ', 'MEI'],
  },
  {
    id: 'marca-doc-rg',
    label: 'Documento de identidade',
    description: 'RG ou CNH do titular ou representante legal.',
    category: 'Documentacao Pessoal',
    order: 2,
    applicableTo: 'ALL',
  },
  {
    id: 'marca-doc-contrato-social',
    label: 'Contrato Social ou Requerimento de Empresario',
    description: 'Documento constitutivo da empresa atualizado.',
    category: 'Documentacao Pessoal',
    order: 3,
    applicableTo: ['PJ'],
  },
  {
    id: 'marca-doc-ccmei',
    label: 'Certificado de Condicao de MEI (CCMEI)',
    description: 'Certificado emitido pelo Portal do Empreendedor.',
    category: 'Documentacao Pessoal',
    order: 3,
    applicableTo: ['MEI'],
  },
  {
    id: 'marca-doc-procuracao',
    label: 'Procuracao (se aplicavel)',
    description: 'Procuracao caso um representante faca o pedido.',
    category: 'Documentacao Pessoal',
    order: 4,
    applicableTo: 'ALL',
    condition: (answers) => answers.hasRepresentative === true,
  },

  // Preparacao da Marca
  {
    id: 'marca-prep-nome',
    label: 'Nome da marca definido',
    description: 'Defina o nome exato que deseja registrar.',
    category: 'Preparacao da Marca',
    order: 1,
    applicableTo: 'ALL',
  },
  {
    id: 'marca-prep-logotipo',
    label: 'Logotipo em alta resolucao (JPG/PNG)',
    description: 'Imagem do logotipo em alta resolucao (minimo 945x945 pixels).',
    category: 'Preparacao da Marca',
    order: 2,
    applicableTo: 'ALL',
    condition: (answers) =>
      answers.brandPresentation === 'FIGURATIVA' || answers.brandPresentation === 'MISTA',
  },
  {
    id: 'marca-prep-classe-nice',
    label: 'Classe Nice escolhida',
    description: 'Identifique a classe de produtos/servicos (1 a 45).',
    category: 'Preparacao da Marca',
    order: 3,
    applicableTo: 'ALL',
  },
  {
    id: 'marca-prep-especificacao',
    label: 'Especificacao de produtos/servicos',
    description: 'Liste os produtos ou servicos dentro da classe escolhida.',
    category: 'Preparacao da Marca',
    order: 4,
    applicableTo: 'ALL',
  },
  {
    id: 'marca-prep-pesquisa',
    label: 'Pesquisa de anterioridade realizada',
    description: 'Verifique marcas similares ja registradas no INPI.',
    category: 'Preparacao da Marca',
    order: 5,
    applicableTo: 'ALL',
  },

  // Cadastro e Pagamento
  {
    id: 'marca-cad-einpi',
    label: 'Cadastro no e-INPI criado',
    description: 'Crie sua conta no sistema eletronico do INPI (e-INPI).',
    category: 'Cadastro e Pagamento',
    order: 1,
    applicableTo: 'ALL',
  },
  {
    id: 'marca-cad-gru',
    label: 'GRU gerada e paga',
    description: 'Gere e pague a Guia de Recolhimento da Uniao.',
    category: 'Cadastro e Pagamento',
    order: 2,
    applicableTo: 'ALL',
  },
  {
    id: 'marca-cad-comprovante',
    label: 'Comprovante de pagamento salvo',
    description: 'Guarde o comprovante de pagamento da GRU.',
    category: 'Cadastro e Pagamento',
    order: 3,
    applicableTo: 'ALL',
  },

  // Protocolo
  {
    id: 'marca-proto-formulario',
    label: 'Formulario preenchido no e-INPI',
    description: 'Preencha o formulario eletronico de pedido de registro.',
    category: 'Protocolo',
    order: 1,
    applicableTo: 'ALL',
  },
  {
    id: 'marca-proto-protocolo',
    label: 'Pedido protocolado',
    description: 'Submeta o pedido e salve o numero de protocolo.',
    category: 'Protocolo',
    order: 2,
    applicableTo: 'ALL',
  },
];

const PATENTE_CHECKLIST: ChecklistItemDefinition[] = [
  // Documentacao Pessoal
  {
    id: 'pat-doc-cpf',
    label: 'CPF do inventor',
    description: 'Copia do CPF do inventor ou titular.',
    category: 'Documentacao Pessoal',
    order: 1,
    applicableTo: ['PF'],
  },
  {
    id: 'pat-doc-cnpj',
    label: 'CNPJ da empresa titular',
    description: 'Cartao CNPJ atualizado.',
    category: 'Documentacao Pessoal',
    order: 1,
    applicableTo: ['PJ'],
  },
  {
    id: 'pat-doc-rg',
    label: 'Documento de identidade',
    description: 'RG ou CNH do inventor ou representante legal.',
    category: 'Documentacao Pessoal',
    order: 2,
    applicableTo: 'ALL',
  },
  {
    id: 'pat-doc-cessao',
    label: 'Documento de cessao de direitos (se aplicavel)',
    description: 'Se a patente foi desenvolvida em empresa, e necessario documento de cessao.',
    category: 'Documentacao Pessoal',
    order: 3,
    applicableTo: 'ALL',
    condition: (answers) => answers.inventedAtCompany === true,
  },
  {
    id: 'pat-doc-procuracao',
    label: 'Procuracao (se aplicavel)',
    description: 'Procuracao caso um representante faca o pedido.',
    category: 'Documentacao Pessoal',
    order: 4,
    applicableTo: 'ALL',
    condition: (answers) => answers.hasRepresentative === true,
  },

  // Documentacao Tecnica
  {
    id: 'pat-tec-relatorio',
    label: 'Relatorio descritivo redigido',
    description: 'Descricao detalhada da invencao seguindo normas do INPI.',
    category: 'Documentacao Tecnica',
    order: 1,
    applicableTo: 'ALL',
  },
  {
    id: 'pat-tec-reivindicacoes',
    label: 'Reivindicacoes elaboradas',
    description: 'Defina o escopo de protecao desejado.',
    category: 'Documentacao Tecnica',
    order: 2,
    applicableTo: 'ALL',
  },
  {
    id: 'pat-tec-desenhos',
    label: 'Desenhos tecnicos preparados',
    description: 'Ilustracoes da invencao conforme normas INPI.',
    category: 'Documentacao Tecnica',
    order: 3,
    applicableTo: 'ALL',
    condition: (answers) => answers.hasDrawings !== false,
  },
  {
    id: 'pat-tec-resumo',
    label: 'Resumo redigido',
    description: 'Resumo conciso da invencao (max. 200 palavras).',
    category: 'Documentacao Tecnica',
    order: 4,
    applicableTo: 'ALL',
  },
  {
    id: 'pat-tec-ipc',
    label: 'Classificacao IPC identificada',
    description: 'Identifique a Classificacao Internacional de Patentes.',
    category: 'Documentacao Tecnica',
    order: 5,
    applicableTo: 'ALL',
  },
  {
    id: 'pat-tec-pesquisa',
    label: 'Pesquisa de estado da tecnica realizada',
    description: 'Pesquise patentes existentes para confirmar novidade.',
    category: 'Documentacao Tecnica',
    order: 6,
    applicableTo: 'ALL',
  },

  // Cadastro e Pagamento
  {
    id: 'pat-cad-einpi',
    label: 'Cadastro no e-INPI criado',
    description: 'Crie sua conta no sistema eletronico do INPI.',
    category: 'Cadastro e Pagamento',
    order: 1,
    applicableTo: 'ALL',
  },
  {
    id: 'pat-cad-gru',
    label: 'GRU gerada e paga',
    description: 'Gere e pague a Guia de Recolhimento da Uniao.',
    category: 'Cadastro e Pagamento',
    order: 2,
    applicableTo: 'ALL',
  },

  // Protocolo
  {
    id: 'pat-proto-pedido',
    label: 'Pedido protocolado no e-INPI',
    description: 'Submeta o pedido de patente e salve o protocolo.',
    category: 'Protocolo',
    order: 1,
    applicableTo: 'ALL',
  },
];

const DESENHO_INDUSTRIAL_CHECKLIST: ChecklistItemDefinition[] = [
  {
    id: 'di-doc-cpf',
    label: 'CPF do autor',
    description: 'Copia do CPF do criador do desenho.',
    category: 'Documentacao Pessoal',
    order: 1,
    applicableTo: ['PF'],
  },
  {
    id: 'di-doc-cnpj',
    label: 'CNPJ da empresa',
    description: 'Cartao CNPJ atualizado.',
    category: 'Documentacao Pessoal',
    order: 1,
    applicableTo: ['PJ', 'MEI'],
  },
  {
    id: 'di-doc-rg',
    label: 'Documento de identidade',
    description: 'RG ou CNH do autor ou representante legal.',
    category: 'Documentacao Pessoal',
    order: 2,
    applicableTo: 'ALL',
  },
  {
    id: 'di-prep-imagens',
    label: 'Representacoes graficas preparadas',
    description: 'Imagens do desenho industrial conforme normas do INPI.',
    category: 'Preparacao do Design',
    order: 1,
    applicableTo: 'ALL',
  },
  {
    id: 'di-prep-pesquisa',
    label: 'Pesquisa de anterioridade realizada',
    description: 'Verifique desenhos industriais similares ja registrados.',
    category: 'Preparacao do Design',
    order: 2,
    applicableTo: 'ALL',
  },
  {
    id: 'di-cad-einpi',
    label: 'Cadastro no e-INPI criado',
    description: 'Crie sua conta no sistema eletronico do INPI.',
    category: 'Cadastro e Pagamento',
    order: 1,
    applicableTo: 'ALL',
  },
  {
    id: 'di-cad-gru',
    label: 'GRU gerada e paga',
    description: 'Gere e pague a GRU correspondente.',
    category: 'Cadastro e Pagamento',
    order: 2,
    applicableTo: 'ALL',
  },
  {
    id: 'di-proto-pedido',
    label: 'Pedido protocolado',
    description: 'Submeta o pedido e salve o numero de protocolo.',
    category: 'Protocolo',
    order: 1,
    applicableTo: 'ALL',
  },
];

const CHECKLIST_TEMPLATES: Record<ProtectionType, ChecklistItemDefinition[]> = {
  MARCA: MARCA_CHECKLIST,
  PATENTE: PATENTE_CHECKLIST,
  DESENHO_INDUSTRIAL: DESENHO_INDUSTRIAL_CHECKLIST,
};

// ---------------------------------------------------------------------------
// ChecklistEngine
// ---------------------------------------------------------------------------

export class ChecklistEngine {
  /**
   * Generate a personalized checklist for a journey.
   * Filters items based on the user's person type (PF/PJ/MEI) and journey answers.
   * If a checklist already exists for the journey, returns it instead.
   */
  async generateChecklist(journeyId: string): Promise<Checklist> {
    // Check for existing checklist
    const existing = await prisma.checklist.findUnique({
      where: { journeyId },
      include: { items: { orderBy: [{ category: 'asc' }, { order: 'asc' }] } },
    });

    if (existing) {
      return this.mapChecklistFromDb(existing);
    }

    // Fetch journey and user data
    const journey = await prisma.journey.findUnique({
      where: { id: journeyId },
      include: { user: true },
    });

    if (!journey) {
      throw new ChecklistError('JOURNEY_NOT_FOUND', 'Jornada nao encontrada.');
    }

    const protectionType = journey.protectionType as ProtectionType;
    const personType = (journey.user.personType as PersonType) ?? 'PF';
    const answers = (journey.answers as Record<string, unknown>) ?? {};
    const template = CHECKLIST_TEMPLATES[protectionType];

    if (!template) {
      throw new ChecklistError('INVALID_PROTECTION_TYPE', 'Tipo de protecao invalido.');
    }

    // Filter items by person type and conditions
    const applicableItems = template.filter((item) => {
      // Check person type applicability
      if (item.applicableTo !== 'ALL' && !item.applicableTo.includes(personType)) {
        return false;
      }
      // Check conditional items
      if (item.condition && !item.condition(answers)) {
        return false;
      }
      return true;
    });

    // Persist the checklist
    const checklist = await prisma.checklist.create({
      data: {
        journeyId,
        items: {
          create: applicableItems.map((item) => ({
            definitionId: item.id,
            label: item.label,
            description: item.description,
            category: item.category,
            order: item.order,
            completed: false,
          })),
        },
      },
      include: { items: { orderBy: [{ category: 'asc' }, { order: 'asc' }] } },
    });

    return this.mapChecklistFromDb(checklist);
  }

  /**
   * Toggle a checklist item between completed and not completed.
   */
  async toggleItem(checklistId: string, itemId: string): Promise<ChecklistItem> {
    const item = await prisma.checklistItem.findFirst({
      where: { id: itemId, checklistId },
    });

    if (!item) {
      throw new ChecklistError('ITEM_NOT_FOUND', 'Item do checklist nao encontrado.');
    }

    const updated = await prisma.checklistItem.update({
      where: { id: itemId },
      data: {
        completed: !item.completed,
        completedAt: item.completed ? null : new Date(),
      },
    });

    return {
      id: updated.id,
      label: updated.label,
      description: updated.description,
      category: updated.category,
      order: updated.order,
      completed: updated.completed,
      completedAt: updated.completedAt,
    };
  }

  /**
   * Get progress statistics for a checklist, including per-category breakdown.
   */
  async getProgress(checklistId: string): Promise<ChecklistProgress> {
    const items = await prisma.checklistItem.findMany({
      where: { checklistId },
    });

    if (items.length === 0) {
      throw new ChecklistError('CHECKLIST_NOT_FOUND', 'Checklist nao encontrado.');
    }

    const total = items.length;
    const completed = items.filter((i) => i.completed).length;
    const percentage = Math.round((completed / total) * 100);

    const byCategory: Record<string, { total: number; completed: number }> = {};

    for (const item of items) {
      if (!byCategory[item.category]) {
        byCategory[item.category] = { total: 0, completed: 0 };
      }
      byCategory[item.category].total += 1;
      if (item.completed) {
        byCategory[item.category].completed += 1;
      }
    }

    return { total, completed, percentage, byCategory };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private mapChecklistFromDb(dbChecklist: any): Checklist {
    return {
      id: dbChecklist.id,
      journeyId: dbChecklist.journeyId,
      items: (dbChecklist.items ?? []).map((item: any) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        category: item.category,
        order: item.order,
        completed: item.completed,
        completedAt: item.completedAt,
      })),
      progress: this.calculateProgressSync(dbChecklist.items ?? []),
      createdAt: dbChecklist.createdAt,
      updatedAt: dbChecklist.updatedAt,
    };
  }

  private calculateProgressSync(items: any[]): number {
    if (items.length === 0) return 0;
    const completed = items.filter((i: any) => i.completed).length;
    return Math.round((completed / items.length) * 100);
  }
}

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

export class ChecklistError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ChecklistError';
  }
}
