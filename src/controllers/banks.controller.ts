import { NextFunction, Request, Response } from "express";
import { BankService } from "@/services/banks.service";

export class BankController {
    public bankService = new BankService();

    public getBanks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const account_type = req.query.account_type as string;
            const student_visible = req.query.student_visible !== undefined ? req.query.student_visible === 'true' : undefined;
            const sort = req.query.sort as string;
            const order = req.query.order as string;

            const user = (req as any).user;
            const result = await this.bankService.findAll(
                page, limit, search, status, account_type, student_visible, sort, order,
                user?.user_type, user?.id
            );

            res.status(200).json({ data: result.data, pagination: result.pagination, message: "findAll" });
        } catch (error) {
            next(error);
        }
    };

    public getBankById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bankId = req.params.id;
            const user = (req as any).user;
            const findBankData = await this.bankService.findById(bankId, user?.user_type, user?.id);

            res.status(200).json({ data: findBankData, message: "findOne" });
        } catch (error) {
            next(error);
        }
    };

    public createBank = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bankData = req.body;
            const user = (req as any).user;

            // RBAC: Automatically assign provider_id if user is provider
            if (user?.user_type === 'provider') {
                bankData.provider_id = user.id;
            }

            const createBankData = await this.bankService.create(bankData);

            res.status(201).json({ data: createBankData, message: "created" });
        } catch (error) {
            next(error);
        }
    };

    public updateBank = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bankId = req.params.id;
            const bankData = req.body;
            const user = (req as any).user;

            const updateBankData = await this.bankService.update(bankId, bankData, user?.user_type, user?.id);

            if (!updateBankData) {
                res.status(404).json({ message: "Bank not found or unauthorized" });
                return;
            }

            res.status(200).json({ data: updateBankData, message: "updated" });
        } catch (error) {
            next(error);
        }
    };

    public deleteBank = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bankId = req.params.id;
            const user = (req as any).user;
            const deleteBankData = await this.bankService.delete(bankId, user?.user_type, user?.id);

            if (!deleteBankData) {
                res.status(404).json({ message: "Bank not found or unauthorized" });
                return;
            }

            res.status(200).json({ data: deleteBankData, message: "deleted" });
        } catch (error) {
            next(error);
        }
    };

    public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const metrics = await this.bankService.getMetrics();
            res.status(200).json({ data: metrics, message: "metrics" });
        } catch (error) {
            next(error);
        }
    };
}
