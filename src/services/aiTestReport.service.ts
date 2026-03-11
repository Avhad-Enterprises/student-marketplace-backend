import DB from '@/database';
import { AITestReport } from '@/interfaces/aiTestReport.interface';

class AiTestReportService {
    public async getReports(): Promise<AITestReport[]> {
        return DB('ai_test_reports').orderBy('created_at', 'desc');
    }

    public async getReportById(id: number): Promise<AITestReport> {
        return DB('ai_test_reports').where({ id }).first();
    }

    public async updateReportStatus(id: number, status: string, assignedTo?: string): Promise<AITestReport> {
        const updateData: any = { status, updated_at: new Date() };
        if (assignedTo) updateData.assigned_to = assignedTo;

        await DB('ai_test_reports').where({ id }).update(updateData);
        return this.getReportById(id);
    }

    public async createReport(reportData: AITestReport): Promise<AITestReport> {
        const [newReport] = await DB('ai_test_reports').insert({
            ...reportData,
            created_at: new Date(),
            updated_at: new Date()
        }).returning('*');
        return newReport;
    }
}

export default AiTestReportService;
