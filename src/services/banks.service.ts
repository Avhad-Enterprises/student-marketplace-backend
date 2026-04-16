import DB from "@/database";
import { Bank } from "@/interfaces/banks.interface";
import cache from "@/utils/cache";

export class BankService {
    // GET all banks with pagination, search, and filters
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        account_type?: string,
        student_visible?: boolean,
        sort: string = "created_at",
        order: string = "desc",
        userRole?: string,
        providerId?: string | number
    ) {
        const cacheKey = cache.generateKey('banks:list', { page, limit, search, status, account_type, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('banks').where('is_deleted', false);
        const dataQuery = DB('banks').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.andWhere(function () {
                this.whereILike('bank_name', term)
                    .orWhereILike('account_type', term)
                    .orWhereILike('bank_id', term);
            });
            dataQuery.andWhere(function () {
                this.whereILike('bank_name', term)
                    .orWhereILike('account_type', term)
                    .orWhereILike('bank_id', term);
            });
        }

        if (status) {
            countQuery.andWhere('status', status);
            dataQuery.andWhere('status', status);
        }

        if (account_type) {
            countQuery.andWhere('account_type', account_type);
            dataQuery.andWhere('account_type', account_type);
        }

        if (student_visible !== undefined) {
            countQuery.andWhere('student_visible', student_visible);
            dataQuery.andWhere('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['bank_id', 'bank_name', 'account_type', 'popularity', 'created_at', 'updated_at', 'countries_covered'];
        const finalSort = validSortFields.includes(sort) ? sort : 'created_at';
        const finalOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

        const rows = await dataQuery.orderBy(finalSort, finalOrder).limit(limit).offset(offset);

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

    // GET bank by ID
    public async findById(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('banks').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    // CREATE bank
    public async create(bankData: any) {
        const bank_id = bankData.bank_id || bankData.bankId || `BNK-${Date.now()}`;

        const payload = {
            bank_id,
            bank_name: bankData.bank_name || bankData.bankName,
            account_type: bankData.account_type || bankData.accountType,
            countries_covered: bankData.countries_covered !== undefined ? bankData.countries_covered : (bankData.countriesCovered || 0),
            status: bankData.status || 'active',
            student_visible: bankData.student_visible !== undefined ? bankData.student_visible : (bankData.studentVisible !== undefined ? bankData.studentVisible : true),
            min_balance: bankData.min_balance || bankData.minBalance,
            digital_onboarding: bankData.digital_onboarding !== undefined ? bankData.digital_onboarding : (bankData.digitalOnboarding !== undefined ? bankData.digitalOnboarding : true),
            student_friendly: bankData.student_friendly !== undefined ? bankData.student_friendly : (bankData.studentFriendly !== undefined ? bankData.studentFriendly : true),
            popularity: bankData.popularity !== undefined ? bankData.popularity : (bankData.popularity || 0),
        };

        const inserted = await DB('banks').insert(payload).returning('*');
        cache.del('banks:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE bank
    public async update(id: string | number, bankData: any, userRole?: string, providerId?: string | number) {
        let query = DB('banks').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (bankData.bank_name || bankData.bankName) payload.bank_name = bankData.bank_name || bankData.bankName;
        if (bankData.account_type || bankData.accountType) payload.account_type = bankData.account_type || bankData.accountType;
        if (bankData.countries_covered !== undefined) payload.countries_covered = bankData.countries_covered;
        if (bankData.countriesCovered !== undefined) payload.countries_covered = bankData.countriesCovered;
        if (bankData.status) payload.status = bankData.status;
        if (bankData.student_visible !== undefined) payload.student_visible = bankData.student_visible;
        if (bankData.studentVisible !== undefined) payload.student_visible = bankData.studentVisible;
        if (bankData.min_balance || bankData.minBalance) payload.min_balance = bankData.min_balance || bankData.minBalance;
        if (bankData.digital_onboarding !== undefined) payload.digital_onboarding = bankData.digital_onboarding;
        if (bankData.digitalOnboarding !== undefined) payload.digital_onboarding = bankData.digitalOnboarding;
        if (bankData.student_friendly !== undefined) payload.student_friendly = bankData.student_friendly;
        if (bankData.studentFriendly !== undefined) payload.student_friendly = bankData.studentFriendly;
        if (bankData.popularity !== undefined) payload.popularity = bankData.popularity;

        const updated = await DB('banks').where('id', id).update(payload).returning('*');
        if (updated) cache.del('banks:');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE bank (Soft Delete)
    public async delete(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('banks').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deleted = await query.update({ is_deleted: true, updated_at: DB.fn.now() }).returning('*');
        const isSuccess = Array.isArray(deleted) && deleted.length > 0;
        if (isSuccess) cache.del('banks:');
        return isSuccess;
    }

    // GET bank metrics
    public async getMetrics() {
        const cacheKey = 'banks:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('banks')
            .where('is_deleted', false)
            .select(
                DB.raw('count(distinct bank_name) as total_banks'),
                DB.raw("count(*) FILTER (WHERE status = 'active') as active_accounts"),
                DB.raw('max(countries_covered) as max_countries'),
                DB.raw("count(*) FILTER (WHERE student_friendly = true) as student_friendly_count")
            )
            .first();

        const result = {
            totalBanks: parseInt(String(metrics?.total_banks || 0)),
            activeAccounts: parseInt(String(metrics?.active_accounts || 0)),
            countriesSupported: parseInt(String(metrics?.max_countries || 0)),
            studentFriendly: parseInt(String(metrics?.student_friendly_count || 0)),
        };

        cache.set(cacheKey, result);
        return result;
    }
}
