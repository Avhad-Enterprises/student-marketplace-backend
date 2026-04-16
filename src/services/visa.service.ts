import DB from "@/database";
import { Visa } from "@/interfaces/visa.interface";
import cache from "@/utils/cache";

export class VisaService {
    // GET all visa types with pagination, search, and filters
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        category?: string,
        student_visible?: boolean,
        sort: string = "created_at",
        order: string = "desc",
        userRole?: string,
        providerId?: string | number
    ) {
        const cacheKey = cache.generateKey('visa:list', { page, limit, search, status, category, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('visa').where('is_deleted', false);
        const dataQuery = DB('visa').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.andWhere(function () {
                this.whereILike('visa_type', term)
                    .orWhereILike('category', term)
                    .orWhereILike('visa_id', term);
            });
            dataQuery.andWhere(function () {
                this.whereILike('visa_type', term)
                    .orWhereILike('category', term)
                    .orWhereILike('visa_id', term);
            });
        }

        if (status && status !== 'All') {
            countQuery.andWhere('status', status.toLowerCase());
            dataQuery.andWhere('status', status.toLowerCase());
        }

        if (category && category !== 'All Categories') {
            countQuery.andWhere('category', category);
            dataQuery.andWhere('category', category);
        }

        if (student_visible !== undefined) {
            countQuery.andWhere('student_visible', student_visible);
            dataQuery.andWhere('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['visa_id', 'visa_type', 'category', 'popularity', 'created_at', 'updated_at', 'countries_covered'];
        const finalSort = validSortFields.includes(sort) ? sort : 'created_at';
        const finalOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

        const rows = await dataQuery.orderBy(finalSort, finalOrder).limit(limit).offset(offset);

        const result = {
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };

        cache.set(cacheKey, result);
        return result;
    }

    // GET visa by ID
    public async findById(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('visa').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    // CREATE visa
    public async create(visaData: any) {
        const payload = {
            visa_type: visaData.visa_type || visaData.visaType,
            category: visaData.category || 'Study',
            status: visaData.status || 'active',
            provider_id: visaData.provider_id,
        };

        const inserted = await DB('visa').insert(payload).returning('*');
        cache.del('visa:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE visa
    public async update(id: string | number, visaData: any, userRole?: string, providerId?: string | number) {
        let query = DB('visa').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (visaData.visa_type || visaData.visaType) payload.visa_type = visaData.visa_type || visaData.visaType;
        if (visaData.category) payload.category = visaData.category;
        if (visaData.status) payload.status = visaData.status;

        const updated = await DB('visa').where('id', id).update(payload).returning('*');
        if (updated) cache.del('visa:');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE visa (Soft Delete)
    public async delete(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('visa').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deleted = await query.update({ is_deleted: true, updated_at: DB.fn.now() }).returning('*');
        const isSuccess = Array.isArray(deleted) && deleted.length > 0;
        if (isSuccess) cache.del('visa:');
        return isSuccess;
    }

    // GET visa metrics
    public async getMetrics() {
        const cacheKey = 'visa:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('visa')
            .where('is_deleted', false)
            .select(
                DB.raw('count(*) as total_types'),
                DB.raw("count(*) FILTER (WHERE status = 'active') as active_types")
            )
            .first();
        
        const result = {
            totalVisaTypes: parseInt(String(metrics?.total_types || 0)),
            activeVisaRules: parseInt(String(metrics?.active_types || 0)),
        };

        cache.set(cacheKey, result);
        return result;
    }

    public async exportVisas(ids?: (string | number)[], userRole?: string, providerId?: string | number) {
        let query = DB('visa').where('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        if (ids && ids.length > 0) {
            query.whereIn('id', ids);
        }

        return await query.select('*');
    }
}
