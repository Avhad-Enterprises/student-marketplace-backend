import DB from "@/database";
import { Insurance } from "@/interfaces/insurance.interface";

export class InsuranceService {
    // GET all insurance policies with pagination, search, and filters
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        coverage_type?: string,
        student_visible?: boolean,
        sort: string = "created_at",
        order: string = "desc"
    ) {
        const offset = (page - 1) * limit;

        const countQuery = DB('insurance').count('* as count');
        const dataQuery = DB('insurance').select('*');

        if (search) {
            const term = `%${search}%`;
            countQuery.where(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('policy_name', term)
                    .orWhereILike('insurance_id', term);
            });
            dataQuery.where(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('policy_name', term)
                    .orWhereILike('insurance_id', term);
            });
        }

        if (status) {
            countQuery.where('status', status);
            dataQuery.where('status', status);
        }

        if (coverage_type) {
            countQuery.where('coverage_type', coverage_type);
            dataQuery.where('coverage_type', coverage_type);
        }

        if (student_visible !== undefined) {
            countQuery.where('student_visible', student_visible);
            dataQuery.where('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['insurance_id', 'provider_name', 'policy_name', 'popularity', 'created_at', 'updated_at', 'countries_covered'];
        const finalSort = validSortFields.includes(sort) ? sort : 'created_at';
        const finalOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

        const rows = await dataQuery.orderBy(finalSort, finalOrder).limit(limit).offset(offset);

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

    // GET insurance by ID
    public async findById(id: string | number) {
        const result = await DB('insurance').where('id', id).first();
        return result || null;
    }

    // CREATE insurance
    public async create(insuranceData: any) {
        const insurance_id = insuranceData.insurance_id || insuranceData.insuranceId || `INS-${Date.now()}`;

        const payload = {
            insurance_id,
            provider_name: insuranceData.provider_name || insuranceData.providerName,
            policy_name: insuranceData.policy_name || insuranceData.policyName,
            coverage_type: insuranceData.coverage_type || insuranceData.coverageType,
            countries_covered: insuranceData.countries_covered !== undefined ? insuranceData.countries_covered : (insuranceData.countriesCovered || 0),
            status: insuranceData.status || 'active',
            student_visible: insuranceData.student_visible !== undefined ? insuranceData.student_visible : (insuranceData.studentVisible !== undefined ? insuranceData.studentVisible : true),
            duration: insuranceData.duration || '12 months',
            visa_compliant: insuranceData.visa_compliant !== undefined ? insuranceData.visa_compliant : (insuranceData.visaCompliant !== undefined ? insuranceData.visaCompliant : true),
            mandatory: insuranceData.mandatory !== undefined ? insuranceData.mandatory : (insuranceData.mandatory !== undefined ? insuranceData.mandatory : false),
            popularity: insuranceData.popularity !== undefined ? insuranceData.popularity : (insuranceData.popularity || 0),
        };

        const inserted = await DB('insurance').insert(payload).returning('*');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE insurance
    public async update(id: string | number, insuranceData: any) {
        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (insuranceData.provider_name || insuranceData.providerName) payload.provider_name = insuranceData.provider_name || insuranceData.providerName;
        if (insuranceData.policy_name || insuranceData.policyName) payload.policy_name = insuranceData.policy_name || insuranceData.policyName;
        if (insuranceData.coverage_type || insuranceData.coverageType) payload.coverage_type = insuranceData.coverage_type || insuranceData.coverageType;
        if (insuranceData.countries_covered !== undefined) payload.countries_covered = insuranceData.countries_covered;
        if (insuranceData.countriesCovered !== undefined) payload.countries_covered = insuranceData.countriesCovered;
        if (insuranceData.status) payload.status = insuranceData.status;
        if (insuranceData.student_visible !== undefined) payload.student_visible = insuranceData.student_visible;
        if (insuranceData.studentVisible !== undefined) payload.student_visible = insuranceData.studentVisible;
        if (insuranceData.duration) payload.duration = insuranceData.duration;
        if (insuranceData.visa_compliant !== undefined) payload.visa_compliant = insuranceData.visa_compliant;
        if (insuranceData.visaCompliant !== undefined) payload.visa_compliant = insuranceData.visaCompliant;
        if (insuranceData.mandatory !== undefined) payload.mandatory = insuranceData.mandatory;
        if (insuranceData.popularity !== undefined) payload.popularity = insuranceData.popularity;

        const updated = await DB('insurance').where('id', id).update(payload).returning('*');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE insurance
    public async delete(id: string | number) {
        const deleted = await DB('insurance').where('id', id).del().returning('*');
        return Array.isArray(deleted) && deleted.length > 0;
    }

    // GET insurance metrics
    public async getMetrics() {
        const totalProviders = await DB('insurance').countDistinct('provider_name as count').first();
        const activePolicies = await DB('insurance').where('status', 'active').count('* as count').first();
        const mandatoryCountries = await DB('insurance').where('mandatory', true).countDistinct('countries_covered as count').first(); // Simplified, might need countries table link
        const mostChosenType = await DB('insurance')
            .select('coverage_type')
            .count('* as count')
            .groupBy('coverage_type')
            .orderBy('count', 'desc')
            .first();

        return {
            totalProviders: parseInt((totalProviders as any).count || 0),
            activePolicies: parseInt((activePolicies as any).count || 0),
            mandatoryCountries: parseInt((mandatoryCountries as any).count || 0),
            mostChosenType: mostChosenType ? (mostChosenType as any).coverage_type : 'N/A',
        };
    }
}
