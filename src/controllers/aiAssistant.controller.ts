import { NextFunction, Request, Response } from 'express';
import AiAssistantService from '@/services/aiAssistant.service';
import { AiAssistantSettings } from '@/interfaces/aiAssistant.interface';

export class AiAssistantController {
    public aiAssistantService = new AiAssistantService();

    public getSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const settings = await this.aiAssistantService.getSettings();
            res.status(200).json({ data: settings, message: 'getSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const settingsData = req.body;
            const updateSettingsData = await this.aiAssistantService.updateSettings(settingsData);
            res.status(200).json({ data: updateSettingsData, message: 'updateSettings' });
        } catch (error) {
            next(error);
        }
    };

    public getVersions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const versions = await this.aiAssistantService.getVersions();
            res.status(200).json({ data: versions, message: 'getVersions' });
        } catch (error) {
            next(error);
        }
    };

    public rollbackToVersion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const versionId = parseInt(req.params.id);
            const settings = await this.aiAssistantService.rollbackToVersion(versionId);
            res.status(200).json({ data: settings, message: 'rollbackToVersion' });
        } catch (error) {
            next(error);
        }
    };
}
