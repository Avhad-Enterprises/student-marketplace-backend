import DB from "@/database";
import { Loan } from "@/interfaces/loans.interface";
import { logger } from "@/utils/logger";

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
        order: string = 'desc'
    ) {
        let query = DB('loans');

        if (search) {
            query = query.where((builder) => {
                builder.where('provider_name', 'ILIKE', `%${search}%`)
                    .orWhere('product_name', 'ILIKE', `%${search}%`)
                    .orWhere('loan_id', 'ILIKE', `%${search}%`);
            });
        }

        if (status && status !== 'All') {
            query = query.where('status', status.toLowerCase());
        }

        if (student_visible !== undefined) {
            query = query.where('student_visible', student_visible);
        }

        const total = await query.clone().count('* as count').first();
        const count = parseInt(total?.count as string) || 0;

        const data = await query
            .orderBy(sort, order)
            .limit(limit)
            .offset((page - 1) * limit);

        return {
            data,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    public async findById(id: string | number): Promise<Loan> {
        return await DB('loans').where('id', id).orWhere('loan_id', id).first();
    }

    public async create(loanData: Partial<Loan>): Promise<Loan> {
        const loanCount = await DB('loans').count('* as count').first();
        const count = parseInt(loanCount?.count as string) || 0;
        const loanId = `LON-${7801 + count}`;

        const [newLoan] = await DB('loans').insert({
            ...loanData,
            loan_id: loanId
        }).returning('*');

        return newLoan;
    }

    public async update(id: string | number, loanData: Partial<Loan>): Promise<Loan> {
        const [updatedLoan] = await DB('loans')
            .where('id', id)
            .update({
                ...loanData,
                updated_at: DB.fn.now()
            })
            .returning('*');
        return updatedLoan;
    }

    public async delete(id: string | number): Promise<boolean> {
        const deletedCount = await DB('loans').where('id', id).delete();
        return deletedCount > 0;
    }

    public async getMetrics() {
        const totalLoans = await DB('loans').count('* as count').first();
        const activeLoans = await DB('loans').where('status', 'active').count('* as count').first();
        const countriesSupported = await DB('loans').sum('countries_supported as sum').first();

        return {
            totalLoanProviders: parseInt(totalLoans?.count as string) || 0,
            activeLoanProducts: parseInt(activeLoans?.count as string) || 0,
            countriesSupported: parseInt(countriesSupported?.sum as string) || 0,
            averageApprovalRate: '76%' // Mocked for now to match UI
        };
    }

    public async exportLoans(options: any): Promise<ExportResult> {
        let query = DB('loans');

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
