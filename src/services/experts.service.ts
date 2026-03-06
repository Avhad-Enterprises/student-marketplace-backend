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
}
