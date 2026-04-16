import { Router } from 'express';
import { LoansController } from '@/controllers/loans.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateLoanDto, UpdateLoanDto } from '@/dtos/loans.dto';

export class LoansRoute implements Routes {
    public path = '/api/loans';
    public router = Router();
    public loansController = new LoansController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all loan routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get('/', this.loansController.getAllLoans);
        this.router.get('/metrics', this.loansController.getMetrics);
        this.router.get('/:id', this.loansController.getLoanById);

        // Administrative & Provider Actions (+ Validation)
        this.router.get('/export', roleMiddleware(['admin', 'provider']), this.loansController.exportLoans);
        this.router.post('/', roleMiddleware(['admin', 'provider']), validationMiddleware(CreateLoanDto, 'body'), this.loansController.createLoan);
        this.router.put('/:id', roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateLoanDto, 'body'), this.loansController.updateLoan);
        this.router.delete('/:id', roleMiddleware(['admin', 'provider']), this.loansController.deleteLoan);
    }
}
