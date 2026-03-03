import { NextFunction, Request, Response } from 'express';
import { BuildCreditService } from '@/services/buildCredit.service';

export class BuildCreditController {
    public buildCreditService = new BuildCreditService();

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { page, limit, search, status, student_visible, sort, order } = req.query;
            const result = await this.buildCreditService.findAll(
                Number(page) || 1,
                Number(limit) || 10,
                search as string,
                status as string,
                student_visible === 'true' ? true : student_visible === 'false' ? false : undefined,
                sort as string,
                order as string
            );

            res.status(200).json({ data: result.data, pagination: result.pagination, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    };

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const data = await this.buildCreditService.findById(id);
            res.status(200).json({ data, message: 'findOne' });
        } catch (error) {
            next(error);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = req.body;
            const newData = await this.buildCreditService.create(data);
            res.status(201).json({ data: newData, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const data = req.body;
            const updatedData = await this.buildCreditService.update(id, data);
            res.status(200).json({ data: updatedData, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            await this.buildCreditService.delete(id);
            res.status(200).json({ message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };

    public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const metrics = await this.buildCreditService.getMetrics();
            res.status(200).json({ data: metrics, message: 'getMetrics' });
        } catch (error) {
            next(error);
        }
    };

    public export = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const options = req.query;
            const result = await this.buildCreditService.export(options);

            res.setHeader('Content-Type', result.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename=build-credit-export.${result.extension}`);
            res.status(200).send(result.data);
        } catch (error) {
            next(error);
        }
    };
}
