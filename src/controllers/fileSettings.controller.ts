import { NextFunction, Request, Response } from 'express';
import FileSettingsService from '@/services/fileSettings.service';
import { FileSettings } from '@/interfaces/fileSettings.interface';

class FileSettingsController {
    public fileSettingsService = new FileSettingsService();

    public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settings: FileSettings = await this.fileSettingsService.getSettings();
            res.status(200).json({ data: settings, message: 'getSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settingsData: Partial<FileSettings> = req.body;
            const updatedSettings: FileSettings = await this.fileSettingsService.updateSettings(settingsData);
            res.status(200).json({ data: updatedSettings, message: 'updateSettings' });
        } catch (error) {
            next(error);
        }
    };
}

export default FileSettingsController;
