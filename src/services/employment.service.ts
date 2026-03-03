import DB from "@/database";
import { Employment } from "@/interfaces/employment.interface";

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
        order: string = "desc"
    ) {
        const offset = (page - 1) * limit;

        const countQuery = DB('employment').count('* as count');
        const dataQuery = DB('employment').select('*');

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

    // GET employment by ID
    public async findById(id: string | number) {
        const result = await DB('employment').where('id', id).first();
        return result || null;
    }

    // CREATE employment
    public async create(employmentData: any) {
        const reference_id = employmentData.reference_id || employmentData.referenceId || `EMP-${Date.now()}`;

        const payload = {
            reference_id,
            platform: employmentData.platform,
            service_type: employmentData.service_type || employmentData.serviceType,
            job_types: employmentData.job_types || employmentData.jobTypes,
            countries_covered: employmentData.countries_covered !== undefined ? employmentData.countries_covered : (employmentData.countriesCovered || 0),
            status: employmentData.status || 'active',
            student_visible: employmentData.student_visible !== undefined ? employmentData.student_visible : (employmentData.studentVisible !== undefined ? employmentData.studentVisible : true),
            avg_salary: employmentData.avg_salary || employmentData.avgSalary,
            verified: employmentData.verified !== undefined ? employmentData.verified : false,
            popularity: employmentData.popularity !== undefined ? employmentData.popularity : (employmentData.popularity || 0),
        };

        const inserted = await DB('employment').insert(payload).returning('*');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE employment
    public async update(id: string | number, employmentData: any) {
        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (employmentData.platform) payload.platform = employmentData.platform;
        if (employmentData.service_type || employmentData.serviceType) payload.service_type = employmentData.service_type || employmentData.serviceType;
        if (employmentData.job_types !== undefined) payload.job_types = employmentData.job_types;
        if (employmentData.jobTypes !== undefined) payload.job_types = employmentData.jobTypes;
        if (employmentData.countries_covered !== undefined) payload.countries_covered = employmentData.countries_covered;
        if (employmentData.countriesCovered !== undefined) payload.countries_covered = employmentData.countriesCovered;
        if (employmentData.status) payload.status = employmentData.status;
        if (employmentData.student_visible !== undefined) payload.student_visible = employmentData.student_visible;
        if (employmentData.studentVisible !== undefined) payload.student_visible = employmentData.studentVisible;
        if (employmentData.avg_salary || employmentData.avgSalary) payload.avg_salary = employmentData.avg_salary || employmentData.avgSalary;
        if (employmentData.verified !== undefined) payload.verified = employmentData.verified;
        if (employmentData.popularity !== undefined) payload.popularity = employmentData.popularity;

        const updated = await DB('employment').where('id', id).update(payload).returning('*');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE employment
    public async delete(id: string | number) {
        const deleted = await DB('employment').where('id', id).del().returning('*');
        return Array.isArray(deleted) && deleted.length > 0;
    }

    // GET employment metrics
    public async getMetrics() {
        const totalPlatforms = await DB('employment').countDistinct('platform as count').first();
        const countriesServed = await DB('employment').sum('countries_covered as sum').first();
        const totalCount = await DB('employment').count('* as count').first();

        // Standardized mock values for metrics not easily tracked in basic table
        // In a real app these might come from linked tables like placements/listings
        const activeListings = (parseInt(String(totalCount?.count || 0)) * 45);
        const studentPlacements = (parseInt(String(totalCount?.count || 0)) * 12);

        return {
            totalPlatforms: parseInt(String(totalPlatforms?.count || 0)),
            activeListings: activeListings.toLocaleString(),
            countriesServed: parseInt(String(countriesServed?.sum || 0)),
            studentPlacements: studentPlacements.toLocaleString()
        };
    }
}
