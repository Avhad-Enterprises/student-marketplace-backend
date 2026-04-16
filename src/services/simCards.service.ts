import DB from "@/database";
import { SimCard } from "@/interfaces/simCards.interface";
import cache from "@/utils/cache";

export class SimCardService {
    // GET all SIM cards with pagination and search
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        network_type?: string,
        student_visible?: boolean,
        sort: string = "created_at",
        order: string = "desc",
        userRole?: string,
        providerId?: string | number
    ) {
        const cacheKey = cache.generateKey('simcards:list', { page, limit, search, status, network_type, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('sim_cards').where('is_deleted', false);
        const dataQuery = DB('sim_cards').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.andWhere(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('service_name', term)
                    .orWhereILike('sim_id', term);
            });
            dataQuery.andWhere(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('service_name', term)
                    .orWhereILike('sim_id', term);
            });
        }

        if (status) {
            countQuery.andWhere('status', status);
            dataQuery.andWhere('status', status);
        }

        if (network_type) {
            countQuery.andWhere('network_type', network_type);
            dataQuery.andWhere('network_type', network_type);
        }

        if (student_visible !== undefined) {
            countQuery.andWhere('student_visible', student_visible);
            dataQuery.andWhere('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['sim_id', 'provider_name', 'service_name', 'popularity', 'created_at', 'updated_at', 'countries_covered'];
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

    // GET SIM card by ID
    public async findById(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('sim_cards').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    // CREATE SIM card
    public async create(simData: any) {
        const sim_id = simData.sim_id || simData.simId || `SIM-${Date.now()}`;

        const payload = {
            sim_id,
            provider_name: simData.provider_name || simData.providerName,
            service_name: simData.service_name || simData.serviceName,
            countries_covered: simData.countries_covered !== undefined ? simData.countries_covered : (simData.countriesCovered || 0),
            status: simData.status || 'active',
            student_visible: simData.student_visible !== undefined ? simData.student_visible : (simData.studentVisible !== undefined ? simData.studentVisible : true),
            network_type: simData.network_type || simData.networkType,
            data_allowance: simData.data_allowance || simData.dataAllowance,
            validity: simData.validity,
            popularity: simData.popularity !== undefined ? simData.popularity : (simData.popularity || 0),
        };

        const inserted = await DB('sim_cards').insert(payload).returning('*');
        cache.del('simcards:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE SIM card
    public async update(id: string | number, simData: any, userRole?: string, providerId?: string | number) {
        let query = DB('sim_cards').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (simData.provider_name || simData.providerName) payload.provider_name = simData.provider_name || simData.providerName;
        if (simData.service_name || simData.serviceName) payload.service_name = simData.service_name || simData.serviceName;
        if (simData.countries_covered !== undefined) payload.countries_covered = simData.countries_covered;
        if (simData.countriesCovered !== undefined) payload.countries_covered = simData.countriesCovered;
        if (simData.status) payload.status = simData.status;
        if (simData.student_visible !== undefined) payload.student_visible = simData.student_visible;
        if (simData.studentVisible !== undefined) payload.student_visible = simData.studentVisible;
        if (simData.network_type || simData.networkType) payload.network_type = simData.network_type || simData.networkType;
        if (simData.data_allowance || simData.dataAllowance) payload.data_allowance = simData.data_allowance || simData.dataAllowance;
        if (simData.validity) payload.validity = simData.validity;
        if (simData.popularity !== undefined) payload.popularity = simData.popularity;

        const updated = await DB('sim_cards').where('id', id).update(payload).returning('*');
        if (updated) cache.del('simcards:');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE SIM card (Soft Delete)
    public async delete(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('sim_cards').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deleted = await query.update({ is_deleted: true, updated_at: DB.fn.now() }).returning('*');
        const isSuccess = Array.isArray(deleted) && deleted.length > 0;
        if (isSuccess) cache.del('simcards:');
        return isSuccess;
    }

    // GET SIM metrics
    public async getMetrics() {
        const cacheKey = 'simcards:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('sim_cards')
            .where('is_deleted', false)
            .select(
                DB.raw('count(distinct provider_name) as total_providers'),
                DB.raw("count(*) FILTER (WHERE status = 'active') as active_plans"),
                DB.raw('max(countries_covered) as max_countries')
            )
            .first();

        const mostPopular = await DB('sim_cards')
            .where('is_deleted', false)
            .orderBy('popularity', 'desc')
            .select('provider_name')
            .first();

        const result = {
            totalProviders: parseInt(String(metrics?.total_providers || 0)),
            activePlans: parseInt(String(metrics?.active_plans || 0)),
            countriesCovered: parseInt(String(metrics?.max_countries || 0)),
            mostPopular: (mostPopular as any)?.provider_name || 'N/A',
        };

        cache.set(cacheKey, result);
        return result;
    }
}
