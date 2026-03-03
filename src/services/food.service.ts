import DB from "@/database";
import { Food } from "@/interfaces/food.interface";

export class FoodService {
    // GET all food with pagination and search
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        service_type?: string,
        student_visible?: boolean,
        sort: string = "created_at",
        order: string = "desc"
    ) {
        const offset = (page - 1) * limit;

        const countQuery = DB('food').count('* as count');
        const dataQuery = DB('food').select('*');

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

        const validSortFields = ['reference_id', 'platform', 'service_type', 'offer_details', 'countries_covered', 'popularity', 'created_at', 'updated_at', 'avg_cost'];
        const finalSort = validSortFields.includes(sort) ? sort : 'created_at';
        const finalOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

        dataQuery.orderBy(finalSort, finalOrder);

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

    // GET food by ID
    public async findById(id: string | number) {
        const result = await DB('food').where('id', id).first();
        return result || null;
    }

    // CREATE food
    public async create(foodData: any) {
        const reference_id = foodData.reference_id || foodData.referenceId || `FOOD-${Date.now()}`;

        const payload = {
            reference_id,
            platform: foodData.platform,
            service_type: foodData.service_type || foodData.serviceType,
            offer_details: foodData.offer_details || foodData.offerDetails,
            countries_covered: foodData.countries_covered !== undefined ? foodData.countries_covered : (foodData.countriesCovered || 0),
            status: foodData.status || 'active',
            student_visible: foodData.student_visible !== undefined ? foodData.student_visible : (foodData.studentVisible !== undefined ? foodData.studentVisible : true),
            avg_cost: foodData.avg_cost || foodData.avgCost,
            verified: foodData.verified !== undefined ? foodData.verified : false,
            popularity: foodData.popularity !== undefined ? foodData.popularity : (foodData.popularity || 0),
        };

        const inserted = await DB('food').insert(payload).returning('*');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE food
    public async update(id: string | number, foodData: any) {
        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (foodData.platform) payload.platform = foodData.platform;
        if (foodData.service_type || foodData.serviceType) payload.service_type = foodData.service_type || foodData.serviceType;
        if (foodData.offer_details !== undefined) payload.offer_details = foodData.offer_details;
        if (foodData.offerDetails !== undefined) payload.offer_details = foodData.offerDetails;
        if (foodData.countries_covered !== undefined) payload.countries_covered = foodData.countries_covered;
        if (foodData.countriesCovered !== undefined) payload.countries_covered = foodData.countriesCovered;
        if (foodData.status) payload.status = foodData.status;
        if (foodData.student_visible !== undefined) payload.student_visible = foodData.student_visible;
        if (foodData.studentVisible !== undefined) payload.student_visible = foodData.studentVisible;
        if (foodData.avg_cost || foodData.avgCost) payload.avg_cost = foodData.avg_cost || foodData.avgCost;
        if (foodData.verified !== undefined) payload.verified = foodData.verified;
        if (foodData.popularity !== undefined) payload.popularity = foodData.popularity;

        const updated = await DB('food').where('id', id).update(payload).returning('*');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE food
    public async delete(id: string | number) {
        const deleted = await DB('food').where('id', id).del().returning('*');
        return Array.isArray(deleted) && deleted.length > 0;
    }

    // GET food metrics
    public async getMetrics() {
        const totalPlatforms = await DB('food').countDistinct('platform as count').first();
        const countriesServed = await DB('food').sum('countries_covered as sum').first();
        const totalCount = await DB('food').count('* as count').first();

        // Standardized mock values for metrics
        const foodPlacements = (parseInt(String(totalCount?.count || 0)) * 25);
        const activeUsers = (parseInt(String(totalCount?.count || 0)) * 150);

        return {
            totalPartners: parseInt(String(totalPlatforms?.count || 0)),
            activeUsers: activeUsers.toLocaleString(),
            countriesServed: parseInt(String(countriesServed?.sum || 0)),
            studentSavings: `$${(parseInt(String(totalCount?.count || 0)) * 50).toLocaleString()}`
        };
    }
}
