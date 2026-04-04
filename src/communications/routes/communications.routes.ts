import { Router } from 'express';
import Route from '@/interfaces/routes.interface';
import { CampaignsController } from '../controllers/campaigns.controller';
import { TemplatesController } from '../controllers/templates.controller';
import { AudienceSegmentsController } from '../controllers/audience-segments.controller';
import { CommunicationSettingsController } from '../controllers/communication-settings.controller';
import { EmailTemplatesController } from '../controllers/email-templates.controller';
import { SenderIdentitiesController } from '../controllers/sender-identities.controller';
import { AutomationRulesController } from '../controllers/automation-rules.controller';

export class CommunicationsRoute implements Route {
  public path = '/api/communications';
  public router = Router();
  
  private campaignsController = new CampaignsController();
  private templatesController = new TemplatesController();
  private audienceSegmentsController = new AudienceSegmentsController();
  private communicationSettingsController = new CommunicationSettingsController();
  private emailTemplatesController = new EmailTemplatesController();
  private senderIdentitiesController = new SenderIdentitiesController();
  private automationRulesController = new AutomationRulesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Campaigns APIs
    this.router.get('/campaigns', (req, res) => this.campaignsController.getCampaigns(req, res));
    this.router.get('/campaigns/stats', (req, res) => this.campaignsController.getCampaignStats(req, res));
    this.router.get('/campaigns/audience-segments', (req, res) => this.campaignsController.getAudienceSegments(req, res));
    this.router.post('/campaigns/preview-audience', (req, res) => this.campaignsController.previewAudience(req, res));
    this.router.post('/campaigns', (req, res) => this.campaignsController.createCampaign(req, res));
    this.router.get('/campaigns/:campaignId', (req, res) => this.campaignsController.getCampaignById(req, res));
    this.router.put('/campaigns/:campaignId', (req, res) => this.campaignsController.updateCampaign(req, res));
    this.router.delete('/campaigns/:campaignId', (req, res) => this.campaignsController.deleteCampaign(req, res));
    this.router.post('/campaigns/:campaignId/duplicate', (req, res) => this.campaignsController.duplicateCampaign(req, res));
    this.router.post('/campaigns/:campaignId/send', (req, res) => this.campaignsController.sendCampaign(req, res));
    this.router.post('/campaigns/:campaignId/schedule', (req, res) => this.campaignsController.scheduleCampaign(req, res));
    this.router.post('/campaigns/:campaignId/pause', (req, res) => this.campaignsController.pauseCampaign(req, res));
    this.router.post('/campaigns/:campaignId/resume', (req, res) => this.campaignsController.resumeCampaign(req, res));
    this.router.get('/campaigns/:campaignId/recipients', (req, res) => this.campaignsController.getCampaignRecipients(req, res));

    // Templates APIs
    this.router.get('/templates', (req, res) => this.templatesController.getTemplates(req, res));
    this.router.get('/templates/variables', (req, res) => this.templatesController.getVariables(req, res));
    this.router.post('/templates', (req, res) => this.templatesController.createTemplate(req, res));
    this.router.get('/templates/:templateId', (req, res) => this.templatesController.getTemplateById(req, res));
    this.router.put('/templates/:templateId', (req, res) => this.templatesController.updateTemplate(req, res));
    this.router.delete('/templates/:templateId', (req, res) => this.templatesController.deleteTemplate(req, res));
    this.router.post('/templates/:templateId/duplicate', (req, res) => this.templatesController.duplicateTemplate(req, res));

    // Global Email Lifecycle Templates APIs
    this.router.get('/email-templates', (req, res) => this.emailTemplatesController.getGlobalTemplates(req, res));
    this.router.put('/email-templates', (req, res) => this.emailTemplatesController.saveGlobalTemplates(req, res));
    this.router.delete('/email-templates/:scenario', (req, res) => this.emailTemplatesController.deleteGlobalTemplate(req, res));

    // General Email Templates APIs
    this.router.get('/all-templates', (req, res) => this.emailTemplatesController.getAllTemplates(req, res));
    this.router.post('/all-templates', (req, res) => this.emailTemplatesController.createTemplate(req, res));
    this.router.put('/all-templates/:id', (req, res) => this.emailTemplatesController.updateTemplate(req, res));
    this.router.delete('/all-templates/:id', (req, res) => this.emailTemplatesController.deleteTemplate(req, res));

    // Sender Identities APIs
    this.router.get('/senders', (req, res) => this.senderIdentitiesController.getAll(req, res));
    this.router.post('/senders', (req, res) => this.senderIdentitiesController.create(req, res));
    this.router.get('/senders/:id', (req, res) => this.senderIdentitiesController.getById(req, res));
    this.router.put('/senders/:id', (req, res) => this.senderIdentitiesController.update(req, res));
    this.router.delete('/senders/:id', (req, res) => this.senderIdentitiesController.delete(req, res));

    // Automation Rules APIs
    this.router.get('/automation-rules', (req, res) => this.automationRulesController.getAll(req, res));
    this.router.post('/automation-rules', (req, res) => this.automationRulesController.create(req, res));
    this.router.get('/automation-rules/:id', (req, res) => this.automationRulesController.getById(req, res));
    this.router.put('/automation-rules/:id', (req, res) => this.automationRulesController.update(req, res));
    this.router.delete('/automation-rules/:id', (req, res) => this.automationRulesController.delete(req, res));

    // Audience Segments APIs
    this.router.get('/segments', (req, res) => this.audienceSegmentsController.getSegments(req, res));
    this.router.get('/segments/filter-fields', (req, res) => this.audienceSegmentsController.getFilterFields(req, res));
    this.router.post('/segments/preview', (req, res) => this.audienceSegmentsController.previewSegment(req, res));
    this.router.post('/segments', (req, res) => this.audienceSegmentsController.createSegment(req, res));
    this.router.get('/segments/:segmentId', (req, res) => this.audienceSegmentsController.getSegmentById(req, res));
    this.router.put('/segments/:segmentId', (req, res) => this.audienceSegmentsController.updateSegment(req, res));
    this.router.delete('/segments/:segmentId', (req, res) => this.audienceSegmentsController.deleteSegment(req, res));
    this.router.get('/segments/:segmentId/members', (req, res) => this.audienceSegmentsController.getSegmentMembers(req, res));
    this.router.post('/segments/:segmentId/refresh', (req, res) => this.audienceSegmentsController.refreshSegment(req, res));

    // Communication Settings APIs
    this.router.get('/settings', (req, res) => this.communicationSettingsController.getSettings(req, res));
    this.router.put('/settings', (req, res) => this.communicationSettingsController.updateSettings(req, res));
    this.router.post('/settings/validate', (req, res) => this.communicationSettingsController.validateSettings(req, res));
    this.router.get('/settings/quiet-hours', (req, res) => this.communicationSettingsController.getQuietHoursStatus(req, res));
    this.router.post('/settings/reset', (req, res) => this.communicationSettingsController.resetSettings(req, res));
  }
}

