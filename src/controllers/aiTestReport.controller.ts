import { NextFunction, Request, Response } from 'express';
import AiTestReportService from '@/services/aiTestReport.service';

export class AiTestReportController {
    public aiTestReportService = new AiTestReportService();

    public getReports = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reports = await this.aiTestReportService.getReports();
            res.status(200).json({ data: reports, message: 'getReports' });
        } catch (error) {
            next(error);
        }
    };

    public updateReportStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reportId = parseInt(req.params.id);
            const { status, assigned_to } = req.body;
            const updateData = await this.aiTestReportService.updateReportStatus(reportId, status, assigned_to);
            res.status(200).json({ data: updateData, message: 'updateReportStatus' });
        } catch (error) {
            next(error);
        }
    };
}
