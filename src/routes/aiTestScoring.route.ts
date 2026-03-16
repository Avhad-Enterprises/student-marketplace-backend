import { Router } from 'express';
import { AiTestScoringController } from '@/controllers/aiTestScoring.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class AiTestScoringRoute implements Route {
    public path = '/api/ai-test-scoring';
    public router = Router();
    public aiTestScoringController = new AiTestScoringController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);
        this.router.get(`/settings`, this.aiTestScoringController.getSettings);
        this.router.post(`/settings`, this.aiTestScoringController.updateSettings);
    }
}
