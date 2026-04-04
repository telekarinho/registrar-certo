import type { ProtectionType } from './journey'

export interface TriageQuestion {
  key: string
  question: string
  options: TriageOption[]
  helpText?: string
}

export interface TriageOption {
  value: string
  label: string
  description?: string
  example?: string
  scores: Partial<Record<ProtectionType, number>>
}

export interface TriageAnswer {
  questionKey: string
  answerValue: string
}

export interface TriageResult {
  type: ProtectionType | null
  confidence: number // 0 to 1
  explanation: string
  details: string
  recommendation: string
  scores: Record<ProtectionType, number>
}

export type TriageConfidence = 'high' | 'medium' | 'low' | 'inconclusive'

export function getConfidenceLevel(confidence: number): TriageConfidence {
  if (confidence >= 0.8) return 'high'
  if (confidence >= 0.5) return 'medium'
  if (confidence >= 0.3) return 'low'
  return 'inconclusive'
}

export const CONFIDENCE_LABELS: Record<TriageConfidence, string> = {
  high: 'Alta confiança',
  medium: 'Confiança média — vale confirmar',
  low: 'Confiança baixa — recomendamos consultar um especialista',
  inconclusive: 'Inconclusivo — sugerimos falar com um especialista',
}
