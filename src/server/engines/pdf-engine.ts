import type { ProtectionType } from './journey-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PDFSection {
  title: string;
  content: string | string[];
}

interface JourneyReportData {
  userName: string;
  userEmail: string;
  protectionType: ProtectionType;
  protectionTypeLabel: string;
  journeyTitle: string | null;
  status: string;
  progress: number;
  steps: Array<{
    title: string;
    status: string;
    completedAt: string | null;
  }>;
  checklist: {
    items: Array<{
      label: string;
      category: string;
      completed: boolean;
    }>;
    progress: number;
  } | null;
  answers: Record<string, unknown>;
  createdAt: string;
  generatedAt: string;
}

interface PDFGenerationResult {
  /** Text content of the report (plain text in demo mode) */
  content: string;
  filename: string;
  mimeType: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROTECTION_TYPE_LABELS: Record<ProtectionType, string> = {
  MARCA: 'Registro de Marca',
  PATENTE: 'Pedido de Patente',
  DESENHO_INDUSTRIAL: 'Registro de Desenho Industrial',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Em andamento',
  PAUSED: 'Pausada',
  COMPLETED: 'Concluida',
  ABANDONED: 'Abandonada',
};

// ---------------------------------------------------------------------------
// PDFEngine (demo mode — generates plain text reports)
// ---------------------------------------------------------------------------

/**
 * In demo mode (no jsPDF), this engine generates plain-text reports
 * rather than actual PDFs. When jsPDF is available, it can be swapped
 * back to generate real PDFs.
 */
export class PDFEngine {
  /**
   * Generate a plain-text summary report for a journey.
   */
  async generateSummaryReport(
    journeyData: {
      id: string;
      protectionType: ProtectionType;
      title: string | null;
      status: string;
      progress: number;
      answers: Record<string, unknown>;
      createdAt: Date;
      steps: Array<{ title: string; status: string; completedAt: string | null }>;
    },
    userName: string,
    userEmail: string,
  ): Promise<PDFGenerationResult> {
    const protectionType = journeyData.protectionType;
    const protectionTypeLabel = PROTECTION_TYPE_LABELS[protectionType];
    const generatedAt = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    const lines: string[] = [
      '='.repeat(60),
      '           REGISTRAR CERTO — Relatorio de Jornada',
      '='.repeat(60),
      '',
      `Titular: ${userName}`,
      `E-mail: ${userEmail}`,
      `Tipo de Protecao: ${protectionTypeLabel}`,
      journeyData.title ? `Titulo: ${journeyData.title}` : '',
      `Status: ${STATUS_LABELS[journeyData.status] ?? journeyData.status}`,
      `Progresso: ${journeyData.progress}%`,
      `Iniciada em: ${new Date(journeyData.createdAt).toLocaleDateString('pt-BR')}`,
      '',
      '-'.repeat(60),
      '                          ETAPAS',
      '-'.repeat(60),
    ];

    for (const step of journeyData.steps) {
      const icon = step.status === 'Concluida' ? '[X]' : step.status === 'Atual' ? '[>]' : '[ ]';
      const date = step.completedAt ? ` — ${step.completedAt}` : '';
      lines.push(`  ${icon} ${step.title}${date}`);
    }

    lines.push('');
    lines.push('-'.repeat(60));
    lines.push('AVISO LEGAL: Este relatorio e apenas informativo.');
    lines.push(`Gerado em: ${generatedAt}`);
    lines.push('='.repeat(60));

    const filename = `relatorio-${protectionType.toLowerCase()}-${journeyData.id.slice(0, 8)}.txt`;

    return {
      content: lines.filter(Boolean).join('\n'),
      filename,
      mimeType: 'text/plain',
    };
  }

  translateStepStatus(status: string): string {
    const map: Record<string, string> = {
      COMPLETED: 'Concluida',
      CURRENT: 'Atual',
      LOCKED: 'Bloqueada',
    };
    return map[status] ?? status;
  }
}

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

export class PDFError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'PDFError';
  }
}
