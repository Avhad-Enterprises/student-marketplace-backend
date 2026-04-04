import { Knex } from "knex";
import { buildQuery } from "../utils/queryBuilder";
import * as ExcelJS from "exceljs";
import * as Papa from "papaparse";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

interface RunReportInput {
    table: string;
    metrics?: string[];
    dimensions?: string[];
    filters?: any[];
    groupBy?: string[];
    sort?: any[];
    joins?: any[];
    fieldOrder?: { id: string; type: 'metric' | 'dimension' }[];
}

export class ReportService {
    private db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }

    async runReport(config: RunReportInput) {
        try {
            const query = buildQuery(this.db, config);
            const data = await query;
            return {
                success: true,
                data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async exportReport(config: RunReportInput, format: string) {
        try {
            const query = buildQuery(this.db, config);
            const data = await query;
            
            // Determine column order
            let columns: { key: string; header: string }[] = [];
            
            if (config.fieldOrder && config.fieldOrder.length > 0) {
                columns = config.fieldOrder.map(f => ({
                    key: f.id,
                    header: this.formatLabel(f.id)
                }));
            } else {
                // Fallback to dimensions then metrics
                const dims = (config.dimensions || []).map(d => ({ key: d, header: this.formatLabel(d) }));
                const mets = (config.metrics || []).map(m => {
                    // Extract name from raw SQL like 'SUM("col") AS "alias"' or just 'SUM("col")'
                    const match = m.match(/AS\s+"([^"]+)"/i) || m.match(/"([^"]+)"/);
                    const key = match ? match[1] : m;
                    return { key, header: this.formatLabel(key) };
                });
                columns = [...dims, ...mets];
            }

            switch (format.toLowerCase()) {
                case 'csv':
                    return this.generateCSV(data, columns);
                case 'xlsx':
                    return this.generateXLSX(data, columns);
                case 'pdf':
                    return this.generatePDF(data, columns, config.table);
                default:
                    throw new Error(`Unsupported export format: ${format}`);
            }
        } catch (error: any) {
            throw error;
        }
    }

    private formatLabel(str: string) {
        return str
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/\bId\b/g, 'ID');
    }

    private async generateCSV(data: any[], columns: any[]) {
        const rows = data.map(item => {
            const row: any = {};
            columns.forEach(col => {
                row[col.header] = item[col.key];
            });
            return row;
        });
        
        const csv = Papa.unparse(rows);
        const stream = new PassThrough();
        stream.end(csv);
        
        return {
            stream,
            filename: `report_${Date.now()}.csv`,
            mimeType: 'text/csv'
        };
    }

    private async generateXLSX(data: any[], columns: any[]) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        
        worksheet.columns = columns.map(col => ({
            header: col.header,
            key: col.key,
            width: 20
        }));
        
        worksheet.addRows(data);
        
        // Styling headers
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE9ECEF' }
        };

        const stream = new PassThrough();
        await workbook.xlsx.write(stream);
        stream.end();

        return {
            stream,
            filename: `report_${Date.now()}.xlsx`,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
    }

    private async generatePDF(data: any[], columns: any[], tableName: string) {
        const doc = new PDFDocument({ layout: 'landscape', margin: 30 });
        const stream = new PassThrough();
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text(`Report: ${this.formatLabel(tableName)}`, { align: 'center' });
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Table logic (simplified)
        const startX = 30;
        let currentY = doc.y;
        const colWidth = (doc.page.width - 60) / columns.length;

        // Draw Headers
        doc.fontSize(10).font('Helvetica-Bold');
        columns.forEach((col, i) => {
            doc.text(col.header, startX + (i * colWidth), currentY, { width: colWidth, ellipsis: true });
        });
        
        doc.moveTo(startX, doc.y + 2).lineTo(doc.page.width - 30, doc.y + 2).stroke();
        currentY = doc.y + 10;

        // Draw Rows
        doc.font('Helvetica').fontSize(9);
        data.slice(0, 100).forEach((row) => { // Limit to 100 rows for PDF safety
            if (currentY > doc.page.height - 50) {
                doc.addPage({ layout: 'landscape' });
                currentY = 40;
            }
            
            columns.forEach((col, i) => {
                const val = row[col.key];
                const text = val === null || val === undefined ? '-' : String(val);
                doc.text(text, startX + (i * colWidth), currentY, { width: colWidth, ellipsis: true });
            });
            currentY += 15;
        });

        if (data.length > 100) {
            doc.moveDown();
            doc.font('Helvetica-Oblique').fontSize(8).text(`... and ${data.length - 100} more rows (Download CSV/XLSX for full data)`);
            doc.font('Helvetica');
        }

        doc.end();

        return {
            stream,
            filename: `report_${Date.now()}.pdf`,
            mimeType: 'application/pdf'
        };
    }

    async saveReport(payload: {
        name: string;
        config: any;
        created_by?: number;
    }) {
        try {
            const { name, config, created_by } = payload;
            
            const [report] = await this.db("reports")
                .insert({
                    name,
                    category: config.category || null,
                    visualization_type: config.visualization || 'table',
                    config_json: JSON.stringify(config),
                    schedule_enabled: !!config.isScheduled,
                    schedule_frequency: config.frequency || null,
                    schedule_recipients: config.recipients?.join(',') || null,
                    created_by: created_by || null,
                })
                .returning("*");

            return {
                success: true,
                data: report,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async updateReport(id: number, payload: {
        name: string;
        config: any;
        updated_by?: number;
    }) {
        try {
            const { name, config, updated_by } = payload;
            
            const [report] = await this.db("reports")
                .where({ id })
                .update({
                    name,
                    category: config.category || null,
                    visualization_type: config.visualization || 'table',
                    config_json: JSON.stringify(config),
                    schedule_enabled: !!config.isScheduled,
                    schedule_frequency: config.frequency || null,
                    schedule_recipients: config.recipients?.join(',') || null,
                    updated_at: new Date(),
                })
                .returning("*");

            if (!report) {
                return {
                    success: false,
                    message: "Report not found",
                };
            }

            return {
                success: true,
                data: report,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getReports() {
        try {
            const reports = await this.db("reports").select("*");

            return {
                success: true,
                data: reports,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getReportById(id: number) {
        try {
            const report = await this.db("reports")
                .where({ id })
                .first();

            if (!report) {
                return { success: false, message: "Report not found" };
            }

            const config = typeof report.config_json === 'string' 
                ? JSON.parse(report.config_json) 
                : report.config_json;

            const query = buildQuery(this.db, config);
            const data = await query;

            return {
                success: true,
                report,
                data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async exportReportById(id: number, format: any = 'xlsx') {
        try {
            const result = await this.getReportById(id);
            if (!result.success) return result;

            const config = typeof result.report.config_json === 'string'
                ? JSON.parse(result.report.config_json)
                : result.report.config_json;

            return this.exportReport(config, format);
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}