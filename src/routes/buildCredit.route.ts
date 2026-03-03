import { Router } from 'express';
import { BuildCreditController } from '@/controllers/buildCredit.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class BuildCreditRoute implements Routes {
    public path = '/api/build-credit';
    public router = Router();
    public buildCreditController = new BuildCreditController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware, this.buildCreditController.getAll);
        this.router.get('/metrics', authMiddleware, this.buildCreditController.getMetrics);
        this.router.get('/export', authMiddleware, this.buildCreditController.export);
        this.router.get('/:id', authMiddleware, this.buildCreditController.getById);
        this.router.post('/', authMiddleware, this.buildCreditController.create);
        this.router.put('/:id', authMiddleware, this.buildCreditController.update);
        this.router.delete('/:id', authMiddleware, this.buildCreditController.delete);
    }
}
