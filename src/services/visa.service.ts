import DB from "@/database";
import { Visa } from "@/interfaces/visa.interface";
import cache from "@/utils/cache";

export interface ExportResult {
    data: any;
    mimeType: string;
    extension: string;
}

export class VisaService {
    // GET all visa types with pagination, search, and filters
    public async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        category?: string,
        student_visible?: boolean,
        sort: string = "created_at",
        order: string = "desc",
        userRole?: string,
        providerId?: string | number
    ) {
        const cacheKey = cache.generateKey('visa:list', { page, limit, search, status, category, student_visible, sort, order, userRole, providerId });
        const cachedData = cache.get<any>(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;

        const countQuery = DB('visa').where('is_deleted', false);
        const dataQuery = DB('visa').where('is_deleted', false);

        // RBAC: Provider only sees their own data
        if (userRole === 'provider' && providerId) {
            countQuery.andWhere('provider_id', providerId);
            dataQuery.andWhere('provider_id', providerId);
        }

        if (search) {
            const term = `%${search}%`;
            countQuery.andWhere(function () {
                this.whereILike('visa_type', term)
                    .orWhereILike('category', term)
                    .orWhereILike('visa_id', term);
            });
            dataQuery.andWhere(function () {
                this.whereILike('visa_type', term)
                    .orWhereILike('category', term)
                    .orWhereILike('visa_id', term);
            });
        }

        if (status && status !== 'All') {
            countQuery.andWhere('status', status.toLowerCase());
            dataQuery.andWhere('status', status.toLowerCase());
        }

        if (category && category !== 'All Categories') {
            countQuery.andWhere('category', category);
            dataQuery.andWhere('category', category);
        }

        if (student_visible !== undefined) {
            countQuery.andWhere('student_visible', student_visible);
            dataQuery.andWhere('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['visa_id', 'visa_type', 'category', 'popularity', 'created_at', 'updated_at', 'countries_covered'];
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

    // GET visa by ID
    public async findById(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('visa').where('id', id).andWhere('is_deleted', false);
        
        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const result = await query.first();
        return result || null;
    }

    // CREATE visa
    public async create(visaData: any) {
        const payload = {
            visa_type: visaData.visa_type || visaData.visaType,
            category: visaData.category || 'Study',
            status: visaData.status || 'active',
            provider_id: visaData.provider_id,
        };

        const inserted = await DB('visa').insert(payload).returning('*');
        cache.del('visa:');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE visa
    public async update(id: string | number, visaData: any, userRole?: string, providerId?: string | number) {
        let query = DB('visa').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const existing = await query.first();
        if (!existing) return null;

        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (visaData.visa_type || visaData.visaType) payload.visa_type = visaData.visa_type || visaData.visaType;
        if (visaData.category) payload.category = visaData.category;
        if (visaData.status) payload.status = visaData.status;

        const updated = await DB('visa').where('id', id).update(payload).returning('*');
        if (updated) cache.del('visa:');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE visa (Soft Delete)
    public async delete(id: string | number, userRole?: string, providerId?: string | number) {
        let query = DB('visa').where('id', id).andWhere('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        const deleted = await query.update({ is_deleted: true, updated_at: DB.fn.now() }).returning('*');
        const isSuccess = Array.isArray(deleted) && deleted.length > 0;
        if (isSuccess) cache.del('visa:');
        return isSuccess;
    }

    // GET visa metrics
    public async getMetrics() {
        const cacheKey = 'visa:metrics';
        const cached = cache.get<any>(cacheKey);
        if (cached) return cached;

        const metrics = await DB('visa')
            .where('is_deleted', false)
            .select(
                DB.raw('count(*) as total_types'),
                DB.raw("count(*) FILTER (WHERE status = 'active') as active_types")
            )
            .first();
        
        const result = {
            totalVisaTypes: parseInt(String(metrics?.total_types || 0)),
            activeVisaRules: parseInt(String(metrics?.active_types || 0)),
        };

        cache.set(cacheKey, result);
        return result;
    }

    public async exportVisas(options: any, userRole?: string, providerId?: string | number): Promise<ExportResult> {
        let query = DB('visa').where('is_deleted', false);

        if (userRole === 'provider' && providerId) {
            query = query.andWhere('provider_id', providerId);
        }

        // Handle Scope
        if (options.scope === 'selected' && options.ids) {
            const idsArray = options.ids.split(',').map(Number);
            query = query.whereIn('id', idsArray);
        }

        // Handle Date Range
        if (options.from) {
            query = query.where('created_at', '>=', options.from);
        }
        if (options.to) {
            query = query.where('created_at', '<=', options.to);
        }

        const data = await query.select('*');

        // Handle Columns
        const columns = options.columns ? options.columns.split(',') : null;
        const formattedData = data.map(item => {
            if (!columns) return item;
            const filtered: any = {};
            columns.forEach((col: string) => {
                const keyMap: any = {
                    'id': 'visa_id',
                    'type': 'visa_type',
                    'category': 'category',
                    'countries': 'countries_covered',
                    'status': 'status',
                    'difficulty': 'processing_difficulty',
                    'visible': 'student_visible',
                    'workRights': 'work_rights',
                    'popularity': 'popularity'
                };
                const backendKey = keyMap[col] || col;
                filtered[col] = item[backendKey];
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

        if (options.format === 'pdf') {
            try {
                const PDFDocument = require('pdfkit');
                const doc = new PDFDocument({ margin: 30, size: 'A4' });
                const buffers: any[] = [];

                return new Promise((resolve, reject) => {
                    doc.on('data', (chunk: any) => buffers.push(chunk));
                    doc.on('end', () => {
                        const pdfBuffer = Buffer.concat(buffers);
                        resolve({
                            data: pdfBuffer,
                            mimeType: 'application/pdf',
                            extension: 'pdf'
                        });
                    });

                    // PDF Header
                    doc.fontSize(20).text('Visa Records Export', { align: 'center' });
                    doc.moveDown();
                    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
                    doc.moveDown();

                    if (formattedData.length === 0) {
                        doc.text('No records found matching the criteria.');
                    } else {
                        // Very basic table layout
                        const headers = Object.keys(formattedData[0]);
                        const startX = 30;
                        let currentY = doc.y;
                        const colWidth = (doc.page.width - 60) / headers.length;

                        // Draw Headers
                        doc.fillColor('#333333').font('Helvetica-Bold');
                        headers.forEach((header, i) => {
                            doc.text(header.toUpperCase(), startX + (i * colWidth), currentY, {
                                width: colWidth,
                                align: 'left'
                            });
                        });

                        doc.moveDown(0.5);
                        doc.strokeColor('#cccccc').moveTo(startX, doc.y).lineTo(doc.page.width - 30, doc.y).stroke();
                        doc.moveDown(0.5);

                        // Draw Rows
                        doc.fillColor('#000000').font('Helvetica');
                        formattedData.forEach((row) => {
                            if (doc.y > doc.page.height - 50) doc.addPage();
                            currentY = doc.y;
                            headers.forEach((header, i) => {
                                doc.text(String(row[header] || '-'), startX + (i * colWidth), currentY, {
                                    width: colWidth,
                                    align: 'left'
                                });
                            });
                            doc.moveDown(0.8);
                        });
                    }

                    doc.end();
                });
            } catch (err) {
                console.error("PDFKit error:", err);
                throw new Error("PDF generation failed. Please ensure 'pdfkit' is installed on the server.");
            }
        }

        // Simple CSV generation
        if (options.format === 'csv' || options.format === 'xlsx') {
            if (formattedData.length === 0) {
                return { data: '', mimeType: 'text/csv', extension: 'csv' };
            }
            const headers = Object.keys(formattedData[0]);
            const csvRows = [
                headers.join(','),
                ...formattedData.map(row =>
                    headers.map(header => {
                        const val = row[header];
                        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
                    }).join(',')
                )
            ];
            return {
                data: csvRows.join('\n'),
                mimeType: 'text/csv',
                extension: 'csv'
            };
        }

        throw new Error(`Unsupported export format: ${options.format}`);
    }
}
