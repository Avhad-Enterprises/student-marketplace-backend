import DB from "@/database";
import { BuildCredit } from "@/interfaces/buildCredit.interface";
import { logger } from "@/utils/logger";

export interface ExportResult {
    data: any;
    mimeType: string;
    extension: string;
}

export class BuildCreditService {
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        student_visible?: boolean,
        sort: string = 'created_at',
        order: string = 'desc'
    ) {
        let query = DB('build_credit');

        if (search) {
            query = query.where((builder) => {
                builder.where('provider_name', 'ILIKE', `%${search}%`)
                    .orWhere('program_name', 'ILIKE', `%${search}%`)
                    .orWhere('reference_id', 'ILIKE', `%${search}%`);
            });
        }

        if (status && status !== 'All') {
            query = query.where('status', status.toLowerCase());
        }

        if (student_visible !== undefined) {
            query = query.where('student_visible', student_visible);
        }

        const total = await query.clone().count('* as count').first();
        const count = parseInt(total?.count as string) || 0;

        const data = await query
            .orderBy(sort, order)
            .limit(limit)
            .offset((page - 1) * limit);

        return {
            data,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    public async findById(id: string | number): Promise<BuildCredit> {
        return await DB('build_credit').where('id', id).orWhere('reference_id', id).first();
    }

    public async create(data: Partial<BuildCredit>): Promise<BuildCredit> {
        const countResult = await DB('build_credit').count('* as count').first();
        const count = parseInt(countResult?.count as string) || 0;
        const referenceId = `CRD-${8901 + count}`;

        const [newRecord] = await DB('build_credit').insert({
            ...data,
            reference_id: referenceId
        }).returning('*');

        return newRecord;
    }

    public async update(id: string | number, data: Partial<BuildCredit>): Promise<BuildCredit> {
        const [updatedRecord] = await DB('build_credit')
            .where('id', id)
            .update({
                ...data,
                updated_at: DB.fn.now()
            })
            .returning('*');
        return updatedRecord;
    }

    public async delete(id: string | number): Promise<boolean> {
        const deletedCount = await DB('build_credit').where('id', id).delete();
        return deletedCount > 0;
    }

    public async getMetrics() {
        const totalResult = await DB('build_credit').count('* as count').first();
        const activeResult = await DB('build_credit').where('status', 'active').count('* as count').first();

        return {
            totalPrograms: parseInt(totalResult?.count as string) || 0,
            averageCreditLimit: '$1.2k', // Mocked for consistency with UI
            successRate: '89%', // Mocked
            activeUsers: '2.4k' // Mocked
        };
    }

    public async export(options: any): Promise<ExportResult> {
        let query = DB('build_credit');

        if (options.scope === 'selected' && options.ids) {
            const idsArray = options.ids.split(',').map(Number);
            query = query.whereIn('id', idsArray);
        }

        if (options.from) {
            query = query.where('created_at', '>=', options.from);
        }
        if (options.to) {
            query = query.where('created_at', '<=', options.to);
        }

        const data = await query.select('*');

        const columns = options.columns ? options.columns.split(',') : null;
        const formattedData = data.map(item => {
            if (!columns) return item;
            const filtered: any = {};
            columns.forEach((col: string) => {
                filtered[col] = (item as any)[col];
            });
            return filtered;
        });

        if (options.format === 'json') {
            return {
                data: JSON.stringify(formattedData, null, 2),
                mimeType: 'application/json',
                extension: 'json'
            };
        }

        // Default CSV
        if (formattedData.length === 0) {
            return { data: '', mimeType: 'text/csv', extension: 'csv' };
        }

        const headers = Object.keys(formattedData[0]);
        const csvRows = [
            headers.join(','),
            ...formattedData.map(row => headers.map(fieldName => String(row[fieldName] || '')).join(','))
        ];

        return {
            data: csvRows.join('\n'),
            mimeType: 'text/csv',
            extension: 'csv'
        };
    }
}
