import DB from "@/database";
import { SimCard } from "@/interfaces/simCards.interface";

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
        order: string = "desc"
    ) {
        const offset = (page - 1) * limit;

        const countQuery = DB('sim_cards').count('* as count');
        const dataQuery = DB('sim_cards').select('*');

        if (search) {
            const term = `%${search}%`;
            countQuery.where(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('service_name', term)
                    .orWhereILike('sim_id', term);
            });
            dataQuery.where(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('service_name', term)
                    .orWhereILike('sim_id', term);
            });
        }

        if (status) {
            countQuery.where('status', status);
            dataQuery.where('status', status);
        }

        if (network_type) {
            countQuery.where('network_type', network_type);
            dataQuery.where('network_type', network_type);
        }

        if (student_visible !== undefined) {
            countQuery.where('student_visible', student_visible);
            dataQuery.where('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['sim_id', 'provider_name', 'service_name', 'popularity', 'created_at', 'updated_at', 'countries_covered'];
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

    // GET SIM card by ID
    public async findById(id: string | number) {
        const result = await DB('sim_cards').where('id', id).first();
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
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE SIM card
    public async update(id: string | number, simData: any) {
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
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE SIM card
    public async delete(id: string | number) {
        const deleted = await DB('sim_cards').where('id', id).del().returning('*');
        return Array.isArray(deleted) && deleted.length > 0;
    }

    // GET SIM metrics
    public async getMetrics() {
        const totalProviders = await DB('sim_cards').countDistinct('provider_name as count').first();
        const activePlans = await DB('sim_cards').where('status', 'active').count('* as count').first();
        const countriesCovered = await DB('sim_cards').max('countries_covered as max').first();
        const mostPopular = await DB('sim_cards').orderBy('popularity', 'desc').select('provider_name').first();

        return {
            totalProviders: parseInt((totalProviders as any).count || 0),
            activePlans: parseInt((activePlans as any).count || 0),
            countriesCovered: parseInt((countriesCovered as any).max || 0),
            mostPopular: (mostPopular as any)?.provider_name || 'N/A',
        };
    }
}
