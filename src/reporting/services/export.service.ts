import Papa from "papaparse";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { Response } from "express";

export class ExportService {
    static toCSV(data: any[]): string {
        return Papa.unparse(data);
    }

    static async toExcel(data: any[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Report");

        if (data.length > 0) {
            worksheet.columns = Object.keys(data[0]).map((key) => ({
                header: key,
                key,
                width: 20,
            }));
            data.forEach((row) => worksheet.addRow(row));

            worksheet.getRow(1).font = { bold: true };
        }

        return workbook.xlsx.writeBuffer() as Promise<Buffer>;
    }

    static toPDF(data: any[], res: Response): void {
        const doc = new PDFDocument({ margin: 30 });
        doc.pipe(res);

        if (data.length === 0) {
            doc.fontSize(12).text("No data available.");
            doc.end();
            return;
        }

        const headers = Object.keys(data[0]);
        const colWidth = 500 / headers.length;

        doc.fontSize(10).font("Helvetica-Bold");
        headers.forEach((h, i) => {
            doc.text(h, 30 + i * colWidth, doc.y, {
                width: colWidth,
                continued: i < headers.length - 1,
            });
        });

        doc.moveDown(0.5);
        doc.font("Helvetica").fontSize(9);

        data.forEach((row) => {
            const startY = doc.y;
            Object.values(row).forEach((val: any, i) => {
                doc.text(String(val ?? ""), 30 + i * colWidth, startY, {
                    width: colWidth,
                    continued: i < headers.length - 1,
                });
            });
            doc.moveDown(0.3);
        });

        doc.end();
    }
}