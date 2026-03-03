import DB from "@/database";
import { Housing } from "@/interfaces/housing.interface";

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
        order: string = "desc"
    ) {
        const offset = (page - 1) * limit;

        const countQuery = DB('housing').count('* as count');
        const dataQuery = DB('housing').select('*');

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

        return {
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // GET housing by ID
    public async findById(id: string | number) {
        const result = await DB('housing').where('id', id).first();
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
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE housing
    public async update(id: string | number, housingData: any) {
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
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE housing
    public async delete(id: string | number) {
        const deleted = await DB('housing').where('id', id).del().returning('*');
        return Array.isArray(deleted) && deleted.length > 0;
    }

    // GET housing metrics
    public async getMetrics() {
        const totalProviders = await DB('housing').countDistinct('provider_name as count').first();
        const citiesCovered = await DB('housing').countDistinct('location as count').first(); // Best effort for cities
        const totalListings = await DB('housing').count('* as count').first(); // In this simple table, 1 row = 1 provider/listing set
        const mostPopular = await DB('housing').orderBy('popularity', 'desc').select('provider_name').first();

        return {
            totalProviders: parseInt((totalProviders as any).count || 0),
            citiesCovered: parseInt((citiesCovered as any).count || 0),
            totalListings: parseInt((totalListings as any).count || 0),
            mostPopular: (mostPopular as any)?.provider_name || 'N/A',
        };
    }
}
