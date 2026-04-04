import db from '@/database';

export interface Template {
  id: number;
  event_id: number | null;
  name: string;
  channel: 'email' | 'sms';
  subject?: string;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateInput {
  name: string;
  channel: 'email' | 'sms';
  subject?: string;
  content: string;
}

export interface UpdateTemplateInput {
  name?: string;
  channel?: 'email' | 'sms';
  subject?: string;
  content?: string;
}

export class TemplatesService {
  /**
   * Get all templates for an event
   */
  async getTemplatesByEventId(
    eventId: number | null | undefined,
    options: { search?: string; page?: number; limit?: number } = {}
  ): Promise<{ templates: Template[]; total: number }> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const { search, page = 1, limit = 10 } = options;

    const query = db('communication_templates').where('is_deleted', false);

    if (effectiveEventId === null) {
      query.whereNull('event_id');
    } else {
      query.where('event_id', effectiveEventId);
    }

    if (search) {
      query.andWhere('name', 'ilike', `%${search}%`);
    }

    const countResult = await query.clone().count('id as count').first();
    const total = parseInt((countResult as any)?.count || '0', 10);

    const templates = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset((page - 1) * limit);

    return { templates, total };
  }

  /**
   * Get template by ID
   */
  async getTemplateById(eventId: number | null | undefined, templateId: number): Promise<Template | null> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;

    const query = db('communication_templates')
      .where('id', templateId)
      .andWhere('is_deleted', false);

    if (effectiveEventId === null) {
      query.whereNull('event_id');
    } else {
      query.where('event_id', effectiveEventId);
    }

    const template = await query.first();
    return template || null;
  }

  /**
   * Create template
   */
  async createTemplate(eventId: number | null | undefined, input: CreateTemplateInput): Promise<Template> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;

    const [template] = await db('communication_templates')
      .insert({
        event_id: effectiveEventId,
        name: input.name,
        channel: input.channel,
        subject: input.subject || null,
        content: input.content,
      })
      .returning('*');

    return template;
  }

  /**
   * Update template
   */
  async updateTemplate(
    eventId: number | null | undefined,
    templateId: number,
    input: UpdateTemplateInput
  ): Promise<Template | null> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const existing = await this.getTemplateById(effectiveEventId, templateId);
    if (!existing) return null;

    const [updated] = await db('communication_templates')
      .where('id', templateId)
      .update({
        ...input,
        updated_at: db.fn.now(),
      })
      .returning('*');

    return updated;
  }

  /**
   * Delete template
   */
  async deleteTemplate(eventId: number | null | undefined, templateId: number): Promise<boolean> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const existing = await this.getTemplateById(effectiveEventId, templateId);
    if (!existing) return false;

    await db('communication_templates')
      .where('id', templateId)
      .update({ is_deleted: true, updated_at: db.fn.now() });

    return true;
  }

  /**
   * Duplicate template
   */
  async duplicateTemplate(eventId: number | null | undefined, templateId: number): Promise<Template | null> {
    const original = await this.getTemplateById(eventId, templateId);
    if (!original) return null;

    const [duplicate] = await db('communication_templates')
      .insert({
        event_id: original.event_id,
        name: `${original.name} (Copy)`,
        channel: original.channel,
        subject: original.subject,
        content: original.content,
      })
      .returning('*');

    return duplicate;
  }

  /**
   * Get available variables
   */
  getAvailableVariables(): string[] {
    return [
      '{{attendee_name}}',
      '{{attendee_email}}',
      '{{event_name}}',
      '{{event_date}}',
      '{{event_time}}',
      '{{venue_name}}',
      '{{confirmation_number}}',
      '{{ticket_type}}',
      '{{unique_code}}'
    ];
  }
}
