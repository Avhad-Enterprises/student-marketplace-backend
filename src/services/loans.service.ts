import DB from "@/database";
import { Loan } from "@/interfaces/loans.interface";
import { logger } from "@/utils/logger";
import cache from "@/utils/cache";

export interface ExportResult {
    data: any;
    mimeType: string;
    extension: string;
}

export class LoansService {
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        student_visible?: boolean,
        sort: string = 'created_at',
        order: string = 'desc',
        userRole?: string,
        providerId?: string | number
    ) {
        const cacheKey = cache.generateKey('loans:list', { page, limit, search, status, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('loans').where('is_deleted', false);
        const dataQuery = DB('loans').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.andWhere(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('product_name', term);
            });
            dataQuery.andWhere(function () {
                this.whereILike('provider_name', term)
                    .orWhereILike('product_name', term);
            });
        }

        if (status && status !== 'All') {
            countQuery.andWhere('status', status.toLowerCase());
            dataQuery.andWhere('status', status.toLowerCase());
        }

        if (student_visible !== undefined) {
            countQuery.andWhere('student_visible', student_visible);
            dataQuery.andWhere('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['provider_name', 'product_name', 'status', 'created_at', 'updated_at', 'interest_rate', 'max_amount'];
        const finalSort = validSortFields.includes(sort) ? sort : 'created_at';
        const finalOrder = order?.toLowerCase() === 'asc' ? 'asc' : 'desc';

        const rows = await dataQuery.orderBy(finalSort, finalOrder).limit(limit).offset(offset);

        const result = {
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };

        cache.set(cacheKey, result);
        return result;
    }

    public async findById(id: string | number, userRole?: string, providerId?: string | number): Promise<Loan> {
        let query = DB('loans').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    public async create(loanData: any): Promise<Loan> {
        const payload = {
            provider_name: loanData.provider_name || loanData.providerName,
            product_name: loanData.product_name || loanData.productName,
            loan_type: loanData.loan_type || loanData.loanType,
            interest_rate: loanData.interest_rate || loanData.interestRate,
            max_amount: loanData.max_amount || loanData.maxAmount,
            status: loanData.status || 'active',
            provider_id: loanData.provider_id,
        };

        const inserted = await DB('loans').insert(payload).returning('*');
        cache.del('loans:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    public async update(id: string | number, loanData: any, userRole?: string, providerId?: string | number): Promise<Loan | null> {
        let query = DB('loans').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now()
        };

        if (loanData.provider_name || loanData.providerName) payload.provider_name = loanData.provider_name || loanData.providerName;
        if (loanData.product_name || loanData.productName) payload.product_name = loanData.product_name || loanData.productName;
        if (loanData.loan_type || loanData.loanType) payload.loan_type = loanData.loan_type || loanData.loanType;
        if (loanData.interest_rate !== undefined || loanData.interestRate !== undefined) 
            payload.interest_rate = loanData.interest_rate || loanData.interestRate;
        if (loanData.max_amount !== undefined || loanData.maxAmount !== undefined) 
            payload.max_amount = loanData.max_amount || loanData.maxAmount;
        if (loanData.status) payload.status = loanData.status;

        const [updatedLoan] = await DB('loans').where('id', id).update(payload).returning('*');
        if (updatedLoan) cache.del('loans:');
        return updatedLoan;
    }

    public async delete(id: string | number, userRole?: string, providerId?: string | number): Promise<boolean> {
        let query = DB('loans').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deletedCount = await query.update({ is_deleted: true, updated_at: DB.fn.now() });
        if (deletedCount > 0) cache.del('loans:');
        return deletedCount > 0;
    }

    public async getMetrics() {
        const cacheKey = 'loans:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('loans')
            .where('is_deleted', false)
            .select(
                DB.raw('count(*) as total_loans'),
                DB.raw("count(*) FILTER (WHERE status = 'active') as active_loans")
            )
            .first();

        const result = {
            totalLoanProviders: parseInt(String(metrics?.total_loans || 0)),
            activeLoanProducts: parseInt(String(metrics?.active_loans || 0)),
        };

        cache.set(cacheKey, result);
        return result;
    }

    public async exportLoans(options: any, userRole?: string, providerId?: string | number): Promise<ExportResult> {
        let query = DB('loans').where('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        if (options.scope === 'selected' && options.ids) {
            const idsArray = options.ids.split(',').map(Number);
            query = query.whereIn('id', idsArray);
        }

        if (options.from) {
            query = query.where('created_at', '>=', options.from);
        }
        if (options.to) {
            query = query.where('created_at', '<=', options.to);
        }

        const data = await query.select('*');

        const columns = options.columns ? options.columns.split(',') : null;
        const formattedData = data.map(item => {
            if (!columns) return item;
            const filtered: any = {};
            columns.forEach((col: string) => {
                filtered[col] = (item as any)[col];
            });
            return filtered;
        });

        if (options.format === 'json') {
            return {
                data: JSON.stringify(formattedData, null, 2),
                mimeType: 'application/json',
                extension: 'json'
            };
        }

        // Default CSV
        if (formattedData.length === 0) {
            return { data: '', mimeType: 'text/csv', extension: 'csv' };
        }

        const headers = Object.keys(formattedData[0]);
        const csvRows = [
            headers.join(','),
            ...formattedData.map(row => headers.map(fieldName => String(row[fieldName] || '')).join(','))
        ];

        return {
            data: csvRows.join('\n'),
            mimeType: 'text/csv',
            extension: 'csv'
        };
    }
}
