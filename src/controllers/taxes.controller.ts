import { NextFunction, Request, Response } from 'express';
import { TaxesService, ExportResult } from '@/services/taxes.service';
import { logger } from '@/utils/logger';

export class TaxesController {
    public taxesService = new TaxesService();

    public getAllTaxes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const student_visible = req.query.student_visible === 'true' ? true : req.query.student_visible === 'false' ? false : undefined;
            const sort = req.query.sort as string;
            const order = req.query.order as string;

            const user = (req as any).user;
            const result = await this.taxesService.findAll(
                page, limit, search, status, student_visible, sort, order,
                user?.user_type, user?.id
            );

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            logger.error(`[TaxesController.getAllTaxes] Error: ${(error as any).message}`);
            next(error);
        }
    };

    public getTaxById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const user = (req as any).user;
            const tax = await this.taxesService.findById(id, user?.user_type, user?.id);

            if (!tax) {
                res.status(404).json({ success: false, message: 'Tax service not found or unauthorized' });
                return;
            }

            res.status(200).json({ success: true, data: tax });
        } catch (error) {
            next(error);
        }
    };

    public createTax = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const taxData = req.body;
            const user = (req as any).user;

            // RBAC: Automatically assign provider_id if user is provider
            if (user?.user_type === 'provider') {
                taxData.provider_id = user.id;
            }

            const newTax = await this.taxesService.create(taxData);
            res.status(201).json({ success: true, data: newTax, message: 'Tax service created successfully' });
        } catch (error) {
            next(error);
        }
    };

    public updateTax = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const taxData = req.body;
            const user = (req as any).user;

            const updatedTax = await this.taxesService.update(id, taxData, user?.user_type, user?.id);

            if (!updatedTax) {
                res.status(404).json({ success: false, message: 'Tax service not found or unauthorized' });
                return;
            }

            res.status(200).json({ success: true, data: updatedTax, message: 'Tax service updated successfully' });
        } catch (error) {
            next(error);
        }
    };

    public deleteTax = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const user = (req as any).user;
            const result = await this.taxesService.delete(id, user?.user_type, user?.id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Tax service not found or unauthorized' });
                return;
            }

            res.status(200).json({ success: true, message: 'Tax service deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const metrics = await this.taxesService.getMetrics();
            res.status(200).json({ success: true, data: metrics });
        } catch (error) {
            next(error);
        }
    };

    public exportTaxes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info(`[TaxesController.exportTaxes] Processing export request with query: ${JSON.stringify(req.query)}`);
            const user = (req as any).user;
            const { data, mimeType, extension }: ExportResult = await this.taxesService.exportTaxes(req.query, user?.user_type, user?.id);
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `attachment; filename=taxes-export-${Date.now()}.${extension}`);
            res.status(200).send(data);
        } catch (error) {
            logger.error(`[TaxesController.exportTaxes] Error: ${(error as any).message}`);
            next(error);
        }
    };
}
