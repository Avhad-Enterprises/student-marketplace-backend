import DB from "@/database";
import { Forex } from "@/interfaces/forex.interface";

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
        order: string = "desc"
    ) {
        const offset = (page - 1) * limit;

        const countQuery = DB('forex').count('* as count');
        const dataQuery = DB('forex').select('*');

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

    // GET forex by ID
    public async findById(id: string | number) {
        const result = await DB('forex').where('id', id).first();
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
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE forex
    public async update(id: string | number, forexData: any) {
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
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE forex
    public async delete(id: string | number) {
        const deleted = await DB('forex').where('id', id).del().returning('*');
        return Array.isArray(deleted) && deleted.length > 0;
    }

    // GET forex metrics
    public async getMetrics() {
        const totalPartners = await DB('forex').countDistinct('provider_name as count').first();
        const totalCurrencyPairs = await DB('forex').sum('currency_pairs as sum').first();
        const avgFeeResult = await DB('forex').select(DB.raw("AVG(CAST(NULLIF(regexp_replace(avg_fee, '[^0-9.]', '', 'g'), '') AS NUMERIC)) as avg")).first();
        const instantTransfers = await DB('forex').whereILike('transfer_speed', '%instant%').orWhereILike('transfer_speed', '%same day%').count('* as count').first();
        const totalCount = await DB('forex').count('* as count').first();

        const total = parseInt(String(totalCount?.count || 0));

        return {
            totalPartners: parseInt(String(totalPartners?.count || 0)),
            totalCurrencyPairs: parseInt(String(totalCurrencyPairs?.sum || 0)),
            avgFee: parseFloat(String((avgFeeResult as any)?.avg || 0)).toFixed(1) + '%',
            instantPercentage: total > 0 ? Math.round((parseInt(String(instantTransfers?.count || 0)) / total) * 100) + '%' : '0%',
        };
    }
}
