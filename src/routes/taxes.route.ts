import { Router } from 'express';
import { TaxesController } from '@/controllers/taxes.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class TaxesRoute implements Routes {
    public path = '/api/taxes';
    public router = Router();
    public taxesController = new TaxesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware, this.taxesController.getAllTaxes);
        this.router.get('/metrics', authMiddleware, this.taxesController.getMetrics);
        this.router.get('/export', authMiddleware, this.taxesController.exportTaxes);
        this.router.get('/:id', authMiddleware, this.taxesController.getTaxById);
        this.router.post('/', authMiddleware, this.taxesController.createTax);
        this.router.put('/:id', authMiddleware, this.taxesController.updateTax);
        this.router.delete('/:id', authMiddleware, this.taxesController.deleteTax);
    }
}
