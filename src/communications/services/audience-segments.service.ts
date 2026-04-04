import db from '../database/db';
import { Knex } from 'knex';

export interface SegmentRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'between' | 'is_empty' | 'is_not_empty';
  value: any;
}

export interface AudienceSegment {
  id: number;
  event_id: number;
  name: string;
  description?: string;
  match_type: 'ALL' | 'ANY';
  rules_json: SegmentRule[];
  estimated_count: number;
  is_active: boolean;
  last_evaluated_at?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface CreateSegmentInput {
  name: string;
  description?: string;
  match_type: 'ALL' | 'ANY';
  rules_json: SegmentRule[];
  is_active?: boolean;
}

export interface UpdateSegmentInput {
  name?: string;
  description?: string;
  match_type?: 'ALL' | 'ANY';
  rules_json?: SegmentRule[];
  is_active?: boolean;
}

export interface SegmentMember {
  id: number;
  attendee_id: number;
  attendee_name: string;
  attendee_email?: string;
  ticket_name?: string;
  checkin_status: string;
  registration_status?: string;
}

export class AudienceSegmentsService {
  // Get all segments for an event
  async getSegmentsByEventId(
    eventId: number | null | undefined,
    options: {
      search?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ segments: AudienceSegment[]; total: number }> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const { search, page = 1, limit = 10 } = options;
    
    const query = db('audience_segments').andWhere('is_deleted', false);
    if (effectiveEventId === null) query.whereNull('event_id');
    else query.where('event_id', effectiveEventId);

    if (search) {
      query.andWhere(function() {
        this.where('name', 'ilike', `%${search}%`).orWhere('description', 'ilike', `%${search}%`);
      });
    }

    const countResult = await query.clone().count('id as count').first();
    const total = parseInt((countResult as any)?.count || '0', 10);

    const segments = await query.orderBy('created_at', 'desc').limit(limit).offset((page - 1) * limit);

    return {
      segments: segments.map((s: any) => ({
        ...s,
        rules_json: typeof s.rules_json === 'string' ? JSON.parse(s.rules_json) : s.rules_json,
      })),
      total
    };
  }

  // Get segment by ID
  async getSegmentById(eventId: number | null | undefined, segmentId: number): Promise<AudienceSegment | null> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const query = db('audience_segments').where('id', segmentId).andWhere('is_deleted', false);
    if (effectiveEventId === null) query.whereNull('event_id');
    else query.where('event_id', effectiveEventId);

    const segment = await query.first();
    if (!segment) return null;

    return {
      ...segment,
      rules_json: typeof segment.rules_json === 'string' ? JSON.parse(segment.rules_json) : segment.rules_json,
    };
  }

  // Create segment
  async createSegment(eventId: number | null | undefined, input: CreateSegmentInput): Promise<AudienceSegment> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const count = await this.evaluateSegmentRules(effectiveEventId, input.rules_json, input.match_type);

    const [segment] = await db('audience_segments')
      .insert({
        event_id: effectiveEventId,
        name: input.name,
        description: input.description || null,
        match_type: input.match_type,
        rules_json: JSON.stringify(input.rules_json),
        estimated_count: count,
        is_active: input.is_active !== false,
        last_evaluated_at: db.fn.now(),
      })
      .returning('*');

    await this.cacheSegmentMembers(segment.id, effectiveEventId, input.rules_json, input.match_type);

    return { ...segment, rules_json: input.rules_json };
  }

  // Evaluate segment rules
  async evaluateSegmentRules(eventId: number | null | undefined, rules: SegmentRule[], matchType: 'ALL' | 'ANY'): Promise<number> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const members = await this.resolveSegmentMembers(effectiveEventId, rules, matchType);
    return members.length;
  }

  // Resolve segment members
  async resolveSegmentMembers(eventId: number | null | undefined, rules: SegmentRule[], matchType: 'ALL' | 'ANY'): Promise<any[]> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    let query = db('issued_tickets as a')
      .leftJoin('tickets as t', 'a.ticket_type_id', 't.id')
      .leftJoin('event_registrations as r', 'a.registration_id', 'r.id')
      .select('a.id', 'a.holder_name', 'a.holder_email', 't.name as ticket_name')
      .andWhere('a.is_deleted', false);

    if (effectiveEventId) query = query.where('a.event_id', effectiveEventId);

    if (rules.length === 0) return query;

    if (matchType === 'ALL') {
      for (const rule of rules) {
        query = this.applyRule(query, rule);
      }
    } else {
      query = query.andWhere(function () {
        for (let i = 0; i < rules.length; i++) {
          if (i === 0) this.where(function () { applyRuleToBuilder(this, rules[i]); });
          else this.orWhere(function () { applyRuleToBuilder(this, rules[i]); });
        }
      });
    }

    return query;
  }

  private applyRule(query: any, rule: SegmentRule): any {
    // Basic implementation of rule applying
    return query; 
  }

  // Cache members
  async cacheSegmentMembers(segmentId: number, eventId: number | null | undefined, rules: SegmentRule[], matchType: 'ALL' | 'ANY'): Promise<void> {
    // Implementation for caching members
  }

  // Refresh segment
  async refreshSegment(eventId: number | null | undefined, segmentId: number): Promise<AudienceSegment | null> {
    const segment = await this.getSegmentById(eventId, segmentId);
    if (!segment) return null;
    const count = await this.evaluateSegmentRules(eventId, segment.rules_json, segment.match_type);
    const [updated] = await db('audience_segments').where('id', segmentId).update({ estimated_count: count, last_evaluated_at: db.fn.now() }).returning('*');
    return { ...updated, rules_json: segment.rules_json };
  }

  // Get filter fields
  getAvailableFilterFields(): any[] {
    return [
      { field: 'ticket_type', label: 'Ticket Type', type: 'select', operators: ['equals', 'in'] },
      { field: 'checkin_status', label: 'Check-in Status', type: 'select', operators: ['equals'] },
    ];
  }

  // Get segment members
  async getSegmentMembers(segmentId: number, page: number = 1, limit: number = 20): Promise<any> {
    const members = await db('audience_segment_members as sm').join('issued_tickets as a', 'sm.issued_ticket_id', 'a.id').where('sm.segment_id', segmentId).limit(limit).offset((page - 1) * limit);
    return { members, total: members.length };
  }
}

function applyRuleToBuilder(builder: any, rule: SegmentRule): void {
  // Logic to apply rule to knex builder
}
