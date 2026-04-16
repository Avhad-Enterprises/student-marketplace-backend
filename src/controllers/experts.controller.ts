import { NextFunction, Request, Response } from "express";
import { CreateExpertDto, UpdateExpertDto } from "@/dtos/experts.dto";
import { Expert } from "@/interfaces/experts.interface";
import { ExpertService } from "@/services/experts.service";

export class ExpertController {
    public expertService = new ExpertService();

    public getExperts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;

            const expertsData = await this.expertService.findAll(page, limit, search);

            res.status(200).json({ data: expertsData.data, pagination: expertsData.pagination, message: "findAll" });
        } catch (error) {
            next(error);
        }
    };

    public getExpertById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const expertId = req.params.id;
            const findExpertData: Expert = await this.expertService.findById(expertId);

            res.status(200).json({ data: findExpertData, message: "findOne" });
        } catch (error) {
            next(error);
        }
    };

    public createExpert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const expertData: CreateExpertDto = req.body;
            const createExpertData: Expert = await this.expertService.create(expertData);

            res.status(201).json({ data: createExpertData, message: "created" });
        } catch (error) {
            next(error);
        }
    };

    public updateExpert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const expertId = req.params.id;
            const expertData: UpdateExpertDto = req.body;
            const updateExpertData: Expert = await this.expertService.update(expertId, expertData);

            res.status(200).json({ data: updateExpertData, message: "updated" });
        } catch (error) {
            next(error);
        }
    };

    public deleteExpert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const expertId = req.params.id;
            await this.expertService.delete(expertId);

            res.status(200).json({ message: "deleted" });
        } catch (error) {
            next(error);
        }
    };

    public importExperts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = req.body;
            if (!Array.isArray(data)) {
                res.status(400).json({ message: 'Input data must be an array' });
                return;
            }
            const result = await this.expertService.importExperts(data);
            res.status(200).json({ data: result, message: 'importExperts' });
        } catch (error) {
            next(error);
        }
    };
}
