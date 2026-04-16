import { Router } from 'express';
import { AiTestPlansController } from '@/controllers/aiTestPlans.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';

export class AiTestPlansRoute implements Route {
    public path = '/api/ai-test-plans';
    public router = Router();
    public aiTestPlansController = new AiTestPlansController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // AI testing routes require admin privileges
        this.router.use(authMiddleware, roleMiddleware(['admin']));
        this.router.get(`/settings`, this.aiTestPlansController.getSettings);
        this.router.post(`/settings`, this.aiTestPlansController.updateSettings);
    }
}
