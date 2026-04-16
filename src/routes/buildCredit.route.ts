import { Router } from 'express';
import { BuildCreditController } from '@/controllers/buildCredit.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateBuildCreditDto, UpdateBuildCreditDto } from '@/dtos/buildCredit.dto';

export class BuildCreditRoute implements Routes {
    public path = '/api/build-credit';
    public router = Router();
    public buildCreditController = new BuildCreditController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all build-credit routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get('/', this.buildCreditController.getAll);
        this.router.get('/metrics', this.buildCreditController.getMetrics);
        this.router.get('/:id', this.buildCreditController.getById);

        // Administrative & Provider Actions (+ Validation)
        this.router.get('/export', roleMiddleware(['admin', 'provider']), this.buildCreditController.export);
        this.router.post('/', roleMiddleware(['admin', 'provider']), validationMiddleware(CreateBuildCreditDto, 'body'), this.buildCreditController.create);
        this.router.put('/:id', roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateBuildCreditDto, 'body'), this.buildCreditController.update);
        this.router.delete('/:id', roleMiddleware(['admin', 'provider']), this.buildCreditController.delete);
    }
}
