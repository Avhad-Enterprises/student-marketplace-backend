import db from '@/database';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type EmailScenario = string;

export interface EmailTemplate {
  id: number;
  event_id: number | null;
  name: string;
  type: 'transactional' | 'campaign' | 'system';
  language: string;
  status: 'active' | 'draft' | 'archived';
  scenario: EmailScenario | null;
  is_enabled: boolean;
  has_override: boolean;
  subject: string | null;
  body: string | null;
  send_timing: 'immediate' | 'scheduled';
  schedule_offset: number | null;
  schedule_unit: 'minutes' | 'hours' | 'days' | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  // Virtual fields for resolution
  is_global_default?: boolean;
  source?: 'global' | 'event';
}

export interface EmailScenarioConfig {
  scenario: EmailScenario;
  triggerLabel: string;
  description: string;
  is_enabled: boolean;
  has_override: boolean;
  source: 'global' | 'event';
  subject: string;
  body: string;
  send_timing: 'immediate' | 'scheduled';
  schedule_offset: number | null;
  schedule_unit: 'minutes' | 'hours' | 'days' | null;
  globalSubject: string;
  globalBody: string;
  variables: string[];
}

export interface UpsertEmailTemplatesInput {
  scenarios: Array<{
    scenario: EmailScenario;
    is_enabled: boolean;
    has_override: boolean;
    subject?: string | null;
    body?: string | null;
    send_timing?: 'immediate' | 'scheduled';
    schedule_offset?: number | null;
    schedule_unit?: 'minutes' | 'hours' | 'days' | null;
  }>;
}

// Scenario metadata with variables
const SCENARIO_METADATA: Record<string, { triggerLabel: string; description: string; variables: string[] }> = {
  registration_complete: {
    triggerLabel: 'Registration Complete',
    description: 'Sent when attendee completes registration',
    variables: ['{{attendee_name}}', '{{attendee_email}}', '{{event_name}}', '{{event_date}}', '{{event_time}}', '{{venue_name}}', '{{confirmation_number}}', '{{organizer_name}}', '{{ticket_number}}', '{{unique_code}}', '{{ticket_type}}', '{{qr_image_url}}', '{{visual_ticket_url}}']
  },
  payment_processed: {
    triggerLabel: 'Payment Processed',
    description: 'Sent when payment is processed successfully',
    variables: ['{{attendee_name}}', '{{event_name}}', '{{payment_amount}}', '{{transaction_id}}', '{{organizer_name}}']
  },
  ticket_generated: {
    triggerLabel: 'Ticket Generated',
    description: 'Sent when a ticket is generated for an attendee',
    variables: ['{{attendee_name}}', '{{event_name}}', '{{event_date}}', '{{event_time}}', '{{ticket_type}}', '{{ticket_download_link}}', '{{organizer_name}}']
  },
  refund_processed: {
    triggerLabel: 'Refund Processed',
    description: 'Sent when a refund has been issued',
    variables: ['{{attendee_name}}', '{{event_name}}', '{{payment_amount}}', '{{organizer_name}}']
  },
  event_updated: {
    triggerLabel: 'Event Updated',
    description: 'Sent when event details are updated',
    variables: ['{{attendee_name}}', '{{event_name}}', '{{event_date}}', '{{event_time}}', '{{venue_name}}', '{{organizer_name}}']
  },
  event_cancelled: {
    triggerLabel: 'Event Cancelled',
    description: 'Sent when event is cancelled',
    variables: ['{{attendee_name}}', '{{event_name}}', '{{organizer_name}}']
  },
  scheduled_before_event: {
    triggerLabel: 'Scheduled Before Event',
    description: 'Sent as a reminder before the event starts',
    variables: ['{{attendee_name}}', '{{event_name}}', '{{event_date}}', '{{event_time}}', '{{venue_name}}', '{{confirmation_number}}', '{{organizer_name}}']
  },
  post_event_followup: {
    triggerLabel: 'Post-Event Follow-up',
    description: 'Sent after event ends',
    variables: ['{{attendee_name}}', '{{event_name}}', '{{organizer_name}}']
  }
};

const ALL_SCENARIOS: string[] = Object.keys(SCENARIO_METADATA);

// ============================================================================
// EMAIL TEMPLATES SERVICE
// ============================================================================

export class EmailTemplatesService {
  /**
   * Get all global default email template configurations
   */
  async getGlobalTemplates(): Promise<EmailScenarioConfig[]> {
    const result: EmailScenarioConfig[] = [];

    const dbScenarios = await db('email_templates')
      .whereNull('event_id')
      .where('is_deleted', false)
      .distinct('scenario')
      .select('scenario');

    for (const row of dbScenarios) {
      const config = await this.getScenarioConfig(row.scenario, null);
      if (config) {
        result.push(config);
      }
    }

    return result;
  }

  /**
   * Save all global email template configurations
   */
  async saveGlobalTemplates(input: UpsertEmailTemplatesInput): Promise<EmailScenarioConfig[]> {
    for (const scenarioInput of input.scenarios) {
      await this.upsertGlobalScenario(scenarioInput);
    }
    return this.getGlobalTemplates();
  }

  /**
   * Delete a global scenario
   */
  async deleteGlobalTemplate(scenario: EmailScenario): Promise<void> {
    await db('email_templates')
      .whereNull('event_id')
      .where('scenario', scenario)
      .update({
        is_deleted: true,
        updated_at: db.fn.now()
      });
  }

  /**
   * Upsert a single global scenario default
   */
  async upsertGlobalScenario(
    input: {
      scenario: EmailScenario;
      is_enabled: boolean;
      subject?: string | null;
      body?: string | null;
      send_timing?: 'immediate' | 'scheduled';
      schedule_offset?: number | null;
      schedule_unit?: 'minutes' | 'hours' | 'days' | null;
    }
  ): Promise<EmailTemplate> {
    const existing = await db('email_templates')
      .whereNull('event_id')
      .where('scenario', input.scenario)
      .first();

    const updateData: any = {
      is_enabled: input.is_enabled,
      has_override: true,
      updated_at: db.fn.now(),
      is_deleted: false
    };

    if (input.subject !== undefined) updateData.subject = input.subject;
    if (input.body !== undefined) updateData.body = input.body;
    if (input.send_timing !== undefined) updateData.send_timing = input.send_timing;
    if (input.schedule_offset !== undefined) updateData.schedule_offset = input.schedule_offset;
    if (input.schedule_unit !== undefined) updateData.schedule_unit = input.schedule_unit;

    if (existing) {
      const [updated] = await db('email_templates')
        .where('id', existing.id)
        .update(updateData)
        .returning('*');
      return updated;
    }

    const [created] = await db('email_templates')
      .insert({
        event_id: null,
        name: SCENARIO_METADATA[input.scenario]?.triggerLabel || input.scenario,
        type: 'system',
        scenario: input.scenario,
        ...updateData
      })
      .returning('*');
    return created;
  }

  /**
   * Get all email templates
   */
  async getAllTemplates(eventId?: number | null): Promise<EmailTemplate[]> {
    const query = db('email_templates').where('is_deleted', false);
    if (eventId !== undefined) {
      if (eventId === null) query.whereNull('event_id');
      else query.where('event_id', eventId);
    }
    return query.select('*').orderBy('created_at', 'desc');
  }

  /**
   * Create a custom template
   */
  async createTemplate(input: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const [template] = await db('email_templates')
      .insert({
        name: input.name || 'Untitled Template',
        type: input.type || 'transactional',
        language: input.language || 'en',
        status: input.status || 'active',
        event_id: input.event_id || null,
        subject: input.subject || '',
        body: input.body || '',
        send_timing: input.send_timing || 'immediate',
        scenario: input.scenario || null,
        is_enabled: input.is_enabled ?? true,
        has_override: true
      })
      .returning('*');
    return template;
  }

  /**
   * Update a template by ID
   */
  async updateTemplate(id: number, input: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    const [updated] = await db('email_templates')
      .where('id', id)
      .update({
        ...input,
        updated_at: db.fn.now()
      })
      .returning('*');
    return updated;
  }

  /**
   * Get all email template configurations for an event
   */
  async getEventTemplates(eventId: number): Promise<EmailScenarioConfig[]> {
    const result: EmailScenarioConfig[] = [];
    for (const scenario of ALL_SCENARIOS) {
      const config = await this.getScenarioConfig(scenario, eventId);
      result.push(config);
    }
    const extraScenarios = await db('email_templates')
      .where(function() { this.whereNull('event_id').orWhere('event_id', eventId); })
      .whereNotIn('scenario', ALL_SCENARIOS)
      .where('is_deleted', false)
      .distinct('scenario')
      .select('scenario');

    for (const row of extraScenarios) {
      const config = await this.getScenarioConfig(row.scenario, eventId);
      result.push(config);
    }
    return result;
  }

  /**
   * Get a single scenario config with resolution
   */
  async getScenarioConfig(scenario: EmailScenario, eventId?: number | null): Promise<EmailScenarioConfig> {
    const metadata = SCENARIO_METADATA[scenario] || {
      triggerLabel: scenario.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: 'Custom email lifecycle trigger',
      variables: ['{{attendee_name}}', '{{event_name}}', '{{organizer_name}}']
    };
    
    const globalTemplate = await db('email_templates').whereNull('event_id').where('scenario', scenario).where('is_deleted', false).first();
    let eventTemplate = null;
    if (eventId) {
      eventTemplate = await db('email_templates').where('event_id', eventId).where('scenario', scenario).where('is_deleted', false).first();
    }

    const globalSubject = globalTemplate?.subject || '';
    const globalBody = globalTemplate?.body || '';

    if (eventTemplate && eventTemplate.has_override) {
      return {
        scenario,
        triggerLabel: metadata.triggerLabel,
        description: metadata.description,
        is_enabled: eventTemplate.is_enabled,
        has_override: true,
        source: 'event',
        subject: eventTemplate.subject || globalSubject,
        body: eventTemplate.body || globalBody,
        send_timing: eventTemplate.send_timing || 'immediate',
        schedule_offset: eventTemplate.schedule_offset,
        schedule_unit: eventTemplate.schedule_unit,
        globalSubject,
        globalBody,
        variables: metadata.variables
      };
    }

    return {
      scenario,
      triggerLabel: metadata.triggerLabel,
      description: metadata.description,
      is_enabled: eventTemplate?.is_enabled ?? globalTemplate?.is_enabled ?? true,
      has_override: false,
      source: 'global',
      subject: globalSubject,
      body: globalBody,
      send_timing: globalTemplate?.send_timing || 'immediate',
      schedule_offset: globalTemplate?.schedule_offset,
      schedule_unit: globalTemplate?.schedule_unit,
      globalSubject,
      globalBody,
      variables: metadata.variables
    };
  }

  /**
   * Save all email template configurations for an event
   */
  async saveEventTemplates(eventId: number, input: UpsertEmailTemplatesInput): Promise<EmailScenarioConfig[]> {
    for (const scenarioInput of input.scenarios) {
      await this.upsertEventScenario(eventId, scenarioInput);
    }
    return this.getEventTemplates(eventId);
  }

  /**
   * Upsert a single scenario for an event
   */
  async upsertEventScenario(
    eventId: number,
    input: {
      scenario: EmailScenario;
      is_enabled: boolean;
      has_override: boolean;
      subject?: string | null;
      body?: string | null;
      send_timing?: 'immediate' | 'scheduled';
      schedule_offset?: number | null;
      schedule_unit?: 'minutes' | 'hours' | 'days' | null;
    }
  ): Promise<EmailTemplate> {
    const existing = await db('email_templates').where('event_id', eventId).where('scenario', input.scenario).first();
    const updateData: any = { is_enabled: input.is_enabled, has_override: input.has_override, updated_at: db.fn.now(), is_deleted: false };

    if (input.has_override) {
      if (input.subject !== undefined) updateData.subject = input.subject;
      if (input.body !== undefined) updateData.body = input.body;
      if (input.send_timing !== undefined) updateData.send_timing = input.send_timing;
      if (input.schedule_offset !== undefined) updateData.schedule_offset = input.schedule_offset;
      if (input.schedule_unit !== undefined) updateData.schedule_unit = input.schedule_unit;
    } else {
      updateData.subject = null;
      updateData.body = null;
      updateData.send_timing = 'immediate';
      updateData.schedule_offset = null;
      updateData.schedule_unit = null;
    }

    if (existing) {
      const [updated] = await db('email_templates').where('id', existing.id).update(updateData).returning('*');
      return updated;
    }

    const [created] = await db('email_templates')
      .insert({
        event_id: eventId,
        name: SCENARIO_METADATA[input.scenario]?.triggerLabel || input.scenario,
        type: 'system',
        scenario: input.scenario,
        ...updateData
      })
      .returning('*');
    return created;
  }

  /**
   * Reset all event templates to global defaults
   */
  async resetToGlobal(eventId: number): Promise<EmailScenarioConfig[]> {
    await db('email_templates').where('event_id', eventId).update({ is_deleted: true, updated_at: db.fn.now() });
    return this.getEventTemplates(eventId);
  }

  /**
   * Get resolved template for sending
   */
  async getResolvedTemplate(scenario: EmailScenario, eventId?: number): Promise<any | null> {
    const config = await this.getScenarioConfig(scenario, eventId);
    if (!config.is_enabled) return null;
    return {
      is_enabled: config.is_enabled,
      subject: config.subject,
      body: config.body,
      send_timing: config.send_timing,
      schedule_offset: config.schedule_offset,
      schedule_unit: config.schedule_unit
    };
  }

  /**
   * Get scenario metadata
   */
  getScenarioMetadata(): typeof SCENARIO_METADATA {
    return SCENARIO_METADATA;
  }
}
