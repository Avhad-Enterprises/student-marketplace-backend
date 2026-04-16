import { NextFunction, Request, Response } from 'express';
import { LoansService } from '@/services/loans.service';
import { logger } from '@/utils/logger';

export class LoansController {
    public loansService = new LoansService();

    public getAllLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { page, limit, search, status, student_visible, sort, order } = req.query;
            const user = (req as any).user;
            const result = await this.loansService.findAll(
                Number(page) || 1,
                Number(limit) || 10,
                search as string,
                status as string,
                student_visible === 'true' ? true : student_visible === 'false' ? false : undefined,
                sort as string,
                order as string,
                user?.user_type,
                user?.id
            );

            res.status(200).json({ data: result.data, pagination: result.pagination, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    };

    public getLoanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const loanId = req.params.id;
            const user = (req as any).user;
            const findLoanData = await this.loansService.findById(loanId, user?.user_type, user?.id);

            if (!findLoanData) {
                res.status(404).json({ success: false, message: 'Loan product not found or unauthorized' });
                return;
            }

            res.status(200).json({ data: findLoanData, message: 'findOne' });
        } catch (error) {
            next(error);
        }
    };

    public createLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const loanData = req.body;
            const user = (req as any).user;

            // RBAC: Automatically assign provider_id if user is provider
            if (user?.user_type === 'provider') {
                loanData.provider_id = user.id;
            }

            const createLoanData = await this.loansService.create(loanData);
            res.status(201).json({ data: createLoanData, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    public updateLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const loanId = req.params.id;
            const loanData = req.body;
            const user = (req as any).user;

            const updateLoanData = await this.loansService.update(loanId, loanData, user?.user_type, user?.id);

            if (!updateLoanData) {
                res.status(404).json({ success: false, message: 'Loan product not found or unauthorized' });
                return;
            }

            res.status(200).json({ data: updateLoanData, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public deleteLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const loanId = req.params.id;
            const user = (req as any).user;
            const result = await this.loansService.delete(loanId, user?.user_type, user?.id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Loan product not found or unauthorized' });
                return;
            }

            res.status(200).json({ message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };

    public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const metrics = await this.loansService.getMetrics();
            res.status(200).json({ data: metrics, message: 'getMetrics' });
        } catch (error) {
            next(error);
        }
    };

    public exportLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const options = req.query;
            const user = (req as any).user;
            const exportResult = await this.loansService.exportLoans(options, user?.user_type, user?.id);

            res.setHeader('Content-Type', exportResult.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename=loans-export.${exportResult.extension}`);
            res.status(200).send(exportResult.data);
        } catch (error) {
            next(error);
        }
    };
}
