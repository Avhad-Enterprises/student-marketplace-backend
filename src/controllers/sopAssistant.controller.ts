import { NextFunction, Request, Response } from 'express';
import SopAssistantService from '@/services/sopAssistant.service';

class SopAssistantController {
    public sopAssistantService = new SopAssistantService();

    public getSOPs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = {
                search: req.query.search as string,
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                sortBy: req.query.sortBy as string,
                sortOrder: req.query.sortOrder as string,
                status: req.query.status as string,
                country: req.query.country as string,
                reviewStatus: req.query.reviewStatus as string,
            };
            const data = await this.sopAssistantService.getSOPs(filters);
            res.status(200).json({ data, message: 'getSOPs' });
        } catch (error) {
            next(error);
        }
    };

    public getStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.sopAssistantService.getStats();
            res.status(200).json({ data, message: 'getStats' });
        } catch (error) {
            next(error);
        }
    };

    public createSOP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sopData = req.body;
            const data = await this.sopAssistantService.createSOP(sopData);
            res.status(201).json({ data, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    public updateSOP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const sopData = req.body;
            await this.sopAssistantService.updateSOP(id, sopData);
            res.status(200).json({ message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const { status } = req.body;
            await this.sopAssistantService.updateStatus(id, status);
            res.status(200).json({ message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public importSOPs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sops = req.body;
            const count = await this.sopAssistantService.importSOPs(sops);
            res.status(200).json({ message: `${count} SOPs imported successfully`, count });
        } catch (error) {
            next(error);
        }
    };

    public getSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.sopAssistantService.getSettings();
            res.status(200).json({ data, message: 'getSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const settingsData = req.body;
            await this.sopAssistantService.updateSettings(settingsData);
            res.status(200).json({ message: 'updated' });
        } catch (error) {
            next(error);
        }
    };
}

export default SopAssistantController;
