import { Router } from 'express';
import GeneralSettingsController from '@/controllers/generalSettings.controller';
import Routes from '@/interfaces/routes.interface';

class GeneralSettingsRoute implements Routes {
  public path = '/settings/general';
  public router = Router();
  public generalSettingsController = new GeneralSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.generalSettingsController.getAll);
    this.router.get(`${this.path}/:key`, this.generalSettingsController.getByKey);
    this.router.post(`${this.path}`, this.generalSettingsController.upsert);
    this.router.post(`${this.path}/bulk`, this.generalSettingsController.bulkUpdate);
  }
}

export default GeneralSettingsRoute;
