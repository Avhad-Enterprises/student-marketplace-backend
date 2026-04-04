import db from '../database/db';

export interface SenderIdentity {
  id: number;
  display_name: string;
  email: string;
  reply_to?: string;
  linked_brand?: string;
  status: 'verified' | 'pending' | 'failed';
  created_at: string;
  updated_at: string;
}

export class SenderIdentitiesService {
  async getAll(): Promise<SenderIdentity[]> {
    return db('sender_identities').select('*').orderBy('created_at', 'desc');
  }

  async getById(id: number): Promise<SenderIdentity | null> {
    return db('sender_identities').where('id', id).first();
  }

  async create(input: Partial<SenderIdentity>): Promise<SenderIdentity> {
    const [sender] = await db('sender_identities')
      .insert({
        display_name: input.display_name,
        email: input.email,
        reply_to: input.reply_to,
        linked_brand: input.linked_brand,
        status: input.status || 'pending'
      })
      .returning('*');
    return sender;
  }

  async update(id: number, input: Partial<SenderIdentity>): Promise<SenderIdentity | null> {
    const [updated] = await db('sender_identities')
      .where('id', id)
      .update({
        ...input,
        updated_at: db.fn.now()
      })
      .returning('*');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await db('sender_identities').where('id', id).del();
  }
}
