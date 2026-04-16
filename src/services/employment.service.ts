import DB from "@/database";
import { Employment } from "@/interfaces/employment.interface";
import cache from "@/utils/cache";

export class EmploymentService {
    // GET all employment with pagination and search
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        service_type?: string,
        student_visible?: boolean,
        sort: string = "created_at",
        order: string = "desc",
        userRole?: string,
        providerId?: string | number
    ) {
        const cacheKey = cache.generateKey('employment:list', { page, limit, search, status, service_type, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('employment').where('is_deleted', false);
        const dataQuery = DB('employment').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.where(function () {
                this.whereILike('platform', term)
                    .orWhereILike('service_type', term)
                    .orWhereILike('reference_id', term);
            });
            dataQuery.where(function () {
                this.whereILike('platform', term)
                    .orWhereILike('service_type', term)
                    .orWhereILike('reference_id', term);
            });
        }

        if (status) {
            countQuery.where('status', status);
            dataQuery.where('status', status);
        }

        if (service_type) {
            countQuery.where('service_type', service_type);
            dataQuery.where('service_type', service_type);
        }

        if (student_visible !== undefined) {
            countQuery.where('student_visible', student_visible);
            dataQuery.where('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt(String(totalRes?.count || '0'));

        const validSortFields = ['reference_id', 'platform', 'service_type', 'job_types', 'countries_covered', 'popularity', 'created_at', 'updated_at', 'avg_salary'];
        const finalSort = validSortFields.includes(sort) ? sort : 'created_at';
        const finalOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

        dataQuery.orderBy(finalSort, finalOrder);

        const rows = await dataQuery.limit(limit).offset(offset);

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

    // GET employment by ID
    public async findById(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('employment').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    // CREATE employment
    public async create(employmentData: any) {
        const payload = {
            platform: employmentData.platform,
            service_type: employmentData.service_type || employmentData.serviceType,
            job_types: employmentData.job_types || employmentData.jobTypes,
            status: employmentData.status || 'active',
            student_visible: employmentData.student_visible !== undefined ? employmentData.student_visible : (employmentData.studentVisible !== undefined ? employmentData.studentVisible : true),
            avg_salary: employmentData.avg_salary || employmentData.avgSalary,
            provider_id: employmentData.provider_id,
        };

        const inserted = await DB('employment').insert(payload).returning('*');
        cache.del('employment:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE employment
    public async update(id: string | number, employmentData: any, userRole?: string, providerId?: string | number) {
        let query = DB('employment').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (employmentData.platform) payload.platform = employmentData.platform;
        if (employmentData.service_type || employmentData.serviceType) payload.service_type = employmentData.service_type || employmentData.serviceType;
        if (employmentData.job_types !== undefined) payload.job_types = employmentData.job_types;
        if (employmentData.jobTypes !== undefined) payload.job_types = employmentData.jobTypes;
        if (employmentData.status) payload.status = employmentData.status;
        if (employmentData.student_visible !== undefined) payload.student_visible = employmentData.student_visible;
        if (employmentData.studentVisible !== undefined) payload.student_visible = employmentData.studentVisible;
        if (employmentData.avg_salary || employmentData.avgSalary) payload.avg_salary = employmentData.avg_salary || employmentData.avgSalary;

        const updated = await DB('employment').where('id', id).update(payload).returning('*');
        if (updated) cache.del('employment:');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE employment
    public async delete(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('employment').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deletedCount = await query.update({ is_deleted: true, updated_at: DB.fn.now() });
        if (deletedCount > 0) cache.del('employment:');
        return deletedCount > 0;
    }

    // GET employment metrics
    public async getMetrics() {
        const cacheKey = 'employment:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('employment')
            .where('is_deleted', false)
            .select(
                DB.raw('count(distinct platform) as total_platforms'),
                DB.raw('count(*) as total_count')
            )
            .first();

        const count = parseInt(String(metrics?.total_count || 0));

        const result = {
            totalPlatforms: parseInt(String(metrics?.total_platforms || 0)),
            activeListings: (count * 45).toLocaleString(),
            studentPlacements: (count * 12).toLocaleString()
        };

        cache.set(cacheKey, result);
        return result;
    }
}
