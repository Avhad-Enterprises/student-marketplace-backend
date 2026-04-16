import DB from "@/database";
import { Food } from "@/interfaces/food.interface";
import cache from "@/utils/cache";

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
        order: string = "desc",
        userRole?: string,
        providerId?: string | number
    ) {
        const cacheKey = cache.generateKey('food:list', { page, limit, search, status, service_type, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('food').where('is_deleted', false);
        const dataQuery = DB('food').where('is_deleted', false);

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

        const validSortFields = ['reference_id', 'platform', 'service_type', 'offer_details', 'countries_covered', 'popularity', 'created_at', 'updated_at', 'avg_cost'];
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

    // GET food by ID
    public async findById(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('food').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    // CREATE food
    public async create(foodData: any) {
        const payload = {
            platform: foodData.platform,
            service_type: foodData.service_type || foodData.serviceType,
            offer_details: foodData.offer_details || foodData.offerDetails,
            status: foodData.status || 'active',
            student_visible: foodData.student_visible !== undefined ? foodData.student_visible : (foodData.studentVisible !== undefined ? foodData.studentVisible : true),
            avg_cost: foodData.avg_cost || foodData.avgCost,
            provider_id: foodData.provider_id,
        };

        const inserted = await DB('food').insert(payload).returning('*');
        cache.del('food:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE food
    public async update(id: string | number, foodData: any, userRole?: string, providerId?: string | number) {
        let query = DB('food').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (foodData.platform) payload.platform = foodData.platform;
        if (foodData.service_type || foodData.serviceType) payload.service_type = foodData.service_type || foodData.serviceType;
        if (foodData.offer_details !== undefined) payload.offer_details = foodData.offer_details;
        if (foodData.offerDetails !== undefined) payload.offer_details = foodData.offerDetails;
        if (foodData.status) payload.status = foodData.status;
        if (foodData.student_visible !== undefined) payload.student_visible = foodData.student_visible;
        if (foodData.studentVisible !== undefined) payload.student_visible = foodData.studentVisible;
        if (foodData.avg_cost || foodData.avgCost) payload.avg_cost = foodData.avg_cost || foodData.avgCost;

        const updated = await DB('food').where('id', id).update(payload).returning('*');
        if (updated) cache.del('food:');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE food
    public async delete(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('food').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deletedCount = await query.update({ is_deleted: true, updated_at: DB.fn.now() });
        if (deletedCount > 0) cache.del('food:');
        return deletedCount > 0;
    }

    // GET food metrics
    public async getMetrics() {
        const cacheKey = 'food:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('food')
            .where('is_deleted', false)
            .select(
                DB.raw('count(distinct platform) as total_platforms'),
                DB.raw('count(*) as total_count')
            )
            .first();

        const count = parseInt(String(metrics?.total_count || 0));

        const result = {
            totalPartners: parseInt(String(metrics?.total_platforms || 0)),
            activeUsers: (count * 150).toLocaleString(),
            studentSavings: `$${(count * 50).toLocaleString()}`
        };

        cache.set(cacheKey, result);
        return result;
    }
}
