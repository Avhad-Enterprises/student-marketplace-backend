import { Response } from 'express';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { logger } from './logger';

export interface ExportOptions {
    format: 'csv' | 'xlsx' | 'pdf' | 'json';
    columns?: string;
    scope?: string;
    ids?: string;
    from?: string;
    to?: string;
}

export interface ExportResult {
    data: any;
    mimeType: string;
    extension: string;
}

/**
 * Standardized utility to handle data conversion for exports
 */
export class ExportRunner {
    /**
     * Runs the export process and returns formatted data
     * @param data Raw data from service
     * @param options Export options (format, columns, etc)
     * @param moduleName Name of the module (for PDF title)
     * @param keyMap Optional mapping of frontend column names to backend database keys
     */
    public static async run(
        data: any[],
        options: ExportOptions,
        moduleName: string,
        keyMap: Record<string, string> = {}
    ): Promise<ExportResult> {
        
        // 1. Process Columns/Filtering
        const selectedColumns = options.columns ? options.columns.split(',') : null;
        
        const formattedData = data.map(item => {
            if (!selectedColumns) return item;
            
            const filtered: any = {};
            selectedColumns.forEach((col: string) => {
                const backendKey = keyMap[col] || col;
                filtered[col] = item[backendKey];
            });
            return filtered;
        });

        // 2. Handle JSON Format
        if (options.format === 'json') {
            return {
                data: JSON.stringify(formattedData, null, 2),
                mimeType: 'application/json',
                extension: 'json'
            };
        }

        // 3. Handle PDF Format
        if (options.format === 'pdf') {
            return this.generatePDF(formattedData, moduleName);
        }

        // 4. Handle Excel (XLSX) Format
        if (options.format === 'xlsx') {
            return this.generateXLSX(formattedData, moduleName);
        }

        // 5. Handle CSV Format (Default)
        return this.generateCSV(formattedData);
    }

    private static async generatePDF(data: any[], moduleName: string): Promise<ExportResult> {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const buffers: Buffer[] = [];

        return new Promise((resolve, reject) => {
            doc.on('data', (chunk: any) => buffers.push(chunk));
            doc.on('end', () => {
                resolve({
                    data: Buffer.concat(buffers),
                    mimeType: 'application/pdf',
                    extension: 'pdf'
                });
            });

            // Layout Constants
            const startX = 30;
            const pageWidth = doc.page.width - 60;
            const bottomMargin = 50;

            // Helper to draw headers
            const drawHeaders = (headers: string[], y: number, colWidth: number, fontSize: number) => {
                doc.fillColor('#333333').font('Helvetica-Bold').fontSize(fontSize);
                headers.forEach((header, i) => {
                    doc.text(header.toUpperCase(), startX + (i * colWidth), y, {
                        width: colWidth,
                        align: 'left'
                    });
                });
                const nextY = doc.y + 5;
                doc.strokeColor('#cccccc').moveTo(startX, nextY).lineTo(doc.page.width - 30, nextY).stroke();
                return nextY + 10;
            };

            // Initial Header
            doc.fontSize(20).text(`${moduleName} Export`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
            doc.moveDown();

            if (data.length === 0) {
                doc.text('No records found.');
            } else {
                const headers = Object.keys(data[0]);
                const colWidth = pageWidth / headers.length;
                
                // Dynamic Font Sizing (shrink as columns increase)
                const fontSize = headers.length > 8 ? 6 : (headers.length > 5 ? 8 : 10);
                const headerFontSize = fontSize + 1;

                let currentY = drawHeaders(headers, doc.y, colWidth, headerFontSize);

                // Draw Data Rows
                doc.fillColor('#000000').font('Helvetica').fontSize(fontSize);
                
                data.forEach((row) => {
                    // 1. Calculate max height for this row
                    let maxRowHeight = 0;
                    headers.forEach((header) => {
                        const text = String(row[header] ?? '-');
                        const h = doc.heightOfString(text, { width: colWidth });
                        if (h > maxRowHeight) maxRowHeight = h;
                    });

                    // 2. Check for page break
                    if (currentY + maxRowHeight > doc.page.height - bottomMargin) {
                        doc.addPage();
                        currentY = drawHeaders(headers, doc.y, colWidth, headerFontSize);
                        doc.fillColor('#000000').font('Helvetica').fontSize(fontSize);
                    }

                    // 3. Draw Columns
                    headers.forEach((header, i) => {
                        doc.text(String(row[header] ?? '-'), startX + (i * colWidth), currentY, {
                            width: colWidth,
                            align: 'left'
                        });
                    });
                    
                    // 4. Update Y for next row (add 5pt padding)
                    currentY += maxRowHeight + 8;
                    doc.y = currentY; // Keep doc.y in sync
                });
            }
            doc.end();
        });
    }

    private static async generateXLSX(data: any[], moduleName: string): Promise<ExportResult> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(moduleName);

        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            worksheet.columns = headers.map(h => ({ header: h.toUpperCase(), key: h, width: 20 }));
            worksheet.addRows(data);
            
            // Basic Styling
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        return {
            data: buffer,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            extension: 'xlsx'
        };
    }

    private static generateCSV(data: any[]): ExportResult {
        if (data.length === 0) {
            return { data: '', mimeType: 'text/csv', extension: 'csv' };
        }

        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => 
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
}
