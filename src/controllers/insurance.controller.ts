import { NextFunction, Request, Response } from "express";
import { InsuranceService } from "@/services/insurance.service";

export class InsuranceController {
    public insuranceService = new InsuranceService();

    public getInsurance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const insurance_type = req.query.insurance_type as string;
            const student_visible = req.query.student_visible !== undefined ? req.query.student_visible === 'true' : undefined;
            const sort = req.query.sort as string;
            const order = req.query.order as string;

            const user = (req as any).user;
            const result = await this.insuranceService.findAll(
                page, limit, search, status, insurance_type, student_visible, sort, order,
                user?.user_type, user?.id
            );

            res.status(200).json({ data: result.data, pagination: result.pagination, message: "findAll" });
        } catch (error) {
            next(error);
        }
    };

    public getInsuranceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const insuranceId = req.params.id;
            const user = (req as any).user;
            const findInsuranceData = await this.insuranceService.findById(insuranceId, user?.user_type, user?.id);

            res.status(200).json({ data: findInsuranceData, message: "findOne" });
        } catch (error) {
            next(error);
        }
    };

    public createInsurance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const insuranceData = req.body;
            const user = (req as any).user;

            // RBAC: Automatically assign provider_id if user is provider
            if (user?.user_type === 'provider') {
                insuranceData.provider_id = user.id;
            }

            const createInsuranceData = await this.insuranceService.create(insuranceData);

            res.status(201).json({ data: createInsuranceData, message: "created" });
        } catch (error) {
            next(error);
        }
    };

    public updateInsurance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const insuranceId = req.params.id;
            const insuranceData = req.body;
            const user = (req as any).user;

            const updateInsuranceData = await this.insuranceService.update(insuranceId, insuranceData, user?.user_type, user?.id);

            if (!updateInsuranceData) {
                res.status(404).json({ message: "Insurance not found or unauthorized" });
                return;
            }

            res.status(200).json({ data: updateInsuranceData, message: "updated" });
        } catch (error) {
            next(error);
        }
    };

    public deleteInsurance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const insuranceId = req.params.id;
            const user = (req as any).user;
            const deleteInsuranceData = await this.insuranceService.delete(insuranceId, user?.user_type, user?.id);

            if (!deleteInsuranceData) {
                res.status(404).json({ message: "Insurance not found or unauthorized" });
                return;
            }

            res.status(200).json({ data: deleteInsuranceData, message: "deleted" });
        } catch (error) {
            next(error);
        }
    };

    public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const metrics = await this.insuranceService.getMetrics();
            res.status(200).json({ data: metrics, message: "metrics" });
        } catch (error) {
            next(error);
        }
    };
}
