import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import FileSettingsController from '@/controllers/fileSettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class FileSettingsRoute implements Route {
  public path = '/api/settings/files';
  public router = Router();
  public fileSettingsController = new FileSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/`, authMiddleware, this.fileSettingsController.getSettings);
    this.router.post(`/`, authMiddleware, this.fileSettingsController.updateSettings);
  }
}

export default FileSettingsRoute;
