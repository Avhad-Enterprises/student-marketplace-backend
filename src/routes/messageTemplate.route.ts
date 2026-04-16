import { Router } from 'express';
import { MessageTemplateController } from '@/controllers/messageTemplate.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateMessageTemplateDto, UpdateMessageTemplateDto } from '@/dtos/messageTemplate.dto';

export class MessageTemplateRoute implements Route {
    public path = '/api/settings/templates';
    public router = Router();
    public controller = new MessageTemplateController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // All message template management routes require admin privileges
        this.router.use(authMiddleware, roleMiddleware(['admin']));

        this.router.get(`/`, this.controller.getTemplates);
        this.router.get(`/:id`, this.controller.getTemplateById);
        this.router.post(`/`, validationMiddleware(CreateMessageTemplateDto, 'body'), this.controller.createTemplate);
        this.router.patch(`/:id`, validationMiddleware(UpdateMessageTemplateDto, 'body'), this.controller.updateTemplate);
        this.router.delete(`/:id`, this.controller.deleteTemplate);
    }
}
