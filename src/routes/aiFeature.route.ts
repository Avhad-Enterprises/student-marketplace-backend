import { Router } from 'express';
import { AiFeatureController } from '@/controllers/aiFeature.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateAiFeatureDto, UpdateAiFeatureDto } from '@/dtos/aiFeature.dto';

export class AiFeatureRoute implements Routes {
    public path = '/api/ai-features';
    public router = Router();
    public aiFeatureController = new AiFeatureController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all AI feature routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get(`/`, this.aiFeatureController.getAllFeatures);
        this.router.get(`/:id`, this.aiFeatureController.getFeatureById);

        // Administrative Actions (Admin only + Validation)
        this.router.post(`/`, roleMiddleware(['admin']), validationMiddleware(CreateAiFeatureDto, 'body'), this.aiFeatureController.createFeature);
        this.router.post(`/:id`, roleMiddleware(['admin']), validationMiddleware(UpdateAiFeatureDto, 'body'), this.aiFeatureController.updateFeature);
        this.router.delete(`/:id`, roleMiddleware(['admin']), this.aiFeatureController.deleteFeature);
    }
}
