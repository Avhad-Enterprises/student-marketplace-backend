import { Router } from 'express';
import { AiTestReportController } from '@/controllers/aiTestReport.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class AiTestReportRoute implements Route {
    public path = '/api/ai-test-reports';
    public router = Router();
    public aiTestReportController = new AiTestReportController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);
        this.router.get(`/`, this.aiTestReportController.getReports);
        this.router.post(`/update-status/:id`, this.aiTestReportController.updateReportStatus);
    }
}
