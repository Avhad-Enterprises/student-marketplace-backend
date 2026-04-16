import { NextFunction, Request, Response } from 'express';
import { VisaService } from '@/services/visa.service';
import { ExportRunner, ExportOptions } from '@/utils/exportRunner';
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

            const user = (req as any).user;
            const result = await this.visaService.findAll(
                page, limit, search, status, category, student_visible, sort, order,
                user?.user_type, user?.id
            );

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
            const user = (req as any).user;
            const visa = await this.visaService.findById(id, user?.user_type, user?.id);

            if (!visa) {
                res.status(404).json({ success: false, message: 'Visa not found or unauthorized' });
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
            const user = (req as any).user;

            // RBAC: Automatically assign provider_id if user is provider
            if (user?.user_type === 'provider') {
                visaData.provider_id = user.id;
            }

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
            const user = (req as any).user;

            const updatedVisa = await this.visaService.update(id, visaData, user?.user_type, user?.id);

            if (!updatedVisa) {
                res.status(404).json({ success: false, message: 'Visa not found or unauthorized' });
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
            const user = (req as any).user;
            const result = await this.visaService.delete(id, user?.user_type, user?.id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Visa not found or unauthorized' });
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
            const user = (req as any).user;
            let ids: (string | number)[] | undefined;
            const { ids: queryIds } = req.query;

            if (queryIds && typeof queryIds === 'string') {
                ids = queryIds.split(",");
            }

            const data = await this.visaService.exportVisas(ids, user?.user_type, user?.id);
            
            const keyMap = {
                'id': 'visa_id',
                'type': 'visa_type',
                'category': 'category',
                'countries': 'countries_covered',
                'status': 'status',
                'difficulty': 'processing_difficulty',
                'visible': 'student_visible',
                'workRights': 'work_rights',
                'popularity': 'popularity'
            };

            const result = await ExportRunner.run(data, req.query as unknown as ExportOptions, 'Visa', keyMap);
            
            res.setHeader('Content-Type', result.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename=visa-export-${Date.now()}.${result.extension}`);
            res.status(200).send(result.data);
        } catch (error) {
            logger.error(`[VisaController.exportVisa] Error: ${(error as any).message}`);
            next(error);
        }
    };
}
