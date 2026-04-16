import { Router } from 'express';
import { TaxesController } from '@/controllers/taxes.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateTaxDto, UpdateTaxDto } from '@/dtos/taxes.dto';

export class TaxesRoute implements Routes {
    public path = '/api/taxes';
    public router = Router();
    public taxesController = new TaxesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all tax routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get('/', this.taxesController.getAllTaxes);
        this.router.get('/metrics', this.taxesController.getMetrics);
        this.router.get('/:id', this.taxesController.getTaxById);

        // Administrative & Provider Actions (+ Validation)
        this.router.get('/export', roleMiddleware(['admin', 'provider']), this.taxesController.exportTaxes);
        this.router.post('/', roleMiddleware(['admin', 'provider']), validationMiddleware(CreateTaxDto, 'body'), this.taxesController.createTax);
        this.router.put('/:id', roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateTaxDto, 'body'), this.taxesController.updateTax);
        this.router.delete('/:id', roleMiddleware(['admin', 'provider']), this.taxesController.deleteTax);
        this.router.get('/metrics', this.taxesController.getMetrics);
    }
}
