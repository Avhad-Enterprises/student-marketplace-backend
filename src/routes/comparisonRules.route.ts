import { Router } from 'express';
import ComparisonRulesController from '@/controllers/comparisonRules.controller';
import Routes from '@/interfaces/routes.interface';

class ComparisonRulesRoute implements Routes {
    public path = '/api/settings/comparison-rules';
    public router = Router();
    public controller = new ComparisonRulesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/`, this.controller.getRules);
        this.router.post(`/`, this.controller.updateRules);
    }
}

export default ComparisonRulesRoute;
