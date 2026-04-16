import DB from "@/database";
import { Housing } from "@/interfaces/housing.interface";
import cache from "@/utils/cache";

export class HousingService {
    // GET all housing with pagination and search
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        housing_type?: string,
        student_visible?: boolean,
        sort: string = "created_at",
        order: string = "desc",
        userRole?: string,
        providerId?: string | number
    ) {
        const cacheKey = cache.generateKey('housing:list', { page, limit, search, status, housing_type, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('housing').where('is_deleted', false);
        const dataQuery = DB('housing').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.where(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('housing_type', term)
                    .orWhereILike('location', term)
                    .orWhereILike('reference_id', term);
            });
            dataQuery.where(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('housing_type', term)
                    .orWhereILike('location', term)
                    .orWhereILike('reference_id', term);
            });
        }

        if (status) {
            countQuery.where('status', status);
            dataQuery.where('status', status);
        }

        if (housing_type) {
            countQuery.where('housing_type', housing_type);
            dataQuery.where('housing_type', housing_type);
        }

        if (student_visible !== undefined) {
            countQuery.where('student_visible', student_visible);
            dataQuery.where('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['reference_id', 'provider_name', 'housing_type', 'location', 'popularity', 'created_at', 'updated_at', 'countries_covered', 'avg_rent', 'avgRent'];
        const finalSort = validSortFields.includes(sort) ? sort : 'created_at';
        const finalOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

        if (finalSort === 'avg_rent' || finalSort === 'avgRent') {
            dataQuery.orderByRaw(`CAST(NULLIF(regexp_replace(avg_rent, '[^0-9.]', '', 'g'), '') AS NUMERIC) ${finalOrder} NULLS LAST`);
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

    // GET housing by ID
    public async findById(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('housing').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    // CREATE housing
    public async create(housingData: any) {
        const reference_id = housingData.reference_id || housingData.referenceId || `HSG-${Date.now()}`;

        const payload = {
            reference_id,
            provider_name: housingData.provider_name || housingData.providerName,
            housing_type: housingData.housing_type || housingData.housingType,
            location: housingData.location,
            countries_covered: housingData.countries_covered !== undefined ? housingData.countries_covered : (housingData.countriesCovered || 0),
            status: housingData.status || 'active',
            student_visible: housingData.student_visible !== undefined ? housingData.student_visible : (housingData.studentVisible !== undefined ? housingData.studentVisible : true),
            avg_rent: housingData.avg_rent || housingData.avgRent,
            verified: housingData.verified !== undefined ? housingData.verified : false,
            popularity: housingData.popularity !== undefined ? housingData.popularity : (housingData.popularity || 0),
        };

        const inserted = await DB('housing').insert(payload).returning('*');
        cache.del('housing:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE housing
    public async update(id: string | number, housingData: any, userRole?: string, providerId?: string | number) {
        let query = DB('housing').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (housingData.provider_name || housingData.providerName) payload.provider_name = housingData.provider_name || housingData.providerName;
        if (housingData.housing_type || housingData.housingType) payload.housing_type = housingData.housing_type || housingData.housingType;
        if (housingData.location) payload.location = housingData.location;
        if (housingData.countries_covered !== undefined) payload.countries_covered = housingData.countries_covered;
        if (housingData.countriesCovered !== undefined) payload.countries_covered = housingData.countriesCovered;
        if (housingData.status) payload.status = housingData.status;
        if (housingData.student_visible !== undefined) payload.student_visible = housingData.student_visible;
        if (housingData.studentVisible !== undefined) payload.student_visible = housingData.studentVisible;
        if (housingData.avg_rent || housingData.avgRent) payload.avg_rent = housingData.avg_rent || housingData.avgRent;
        if (housingData.verified !== undefined) payload.verified = housingData.verified;
        if (housingData.popularity !== undefined) payload.popularity = housingData.popularity;

        const updated = await DB('housing').where('id', id).update(payload).returning('*');
        if (updated) cache.del('housing:');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE housing
    public async delete(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('housing').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deletedCount = await query.update({ is_deleted: true, updated_at: DB.fn.now() });
        if (deletedCount > 0) cache.del('housing:');
        return deletedCount > 0;
    }

    // GET housing metrics
    public async getMetrics() {
        const cacheKey = 'housing:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('housing')
            .where('is_deleted', false)
            .select(
                DB.raw('count(distinct provider_name) as total_providers'),
                DB.raw('count(distinct location) as cities_covered'),
                DB.raw('count(*) as total_listings')
            )
            .first();

        const result = {
            totalProviders: parseInt(String(metrics?.total_providers || 0)),
            citiesCovered: parseInt(String(metrics?.cities_covered || 0)),
            totalListings: parseInt(String(metrics?.total_listings || 0)),
        };

        cache.set(cacheKey, result);
        return result;
    }
}
