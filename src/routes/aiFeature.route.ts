import { Router } from 'express';
import { AiFeatureController } from '@/controllers/aiFeature.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class AiFeatureRoute implements Routes {
    public path = '/api/ai-features';
    public router = Router();
    public aiFeatureController = new AiFeatureController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/`, authMiddleware, this.aiFeatureController.getAllFeatures);
        this.router.post(`/`, authMiddleware, this.aiFeatureController.createFeature);
        this.router.get(`/:id`, authMiddleware, this.aiFeatureController.getFeatureById);
        this.router.post(`/:id`, authMiddleware, this.aiFeatureController.updateFeature);
        this.router.delete(`/:id`, authMiddleware, this.aiFeatureController.deleteFeature);
    }
}
