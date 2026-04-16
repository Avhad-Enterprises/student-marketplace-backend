import DB from "@/database";
import { Tax } from "@/interfaces/taxes.interface";
import { logger } from "@/utils/logger";
import cache from "@/utils/cache";

export interface ExportResult {
    data: any;
    mimeType: string;
    extension: string;
}

export class TaxesService {
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
        const cacheKey = cache.generateKey('taxes:list', { page, limit, search, status, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('taxes').where('is_deleted', false);
        const dataQuery = DB('taxes').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.andWhere(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('service_name', term);
            });
            dataQuery.andWhere(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('service_name', term);
            });
        }

        if (status && status !== 'all') {
            countQuery.andWhere('status', status.toLowerCase());
            dataQuery.andWhere('status', status.toLowerCase());
        }

        if (student_visible !== undefined) {
            countQuery.andWhere('student_visible', student_visible);
            dataQuery.andWhere('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['provider_name', 'service_name', 'status', 'created_at', 'updated_at', 'fee'];
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

    public async findById(id: string | number, userRole?: string, providerId?: string | number): Promise<Tax> {
        let query = DB('taxes').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    public async create(taxData: any): Promise<Tax> {
        const payload = {
            provider_name: taxData.provider_name || taxData.providerName || taxData.provider,
            service_name: taxData.service_name || taxData.serviceName,
            tax_type: taxData.tax_type || taxData.taxType,
            fee: taxData.fee,
            status: taxData.status || 'active',
            provider_id: taxData.provider_id,
        };

        const inserted = await DB('taxes').insert(payload).returning('*');
        cache.del('taxes:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    public async update(id: string | number, taxData: any, userRole?: string, providerId?: string | number): Promise<Tax | null> {
        let query = DB('taxes').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now()
        };

        if (taxData.provider_name || taxData.providerName || taxData.provider) payload.provider_name = taxData.provider_name || taxData.providerName || taxData.provider;
        if (taxData.service_name || taxData.serviceName) payload.service_name = taxData.service_name || taxData.serviceName;
        if (taxData.tax_type || taxData.taxType) payload.tax_type = taxData.tax_type || taxData.taxType;
        if (taxData.fee !== undefined) payload.fee = taxData.fee;
        if (taxData.status) payload.status = taxData.status;

        const [updatedTax] = await DB('taxes').where('id', id).update(payload).returning('*');
        if (updatedTax) cache.del('taxes:');
        return updatedTax;
    }

    public async delete(id: string | number, userRole?: string, providerId?: string | number): Promise<boolean> {
        let query = DB('taxes').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deletedCount = await query.update({ is_deleted: true, updated_at: DB.fn.now() });
        if (deletedCount > 0) cache.del('taxes:');
        return deletedCount > 0;
    }

    public async getMetrics() {
        const cacheKey = 'taxes:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('taxes')
            .where('is_deleted', false)
            .select(
                DB.raw('count(*) as total_taxes'),
                DB.raw("count(*) FILTER (WHERE status = 'active') as active_taxes")
            )
            .first();

        const result = {
            totalTaxServices: parseInt(String(metrics?.total_taxes || 0)) || 0,
            activeTaxServices: parseInt(String(metrics?.active_taxes || 0)) || 0,
        };

        cache.set(cacheKey, result);
        return result;
    }

    public async exportTaxes(options: any, userRole?: string, providerId?: string | number): Promise<ExportResult> {
        let query = DB('taxes').where('is_deleted', false);

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
                // Map backend column names to expected export headers if needed
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
