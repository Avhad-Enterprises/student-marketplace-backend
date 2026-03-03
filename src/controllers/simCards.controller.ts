import { NextFunction, Request, Response } from "express";
import { SimCardService } from "@/services/simCards.service";

export class SimCardController {
    public simCardService = new SimCardService();

    public getSimCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const network_type = req.query.network_type as string;
            const student_visible = req.query.student_visible !== undefined ? req.query.student_visible === 'true' : undefined;
            const sort = req.query.sort as string;
            const order = req.query.order as string;

            const result = await this.simCardService.findAll(page, limit, search, status, network_type, student_visible, sort, order);

            res.status(200).json({ data: result.data, pagination: result.pagination, message: "findAll" });
        } catch (error) {
            next(error);
        }
    };

    public getSimCardById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const simCardId = req.params.id;
            const findSimCardData = await this.simCardService.findById(simCardId);

            res.status(200).json({ data: findSimCardData, message: "findOne" });
        } catch (error) {
            next(error);
        }
    };

    public createSimCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const simCardData = req.body;
            const createSimCardData = await this.simCardService.create(simCardData);

            res.status(201).json({ data: createSimCardData, message: "created" });
        } catch (error) {
            next(error);
        }
    };

    public updateSimCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const simCardId = req.params.id;
            const simCardData = req.body;
            const updateSimCardData = await this.simCardService.update(simCardId, simCardData);

            res.status(200).json({ data: updateSimCardData, message: "updated" });
        } catch (error) {
            next(error);
        }
    };

    public deleteSimCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const simCardId = req.params.id;
            const deleteSimCardData = await this.simCardService.delete(simCardId);

            res.status(200).json({ data: deleteSimCardData, message: "deleted" });
        } catch (error) {
            next(error);
        }
    };

    public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const metrics = await this.simCardService.getMetrics();
            res.status(200).json({ data: metrics, message: "metrics" });
        } catch (error) {
            next(error);
        }
    };
}
