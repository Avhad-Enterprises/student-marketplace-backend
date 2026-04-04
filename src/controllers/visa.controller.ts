import { NextFunction, Request, Response } from 'express';
import { VisaService, ExportResult } from '@/services/visa.service';
import { logger } from '@/utils/logger';

export class VisaController {
    public visaService = new VisaService();

    public getAllVisas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const category = req.query.category as string;
            const student_visible = req.query.student_visible === 'true' ? true : req.query.student_visible === 'false' ? false : undefined;
            const sort = req.query.sort as string;
            const order = req.query.order as string;

            const result = await this.visaService.findAll(page, limit, search, status, category, student_visible, sort, order);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            logger.error(`[VisaController.getAllVisas] Error: ${(error as any).message}`);
            next(error);
        }
    };

    public getVisaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const visa = await this.visaService.findById(id);

            if (!visa) {
                res.status(404).json({ success: false, message: 'Visa not found' });
                return;
            }

            res.status(200).json({ success: true, data: visa });
        } catch (error) {
            next(error);
        }
    };

    public createVisa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const visaData = req.body;
            const newVisa = await this.visaService.create(visaData);
            res.status(201).json({ success: true, data: newVisa, message: 'Visa created successfully' });
        } catch (error) {
            next(error);
        }
    };

    public updateVisa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const visaData = req.body;
            const updatedVisa = await this.visaService.update(id, visaData);

            if (!updatedVisa) {
                res.status(404).json({ success: false, message: 'Visa not found or update failed' });
                return;
            }

            res.status(200).json({ success: true, data: updatedVisa, message: 'Visa updated successfully' });
        } catch (error) {
            next(error);
        }
    };

    public deleteVisa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const result = await this.visaService.delete(id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Visa not found or deletion failed' });
                return;
            }

            res.status(200).json({ success: true, message: 'Visa deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const metrics = await this.visaService.getMetrics();
            res.status(200).json({ success: true, data: metrics });
        } catch (error) {
            next(error);
        }
    };

    public exportVisa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info(`[VisaController.exportVisa] Processing export request with query: ${JSON.stringify(req.query)}`);
            const { data, mimeType, extension }: ExportResult = await this.visaService.exportVisas(req.query);
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `attachment; filename=visa-export-${Date.now()}.${extension}`);
            res.status(200).send(data);
        } catch (error) {
            logger.error(`[VisaController.exportVisa] Error: ${(error as any).message}`);
            next(error);
        }
    };
}
