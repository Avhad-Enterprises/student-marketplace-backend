import { Request, Response, NextFunction } from "express";
import SopAssistantService from '@/services/sopAssistant.service';
import { ExportRunner, ExportOptions } from '@/utils/exportRunner';

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

    public getSOPById = async (req: any, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const user = req.user;
            const sop = await this.sopAssistantService.getSOPById(id);

            if (!sop) {
                return res.status(404).json({ message: 'SOP not found' });
            }

            // Ownership Validation
            const isAdmin = user.user_type === 'admin' || user.role === 'admin';
            const isOwner = sop.student_id && user.student_code && sop.student_id.toLowerCase() === user.student_code.toLowerCase();

            if (!isAdmin && !isOwner) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to this SOP' });
            }

            res.status(200).json({ data: sop, message: 'getSOPById' });
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

    public createSOP = async (req: any, res: Response, next: NextFunction) => {
        try {
            const sopData = req.body;
            const user = req.user;

            // Automatically set student_id if user is a student
            if (user.role !== 'admin' && user.student_code) {
                sopData.student_id = user.student_code;
            }

            const data = await this.sopAssistantService.createSOP(sopData);
            res.status(201).json({ data, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    public updateSOP = async (req: any, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const sopData = req.body;
            const user = req.user;

            const existingSop = await this.sopAssistantService.getSOPById(id);
            if (!existingSop) {
                return res.status(404).json({ message: 'SOP not found' });
            }

            // Ownership Validation
            const isAdmin = user.user_type === 'admin' || user.role === 'admin';
            const isOwner = existingSop.student_id && user.student_code && existingSop.student_id.toLowerCase() === user.student_code.toLowerCase();

            if (!isAdmin && !isOwner) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to update this SOP' });
            }

            await this.sopAssistantService.updateSOP(id, sopData);
            res.status(200).json({ message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public updateStatus = async (req: any, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const { status } = req.body;
            const user = req.user;

            const existingSop = await this.sopAssistantService.getSOPById(id);
            if (!existingSop) {
                return res.status(404).json({ message: 'SOP not found' });
            }

            // Ownership Validation
            const isAdmin = user.user_type === 'admin' || user.role === 'admin';
            const isOwner = existingSop.student_id && user.student_code && existingSop.student_id.toLowerCase() === user.student_code.toLowerCase();

            if (!isAdmin && !isOwner) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to update this SOP status' });
            }

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

    public exportSOPs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.sopAssistantService.exportSOPs(req.query);
            
            // Map backend keys to frontend labels for display/export
            const keyMap = {
                'id': 'id',
                'studentName': 'student_name',
                'country': 'country',
                'university': 'university',
                'reviewStatus': 'review_status',
                'aiConfidenceScore': 'ai_confidence_score',
                'status': 'status',
                'lastUpdated': 'updated_at'
            };

            const result = await ExportRunner.run(data, req.query as unknown as ExportOptions, 'SOP Assistant', keyMap);
            
            res.setHeader('Content-Type', result.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename=sop-assistant-export-${Date.now()}.${result.extension}`);
            res.status(200).send(result.data);
        } catch (error) {
            next(error);
        }
    };
}

export default SopAssistantController;
