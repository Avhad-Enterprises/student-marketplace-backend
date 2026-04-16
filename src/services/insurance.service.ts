import DB from "@/database";
import { Insurance } from "@/interfaces/insurance.interface";
import cache from "@/utils/cache";

export class InsuranceService {
    // GET all insurance policies with pagination, search, and filters
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        insurance_type?: string,
        student_visible?: boolean,
        sort: string = "created_at",
        order: string = "desc",
        userRole?: string,
        providerId?: string | number
    ) {
        const cacheKey = cache.generateKey('insurance:list', { page, limit, search, status, insurance_type, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('insurance').where('is_deleted', false);
        const dataQuery = DB('insurance').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.andWhere(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('plan_name', term);
            });
            dataQuery.andWhere(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('plan_name', term);
            });
        }

        if (status) {
            countQuery.andWhere('status', status);
            dataQuery.andWhere('status', status);
        }

        if (insurance_type) {
            countQuery.andWhere('insurance_type', insurance_type);
            dataQuery.andWhere('insurance_type', insurance_type);
        }

        if (student_visible !== undefined) {
            countQuery.andWhere('student_visible', student_visible);
            dataQuery.andWhere('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['provider_name', 'plan_name', 'popularity', 'created_at', 'updated_at', 'coverage_amount', 'premium'];
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

    // GET insurance by ID
    public async findById(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('insurance').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    // CREATE insurance
    public async create(insuranceData: any) {
        const payload = {
            provider_name: insuranceData.provider_name || insuranceData.providerName,
            plan_name: insuranceData.plan_name || insuranceData.planName || insuranceData.policy_name || insuranceData.policyName,
            insurance_type: insuranceData.insurance_type || insuranceData.insuranceType || insuranceData.coverage_type || insuranceData.coverageType,
            coverage_amount: insuranceData.coverage_amount || insuranceData.coverageAmount,
            premium: insuranceData.premium,
            status: insuranceData.status || 'active',
            provider_id: insuranceData.provider_id,
        };

        const inserted = await DB('insurance').insert(payload).returning('*');
        cache.del('insurance:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE insurance
    public async update(id: string | number, insuranceData: any, userRole?: string, providerId?: string | number) {
        let query = DB('insurance').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (insuranceData.provider_name || insuranceData.providerName) payload.provider_name = insuranceData.provider_name || insuranceData.providerName;
        if (insuranceData.plan_name || insuranceData.planName || insuranceData.policy_name || insuranceData.policyName) 
            payload.plan_name = insuranceData.plan_name || insuranceData.planName || insuranceData.policy_name || insuranceData.policyName;
        if (insuranceData.insurance_type || insuranceData.insuranceType || insuranceData.coverage_type || insuranceData.coverageType) 
            payload.insurance_type = insuranceData.insurance_type || insuranceData.insuranceType || insuranceData.coverage_type || insuranceData.coverageType;
        if (insuranceData.coverage_amount !== undefined || insuranceData.coverageAmount !== undefined) 
            payload.coverage_amount = insuranceData.coverage_amount || insuranceData.coverageAmount;
        if (insuranceData.premium !== undefined) payload.premium = insuranceData.premium;
        if (insuranceData.status) payload.status = insuranceData.status;

        const updated = await DB('insurance').where('id', id).update(payload).returning('*');
        if (updated) cache.del('insurance:');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE insurance (Soft Delete)
    public async delete(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('insurance').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deleted = await query.update({ is_deleted: true, updated_at: DB.fn.now() }).returning('*');
        const isSuccess = Array.isArray(deleted) && deleted.length > 0;
        if (isSuccess) cache.del('insurance:');
        return isSuccess;
    }

    // GET insurance metrics
    public async getMetrics() {
        const cacheKey = 'insurance:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('insurance')
            .where('is_deleted', false)
            .select(
                DB.raw('count(distinct provider_name) as total_providers'),
                DB.raw("count(*) FILTER (WHERE status = 'active') as active_policies")
            )
            .first();
        
        const mostChosenType = await DB('insurance')
            .where('is_deleted', false)
            .select('insurance_type')
            .count('* as count')
            .groupBy('insurance_type')
            .orderBy('count', 'desc')
            .first();

        const result = {
            totalProviders: parseInt(String(metrics?.total_providers || 0)),
            activePolicies: parseInt(String(metrics?.active_policies || 0)),
            mostChosenType: mostChosenType ? (mostChosenType as any).insurance_type : 'N/A',
        };

        cache.set(cacheKey, result);
        return result;
    }
}
