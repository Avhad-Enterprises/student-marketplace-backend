import db from '@/database';

export interface AutomationRule {
  id: number;
  name: string;
  trigger: string;
  action: string;
  scope: 'global' | 'event' | 'program';
  status: 'active' | 'paused';
  created_at: string;
  updated_at: string;
}

export class AutomationRulesService {
  async getAll(): Promise<AutomationRule[]> {
    return db('automation_rules').select('*').orderBy('created_at', 'desc');
  }

  async getById(id: number): Promise<AutomationRule | null> {
    return db('automation_rules').where('id', id).first();
  }

  async create(input: Partial<AutomationRule>): Promise<AutomationRule> {
    const [rule] = await db('automation_rules')
      .insert({
        name: input.name,
        trigger: input.trigger,
        action: input.action,
        scope: input.scope || 'global',
        status: input.status || 'active'
      })
      .returning('*');
    return rule;
  }

  async update(id: number, input: Partial<AutomationRule>): Promise<AutomationRule | null> {
    const [updated] = await db('automation_rules')
      .where('id', id)
      .update({
        ...input,
        updated_at: db.fn.now()
      })
      .returning('*');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await db('automation_rules').where('id', id).del();
  }
}
