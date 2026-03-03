import { Router } from 'express';
import { LoansController } from '@/controllers/loans.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class LoansRoute implements Routes {
    public path = '/api/loans';
    public router = Router();
    public loansController = new LoansController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware, this.loansController.getAllLoans);
        this.router.get('/metrics', authMiddleware, this.loansController.getMetrics);
        this.router.get('/export', authMiddleware, this.loansController.exportLoans);
        this.router.get('/:id', authMiddleware, this.loansController.getLoanById);
        this.router.post('/', authMiddleware, this.loansController.createLoan);
        this.router.put('/:id', authMiddleware, this.loansController.updateLoan);
        this.router.delete('/:id', authMiddleware, this.loansController.deleteLoan);
    }
}
