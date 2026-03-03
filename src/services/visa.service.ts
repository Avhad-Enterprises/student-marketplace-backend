import DB from "@/database";
import { Visa } from "@/interfaces/visa.interface";

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
        order: string = "desc"
    ) {
        const offset = (page - 1) * limit;

        const countQuery = DB('visa').count('* as count');
        const dataQuery = DB('visa').select('*');

        if (search) {
            const term = `%${search}%`;
            countQuery.where(function () {
                this.whereILike('visa_type', term)
                    .orWhereILike('category', term)
                    .orWhereILike('visa_id', term);
            });
            dataQuery.where(function () {
                this.whereILike('visa_type', term)
                    .orWhereILike('category', term)
                    .orWhereILike('visa_id', term);
            });
        }

        if (status && status !== 'All') {
            countQuery.where('status', status.toLowerCase());
            dataQuery.where('status', status.toLowerCase());
        }

        if (category && category !== 'All Categories') {
            countQuery.where('category', category);
            dataQuery.where('category', category);
        }

        if (student_visible !== undefined) {
            countQuery.where('student_visible', student_visible);
            dataQuery.where('student_visible', student_visible);
        }

        const totalRes = await countQuery.first();
        const total = parseInt((totalRes && (totalRes as any).count) || '0');

        const validSortFields = ['visa_id', 'visa_type', 'category', 'popularity', 'created_at', 'updated_at', 'countries_covered'];
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

    // GET visa by ID
    public async findById(id: string | number) {
        const result = await DB('visa').where('id', id).first();
        return result || null;
    }

    // CREATE visa
    public async create(visaData: any) {
        const visa_id = visaData.visa_id || visaData.visaId || `VIS-${Date.now()}`;

        const payload = {
            visa_id,
            visa_type: visaData.visa_type || visaData.visaType,
            category: visaData.category || 'Study',
            countries_covered: visaData.countries_covered !== undefined ? visaData.countries_covered : (visaData.countriesCovered || 0),
            status: visaData.status || 'active',
            student_visible: visaData.student_visible !== undefined ? visaData.student_visible : (visaData.studentVisible !== undefined ? visaData.studentVisible : true),
            processing_difficulty: visaData.processing_difficulty || visaData.processingDifficulty || 'Medium',
            work_rights: visaData.work_rights !== undefined ? visaData.work_rights : (visaData.workRights !== undefined ? visaData.workRights : true),
            high_approval: visaData.high_approval !== undefined ? visaData.high_approval : (visaData.highApproval !== undefined ? visaData.highApproval : true),
            popularity: visaData.popularity !== undefined ? visaData.popularity : (visaData.popularity || 0),
        };

        const inserted = await DB('visa').insert(payload).returning('*');
        return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // UPDATE visa
    public async update(id: string | number, visaData: any) {
        const payload: any = {
            updated_at: DB.fn.now(),
        };

        if (visaData.visa_type || visaData.visaType) payload.visa_type = visaData.visa_type || visaData.visaType;
        if (visaData.category) payload.category = visaData.category;
        if (visaData.countries_covered !== undefined) payload.countries_covered = visaData.countries_covered;
        if (visaData.countriesCovered !== undefined) payload.countries_covered = visaData.countriesCovered;
        if (visaData.status) payload.status = visaData.status;
        if (visaData.student_visible !== undefined) payload.student_visible = visaData.student_visible;
        if (visaData.studentVisible !== undefined) payload.student_visible = visaData.studentVisible;
        if (visaData.processing_difficulty || visaData.processingDifficulty) payload.processing_difficulty = visaData.processing_difficulty || visaData.processingDifficulty;
        if (visaData.work_rights !== undefined) payload.work_rights = visaData.work_rights;
        if (visaData.workRights !== undefined) payload.work_rights = visaData.workRights;
        if (visaData.high_approval !== undefined) payload.high_approval = visaData.high_approval;
        if (visaData.highApproval !== undefined) payload.high_approval = visaData.highApproval;
        if (visaData.popularity !== undefined) payload.popularity = visaData.popularity;

        const updated = await DB('visa').where('id', id).update(payload).returning('*');
        return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
    }

    // DELETE visa
    public async delete(id: string | number) {
        const deleted = await DB('visa').where('id', id).del().returning('*');
        return Array.isArray(deleted) && deleted.length > 0;
    }

    // GET visa metrics
    public async getMetrics() {
        const totalTypes = await DB('visa').count('* as count').first();
        const activeTypes = await DB('visa').where('status', 'active').count('* as count').first();
        const highApprovalPathways = await DB('visa').where('high_approval', true).count('* as count').first();
        const countriesEnabled = await DB('visa').sum('countries_covered as total').first();

        return {
            totalVisaTypes: parseInt((totalTypes as any).count || 0),
            activeVisaRules: parseInt((activeTypes as any).count || 0),
            highApprovalPathways: parseInt((highApprovalPathways as any).count || 0),
            countriesEnabled: parseInt((countriesEnabled as any).total || 0),
        };
    }

    public async exportVisas(options: any): Promise<ExportResult> {
        let query = DB('visa');

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
