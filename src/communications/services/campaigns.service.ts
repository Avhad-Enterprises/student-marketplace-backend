import db from '../database/db';
import { TemplatesService } from './templates.service';

export interface Campaign {
  id: number;
  event_id: number;
  name: string;
  channel: 'email' | 'sms';
  campaign_type: 'one-time' | 'trigger-based';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'failed';
  template_id?: number;
  subject?: string;
  content?: string;
  sender?: string;
  audience_rule?: any;
  scheduled_at?: string;
  sent_at?: string;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  open_count: number;
  click_count: number;
  bounce_count: number;
  unsubscribe_count: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface CampaignWithStats extends Campaign {
  open_rate: number;
  click_rate: number;
}

export interface CreateCampaignInput {
  name: string;
  channel: 'email' | 'sms';
  campaign_type?: 'one-time' | 'trigger-based';
  template_id?: number;
  subject?: string;
  content?: string;
  sender?: string;
  audience_rule?: any;
  scheduled_at?: string;
}

export interface UpdateCampaignInput {
  name?: string;
  channel?: 'email' | 'sms';
  campaign_type?: 'one-time' | 'trigger-based';
  template_id?: number;
  subject?: string;
  content?: string;
  sender?: string;
  audience_rule?: any;
  scheduled_at?: string;
  status?: string;
}

export interface AudienceRule {
  type: 'all' | 'vip' | 'not_checked_in' | 'checked_in' | 'ticket_type' | 'custom';
  ticket_ids?: number[];
  custom_filter?: any;
}

export interface CampaignRecipient {
  id: number;
  campaign_id: number;
  issued_ticket_id?: number;
  recipient_email?: string;
  recipient_phone?: string;
  recipient_name?: string;
  status: string;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  error_message?: string;
  metadata?: any;
}

export class CampaignsService {
  private templatesService: TemplatesService;

  constructor() {
    this.templatesService = new TemplatesService();
  }

  // Calculate rates
  private calculateRates(campaign: Campaign): CampaignWithStats {
    const openRate = campaign.total_recipients > 0
      ? Math.round((campaign.open_count / campaign.total_recipients) * 100)
      : 0;
    const clickRate = campaign.total_recipients > 0
      ? Math.round((campaign.click_count / campaign.total_recipients) * 100)
      : 0;

    return {
      ...campaign,
      open_rate: openRate,
      click_rate: clickRate,
    };
  }

  // Get all campaigns for an event (or global if eventId is 0/null) with support for search, status, and pagination
  async getCampaignsByEventId(
    eventId: number | null | undefined, 
    options: { 
      search?: string; 
      status?: string; 
      page?: number; 
      limit?: number; 
      sortBy?: string; 
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ campaigns: CampaignWithStats[]; total: number }> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const { 
      search, 
      status, 
      page = 1, 
      limit = 10, 
      sortBy = 'created_at', 
      sortOrder = 'desc' 
    } = options;
    
    const query = db('event_campaigns').andWhere('is_deleted', false);
    
    if (effectiveEventId === null) {
      query.whereNull('event_id');
    } else {
      query.where('event_id', effectiveEventId);
    }

    if (search) {
      query.andWhere('name', 'ilike', `%${search}%`);
    }

    if (status && status !== 'all') {
      query.andWhere('status', status);
    }

    // Get total count for pagination
    const countQuery = query.clone().count('id as count').first();
    const countResult = await countQuery;
    const total = parseInt((countResult as any)?.count || '0', 10);

    // Apply pagination and sorting
    const campaigns = await query
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      campaigns: campaigns.map((c: Campaign) => this.calculateRates(c)),
      total
    };
  }

  // Get campaign by ID
  async getCampaignById(eventId: number | null | undefined, campaignId: number): Promise<CampaignWithStats | null> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;

    const query = db('event_campaigns')
      .where('id', campaignId)
      .andWhere('is_deleted', false);

    if (effectiveEventId === null) {
      query.whereNull('event_id');
    } else {
      query.where('event_id', effectiveEventId);
    }

    const campaign = await query.first();

    return campaign ? this.calculateRates(campaign) : null;
  }

  // Create campaign
  async createCampaign(eventId: number | null | undefined, input: CreateCampaignInput): Promise<CampaignWithStats> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;

    const [campaign] = await db('event_campaigns')
      .insert({
        event_id: effectiveEventId,
        name: input.name,
        channel: input.channel,
        campaign_type: input.campaign_type || 'one-time',
        template_id: input.template_id || null,
        subject: input.subject || null,
        content: input.content || null,
        sender: input.sender || null,
        audience_rule: input.audience_rule ? JSON.stringify(input.audience_rule) : null,
        scheduled_at: input.scheduled_at || null,
        status: input.scheduled_at ? 'scheduled' : 'draft',
      })
      .returning('*');

    // Log activity
    try {
      await db('event_activity_logs').insert({
        event_id: effectiveEventId,
        actor_type: 'admin',
        action_type: 'campaign_created',
        description: `Campaign "${input.name}" created (Channel: ${input.channel})`,
        metadata: JSON.stringify({ campaign_id: campaign.id, channel: input.channel }),
        created_at: new Date(),
      });
    } catch (logError) {
      console.warn('[CampaignsService] Warning: Failed to create activity log', logError);
    }

    return this.calculateRates(campaign);
  }

  // Update campaign
  async updateCampaign(eventId: number | null | undefined, campaignId: number, input: UpdateCampaignInput): Promise<CampaignWithStats | null> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const existing = await this.getCampaignById(effectiveEventId, campaignId);
    if (!existing) return null;

    if (!['draft', 'scheduled'].includes(existing.status)) {
      throw new Error('Cannot edit a campaign that has already been sent');
    }

    const updateData: any = { updated_at: db.fn.now() };
    if (input.name !== undefined) updateData.name = input.name;
    if (input.channel !== undefined) updateData.channel = input.channel;
    if (input.campaign_type !== undefined) updateData.campaign_type = input.campaign_type;
    if (input.template_id !== undefined) updateData.template_id = input.template_id;
    if (input.subject !== undefined) updateData.subject = input.subject;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.sender !== undefined) updateData.sender = input.sender;
    if (input.audience_rule !== undefined) updateData.audience_rule = JSON.stringify(input.audience_rule);
    if (input.scheduled_at !== undefined) {
      updateData.scheduled_at = input.scheduled_at;
      updateData.status = input.scheduled_at ? 'scheduled' : 'draft';
    }
    if (input.status !== undefined) updateData.status = input.status;

    const query = db('event_campaigns')
      .where('id', campaignId);
    
    if (effectiveEventId === null) {
      query.whereNull('event_id');
    } else {
      query.where('event_id', effectiveEventId);
    }

    const [updated] = await query.update(updateData).returning('*');

    return this.calculateRates(updated);
  }

  // Delete campaign (soft delete)
  async deleteCampaign(eventId: number | null | undefined, campaignId: number): Promise<boolean> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    
    const query = db('event_campaigns')
      .where('id', campaignId);

    if (effectiveEventId === null) {
      query.whereNull('event_id');
    } else {
      query.where('event_id', effectiveEventId);
    }

    const result = await query.update({ is_deleted: true, updated_at: db.fn.now() });

    return result > 0;
  }

  // Duplicate campaign
  async duplicateCampaign(eventId: number | null | undefined, campaignId: number): Promise<CampaignWithStats | null> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const original = await this.getCampaignById(effectiveEventId, campaignId);
    if (!original) return null;

    const [duplicate] = await db('event_campaigns')
      .insert({
        event_id: effectiveEventId,
        name: `${original.name} (Copy)`,
        channel: original.channel,
        campaign_type: original.campaign_type,
        template_id: original.template_id,
        subject: original.subject,
        content: original.content,
        audience_rule: original.audience_rule ? JSON.stringify(original.audience_rule) : null,
        status: 'draft',
      })
      .returning('*');

    return this.calculateRates(duplicate);
  }

  // Resolve audience based on rules
  async resolveAudience(eventId: number | null | undefined, audienceRule: AudienceRule): Promise<{ id: number; name: string; email?: string; phone?: string; ticket_name?: string }[]> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    
    let query = db('issued_tickets as a')
      .leftJoin('tickets as t', 'a.ticket_type_id', 't.id')
      .select(
        'a.id',
        'a.holder_name as name',
        'a.holder_email as email',
        'a.holder_phone as phone',
        't.name as ticket_name'
      )
      .andWhere('a.is_deleted', false)
      .andWhereNot('a.status', 'cancelled');

    if (effectiveEventId) {
      query = query.where('a.event_id', effectiveEventId);
    }

    switch (audienceRule.type) {
      case 'all':
        break;
      case 'vip':
        query = query.andWhere(function () {
          this.where('t.name', 'ilike', '%vip%')
            .orWhere('t.category', '=', 'vip');
        });
        break;
      case 'not_checked_in':
        query = query.andWhere('a.is_checked_in', false);
        break;
      case 'checked_in':
        query = query.andWhere('a.is_checked_in', true);
        break;
      case 'ticket_type':
        if (audienceRule.ticket_ids && audienceRule.ticket_ids.length > 0) {
          query = query.whereIn('a.ticket_type_id', audienceRule.ticket_ids);
        }
        break;
    }

    return query;
  }

  // Get audience count for preview
  async getAudienceCount(eventId: number | null | undefined, audienceRule: AudienceRule): Promise<number> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const audience = await this.resolveAudience(effectiveEventId, audienceRule);
    return audience.length;
  }

  // Send campaign
  async sendCampaign(eventId: number | null | undefined, campaignId: number): Promise<{ success: boolean; message: string; recipientCount: number }> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const campaign = await this.getCampaignById(effectiveEventId, campaignId);
    if (!campaign) {
      return { success: false, message: 'Campaign not found', recipientCount: 0 };
    }

    if (campaign.status === 'sent') {
      return { success: false, message: 'Campaign has already been sent', recipientCount: 0 };
    }

    const audienceRule = campaign.audience_rule ? (typeof campaign.audience_rule === 'string' ? JSON.parse(campaign.audience_rule) : campaign.audience_rule) : { type: 'all' };
    const recipients = await this.resolveAudience(effectiveEventId, audienceRule);

    if (recipients.length === 0) {
      return { success: false, message: 'No recipients found for this campaign', recipientCount: 0 };
    }

    // Insert recipient records
    const recipientRecords = recipients.map(r => ({
      campaign_id: campaignId,
      issued_ticket_id: r.id,
      recipient_email: r.email,
      recipient_name: r.name,
      status: 'pending',
    }));

    await db('campaign_recipients').insert(recipientRecords);

    // Update campaign status
    await db('event_campaigns')
      .where('id', campaignId)
      .update({
        status: 'sending',
        total_recipients: recipients.length,
        updated_at: db.fn.now(),
      });

    // Simulated send
    await db('campaign_recipients')
      .where('campaign_id', campaignId)
      .update({
        status: 'sent',
        sent_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

    await db('event_campaigns')
      .where('id', campaignId)
      .update({
        status: 'sent',
        sent_at: db.fn.now(),
        sent_count: recipients.length,
        delivered_count: recipients.length,
        updated_at: db.fn.now(),
      });

    return { success: true, message: 'Campaign sent successfully', recipientCount: recipients.length };
  }

  // Schedule campaign
  async scheduleCampaign(eventId: number | null | undefined, campaignId: number, scheduledAt: string): Promise<CampaignWithStats | null> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const campaign = await this.getCampaignById(effectiveEventId, campaignId);
    if (!campaign) return null;

    if (!['draft', 'scheduled'].includes(campaign.status)) {
      throw new Error('Cannot schedule a campaign that has already been sent');
    }

    const query = db('event_campaigns').where('id', campaignId);
    if (effectiveEventId === null) query.whereNull('event_id');
    else query.where('event_id', effectiveEventId);

    const [updated] = await query.update({
      scheduled_at: scheduledAt,
      status: 'scheduled',
      updated_at: db.fn.now(),
    }).returning('*');

    return this.calculateRates(updated);
  }

  // Pause campaign
  async pauseCampaign(eventId: number | null | undefined, campaignId: number): Promise<CampaignWithStats | null> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const campaign = await this.getCampaignById(effectiveEventId, campaignId);
    if (!campaign) return null;

    if (campaign.status !== 'scheduled') {
      throw new Error('Can only pause scheduled campaigns');
    }

    const query = db('event_campaigns').where('id', campaignId);
    if (effectiveEventId === null) query.whereNull('event_id');
    else query.where('event_id', effectiveEventId);

    const [updated] = await query.update({
      status: 'paused',
      updated_at: db.fn.now(),
    }).returning('*');

    return this.calculateRates(updated);
  }

  // Resume campaign
  async resumeCampaign(eventId: number | null | undefined, campaignId: number): Promise<CampaignWithStats | null> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const campaign = await this.getCampaignById(effectiveEventId, campaignId);
    if (!campaign) return null;

    if (campaign.status !== 'paused') {
      throw new Error('Can only resume paused campaigns');
    }

    const query = db('event_campaigns').where('id', campaignId);
    if (effectiveEventId === null) query.whereNull('event_id');
    else query.where('event_id', effectiveEventId);

    const [updated] = await query.update({
      status: campaign.scheduled_at ? 'scheduled' : 'draft',
      updated_at: db.fn.now(),
    }).returning('*');

    return this.calculateRates(updated);
  }

  // Get campaign recipients
  async getCampaignRecipients(campaignId: number, page: number = 1, limit: number = 20): Promise<{ recipients: CampaignRecipient[]; total: number }> {
    const offset = (page - 1) * limit;
    const countResult = await db('campaign_recipients').where('campaign_id', campaignId).count('id as count').first();
    const total = parseInt((countResult as any)?.count || '0', 10);
    const recipients = await db('campaign_recipients').where('campaign_id', campaignId).orderBy('created_at', 'desc').limit(limit).offset(offset);
    return { recipients, total };
  }

  // Get campaign stats
  async getCampaignStats(eventId: number | null | undefined): Promise<any> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const query = db('event_campaigns').andWhere('is_deleted', false);
    if (effectiveEventId === null) query.whereNull('event_id');
    else query.where('event_id', effectiveEventId);
    const campaigns = await query;
    const totalCampaigns = campaigns.length;
    const sentCampaigns = campaigns.filter((c: Campaign) => c.status === 'sent').length;
    return { totalCampaigns, sentCampaigns };
  }

  // Preview audience segments
  async getAudienceSegments(eventId: number | null | undefined): Promise<any[]> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    return [
      { name: 'All Attendees', type: 'all', count: 0 },
      { name: 'VIP Ticket Holders', type: 'vip', count: 0 },
    ];
  }
}
