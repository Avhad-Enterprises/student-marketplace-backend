import DB from "@/database";
import { Expert } from "@/interfaces/experts.interface";

export class ExpertService {
    public async findAll(page: number = 1, limit: number = 10, search?: string) {
        const offset = (page - 1) * limit;

        const countQuery = DB('experts').count('id as count');
        const dataQuery = DB('experts').select('*');

        if (search) {
            const term = `%${search}%`;
            countQuery.where(function () {
                this.whereILike('full_name', term)
                    .orWhereILike('email', term)
                    .orWhereILike('specialization', term);
            });
            dataQuery.where(function () {
                this.whereILike('full_name', term)
                    .orWhereILike('email', term)
                    .orWhereILike('specialization', term);
            });
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const rows = await dataQuery.orderBy('created_at', 'desc').limit(limit).offset(offset);

        return {
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    public async findById(id: string | number): Promise<Expert> {
        const expert = await DB('experts').where('id', id).orWhere('expert_id', id).first();
        return expert;
    }

    public async create(expertData: any): Promise<Expert> {
        const expert_id = `EXP-${Date.now()}`;
        const payload = {
            ...expertData,
            expert_id,
            created_at: new Date(),
            updated_at: new Date()
        };

        const [inserted] = await DB('experts').insert(payload).returning('*');
        return inserted;
    }

    public async update(id: string | number, expertData: any): Promise<Expert> {
        const [updated] = await DB('experts')
            .where('id', id)
            .orWhere('expert_id', id)
            .update({
                ...expertData,
                updated_at: new Date()
            })
            .returning('*');
        return updated;
    }

    public async delete(id: string | number): Promise<boolean> {
        const deletedCount = await DB('experts').where('id', id).orWhere('expert_id', id).delete();
        return deletedCount > 0;
    }

    public async importExperts(data: any[]): Promise<{ success: number; failed: number; errors: string[] }> {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        await DB.transaction(async (trx) => {
            for (const item of data) {
                try {
                    const expertId = item.expert_id || item.expertId;
                    const email = item.email;
                    
                    if (!email && !expertId) throw new Error('Missing email or expert_id for identification');

                    const payload: any = {
                        full_name: item.full_name || item.name || 'New Expert',
                        email: email,
                        phone: item.phone || '',
                        specialization: item.specialization || 'General',
                        status: (item.status || 'available').toLowerCase(),
                        max_capacity: item.max_capacity || item.maxCapacity || 30,
                        assigned_students: item.assigned_students || item.assignedStudents || 0,
                        rating: item.rating || 5.0,
                        updated_at: new Date()
                    };

                    let existing = null;
                    if (expertId) {
                        existing = await trx('experts').where({ expert_id: expertId }).first();
                    } else if (email) {
                        existing = await trx('experts').where({ email }).first();
                    }

                    if (existing) {
                        await trx('experts').where({ id: existing.id }).update(payload);
                    } else {
                        payload.expert_id = expertId || `EXP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                        payload.created_at = new Date();
                        await trx('experts').insert(payload);
                    }
                    success++;
                } catch (error: any) {
                    failed++;
                    errors.push(`Row ${success + failed}: ${error.message}`);
                }
            }
        });

        return { success, failed, errors };
    }
}
