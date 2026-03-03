import DB from "@/database";
import { Tax } from "@/interfaces/taxes.interface";
import { logger } from "@/utils/logger";

export interface ExportResult {
    data: any;
    mimeType: string;
    extension: string;
}

export class TaxesService {
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        student_visible?: boolean,
        sort: string = 'created_at',
        order: string = 'desc'
    ) {
        let query = DB('taxes');

        if (search) {
            query = query.where((builder) => {
                builder.where('service_name', 'ILIKE', `%${search}%`)
                    .orWhere('provider', 'ILIKE', `%${search}%`)
                    .orWhere('tax_id', 'ILIKE', `%${search}%`);
            });
        }

        if (status && status !== 'all') {
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

    public async findById(id: string | number): Promise<Tax> {
        const tax = await DB('taxes').where('id', id).orWhere('tax_id', id).first();
        return tax;
    }

    public async create(taxData: Partial<Tax>): Promise<Tax> {
        const taxCount = await DB('taxes').count('* as count').first();
        const count = parseInt(taxCount?.count as string) || 0;
        const taxId = `TAX-${6401 + count}`;

        const [newTax] = await DB('taxes').insert({
            ...taxData,
            tax_id: taxId
        }).returning('*');

        return newTax;
    }

    public async update(id: string | number, taxData: Partial<Tax>): Promise<Tax> {
        const [updatedTax] = await DB('taxes')
            .where('id', id)
            .update({
                ...taxData,
                updated_at: DB.fn.now()
            })
            .returning('*');
        return updatedTax;
    }

    public async delete(id: string | number): Promise<boolean> {
        const deletedCount = await DB('taxes').where('id', id).delete();
        return deletedCount > 0;
    }

    public async getMetrics() {
        const totalTaxes = await DB('taxes').count('* as count').first();
        const activeTaxes = await DB('taxes').where('status', 'active').count('* as count').first();

        // In a real app, these would come from more complex queries
        const countriesCovered = await DB('taxes').sum('countries_covered as sum').first();

        return {
            totalTaxServices: parseInt(totalTaxes?.count as string) || 0,
            activeTaxServices: parseInt(activeTaxes?.count as string) || 0,
            countriesCovered: parseInt(countriesCovered?.sum as string) || 0,
            studentUsageRate: '67%' // Mocked for now to match UI
        };
    }

    public async exportTaxes(options: any): Promise<ExportResult> {
        let query = DB('taxes');

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
                // Map backend column names to expected export headers if needed
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
