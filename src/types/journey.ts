export type ProtectionType = 'MARCA' | 'PATENTE' | 'DESENHO_INDUSTRIAL'

export type JourneyStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'ABANDONED'

export type StepStatus = 'PENDING' | 'CURRENT' | 'COMPLETED' | 'SKIPPED'

export interface StepDefinition {
  order: number
  slug: string
  title: string
  description: string
}

export interface Journey {
  id: string
  userId: string
  protectionType: ProtectionType
  status: JourneyStatus
  currentStepOrder: number
  triageAnswers?: Record<string, string>
  brandName?: string
  processNumber?: string
  niceClasses?: string[]
  startedAt: string
  completedAt?: string
  lastActivityAt: string
}

export interface JourneyStep {
  id: string
  journeyId: string
  stepDefinitionSlug: string
  order: number
  status: StepStatus
  startedAt?: string
  completedAt?: string
  notes?: string
  savedData?: Record<string, unknown>
}

export interface JourneyWithSteps extends Journey {
  steps: JourneyStep[]
  totalSteps: number
  completedSteps: number
  progressPercent: number
}

export interface NextStepInfo {
  step: StepDefinition
  whatToDo: string
  whyNow: string
  whatYouNeed: string[]
  estimatedTime: string
  commonMistake: string
  officialLink?: string
}
