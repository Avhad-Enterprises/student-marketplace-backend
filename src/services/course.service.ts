import DB from "@/database";
import { Course } from "@/interfaces/course.interface";

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
        order: string = "desc"
    ) {
        const offset = (page - 1) * limit;

        const countQuery = DB('courses').count('* as count');
        const dataQuery = DB('courses').select('*');

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

    // GET course by ID
    public async findById(id: string | number) {
        const result = await DB('courses').where('id', id).first();
        return result || null;
    }

    // CREATE course
    public async create(courseData: any) {
        const reference_id = courseData.reference_id || courseData.referenceId || `CRS-${Date.now()}`;

        const payload = {
            reference_id,
            course_name: courseData.course_name || courseData.courseName,
            provider: courseData.provider,
            category: courseData.category,
            duration: courseData.duration,
            countries_covered: courseData.countries_covered !== undefined ? courseData.countries_covered : (courseData.countriesCovered || 0),
            status: courseData.status || 'active',
            student_visible: courseData.student_visible !== undefined ? courseData.student_visible : (courseData.studentVisible !== undefined ? courseData.studentVisible : true),
            avg_cost: courseData.avg_cost || courseData.avgCost,
            popularity: courseData.popularity !== undefined ? courseData.popularity : (courseData.popularity || 0),
            learners_count: courseData.learners_count !== undefined ? courseData.learners_count : (courseData.learnersCount || 0),
            rating: courseData.rating !== undefined ? courseData.rating : (courseData.rating || 0),
        };

        const inserted = await DB('courses').insert(payload).returning('*');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE course
    public async update(id: string | number, courseData: any) {
        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (courseData.course_name || courseData.courseName) payload.course_name = courseData.course_name || courseData.courseName;
        if (courseData.provider) payload.provider = courseData.provider;
        if (courseData.category) payload.category = courseData.category;
        if (courseData.duration) payload.duration = courseData.duration;
        if (courseData.countries_covered !== undefined) payload.countries_covered = courseData.countries_covered;
        if (courseData.countriesCovered !== undefined) payload.countries_covered = courseData.countriesCovered;
        if (courseData.status) payload.status = courseData.status;
        if (courseData.student_visible !== undefined) payload.student_visible = courseData.student_visible;
        if (courseData.studentVisible !== undefined) payload.student_visible = courseData.studentVisible;
        if (courseData.avg_cost || courseData.avgCost) payload.avg_cost = courseData.avg_cost || courseData.avgCost;
        if (courseData.popularity !== undefined) payload.popularity = courseData.popularity;
        if (courseData.learners_count !== undefined) payload.learners_count = courseData.learners_count;
        if (courseData.learnersCount !== undefined) payload.learners_count = courseData.learnersCount;
        if (courseData.rating !== undefined) payload.rating = courseData.rating;

        const updated = await DB('courses').where('id', id).update(payload).returning('*');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE course
    public async delete(id: string | number) {
        const deleted = await DB('courses').where('id', id).del().returning('*');
        return Array.isArray(deleted) && deleted.length > 0;
    }

    public async getMetrics() {
        const totalCoursesRes = await DB('courses').count('* as count').first();
        const totalProvidersRes = await DB('courses').countDistinct('provider as count').first();
        const learnersRes = await DB('courses').sum('learners_count as sum').first();
        const ratingRes = await DB('courses').avg('rating as avg').first();

        const totalCourses = parseInt(String(totalCoursesRes?.count || 0));
        const totalProviders = parseInt(String(totalProvidersRes?.count || 0));
        const activeLearners = parseInt(String(learnersRes?.sum || 0));
        const avgRating = parseFloat(String(ratingRes?.avg || 0));

        return {
            totalCourses,
            activeLearners: activeLearners.toLocaleString(),
            totalProviders,
            avgRating: `${avgRating.toFixed(1)}/5.0`
        };
    }
}
