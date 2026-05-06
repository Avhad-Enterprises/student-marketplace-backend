import { Request, Response } from 'express';
import { IntegrationsService } from '../services/integrations.service';
import { EmailSendingService } from '../services/email-sending.service';

const integrationsService = new IntegrationsService();
const emailSendingService = new EmailSendingService();

export class IntegrationsController {
  // Get all integration configs for an event (or global)
  async getIntegrations(req: Request, res: Response) {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string, 10) : null;
      
      const email = await integrationsService.getConfig('email', eventId);
      const sms = await integrationsService.getConfig('sms', eventId);
      const whatsapp = await integrationsService.getConfig('whatsapp', eventId);

      return res.status(200).json({ email, sms, whatsapp });
    } catch (error: any) {
      console.error('Error fetching integrations:', error);
      return res.status(500).json({ message: 'Failed to fetch integrations' });
    }
  }

  // Update integration config
  async updateIntegration(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const { provider, config, eventId } = req.body;

      if (!['email', 'sms', 'whatsapp'].includes(type)) {
        return res.status(400).json({ message: 'Invalid integration type' });
      }

      const result = await integrationsService.updateConfig(
        type as any,
        provider,
        config,
        eventId ? parseInt(eventId as string, 10) : null
      );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error updating integration:', error);
      return res.status(500).json({ message: 'Failed to update integration' });
    }
  }

  // Send a test email
  async sendTestEmail(req: Request, res: Response) {
    try {
      const { to, subject, content, eventId } = req.body;

      if (!to || !subject || !content) {
        return res.status(400).json({ message: 'To, Subject, and Content are required' });
      }

      const result = await emailSendingService.sendEmail({
        to,
        subject,
        html: content,
        text: content.replace(/<[^>]*>?/gm, '')
      }, eventId ? parseInt(eventId as string, 10) : undefined);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error: any) {
      console.error('Error sending test email:', error);
      return res.status(500).json({ message: 'Failed to send test email', error: error.message });
    }
  }
}
