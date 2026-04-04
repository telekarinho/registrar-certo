// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationType =
  | 'STEP_REMINDER'
  | 'ABANDONMENT_WARNING'
  | 'JOURNEY_COMPLETE'
  | 'SYSTEM_UPDATE'
  | 'WELCOME';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  journeyId?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailPayload {
  userId: string;
  templateSlug: string;
  variables: Record<string, string>;
}

export interface ReminderPayload {
  userId: string;
  journeyId: string;
  type: NotificationType;
  delayMs?: number;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

// ---------------------------------------------------------------------------
// In-memory stores (replaces BullMQ / Redis / Prisma)
// ---------------------------------------------------------------------------

interface InMemoryNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  journeyId: string | null;
  metadata: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

const notifications: InMemoryNotification[] = [];
let notifCounter = 1;

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  welcome: {
    subject: 'Bem-vindo ao Registrar Certo, {{userName}}!',
    body:
      'Ola {{userName}},\n\n' +
      'Seja bem-vindo ao Registrar Certo! Estamos aqui para ajuda-lo a proteger ' +
      'sua propriedade intelectual no INPI.\n\n' +
      'Comece agora respondendo ao questionario de triagem para identificar ' +
      'o tipo de protecao ideal para voce.\n\n' +
      'Acesse: {{appUrl}}\n\n' +
      'Equipe Registrar Certo',
  },
  step_reminder: {
    subject: 'Lembrete: Continue sua jornada de registro',
    body:
      'Ola {{userName}},\n\n' +
      'Voce esta na etapa "{{stepTitle}}" da sua jornada de {{protectionType}}.\n\n' +
      'Nao perca o ritmo! Continue de onde parou:\n' +
      '{{journeyUrl}}\n\n' +
      'Equipe Registrar Certo',
  },
  abandonment_warning: {
    subject: 'Sentimos sua falta no Registrar Certo',
    body:
      'Ola {{userName}},\n\n' +
      'Notamos que voce nao acessou sua jornada de registro ha {{daysSinceLastAccess}} dias.\n\n' +
      'Sua jornada de {{protectionType}} esta {{progress}}% concluida. ' +
      'Nao desista agora!\n\n' +
      'Retome sua jornada: {{journeyUrl}}\n\n' +
      'Se precisar de ajuda, estamos aqui.\n\n' +
      'Equipe Registrar Certo',
  },
  journey_complete: {
    subject: 'Parabens! Sua jornada de registro foi concluida!',
    body:
      'Ola {{userName}},\n\n' +
      'Parabens! Voce concluiu todas as etapas da jornada de {{protectionType}}!\n\n' +
      'Agora e importante acompanhar o andamento do seu pedido na Revista da ' +
      'Propriedade Industrial (RPI).\n\n' +
      'Baixe seu relatorio completo: {{reportUrl}}\n\n' +
      'Equipe Registrar Certo',
  },
  system_update: {
    subject: 'Novidades no Registrar Certo',
    body:
      'Ola {{userName}},\n\n' +
      '{{updateMessage}}\n\n' +
      'Equipe Registrar Certo',
  },
};

// ---------------------------------------------------------------------------
// NotificationEngine
// ---------------------------------------------------------------------------

export class NotificationEngine {
  async scheduleReminder(payload: ReminderPayload): Promise<string> {
    const { userId, journeyId, type } = payload;
    // In demo mode, we just log the reminder
    console.log(`[NotificationEngine] Reminder scheduled: ${type} for user ${userId}, journey ${journeyId}`);
    return `reminder-${userId}-${journeyId}-${type}`;
  }

  async sendEmail(payload: EmailPayload): Promise<string> {
    const { templateSlug, variables } = payload;

    const template = EMAIL_TEMPLATES[templateSlug];
    if (!template) {
      throw new NotificationError('TEMPLATE_NOT_FOUND', `Template de email nao encontrado: ${templateSlug}`);
    }

    const subject = this.renderTemplate(template.subject, variables);
    console.log(`[NotificationEngine] Email queued: ${subject}`);
    return `email-${Date.now()}`;
  }

  async processAbandonmentCheck(): Promise<{ warned: number; abandoned: number }> {
    // In demo mode, no-op
    console.log('[NotificationEngine] Abandonment check: demo mode, no action taken.');
    return { warned: 0, abandoned: 0 };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return notifications.filter((n) => n.userId === userId && !n.read).length;
  }

  async createInAppNotification(payload: NotificationPayload): Promise<void> {
    notifications.push({
      id: `notif-${notifCounter++}`,
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      journeyId: payload.journeyId ?? null,
      metadata: payload.metadata ?? {},
      read: false,
      createdAt: new Date(),
    });
  }

  private renderTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
      return variables[key] ?? match;
    });
  }
}

// ---------------------------------------------------------------------------
// Workers placeholder (no-op in demo)
// ---------------------------------------------------------------------------

export function initNotificationWorkers(): void {
  console.log('[NotificationEngine] Workers initialized in demo mode (no-op).');
}

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

export class NotificationError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'NotificationError';
  }
}
