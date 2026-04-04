import { prisma } from '@/server/lib/prisma';
import { AuditLogger } from '@/server/lib/audit-logger';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProtectionType = 'MARCA' | 'PATENTE' | 'DESENHO_INDUSTRIAL';

export type JourneyStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ABANDONED';

export type StepStatus = 'COMPLETED' | 'CURRENT' | 'LOCKED';

export interface StepDefinition {
  id: string;
  order: number;
  title: string;
  description: string;
  /** Tooltip / help text shown alongside the step */
  helpText?: string;
  /** Whether the step can be skipped */
  skippable: boolean;
  /** IDs of prerequisite steps that must be completed first */
  prerequisites: string[];
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  completedAt: Date | null;
  order: number;
}

export interface Journey {
  id: string;
  userId: string;
  protectionType: ProtectionType;
  status: JourneyStatus;
  currentStepId: string;
  progress: number;
  title: string | null;
  answers: Record<string, unknown>;
  steps: JourneyStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJourneyInput {
  userId: string;
  protectionType: ProtectionType;
  triageAnswers?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Step definitions per protection type
// ---------------------------------------------------------------------------

const MARCA_STEPS: StepDefinition[] = [
  {
    id: 'marca-step-1',
    order: 1,
    title: 'Entender o que e uma marca',
    description: 'Aprenda o conceito de marca registrada e por que proteger a sua.',
    skippable: false,
    prerequisites: [],
  },
  {
    id: 'marca-step-2',
    order: 2,
    title: 'Verificar registrabilidade',
    description: 'Entenda quais sinais podem e quais nao podem ser registrados como marca.',
    skippable: false,
    prerequisites: ['marca-step-1'],
  },
  {
    id: 'marca-step-3',
    order: 3,
    title: 'Definir a natureza da marca',
    description: 'Classifique sua marca: produto, servico, coletiva ou de certificacao.',
    skippable: false,
    prerequisites: ['marca-step-2'],
  },
  {
    id: 'marca-step-4',
    order: 4,
    title: 'Definir a apresentacao da marca',
    description: 'Escolha a forma de apresentacao: nominativa, figurativa, mista ou tridimensional.',
    skippable: false,
    prerequisites: ['marca-step-3'],
  },
  {
    id: 'marca-step-5',
    order: 5,
    title: 'Escolher a classe Nice (NCL)',
    description: 'Identifique a classe de produtos ou servicos conforme a Classificacao de Nice.',
    skippable: false,
    prerequisites: ['marca-step-4'],
  },
  {
    id: 'marca-step-6',
    order: 6,
    title: 'Pesquisar anterioridade',
    description: 'Busque marcas ja registradas ou em processo para verificar conflitos.',
    helpText: 'Use a ferramenta de busca INPI integrada para pesquisar.',
    skippable: false,
    prerequisites: ['marca-step-5'],
  },
  {
    id: 'marca-step-7',
    order: 7,
    title: 'Preparar documentacao',
    description: 'Reuna todos os documentos necessarios para o pedido.',
    skippable: false,
    prerequisites: ['marca-step-6'],
  },
  {
    id: 'marca-step-8',
    order: 8,
    title: 'Cadastro no e-INPI',
    description: 'Crie ou acesse sua conta no sistema e-INPI.',
    skippable: false,
    prerequisites: ['marca-step-7'],
  },
  {
    id: 'marca-step-9',
    order: 9,
    title: 'Pagar a GRU',
    description: 'Gere e pague a Guia de Recolhimento da Uniao (taxa do INPI).',
    skippable: false,
    prerequisites: ['marca-step-8'],
  },
  {
    id: 'marca-step-10',
    order: 10,
    title: 'Preencher o formulario de pedido',
    description: 'Preencha o formulario eletronico de pedido de registro de marca no e-INPI.',
    skippable: false,
    prerequisites: ['marca-step-9'],
  },
  {
    id: 'marca-step-11',
    order: 11,
    title: 'Protocolar o pedido',
    description: 'Submeta o pedido e obtenha o numero do protocolo.',
    skippable: false,
    prerequisites: ['marca-step-10'],
  },
  {
    id: 'marca-step-12',
    order: 12,
    title: 'Acompanhar publicacoes na RPI',
    description: 'Monitore a Revista da Propriedade Industrial para acompanhar seu pedido.',
    skippable: false,
    prerequisites: ['marca-step-11'],
  },
  {
    id: 'marca-step-13',
    order: 13,
    title: 'Responder exigencias (se houver)',
    description: 'Caso o INPI emita exigencias, responda dentro do prazo.',
    skippable: true,
    prerequisites: ['marca-step-12'],
  },
];

const PATENTE_STEPS: StepDefinition[] = [
  {
    id: 'patente-step-1',
    order: 1,
    title: 'Entender tipos de patente',
    description: 'Aprenda a diferenca entre Patente de Invencao (PI) e Modelo de Utilidade (MU).',
    skippable: false,
    prerequisites: [],
  },
  {
    id: 'patente-step-2',
    order: 2,
    title: 'Verificar patenteabilidade',
    description: 'Entenda os requisitos: novidade, atividade inventiva e aplicacao industrial.',
    skippable: false,
    prerequisites: ['patente-step-1'],
  },
  {
    id: 'patente-step-3',
    order: 3,
    title: 'Pesquisar estado da tecnica',
    description: 'Busque patentes existentes para verificar a novidade da sua invencao.',
    skippable: false,
    prerequisites: ['patente-step-2'],
  },
  {
    id: 'patente-step-4',
    order: 4,
    title: 'Redigir o relatorio descritivo',
    description: 'Descreva detalhadamente sua invencao conforme as normas do INPI.',
    skippable: false,
    prerequisites: ['patente-step-3'],
  },
  {
    id: 'patente-step-5',
    order: 5,
    title: 'Elaborar as reivindicacoes',
    description: 'Defina o escopo de protecao da sua patente.',
    skippable: false,
    prerequisites: ['patente-step-4'],
  },
  {
    id: 'patente-step-6',
    order: 6,
    title: 'Preparar desenhos tecnicos',
    description: 'Crie desenhos e diagramas que ilustrem sua invencao.',
    skippable: true,
    prerequisites: ['patente-step-5'],
  },
  {
    id: 'patente-step-7',
    order: 7,
    title: 'Escrever o resumo',
    description: 'Redija um resumo conciso da invencao.',
    skippable: false,
    prerequisites: ['patente-step-5'],
  },
  {
    id: 'patente-step-8',
    order: 8,
    title: 'Classificar pela IPC',
    description: 'Identifique a classificacao Internacional de Patentes (IPC).',
    skippable: false,
    prerequisites: ['patente-step-7'],
  },
  {
    id: 'patente-step-9',
    order: 9,
    title: 'Preparar documentacao complementar',
    description: 'Reuna documentos pessoais e procuracoes, se necessario.',
    skippable: false,
    prerequisites: ['patente-step-8'],
  },
  {
    id: 'patente-step-10',
    order: 10,
    title: 'Cadastro no e-INPI',
    description: 'Crie ou acesse sua conta no sistema e-INPI.',
    skippable: false,
    prerequisites: ['patente-step-9'],
  },
  {
    id: 'patente-step-11',
    order: 11,
    title: 'Pagar a GRU',
    description: 'Gere e pague a Guia de Recolhimento da Uniao.',
    skippable: false,
    prerequisites: ['patente-step-10'],
  },
  {
    id: 'patente-step-12',
    order: 12,
    title: 'Protocolar o pedido',
    description: 'Submeta o pedido de patente no sistema e-INPI.',
    skippable: false,
    prerequisites: ['patente-step-11'],
  },
  {
    id: 'patente-step-13',
    order: 13,
    title: 'Acompanhar o exame',
    description: 'Monitore o andamento do exame tecnico do INPI.',
    skippable: false,
    prerequisites: ['patente-step-12'],
  },
  {
    id: 'patente-step-14',
    order: 14,
    title: 'Responder exigencias (se houver)',
    description: 'Responda eventuais exigencias ou pareceres tecnicos do INPI.',
    skippable: true,
    prerequisites: ['patente-step-13'],
  },
];

const DESENHO_INDUSTRIAL_STEPS: StepDefinition[] = [
  {
    id: 'di-step-1',
    order: 1,
    title: 'Entender Desenho Industrial',
    description: 'Aprenda o que pode ser registrado como desenho industrial no INPI.',
    skippable: false,
    prerequisites: [],
  },
  {
    id: 'di-step-2',
    order: 2,
    title: 'Verificar registrabilidade',
    description: 'Confirme se o design atende aos requisitos de novidade e originalidade.',
    skippable: false,
    prerequisites: ['di-step-1'],
  },
  {
    id: 'di-step-3',
    order: 3,
    title: 'Pesquisar anterioridade',
    description: 'Busque desenhos industriais ja registrados que possam conflitar.',
    skippable: false,
    prerequisites: ['di-step-2'],
  },
  {
    id: 'di-step-4',
    order: 4,
    title: 'Preparar representacoes graficas',
    description: 'Crie imagens e desenhos do seu design conforme as normas do INPI.',
    skippable: false,
    prerequisites: ['di-step-3'],
  },
  {
    id: 'di-step-5',
    order: 5,
    title: 'Preparar documentacao',
    description: 'Reuna todos os documentos necessarios para o pedido.',
    skippable: false,
    prerequisites: ['di-step-4'],
  },
  {
    id: 'di-step-6',
    order: 6,
    title: 'Cadastro e pagamento',
    description: 'Acesse o e-INPI, gere e pague a GRU correspondente.',
    skippable: false,
    prerequisites: ['di-step-5'],
  },
  {
    id: 'di-step-7',
    order: 7,
    title: 'Protocolar o pedido',
    description: 'Preencha o formulario e submeta o pedido de registro.',
    skippable: false,
    prerequisites: ['di-step-6'],
  },
  {
    id: 'di-step-8',
    order: 8,
    title: 'Acompanhar o processo',
    description: 'Monitore publicacoes na RPI e responda exigencias se necessario.',
    skippable: false,
    prerequisites: ['di-step-7'],
  },
];

const STEP_DEFINITIONS: Record<ProtectionType, StepDefinition[]> = {
  MARCA: MARCA_STEPS,
  PATENTE: PATENTE_STEPS,
  DESENHO_INDUSTRIAL: DESENHO_INDUSTRIAL_STEPS,
};

// ---------------------------------------------------------------------------
// JourneyEngine
// ---------------------------------------------------------------------------

export class JourneyEngine {
  private auditLogger: AuditLogger;

  constructor() {
    this.auditLogger = new AuditLogger();
  }

  /**
   * Create a new registration journey for a user.
   * Initializes all steps in LOCKED status with the first step as CURRENT.
   */
  async createJourney(input: CreateJourneyInput): Promise<Journey> {
    const { userId, protectionType, triageAnswers } = input;
    const steps = STEP_DEFINITIONS[protectionType];

    if (!steps) {
      throw new JourneyError('INVALID_PROTECTION_TYPE', `Tipo de protecao invalido: ${protectionType}`);
    }

    const firstStepId = steps[0].id;

    const journey = await prisma.journey.create({
      data: {
        userId,
        protectionType,
        status: 'ACTIVE',
        currentStepId: firstStepId,
        progress: 0,
        answers: triageAnswers ?? {},
        steps: {
          create: steps.map((step) => ({
            stepDefinitionId: step.id,
            status: step.id === firstStepId ? 'CURRENT' : 'LOCKED',
            order: step.order,
          })),
        },
      },
      include: { steps: true },
    });

    await this.auditLogger.log({
      action: 'JOURNEY_CREATED',
      entityType: 'Journey',
      entityId: journey.id,
      newValue: { protectionType, userId },
      userId,
    });

    return this.mapJourneyFromDb(journey, protectionType);
  }

  /**
   * Retrieve a journey with all its steps and metadata.
   */
  async getJourney(journeyId: string): Promise<Journey> {
    const journey = await prisma.journey.findUnique({
      where: { id: journeyId },
      include: { steps: { orderBy: { order: 'asc' } } },
    });

    if (!journey) {
      throw new JourneyError('JOURNEY_NOT_FOUND', 'Jornada nao encontrada.');
    }

    return this.mapJourneyFromDb(journey, journey.protectionType as ProtectionType);
  }

  /**
   * Return the ordered step definitions for a given protection type.
   */
  getStepDefinitions(protectionType: ProtectionType): StepDefinition[] {
    const steps = STEP_DEFINITIONS[protectionType];
    if (!steps) {
      throw new JourneyError('INVALID_PROTECTION_TYPE', `Tipo de protecao invalido: ${protectionType}`);
    }
    return steps;
  }

  /**
   * Mark a step as completed and advance the journey to the next step.
   * Validates that all prerequisite steps are completed before allowing completion.
   */
  async completeStep(journeyId: string, stepId: string, userId: string): Promise<Journey> {
    const journey = await prisma.journey.findUnique({
      where: { id: journeyId },
      include: { steps: { orderBy: { order: 'asc' } } },
    });

    if (!journey) {
      throw new JourneyError('JOURNEY_NOT_FOUND', 'Jornada nao encontrada.');
    }

    if (journey.status !== 'ACTIVE') {
      throw new JourneyError('JOURNEY_NOT_ACTIVE', 'A jornada nao esta ativa.');
    }

    const protectionType = journey.protectionType as ProtectionType;
    const definitions = STEP_DEFINITIONS[protectionType];
    const stepDef = definitions.find((d) => d.id === stepId);

    if (!stepDef) {
      throw new JourneyError('STEP_NOT_FOUND', `Etapa nao encontrada: ${stepId}`);
    }

    // Validate prerequisites
    const completedStepIds = journey.steps
      .filter((s: any) => s.status === 'COMPLETED')
      .map((s: any) => s.stepDefinitionId);

    const missingPrereqs = stepDef.prerequisites.filter((prereq) => !completedStepIds.includes(prereq));
    if (missingPrereqs.length > 0) {
      throw new JourneyError(
        'PREREQUISITES_NOT_MET',
        `Etapas pre-requisito nao concluidas: ${missingPrereqs.join(', ')}`,
      );
    }

    // Mark step as completed
    await prisma.journeyStep.updateMany({
      where: { journeyId, stepDefinitionId: stepId },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });

    // Find next step and set it as CURRENT
    const currentOrder = stepDef.order;
    const nextStepDef = definitions.find((d) => d.order === currentOrder + 1);

    let newStatus: JourneyStatus = 'ACTIVE';
    let newCurrentStepId = journey.currentStepId;

    if (nextStepDef) {
      await prisma.journeyStep.updateMany({
        where: { journeyId, stepDefinitionId: nextStepDef.id },
        data: { status: 'CURRENT' },
      });
      newCurrentStepId = nextStepDef.id;
    } else {
      // All steps completed
      newStatus = 'COMPLETED';
    }

    // Calculate new progress
    const totalSteps = definitions.length;
    const newCompletedCount = completedStepIds.length + 1;
    const progress = Math.round((newCompletedCount / totalSteps) * 100);

    // Update journey
    await prisma.journey.update({
      where: { id: journeyId },
      data: {
        currentStepId: newCurrentStepId,
        progress,
        status: newStatus,
      },
    });

    await this.auditLogger.log({
      action: 'STEP_COMPLETED',
      entityType: 'JourneyStep',
      entityId: stepId,
      newValue: { journeyId, stepId, progress },
      userId,
    });

    return this.getJourney(journeyId);
  }

  /**
   * Get the current active step for a journey.
   */
  async getCurrentStep(journeyId: string): Promise<JourneyStep | null> {
    const journey = await this.getJourney(journeyId);
    return journey.steps.find((s) => s.status === 'CURRENT') ?? null;
  }

  /**
   * Save or merge answers (key-value data collected during the journey).
   */
  async saveAnswers(journeyId: string, answers: Record<string, unknown>, userId: string): Promise<void> {
    const journey = await prisma.journey.findUnique({ where: { id: journeyId } });

    if (!journey) {
      throw new JourneyError('JOURNEY_NOT_FOUND', 'Jornada nao encontrada.');
    }

    const existingAnswers = (journey.answers as Record<string, unknown>) ?? {};
    const merged = { ...existingAnswers, ...answers };

    await prisma.journey.update({
      where: { id: journeyId },
      data: { answers: merged },
    });

    await this.auditLogger.log({
      action: 'ANSWERS_SAVED',
      entityType: 'Journey',
      entityId: journeyId,
      oldValue: existingAnswers,
      newValue: merged,
      userId,
    });
  }

  /**
   * Calculate the completion percentage of a journey.
   */
  async calculateProgress(journeyId: string): Promise<number> {
    const journey = await prisma.journey.findUnique({
      where: { id: journeyId },
      include: { steps: true },
    });

    if (!journey) {
      throw new JourneyError('JOURNEY_NOT_FOUND', 'Jornada nao encontrada.');
    }

    const protectionType = journey.protectionType as ProtectionType;
    const totalSteps = STEP_DEFINITIONS[protectionType].length;
    const completedSteps = journey.steps.filter((s: any) => s.status === 'COMPLETED').length;

    return Math.round((completedSteps / totalSteps) * 100);
  }

  /**
   * Pause an active journey. The user can resume later.
   */
  async pauseJourney(journeyId: string, userId: string): Promise<void> {
    const journey = await prisma.journey.findUnique({ where: { id: journeyId } });

    if (!journey) {
      throw new JourneyError('JOURNEY_NOT_FOUND', 'Jornada nao encontrada.');
    }

    if (journey.status !== 'ACTIVE') {
      throw new JourneyError('JOURNEY_NOT_ACTIVE', 'Somente jornadas ativas podem ser pausadas.');
    }

    await prisma.journey.update({
      where: { id: journeyId },
      data: { status: 'PAUSED' },
    });

    await this.auditLogger.log({
      action: 'JOURNEY_PAUSED',
      entityType: 'Journey',
      entityId: journeyId,
      oldValue: { status: 'ACTIVE' },
      newValue: { status: 'PAUSED' },
      userId,
    });
  }

  /**
   * Resume a paused journey.
   */
  async resumeJourney(journeyId: string, userId: string): Promise<void> {
    const journey = await prisma.journey.findUnique({ where: { id: journeyId } });

    if (!journey) {
      throw new JourneyError('JOURNEY_NOT_FOUND', 'Jornada nao encontrada.');
    }

    if (journey.status !== 'PAUSED') {
      throw new JourneyError('JOURNEY_NOT_PAUSED', 'Somente jornadas pausadas podem ser retomadas.');
    }

    await prisma.journey.update({
      where: { id: journeyId },
      data: { status: 'ACTIVE' },
    });

    await this.auditLogger.log({
      action: 'JOURNEY_RESUMED',
      entityType: 'Journey',
      entityId: journeyId,
      oldValue: { status: 'PAUSED' },
      newValue: { status: 'ACTIVE' },
      userId,
    });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private mapJourneyFromDb(dbJourney: any, protectionType: ProtectionType): Journey {
    const definitions = STEP_DEFINITIONS[protectionType];

    const steps: JourneyStep[] = (dbJourney.steps ?? []).map((dbStep: any) => {
      const def = definitions.find((d) => d.id === dbStep.stepDefinitionId);
      return {
        id: dbStep.stepDefinitionId,
        title: def?.title ?? 'Etapa desconhecida',
        description: def?.description ?? '',
        status: dbStep.status as StepStatus,
        completedAt: dbStep.completedAt,
        order: dbStep.order,
      };
    });

    return {
      id: dbJourney.id,
      userId: dbJourney.userId,
      protectionType,
      status: dbJourney.status as JourneyStatus,
      currentStepId: dbJourney.currentStepId,
      progress: dbJourney.progress,
      title: dbJourney.title ?? null,
      answers: (dbJourney.answers as Record<string, unknown>) ?? {},
      steps,
      createdAt: dbJourney.createdAt,
      updatedAt: dbJourney.updatedAt,
    };
  }
}

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

export class JourneyError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'JourneyError';
  }
}
