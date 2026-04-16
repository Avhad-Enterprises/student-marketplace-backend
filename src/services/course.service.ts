import DB from "@/database";
import { Course } from "@/interfaces/course.interface";
import cache from "@/utils/cache";

export class CourseService {
    // GET all courses with pagination and search
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
        const cacheKey = cache.generateKey('course:list', { page, limit, search, status, category, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('courses').where('is_deleted', false);
        const dataQuery = DB('courses').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.where(function () {
                this.whereILike('course_name', term)
                    .orWhereILike('provider', term)
                    .orWhereILike('category', term)
                    .orWhereILike('reference_id', term);
            });
            dataQuery.where(function () {
                this.whereILike('course_name', term)
                    .orWhereILike('provider', term)
                    .orWhereILike('category', term)
                    .orWhereILike('reference_id', term);
            });
        }

        if (status) {
            countQuery.where('status', status);
            dataQuery.where('status', status);
        }

        if (category) {
            countQuery.where('category', category);
            dataQuery.where('category', category);
        }

        if (student_visible !== undefined) {
            countQuery.where('student_visible', student_visible);
            dataQuery.where('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt(String(totalRes?.count || '0'));

        const validSortFields = ['reference_id', 'course_name', 'provider', 'category', 'duration', 'countries_covered', 'popularity', 'created_at', 'updated_at', 'avg_cost'];
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

    // GET course by ID
    public async findById(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('courses').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    // CREATE course
    public async create(courseData: any) {
        const payload = {
            course_name: courseData.course_name || courseData.courseName,
            provider: courseData.provider,
            category: courseData.category,
            duration: courseData.duration,
            status: courseData.status || 'active',
            student_visible: courseData.student_visible !== undefined ? courseData.student_visible : (courseData.studentVisible !== undefined ? courseData.studentVisible : true),
            avg_cost: courseData.avg_cost || courseData.avgCost,
            provider_id: courseData.provider_id,
        };

        const inserted = await DB('courses').insert(payload).returning('*');
        cache.del('course:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE course
    public async update(id: string | number, courseData: any, userRole?: string, providerId?: string | number) {
        let query = DB('courses').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (courseData.course_name || courseData.courseName) payload.course_name = courseData.course_name || courseData.courseName;
        if (courseData.provider) payload.provider = courseData.provider;
        if (courseData.category) payload.category = courseData.category;
        if (courseData.duration) payload.duration = courseData.duration;
        if (courseData.status) payload.status = courseData.status;
        if (courseData.student_visible !== undefined) payload.student_visible = courseData.student_visible;
        if (courseData.studentVisible !== undefined) payload.student_visible = courseData.studentVisible;
        if (courseData.avg_cost || courseData.avgCost) payload.avg_cost = courseData.avg_cost || courseData.avgCost;

        const updated = await DB('courses').where('id', id).update(payload).returning('*');
        if (updated) cache.del('course:');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE course
    public async delete(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('courses').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deletedCount = await query.update({ is_deleted: true, updated_at: DB.fn.now() });
        if (deletedCount > 0) cache.del('course:');
        return deletedCount > 0;
    }

    public async getMetrics() {
        const cacheKey = 'course:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('courses')
            .where('is_deleted', false)
            .select(
                DB.raw('count(*) as total_courses'),
                DB.raw('count(distinct provider) as total_providers')
            )
            .first();

        const totalCourses = parseInt(String(metrics?.total_courses || 0));
        const totalProviders = parseInt(String(metrics?.total_providers || 0));

        const result = {
            totalCourses,
            totalProviders,
            activeLearners: (totalCourses * 125).toLocaleString(),
            avgRating: `4.8/5.0`
        };

        cache.set(cacheKey, result);
        return result;
    }

    public async exportCourses(filters: any, userRole?: string, providerId?: string | number) {
        let query = DB('courses').where('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const { search, from, to, status, category, scope, ids } = filters;

        if (scope === 'selected' && ids) {
            const idsList = ids.split(',').map(Number);
            query = query.whereIn('id', idsList);
        } else {
            if (search) {
                const term = `%${search}%`;
                query.where(function () {
                    this.whereILike('course_name', term)
                        .orWhereILike('provider', term)
                        .orWhereILike('category', term)
                        .orWhereILike('reference_id', term);
                });
            }
            if (status) query.where('status', status);
            if (category) query.where('category', category);
            if (from) query.where('created_at', '>=', from);
            if (to) query.where('created_at', '<=', to);
        }

        return await query.orderBy('created_at', 'desc');
    }
}
