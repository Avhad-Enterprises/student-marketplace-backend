import { Router } from 'express';
import { MessageTemplateController } from '@/controllers/messageTemplate.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class MessageTemplateRoute implements Route {
    public path = '/api/settings/templates';
    public router = Router();
    public controller = new MessageTemplateController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);
        this.router.get(`/`, this.controller.getTemplates);
        this.router.get(`/:id`, this.controller.getTemplateById);
        this.router.post(`/`, this.controller.createTemplate);
        this.router.patch(`/:id`, this.controller.updateTemplate);
        this.router.delete(`/:id`, this.controller.deleteTemplate);
    }
}
