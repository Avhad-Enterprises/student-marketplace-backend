import DB from '@/database';
import { SOP, SOPStats, SOPAssistantSettings } from '@/interfaces/sopAssistant.interface';
import { sanitizePII } from '@/utils/sanitization';

class SopAssistantService {
    public async getSOPs(filters: any) {
        const { search, startDate, endDate, sortBy = 'created_at', sortOrder = 'desc', status, country, reviewStatus } = filters;
        let query = DB('sops').select('*');

        if (search && search.trim() !== '') {
            const searchTerm = search.trim();
            query = query.where(builder => {
                builder.where('student_name', 'ilike', `%${searchTerm}%`)
                    .orWhere('country', 'ilike', `%${searchTerm}%`)
                    .orWhere('university', 'ilike', `%${searchTerm}%`)
                    .orWhereRaw('CAST(id AS TEXT) ilike ?', [`%${searchTerm}%`]);
            });
        }

        if (status) query = query.where('status', status);
        if (country) query = query.where('country', country);
        if (reviewStatus) query = query.where('review_status', reviewStatus);

        if (startDate) {
            query = query.where('created_at', '>=', startDate);
        }

        if (endDate) {
            query = query.where('created_at', '<=', endDate);
        }

        // Validate sortBy field
        const validFields = ['id', 'student_name', 'country', 'university', 'review_status', 'ai_confidence_score', 'status', 'created_at', 'updated_at'];
        const sortField = validFields.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

        const sops = await query.orderBy(sortField, order);
        return sops.map(sop => ({
            id: sop.id.toString(),
            studentId: sop.student_id,
            studentName: sop.student_name,
            country: sop.country,
            university: sop.university,
            reviewStatus: sop.review_status,
            aiConfidenceScore: sop.ai_confidence_score,
            status: sop.status,
            lastUpdated: sop.updated_at
        }));
    }

    public async getSOPById(id: string): Promise<any> {
        const sop = await DB('sops').where({ id }).first();
        return sop;
    }

    public async getStats(): Promise<SOPStats> {
        // Use Knex aggregation for efficiency
        const [totalSOPsCount, draftsCount, reviewedCount] = await Promise.all([
            DB('sops').count('id as count').first(),
            DB('sops').where('review_status', 'Draft').count('id as count').first(),
            DB('sops').where('review_status', 'Reviewed').count('id as count').first()
        ]);

        // Fix confidence calculation to handle '%' string and decimal formats (e.g., 0.95 vs 95%)
        const avgResult: any = await DB('sops')
            .select(DB.raw(`
                AVG(
                    CASE 
                        WHEN ai_confidence_score ~ '%' THEN CAST(REPLACE(ai_confidence_score, '%', '') AS NUMERIC)
                        WHEN ai_confidence_score ~ '^[0-9.]+$' AND CAST(ai_confidence_score AS NUMERIC) <= 1 THEN CAST(ai_confidence_score AS NUMERIC) * 100
                        WHEN ai_confidence_score ~ '^[0-9.]+$' THEN CAST(ai_confidence_score AS NUMERIC)
                        ELSE 0 
                    END
                ) as avg_confidence
            `))
            .first();

        return {
            totalSOPs: Number(totalSOPsCount?.count || 0),
            draftsCreated: Number(draftsCount?.count || 0),
            reviewedSOPs: Number(reviewedCount?.count || 0),
            avgConfidence: `${Math.round(Number(avgResult?.avg_confidence || 0))}%`
        };
    }

    public async sanitizeContent(content: string): Promise<string> {
        return sanitizePII(content);
    }

    public async createSOP(data: Partial<SOP>) {
        const [id] = await DB('sops').insert({
            student_id: data.student_id,
            student_name: data.student_name,
            country: data.country,
            university: data.university,
            review_status: data.review_status || 'Draft',
            ai_confidence_score: data.ai_confidence_score || '0%',
            status: data.status || 'active',
            created_at: new Date(),
            updated_at: new Date()
        }).returning('id');
        return id;
    }

    public async updateSOP(id: string, data: Partial<SOP>) {
        const updateData: any = {
            updated_at: new Date()
        };

        if (data.student_name) updateData.student_name = data.student_name;
        if (data.country) updateData.country = data.country;
        if (data.university) updateData.university = data.university;
        if (data.review_status) updateData.review_status = data.review_status;
        if (data.ai_confidence_score) updateData.ai_confidence_score = data.ai_confidence_score;
        if (data.status) updateData.status = data.status;

        await DB('sops').where({ id }).update(updateData);
        return true;
    }

    public async updateStatus(id: string, status: string) {
        await DB('sops').where({ id }).update({ status, updated_at: new Date() });
        return true;
    }

    public async importSOPs(sops: any[]) {
        for (const sop of sops) {
            const row: any = {
                student_id: sop.studentId || sop.student_id,
                student_name: sop.studentName || sop.student_name,
                country: sop.country,
                university: sop.university,
                review_status: sop.reviewStatus || sop.review_status || 'Draft',
                ai_confidence_score: sop.aiConfidenceScore || sop.ai_confidence_score || '0%',
                status: sop.status || 'active',
                updated_at: new Date()
            };

            const id = sop.sopId || sop.id;
            if (id) {
                // Update if exists, otherwise insert (upsert logic if needed, but simple update is fine if assuming ID exists)
                const updated = await DB('sops').where({ id }).update(row);
                if (!updated) {
                    row.id = id;
                    row.created_at = new Date();
                    await DB('sops').insert(row);
                }
            } else {
                row.created_at = new Date();
                await DB('sops').insert(row);
            }
        }
        return sops.length;
    }

    public async getSettings(): Promise<SOPAssistantSettings> {
        const settings = await DB('sop_assistant_settings').first();
        return settings;
    }

    public async updateSettings(data: Partial<SOPAssistantSettings>) {
        const settings = await DB('sop_assistant_settings').first();
        if (settings) {
            await DB('sop_assistant_settings').where({ id: settings.id }).update({
                ...data,
                updated_at: new Date()
            });
        } else {
            await DB('sop_assistant_settings').insert({
                ...data,
                created_at: new Date(),
                updated_at: new Date()
            });
        }
        return true;
    }
}

export default SopAssistantService;
