import { Router } from 'express';
import ComparisonRulesController from '@/controllers/comparisonRules.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { UpdateComparisonRulesDto } from '@/dtos/comparisonRules.dto';

class ComparisonRulesRoute implements Routes {
    public path = '/api/settings/comparison-rules';
    public router = Router();
    public controller = new ComparisonRulesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware, roleMiddleware(['admin']));
        this.router.get(`/`, this.controller.getRules);
        this.router.post(`/`, validationMiddleware(UpdateComparisonRulesDto, 'body'), this.controller.updateRules);
    }
}

export default ComparisonRulesRoute;
