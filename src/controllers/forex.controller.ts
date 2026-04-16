import { NextFunction, Request, Response } from 'express';
import { ForexService } from '@/services/forex.service';

export class ForexController {
    public forexService = new ForexService();

    public getAllForex = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const service_type = req.query.service_type as string;
            const student_visible = req.query.student_visible !== undefined ? req.query.student_visible === 'true' : undefined;
            const sort = req.query.sort as string;
            const order = req.query.order as string;

            const user = (req as any).user;
            const result = await this.forexService.findAll(page, limit, search, status, service_type, student_visible, sort, order, user?.user_type, user?.id);

            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };

    public getForexById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const user = (req as any).user;
            const result = await this.forexService.findById(id, user?.user_type, user?.id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Forex provider not found or unauthorized' });
                return;
            }

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public createForex = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const forexData = req.body;
            const user = (req as any).user;

            // RBAC: Automatically assign provider_id if user is provider
            if (user?.user_type === 'provider') {
                forexData.provider_id = user.id;
            }

            const result = await this.forexService.create(forexData);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public updateForex = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const forexData = req.body;
            const user = (req as any).user;

            const result = await this.forexService.update(id, forexData, user?.user_type, user?.id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Forex provider not found or unauthorized' });
                return;
            }

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public deleteForex = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const user = (req as any).user;
            const result = await this.forexService.delete(id, user?.user_type, user?.id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Forex provider not found or unauthorized' });
                return;
            }

            res.status(200).json({ success: true, message: 'Forex provider deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getForexMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.forexService.getMetrics();
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };
}
