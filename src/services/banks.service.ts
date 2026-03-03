import DB from "@/database";
import { Bank } from "@/interfaces/banks.interface";

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
        order: string = "desc"
    ) {
        const offset = (page - 1) * limit;

        const countQuery = DB('banks').count('* as count');
        const dataQuery = DB('banks').select('*');

        if (search) {
            const term = `%${search}%`;
            countQuery.where(function () {
                this.whereILike('bank_name', term)
                    .orWhereILike('account_type', term)
                    .orWhereILike('bank_id', term);
            });
            dataQuery.where(function () {
                this.whereILike('bank_name', term)
                    .orWhereILike('account_type', term)
                    .orWhereILike('bank_id', term);
            });
        }

        if (status) {
            countQuery.where('status', status);
            dataQuery.where('status', status);
        }

        if (account_type) {
            countQuery.where('account_type', account_type);
            dataQuery.where('account_type', account_type);
        }

        if (student_visible !== undefined) {
            countQuery.where('student_visible', student_visible);
            dataQuery.where('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['bank_id', 'bank_name', 'account_type', 'popularity', 'created_at', 'updated_at', 'countries_covered'];
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

    // GET bank by ID
    public async findById(id: string | number) {
        const result = await DB('banks').where('id', id).first();
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
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE bank
    public async update(id: string | number, bankData: any) {
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
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE bank
    public async delete(id: string | number) {
        const deleted = await DB('banks').where('id', id).del().returning('*');
        return Array.isArray(deleted) && deleted.length > 0;
    }

    // GET bank metrics
    public async getMetrics() {
        const totalProviders = await DB('banks').countDistinct('bank_name as count').first();
        const activeAccounts = await DB('banks').where('status', 'active').count('* as count').first();
        const countriesSupported = await DB('banks').max('countries_covered as max').first();
        const studentFriendly = await DB('banks').where('student_friendly', true).count('* as count').first();

        return {
            totalBanks: parseInt((totalProviders as any).count || 0),
            activeAccounts: parseInt((activeAccounts as any).count || 0),
            countriesSupported: parseInt((countriesSupported as any).max || 0),
            studentFriendly: parseInt((studentFriendly as any).count || 0),
        };
    }
}
