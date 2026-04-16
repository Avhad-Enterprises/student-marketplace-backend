import DB from "@/database";
import { BuildCredit } from "@/interfaces/buildCredit.interface";
import { logger } from "@/utils/logger";
import cache from "@/utils/cache";

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
        order: string = 'desc',
        userRole?: string,
        providerId?: string | number
    ) {
        const cacheKey = cache.generateKey('build_credit:list', { page, limit, search, status, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('build_credit').where('is_deleted', false);
        const dataQuery = DB('build_credit').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.andWhere(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('program_name', term);
            });
            dataQuery.andWhere(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('program_name', term);
            });
        }

        if (status && status !== 'All') {
            countQuery.andWhere('status', status.toLowerCase());
            dataQuery.andWhere('status', status.toLowerCase());
        }

        if (student_visible !== undefined) {
            countQuery.andWhere('student_visible', student_visible);
            dataQuery.andWhere('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['provider_name', 'program_name', 'status', 'created_at', 'updated_at', 'credit_limit', 'interest_rate'];
        const finalSort = validSortFields.includes(sort) ? sort : 'created_at';
        const finalOrder = order?.toLowerCase() === 'asc' ? 'asc' : 'desc';

        const rows = await dataQuery.orderBy(finalSort, finalOrder).limit(limit).offset(offset);

        const result = {
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };

        cache.set(cacheKey, result);
        return result;
    }

    public async findById(id: string | number, userRole?: string, providerId?: string | number): Promise<BuildCredit> {
        let query = DB('build_credit').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    public async create(data: any): Promise<BuildCredit> {
        const payload = {
            provider_name: data.provider_name || data.providerName,
            program_name: data.program_name || data.programName,
            credit_limit: data.credit_limit || data.creditLimit,
            interest_rate: data.interest_rate || data.interestRate,
            status: data.status || 'active',
            provider_id: data.provider_id,
        };

        const inserted = await DB('build_credit').insert(payload).returning('*');
        cache.del('build_credit:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    public async update(id: string | number, data: any, userRole?: string, providerId?: string | number): Promise<BuildCredit | null> {
        let query = DB('build_credit').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now()
        };

        if (data.provider_name || data.providerName) payload.provider_name = data.provider_name || data.providerName;
        if (data.program_name || data.programName) payload.program_name = data.program_name || data.programName;
        if (data.credit_limit !== undefined || data.creditLimit !== undefined) 
            payload.credit_limit = data.credit_limit || data.creditLimit;
        if (data.interest_rate !== undefined || data.interestRate !== undefined) 
            payload.interest_rate = data.interest_rate || data.interestRate;
        if (data.status) payload.status = data.status;

        const [updatedRecord] = await DB('build_credit').where('id', id).update(payload).returning('*');
        if (updatedRecord) cache.del('build_credit:');
        return updatedRecord;
    }

    public async delete(id: string | number, userRole?: string, providerId?: string | number): Promise<boolean> {
        let query = DB('build_credit').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deletedCount = await query.update({ is_deleted: true, updated_at: DB.fn.now() });
        if (deletedCount > 0) cache.del('build_credit:');
        return deletedCount > 0;
    }

    public async getMetrics() {
        const cacheKey = 'build_credit:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('build_credit')
            .where('is_deleted', false)
            .select(
                DB.raw('count(*) as total_programs'),
                DB.raw("count(*) FILTER (WHERE status = 'active') as active_programs")
            )
            .first();

        const result = {
            totalPrograms: parseInt(String(metrics?.total_programs || 0)),
            activePrograms: parseInt(String(metrics?.active_programs || 0)),
        };

        cache.set(cacheKey, result);
        return result;
    }

    public async export(options: any, userRole?: string, providerId?: string | number): Promise<ExportResult> {
        let query = DB('build_credit').where('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

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
