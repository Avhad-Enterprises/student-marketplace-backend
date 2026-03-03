import { NextFunction, Request, Response } from 'express';
import { EmploymentService } from '@/services/employment.service';

export class EmploymentController {
    public employmentService = new EmploymentService();

    public getAllEmployment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const service_type = req.query.service_type as string;
            const student_visible = req.query.student_visible !== undefined ? req.query.student_visible === 'true' : undefined;
            const sort = req.query.sort as string;
            const order = req.query.order as string;

            const result = await this.employmentService.findAll(page, limit, search, status, service_type, student_visible, sort, order);

            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };

    public getEmploymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const result = await this.employmentService.findById(id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Employment platform not found' });
                return;
            }

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public createEmployment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const employmentData = req.body;
            const result = await this.employmentService.create(employmentData);

            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public updateEmployment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const employmentData = req.body;
            const result = await this.employmentService.update(id, employmentData);

            if (!result) {
                res.status(404).json({ success: false, message: 'Employment platform not found' });
                return;
            }

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public deleteEmployment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const result = await this.employmentService.delete(id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Employment platform not found' });
                return;
            }

            res.status(200).json({ success: true, message: 'Employment platform deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getEmploymentMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.employmentService.getMetrics();
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };
}
