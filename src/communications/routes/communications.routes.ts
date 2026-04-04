import { Router } from 'express';
import { CampaignsController } from '../controllers/campaigns.controller';
import { TemplatesController } from '../controllers/templates.controller';
import { AudienceSegmentsController } from '../controllers/audience-segments.controller';
import { CommunicationSettingsController } from '../controllers/communication-settings.controller';
import { EmailTemplatesController } from '../controllers/email-templates.controller';
import { SenderIdentitiesController } from '../controllers/sender-identities.controller';
import { AutomationRulesController } from '../controllers/automation-rules.controller';

const router = Router();
const campaignsController = new CampaignsController();
const templatesController = new TemplatesController();
const audienceSegmentsController = new AudienceSegmentsController();
const communicationSettingsController = new CommunicationSettingsController();
const emailTemplatesController = new EmailTemplatesController();
const senderIdentitiesController = new SenderIdentitiesController();
const automationRulesController = new AutomationRulesController();

// Campaigns APIs
router.get('/campaigns', (req, res) => campaignsController.getCampaigns(req, res));
router.get('/campaigns/stats', (req, res) => campaignsController.getCampaignStats(req, res));
router.get('/campaigns/audience-segments', (req, res) => campaignsController.getAudienceSegments(req, res));
router.post('/campaigns/preview-audience', (req, res) => campaignsController.previewAudience(req, res));
router.post('/campaigns', (req, res) => campaignsController.createCampaign(req, res));
router.get('/campaigns/:campaignId', (req, res) => campaignsController.getCampaignById(req, res));
router.put('/campaigns/:campaignId', (req, res) => campaignsController.updateCampaign(req, res));
router.delete('/campaigns/:campaignId', (req, res) => campaignsController.deleteCampaign(req, res));
router.post('/campaigns/:campaignId/duplicate', (req, res) => campaignsController.duplicateCampaign(req, res));
router.post('/campaigns/:campaignId/send', (req, res) => campaignsController.sendCampaign(req, res));
router.post('/campaigns/:campaignId/schedule', (req, res) => campaignsController.scheduleCampaign(req, res));
router.post('/campaigns/:campaignId/pause', (req, res) => campaignsController.pauseCampaign(req, res));
router.post('/campaigns/:campaignId/resume', (req, res) => campaignsController.resumeCampaign(req, res));
router.get('/campaigns/:campaignId/recipients', (req, res) => campaignsController.getCampaignRecipients(req, res));

// Templates APIs
router.get('/templates', (req, res) => templatesController.getTemplates(req, res));
router.get('/templates/variables', (req, res) => templatesController.getVariables(req, res));
router.post('/templates', (req, res) => templatesController.createTemplate(req, res));
router.get('/templates/:templateId', (req, res) => templatesController.getTemplateById(req, res));
router.put('/templates/:templateId', (req, res) => templatesController.updateTemplate(req, res));
router.delete('/templates/:templateId', (req, res) => templatesController.deleteTemplate(req, res));
router.post('/templates/:templateId/duplicate', (req, res) => templatesController.duplicateTemplate(req, res));

// Global Email Lifecycle Templates APIs
router.get('/email-templates', (req, res) => emailTemplatesController.getGlobalTemplates(req, res));
router.put('/email-templates', (req, res) => emailTemplatesController.saveGlobalTemplates(req, res));
router.delete('/email-templates/:scenario', (req, res) => emailTemplatesController.deleteGlobalTemplate(req, res));

// General Email Templates APIs
router.get('/all-templates', (req, res) => emailTemplatesController.getAllTemplates(req, res));
router.post('/all-templates', (req, res) => emailTemplatesController.createTemplate(req, res));
router.put('/all-templates/:id', (req, res) => emailTemplatesController.updateTemplate(req, res));
router.delete('/all-templates/:id', (req, res) => emailTemplatesController.deleteTemplate(req, res));

// Sender Identities APIs
router.get('/senders', (req, res) => senderIdentitiesController.getAll(req, res));
router.post('/senders', (req, res) => senderIdentitiesController.create(req, res));
router.get('/senders/:id', (req, res) => senderIdentitiesController.getById(req, res));
router.put('/senders/:id', (req, res) => senderIdentitiesController.update(req, res));
router.delete('/senders/:id', (req, res) => senderIdentitiesController.delete(req, res));

// Automation Rules APIs
router.get('/automation-rules', (req, res) => automationRulesController.getAll(req, res));
router.post('/automation-rules', (req, res) => automationRulesController.create(req, res));
router.get('/automation-rules/:id', (req, res) => automationRulesController.getById(req, res));
router.put('/automation-rules/:id', (req, res) => automationRulesController.update(req, res));
router.delete('/automation-rules/:id', (req, res) => automationRulesController.delete(req, res));

// Audience Segments APIs
router.get('/segments', (req, res) => audienceSegmentsController.getSegments(req, res));
router.get('/segments/filter-fields', (req, res) => audienceSegmentsController.getFilterFields(req, res));
router.post('/segments/preview', (req, res) => audienceSegmentsController.previewSegment(req, res));
router.post('/segments', (req, res) => audienceSegmentsController.createSegment(req, res));
router.get('/segments/:segmentId', (req, res) => audienceSegmentsController.getSegmentById(req, res));
router.put('/segments/:segmentId', (req, res) => audienceSegmentsController.updateSegment(req, res));
router.delete('/segments/:segmentId', (req, res) => audienceSegmentsController.deleteSegment(req, res));
router.get('/segments/:segmentId/members', (req, res) => audienceSegmentsController.getSegmentMembers(req, res));
router.post('/segments/:segmentId/refresh', (req, res) => audienceSegmentsController.refreshSegment(req, res));

// Communication Settings APIs
router.get('/settings', (req, res) => communicationSettingsController.getSettings(req, res));
router.put('/settings', (req, res) => communicationSettingsController.updateSettings(req, res));
router.post('/settings/validate', (req, res) => communicationSettingsController.validateSettings(req, res));
router.get('/settings/quiet-hours', (req, res) => communicationSettingsController.getQuietHoursStatus(req, res));
router.post('/settings/reset', (req, res) => communicationSettingsController.resetSettings(req, res));

export default router;
