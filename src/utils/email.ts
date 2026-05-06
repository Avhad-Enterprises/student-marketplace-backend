import { EmailSendingService, SendEmailOptions, SendEmailResult } from '../communications/services/email-sending.service';

const emailService = new EmailSendingService();

/**
 * Common function to send emails from anywhere in the application.
 * It uses the configured SMTP or SendGrid provider.
 * 
 * @param options - Email options (to, subject, html, etc.)
 * @param eventId - Optional event ID for event-specific branding/config
 * @returns Promise<SendEmailResult>
 */
export const sendEmail = async (options: SendEmailOptions, eventId?: number): Promise<SendEmailResult> => {
  return await emailService.sendEmail(options, eventId);
};
