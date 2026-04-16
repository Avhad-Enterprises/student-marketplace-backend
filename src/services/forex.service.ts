import DB from "@/database";
import { Forex } from "@/interfaces/forex.interface";
import cache from "@/utils/cache";

export class ForexService {
    // GET all forex with pagination and search
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
        const cacheKey = cache.generateKey('forex:list', { page, limit, search, status, service_type, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('forex').where('is_deleted', false);
        const dataQuery = DB('forex').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.where(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('service_type', term)
                    .orWhereILike('forex_id', term);
            });
            dataQuery.where(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('service_type', term)
                    .orWhereILike('forex_id', term);
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

        const validSortFields = ['forex_id', 'provider_name', 'service_type', 'currency_pairs', 'countries_covered', 'popularity', 'created_at', 'updated_at', 'avg_fee', 'transfer_speed'];
        const finalSort = validSortFields.includes(sort) ? sort : 'created_at';
        const finalOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

        if (finalSort === 'avg_fee') {
            dataQuery.orderByRaw(`CAST(NULLIF(regexp_replace(avg_fee, '[^0-9.]', '', 'g'), '') AS NUMERIC) ${finalOrder} NULLS LAST`);
        } else {
            dataQuery.orderBy(finalSort, finalOrder);
        }

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

    // GET forex by ID
    public async findById(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('forex').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    // CREATE forex
    public async create(forexData: any) {
        const forex_id = forexData.forex_id || forexData.forexId || `FRX-${Date.now()}`;

        const payload = {
            forex_id,
            provider_name: forexData.provider_name || forexData.providerName,
            service_type: forexData.service_type || forexData.serviceType,
            currency_pairs: forexData.currency_pairs || forexData.currencyPairs || 0,
            countries_covered: forexData.countries_covered !== undefined ? forexData.countries_covered : (forexData.countriesCovered || 0),
            status: forexData.status || 'active',
            student_visible: forexData.student_visible !== undefined ? forexData.student_visible : (forexData.studentVisible !== undefined ? forexData.studentVisible : true),
            avg_fee: forexData.avg_fee || forexData.avgFee,
            transfer_speed: forexData.transfer_speed || forexData.transferSpeed,
            popularity: forexData.popularity !== undefined ? forexData.popularity : (forexData.popularity || 0),
        };

        const inserted = await DB('forex').insert(payload).returning('*');
        cache.del('forex:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE forex
    public async update(id: string | number, forexData: any, userRole?: string, providerId?: string | number) {
        let query = DB('forex').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (forexData.provider_name || forexData.providerName) payload.provider_name = forexData.provider_name || forexData.providerName;
        if (forexData.service_type || forexData.serviceType) payload.service_type = forexData.service_type || forexData.serviceType;
        if (forexData.currency_pairs !== undefined) payload.currency_pairs = forexData.currency_pairs;
        if (forexData.currencyPairs !== undefined) payload.currency_pairs = forexData.currencyPairs;
        if (forexData.countries_covered !== undefined) payload.countries_covered = forexData.countries_covered;
        if (forexData.countriesCovered !== undefined) payload.countries_covered = forexData.countriesCovered;
        if (forexData.status) payload.status = forexData.status;
        if (forexData.student_visible !== undefined) payload.student_visible = forexData.student_visible;
        if (forexData.studentVisible !== undefined) payload.student_visible = forexData.studentVisible;
        if (forexData.avg_fee || forexData.avgFee) payload.avg_fee = forexData.avg_fee || forexData.avgFee;
        if (forexData.transfer_speed || forexData.transferSpeed) payload.transfer_speed = forexData.transfer_speed || forexData.transferSpeed;
        if (forexData.popularity !== undefined) payload.popularity = forexData.popularity;

        const updated = await DB('forex').where('id', id).update(payload).returning('*');
        if (updated) cache.del('forex:');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE forex
    public async delete(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('forex').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deletedCount = await query.update({ is_deleted: true, updated_at: DB.fn.now() });
        if (deletedCount > 0) cache.del('forex:');
        return deletedCount > 0;
    }

    // GET forex metrics
    public async getMetrics() {
        const cacheKey = 'forex:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('forex')
            .where('is_deleted', false)
            .select(
                DB.raw('count(distinct provider_name) as total_partners'),
                DB.raw('sum(currency_pairs) as total_currency_pairs'),
                DB.raw("AVG(CAST(NULLIF(regexp_replace(avg_fee, '[^0-9.]', '', 'g'), '') AS NUMERIC)) as avg_fee"),
                DB.raw("count(*) FILTER (WHERE transfer_speed ILIKE '%instant%' OR transfer_speed ILIKE '%same day%') as instant_transfers"),
                DB.raw('count(*) as total_count')
            )
            .first();

        const total = parseInt(String(metrics?.total_count || 0));

        const result = {
            totalPartners: parseInt(String(metrics?.total_partners || 0)),
            totalCurrencyPairs: parseInt(String(metrics?.total_currency_pairs || 0)),
            avgFee: parseFloat(String(metrics?.avg_fee || 0)).toFixed(1) + '%',
            instantPercentage: total > 0 ? Math.round((parseInt(String(metrics?.instant_transfers || 0)) / total) * 100) + '%' : '0%',
        };

        cache.set(cacheKey, result);
        return result;
    }
}
