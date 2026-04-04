import type { ProtectionType } from './journey-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TriageAnswer {
  questionId: string;
  value: string | boolean | number;
}

export interface TriageResult {
  type: ProtectionType | null;
  confidence: number;
  explanation: string;
  suggestedNextStep: string;
}

interface ScoreAccumulator {
  MARCA: number;
  PATENTE: number;
  DESENHO_INDUSTRIAL: number;
}

interface ScoringRule {
  questionId: string;
  /** Map from answer value to score deltas */
  scores: Record<string, Partial<ScoreAccumulator>>;
}

// ---------------------------------------------------------------------------
// Triage questions (referenced by questionId in TriageAnswer)
// ---------------------------------------------------------------------------

/**
 * Question IDs and their expected answer values:
 *
 * q_what_protect:
 *   "name_logo"      - A brand name, logo, or slogan
 *   "invention"      - A new invention or technical process
 *   "design"         - The visual appearance/shape of a product
 *   "software"       - A software program
 *   "unsure"         - Not sure
 *
 * q_is_visual_only:
 *   true/false       - Is the innovation purely visual/ornamental?
 *
 * q_has_technical_function:
 *   true/false       - Does it solve a technical problem?
 *
 * q_is_new_invention:
 *   true/false       - Is the invention new (not publicly known)?
 *
 * q_commercial_distinction:
 *   true/false       - Is the goal to distinguish products/services in the market?
 *
 * q_has_industrial_application:
 *   true/false       - Can it be produced or used industrially?
 *
 * q_product_shape:
 *   "unique_shape"   - The product has a unique/novel shape
 *   "standard_shape" - The shape is standard/common
 *   "no_product"     - There is no physical product
 *
 * q_innovation_type:
 *   "process"        - New manufacturing or business process
 *   "product"        - New physical product or device
 *   "composition"    - New chemical or material composition
 *   "improvement"    - Improvement to existing product/process
 *   "visual"         - Visual/aesthetic improvement only
 */

// ---------------------------------------------------------------------------
// Scoring rules
// ---------------------------------------------------------------------------

const SCORING_RULES: ScoringRule[] = [
  {
    questionId: 'q_what_protect',
    scores: {
      name_logo: { MARCA: 40, PATENTE: 0, DESENHO_INDUSTRIAL: 0 },
      invention: { MARCA: 0, PATENTE: 40, DESENHO_INDUSTRIAL: 5 },
      design: { MARCA: 0, PATENTE: 5, DESENHO_INDUSTRIAL: 40 },
      software: { MARCA: 5, PATENTE: 25, DESENHO_INDUSTRIAL: 0 },
      unsure: { MARCA: 10, PATENTE: 10, DESENHO_INDUSTRIAL: 10 },
    },
  },
  {
    questionId: 'q_is_visual_only',
    scores: {
      true: { MARCA: 5, PATENTE: -10, DESENHO_INDUSTRIAL: 25 },
      false: { MARCA: 0, PATENTE: 15, DESENHO_INDUSTRIAL: -5 },
    },
  },
  {
    questionId: 'q_has_technical_function',
    scores: {
      true: { MARCA: 0, PATENTE: 25, DESENHO_INDUSTRIAL: -10 },
      false: { MARCA: 5, PATENTE: -15, DESENHO_INDUSTRIAL: 10 },
    },
  },
  {
    questionId: 'q_is_new_invention',
    scores: {
      true: { MARCA: 0, PATENTE: 20, DESENHO_INDUSTRIAL: 10 },
      false: { MARCA: 10, PATENTE: -20, DESENHO_INDUSTRIAL: 0 },
    },
  },
  {
    questionId: 'q_commercial_distinction',
    scores: {
      true: { MARCA: 25, PATENTE: 0, DESENHO_INDUSTRIAL: 5 },
      false: { MARCA: -10, PATENTE: 5, DESENHO_INDUSTRIAL: 5 },
    },
  },
  {
    questionId: 'q_has_industrial_application',
    scores: {
      true: { MARCA: 0, PATENTE: 15, DESENHO_INDUSTRIAL: 10 },
      false: { MARCA: 10, PATENTE: -10, DESENHO_INDUSTRIAL: -5 },
    },
  },
  {
    questionId: 'q_product_shape',
    scores: {
      unique_shape: { MARCA: 0, PATENTE: 5, DESENHO_INDUSTRIAL: 20 },
      standard_shape: { MARCA: 5, PATENTE: 10, DESENHO_INDUSTRIAL: -10 },
      no_product: { MARCA: 15, PATENTE: 5, DESENHO_INDUSTRIAL: -15 },
    },
  },
  {
    questionId: 'q_innovation_type',
    scores: {
      process: { MARCA: 0, PATENTE: 20, DESENHO_INDUSTRIAL: 0 },
      product: { MARCA: 0, PATENTE: 15, DESENHO_INDUSTRIAL: 10 },
      composition: { MARCA: 0, PATENTE: 25, DESENHO_INDUSTRIAL: 0 },
      improvement: { MARCA: 0, PATENTE: 15, DESENHO_INDUSTRIAL: 5 },
      visual: { MARCA: 5, PATENTE: -5, DESENHO_INDUSTRIAL: 25 },
    },
  },
];

/** Minimum confidence threshold before considering AI disambiguation */
const CONFIDENCE_THRESHOLD = 0.55;

/** Minimum gap between top two scores to consider the result decisive */
const DECISIVENESS_GAP = 15;

// ---------------------------------------------------------------------------
// Explanations
// ---------------------------------------------------------------------------

const EXPLANATIONS: Record<ProtectionType, string> = {
  MARCA:
    'Com base nas suas respostas, o tipo de protecao mais adequado e o Registro de Marca. ' +
    'Marcas protegem sinais distintivos (nomes, logos, slogans) usados para identificar ' +
    'produtos ou servicos no mercado.',
  PATENTE:
    'Com base nas suas respostas, o tipo de protecao mais adequado e a Patente. ' +
    'Patentes protegem invencoes tecnicas novas que possuem aplicacao industrial, ' +
    'como novos processos, produtos ou composicoes.',
  DESENHO_INDUSTRIAL:
    'Com base nas suas respostas, o tipo de protecao mais adequado e o Registro de Desenho Industrial. ' +
    'Desenhos industriais protegem a forma ornamental de um objeto ou um padrao visual ' +
    'que possa ser aplicado a um produto industrial.',
};

const NEXT_STEPS: Record<ProtectionType, string> = {
  MARCA: 'Crie uma conta e inicie sua jornada de registro de marca. Vamos guia-lo passo a passo.',
  PATENTE: 'Crie uma conta e inicie sua jornada de pedido de patente. O processo e mais complexo, mas estamos aqui para ajudar.',
  DESENHO_INDUSTRIAL: 'Crie uma conta e inicie sua jornada de registro de desenho industrial. Prepare as imagens do seu design.',
};

// ---------------------------------------------------------------------------
// TriageEngine
// ---------------------------------------------------------------------------

/**
 * Engine responsible for classifying user answers into an IP protection type.
 * Uses a deterministic scoring system with optional AI disambiguation when
 * the confidence is below a configurable threshold.
 */
export class TriageEngine {
  /**
   * Classify triage answers into a protection type.
   *
   * The scoring algorithm:
   * 1. Each answer contributes weighted scores to MARCA, PATENTE, and DESENHO_INDUSTRIAL.
   * 2. Raw scores are normalized to a 0-1 confidence scale.
   * 3. If confidence is below the threshold or the gap between top two is too small,
   *    an AI call is made for disambiguation (if available).
   * 4. Returns the top classification with confidence and explanation.
   */
  async classify(answers: TriageAnswer[]): Promise<TriageResult> {
    if (!answers || answers.length === 0) {
      return {
        type: null,
        confidence: 0,
        explanation: 'Nenhuma resposta fornecida. Por favor, responda ao questionario de triagem.',
        suggestedNextStep: 'Responda as perguntas do questionario para identificar o tipo de protecao adequado.',
      };
    }

    const scores = this.calculateScores(answers);
    const { type, confidence, gap } = this.determineWinner(scores);

    // If confidence is strong and gap is decisive, return immediately
    if (confidence >= CONFIDENCE_THRESHOLD && gap >= DECISIVENESS_GAP) {
      return {
        type,
        confidence,
        explanation: type ? EXPLANATIONS[type] : 'Nao foi possivel determinar o tipo de protecao.',
        suggestedNextStep: type ? NEXT_STEPS[type] : 'Considere consultar um especialista em Propriedade Intelectual.',
      };
    }

    // Low confidence: attempt AI disambiguation
    try {
      const aiResult = await this.disambiguateWithAI(answers, scores);
      if (aiResult) {
        return aiResult;
      }
    } catch (error) {
      // AI unavailable; fall through to best-effort deterministic result
      console.error('[TriageEngine] AI disambiguation failed:', error);
    }

    // Return best deterministic result even with low confidence
    if (type) {
      return {
        type,
        confidence,
        explanation:
          EXPLANATIONS[type] +
          ' No entanto, a confianca na classificacao e moderada. ' +
          'Recomendamos consultar um especialista para confirmar.',
        suggestedNextStep: NEXT_STEPS[type],
      };
    }

    return {
      type: null,
      confidence: 0,
      explanation:
        'Nao foi possivel determinar com seguranca o tipo de protecao mais adequado ' +
        'com base nas respostas fornecidas.',
      suggestedNextStep:
        'Recomendamos consultar um advogado especializado em Propriedade Intelectual ' +
        'para uma avaliacao mais precisa.',
    };
  }

  // ---------------------------------------------------------------------------
  // Scoring logic
  // ---------------------------------------------------------------------------

  /**
   * Calculate raw scores for each protection type based on the provided answers.
   */
  private calculateScores(answers: TriageAnswer[]): ScoreAccumulator {
    const scores: ScoreAccumulator = {
      MARCA: 0,
      PATENTE: 0,
      DESENHO_INDUSTRIAL: 0,
    };

    const answerMap = new Map<string, string>();
    for (const answer of answers) {
      answerMap.set(answer.questionId, String(answer.value));
    }

    for (const rule of SCORING_RULES) {
      const answerValue = answerMap.get(rule.questionId);
      if (answerValue === undefined) continue;

      const deltas = rule.scores[answerValue];
      if (!deltas) continue;

      scores.MARCA += deltas.MARCA ?? 0;
      scores.PATENTE += deltas.PATENTE ?? 0;
      scores.DESENHO_INDUSTRIAL += deltas.DESENHO_INDUSTRIAL ?? 0;
    }

    // Clamp negative scores to 0
    scores.MARCA = Math.max(0, scores.MARCA);
    scores.PATENTE = Math.max(0, scores.PATENTE);
    scores.DESENHO_INDUSTRIAL = Math.max(0, scores.DESENHO_INDUSTRIAL);

    return scores;
  }

  /**
   * Determine the winning protection type and calculate confidence.
   */
  private determineWinner(scores: ScoreAccumulator): {
    type: ProtectionType | null;
    confidence: number;
    gap: number;
  } {
    const entries: [ProtectionType, number][] = [
      ['MARCA', scores.MARCA],
      ['PATENTE', scores.PATENTE],
      ['DESENHO_INDUSTRIAL', scores.DESENHO_INDUSTRIAL],
    ];

    // Sort descending by score
    entries.sort((a, b) => b[1] - a[1]);

    const [first, second] = entries;
    const totalScore = entries.reduce((sum, [, score]) => sum + score, 0);

    if (totalScore === 0) {
      return { type: null, confidence: 0, gap: 0 };
    }

    const confidence = first[1] / totalScore;
    const gap = first[1] - second[1];

    return {
      type: first[0],
      confidence: Math.round(confidence * 100) / 100,
      gap,
    };
  }

  // ---------------------------------------------------------------------------
  // AI disambiguation (optional)
  // ---------------------------------------------------------------------------

  /**
   * Call an AI model to disambiguate when the deterministic scoring is not
   * confident enough. Returns null if AI is unavailable or unhelpful.
   */
  private async disambiguateWithAI(
    answers: TriageAnswer[],
    scores: ScoreAccumulator,
  ): Promise<TriageResult | null> {
    // Check if AI integration is configured
    const aiApiKey = process.env.OPENAI_API_KEY ?? process.env.AI_API_KEY;
    if (!aiApiKey) {
      return null;
    }

    const prompt = this.buildAIPrompt(answers, scores);

    try {
      const response = await fetch(process.env.AI_API_URL ?? 'https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${aiApiKey}`,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL ?? 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'Voce e um especialista em Propriedade Intelectual brasileira. ' +
                'Classifique o tipo de protecao (MARCA, PATENTE ou DESENHO_INDUSTRIAL) ' +
                'com base nas respostas do usuario. Responda APENAS em JSON valido.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) return null;

      const parsed = JSON.parse(content);

      if (parsed.type && ['MARCA', 'PATENTE', 'DESENHO_INDUSTRIAL'].includes(parsed.type)) {
        return {
          type: parsed.type as ProtectionType,
          confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0.7)),
          explanation: parsed.explanation ?? EXPLANATIONS[parsed.type as ProtectionType],
          suggestedNextStep: parsed.suggestedNextStep ?? NEXT_STEPS[parsed.type as ProtectionType],
        };
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Build the AI prompt with context about the user's answers and current scores.
   */
  private buildAIPrompt(answers: TriageAnswer[], scores: ScoreAccumulator): string {
    const answersText = answers
      .map((a) => `- ${a.questionId}: ${a.value}`)
      .join('\n');

    return (
      `As respostas do usuario no questionario de triagem foram:\n${answersText}\n\n` +
      `Pontuacao parcial do sistema:\n` +
      `- MARCA: ${scores.MARCA}\n` +
      `- PATENTE: ${scores.PATENTE}\n` +
      `- DESENHO_INDUSTRIAL: ${scores.DESENHO_INDUSTRIAL}\n\n` +
      `Analise as respostas e determine o tipo de protecao mais adequado.\n` +
      `Responda em JSON: { "type": "MARCA|PATENTE|DESENHO_INDUSTRIAL", "confidence": 0.0-1.0, "explanation": "...", "suggestedNextStep": "..." }`
    );
  }
}
