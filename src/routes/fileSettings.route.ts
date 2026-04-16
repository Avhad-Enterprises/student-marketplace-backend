import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import FileSettingsController from '@/controllers/fileSettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';

class FileSettingsRoute implements Route {
  public path = '/api/settings/files';
  public router = Router();
  public fileSettingsController = new FileSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware, roleMiddleware(['admin']));
    this.router.get(`/`, this.fileSettingsController.getSettings);
    this.router.post(`/`, this.fileSettingsController.updateSettings);
  }
}

export default FileSettingsRoute;
