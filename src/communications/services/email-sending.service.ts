import db from '../database/db';
import { IntegrationsService, SendGridConfig, SmtpConfig } from './integrations.service';
import { EmailTemplatesService, EmailScenario } from './email-templates.service';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string | Buffer; contentType?: string; cid?: string }>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: string;
  skipped?: boolean;
}

export interface SendScenarioEmailOptions {
  scenario: EmailScenario;
  eventId: number;
  to: string;
  variables: Record<string, string>;
}

export interface EmailLog {
  id?: number;
  event_id: number | null;
  scenario: string | null;
  to_email: string;
  subject: string;
  status: 'sent' | 'failed' | 'skipped';
  provider: string | null;
  message_id: string | null;
  error_message: string | null;
  created_at?: string;
}

// ============================================================================
// EMAIL SENDING SERVICE
// ============================================================================

export class EmailSendingService {
  private integrationsService: IntegrationsService;
  private templatesService: EmailTemplatesService;

  constructor() {
    this.integrationsService = new IntegrationsService();
    this.templatesService = new EmailTemplatesService();
  }

  /**
   * Send an email using the configured provider
   */
  async sendEmail(options: SendEmailOptions, eventId?: number): Promise<SendEmailResult> {
    const config = await this.integrationsService.getConfig('email', eventId);

    if (!config) {
      console.log('[EmailSendingService] No email provider configured');
      return { success: false, error: 'Email provider not configured', skipped: true };
    }

    if (!config.is_enabled) {
      console.log('[EmailSendingService] Email provider is disabled');
      return { success: false, error: 'Email provider is disabled', skipped: true };
    }

    switch (config.provider) {
      case 'sendgrid':
        return this.sendViaSendGrid(options, config.config as SendGridConfig);
      case 'smtp':
        return this.sendViaSmtp(options, config.config as SmtpConfig);
      default:
        return { success: false, error: `Unknown email provider: ${config.provider}`, skipped: true };
    }
  }

  /**
   * Send a scenario-based email with template resolution
   */
  async sendScenarioEmail(options: SendScenarioEmailOptions): Promise<SendEmailResult> {
    const { scenario, eventId, to, variables } = options;
    const template = await this.templatesService.getResolvedTemplate(scenario, eventId);

    if (!template) {
      return { success: false, error: `Email scenario '${scenario}' is disabled`, skipped: true };
    }

    let subject = template.subject;
    let body = template.body;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = key.startsWith('{{') ? key : `{{${key}}}`;
      subject = subject.split(placeholder).join(value);
      body = body.split(placeholder).join(value);
    });

    const result = await this.sendEmail({ to, subject, text: body, html: body.replace(/\n/g, '<br>') }, eventId);

    await this.logEmail({
      event_id: eventId,
      scenario,
      to_email: to,
      subject,
      status: result.success ? 'sent' : (result.skipped ? 'skipped' : 'failed'),
      provider: result.provider || null,
      message_id: result.messageId || null,
      error_message: result.error || null
    });

    return result;
  }

  /**
   * Send test email for a scenario
   */
  async sendTestEmail(eventId: number, scenario: EmailScenario, testEmail: string): Promise<SendEmailResult> {
    const config = await this.templatesService.getScenarioConfig(scenario, eventId);
    let subject = `[TEST] ${config.subject}`;
    let body = config.body;

    const result = await this.sendEmail({ to: testEmail, subject, text: body, html: body.replace(/\n/g, '<br>') }, eventId);
    return result;
  }

  /**
   * Send via SendGrid
   */
  private async sendViaSendGrid(options: SendEmailOptions, config: SendGridConfig): Promise<SendEmailResult> {
    try {
      if (!config.api_key || !config.from_email) {
        return { success: false, error: 'SendGrid not configured correctly', provider: 'sendgrid', skipped: true };
      }

      const toArray = Array.isArray(options.to) ? options.to : [options.to];
      const payload = {
        personalizations: [{ to: toArray.map(email => ({ email })) }],
        from: { email: options.from || config.from_email, name: options.fromName || config.from_name || 'Event Team' },
        subject: options.subject,
        content: [
          ...(options.text ? [{ type: 'text/plain', value: options.text }] : []),
          ...(options.html ? [{ type: 'text/html', value: options.html }] : [])
        ]
      };

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${config.api_key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 202 || response.status === 200) {
        return { success: true, messageId: `sg_${Date.now()}`, provider: 'sendgrid' };
      }
      return { success: false, error: `SendGrid error: ${response.status}`, provider: 'sendgrid' };
    } catch (error: any) {
      return { success: false, error: error.message, provider: 'sendgrid' };
    }
  }

  /**
   * Send via SMTP
   */
  private async sendViaSmtp(options: SendEmailOptions, config: SmtpConfig): Promise<SendEmailResult> {
    try {
      if (!config.host || !config.from_email) {
        return { success: false, error: 'SMTP not configured correctly', provider: 'smtp', skipped: true };
      }

      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465,
        auth: config.username ? { user: config.username, pass: config.password } : undefined,
        tls: { rejectUnauthorized: false }
      });

      const info = await transporter.sendMail({
        from: { name: options.fromName || config.from_name || 'Event Team', address: options.from || config.from_email },
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo,
        attachments: options.attachments
      });

      return { success: true, messageId: info.messageId, provider: 'smtp' };
    } catch (error: any) {
      return { success: false, error: error.message, provider: 'smtp' };
    }
  }

  /**
   * Log email
   */
  private async logEmail(log: EmailLog): Promise<void> {
    try {
      await db('email_logs').insert(log);
    } catch (error) {
      console.error('[EmailSendingService] Error logging email', error);
    }
  }

  /**
   * Check if email sending is available
   */
  async isEmailAvailable(eventId?: number): Promise<any> {
    const config = await this.integrationsService.getConfig('email', eventId);
    if (!config || !config.is_enabled) return { available: false };
    return { available: true, provider: config.provider };
  }
}
