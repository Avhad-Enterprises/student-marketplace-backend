import { Router } from 'express';
import RoleController from '../controllers/role.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';

class RoleRoute implements Route {
    public path = '/api/roles';
    public router = Router();
    public roleController = new RoleController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware, roleMiddleware(['admin']));
        this.router.get('/', this.roleController.getRoles);
        this.router.get('/:id', this.roleController.getRoleById);
        this.router.post('/', this.roleController.createRole);
        this.router.put('/:id', this.roleController.updateRole);
        this.router.delete('/:id', this.roleController.deleteRole);
    }
}

export default RoleRoute;
