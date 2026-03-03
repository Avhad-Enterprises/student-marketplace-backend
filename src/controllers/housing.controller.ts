import { NextFunction, Request, Response } from 'express';
import { HousingService } from '@/services/housing.service';

export class HousingController {
    public housingService = new HousingService();

    public getAllHousing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const housing_type = req.query.housing_type as string;
            const student_visible = req.query.student_visible !== undefined ? req.query.student_visible === 'true' : undefined;
            const sort = req.query.sort as string;
            const order = req.query.order as string;

            const result = await this.housingService.findAll(page, limit, search, status, housing_type, student_visible, sort, order);

            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };

    public getHousingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const result = await this.housingService.findById(id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Housing provider not found' });
                return;
            }

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public createHousing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const housingData = req.body;
            const result = await this.housingService.create(housingData);

            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public updateHousing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const housingData = req.body;
            const result = await this.housingService.update(id, housingData);

            if (!result) {
                res.status(404).json({ success: false, message: 'Housing provider not found' });
                return;
            }

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public deleteHousing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const result = await this.housingService.delete(id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Housing provider not found' });
                return;
            }

            res.status(200).json({ success: true, message: 'Housing provider deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getHousingMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.housingService.getMetrics();
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };
}
