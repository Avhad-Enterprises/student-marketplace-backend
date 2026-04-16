import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import PolicySettingsController from '@/controllers/policySettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';

class PolicySettingsRoute implements Route {
  public path = '/api/settings/policies';
  public router = Router();
  public policySettingsController = new PolicySettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware, roleMiddleware(['admin']));

    // Global Settings
    this.router.get(`/global`, this.policySettingsController.getGlobalSettings);
    this.router.post(`/global`, this.policySettingsController.updateGlobalSettings);
    
    // Policy Pages CRUD
    this.router.get(`/pages`, this.policySettingsController.getPolicyPages);
    this.router.post(`/pages`, this.policySettingsController.createPolicyPage);
    this.router.put(`/pages/:id`, this.policySettingsController.updatePolicyPage);
    this.router.delete(`/pages/:id`, this.policySettingsController.deletePolicyPage);
  }
}

export default PolicySettingsRoute;
