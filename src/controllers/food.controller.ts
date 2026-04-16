import { NextFunction, Request, Response } from 'express';
import { FoodService } from '@/services/food.service';

export class FoodController {
    public foodService = new FoodService();

    public getAllFood = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
            const result = await this.foodService.findAll(page, limit, search, status, service_type, student_visible, sort, order, user?.user_type, user?.id);

            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };

    public getFoodById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const user = (req as any).user;
            const result = await this.foodService.findById(id, user?.user_type, user?.id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Food platform not found or unauthorized' });
                return;
            }

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public createFood = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const foodData = req.body;
            const user = (req as any).user;

            // RBAC: Automatically assign provider_id if user is provider
            if (user?.user_type === 'provider') {
                foodData.provider_id = user.id;
            }

            const result = await this.foodService.create(foodData);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public updateFood = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const foodData = req.body;
            const user = (req as any).user;

            const result = await this.foodService.update(id, foodData, user?.user_type, user?.id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Food platform not found or unauthorized' });
                return;
            }

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public deleteFood = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const user = (req as any).user;
            const result = await this.foodService.delete(id, user?.user_type, user?.id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Food platform not found or unauthorized' });
                return;
            }

            res.status(200).json({ success: true, message: 'Food platform deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getFoodMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.foodService.getMetrics();
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };
}
