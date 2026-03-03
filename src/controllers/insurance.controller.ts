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
            const coverage_type = req.query.coverage_type as string;
            const student_visible = req.query.student_visible !== undefined ? req.query.student_visible === 'true' : undefined;
            const sort = req.query.sort as string;
            const order = req.query.order as string;

            const result = await this.insuranceService.findAll(page, limit, search, status, coverage_type, student_visible, sort, order);

            res.status(200).json({ data: result.data, pagination: result.pagination, message: "findAll" });
        } catch (error) {
            next(error);
        }
    };

    public getInsuranceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const insuranceId = req.params.id;
            const findInsuranceData = await this.insuranceService.findById(insuranceId);

            res.status(200).json({ data: findInsuranceData, message: "findOne" });
        } catch (error) {
            next(error);
        }
    };

    public createInsurance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const insuranceData = req.body;
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
            const updateInsuranceData = await this.insuranceService.update(insuranceId, insuranceData);

            res.status(200).json({ data: updateInsuranceData, message: "updated" });
        } catch (error) {
            next(error);
        }
    };

    public deleteInsurance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const insuranceId = req.params.id;
            const deleteInsuranceData = await this.insuranceService.delete(insuranceId);

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
