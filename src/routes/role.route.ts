import { Router } from 'express';
import RoleController from '../controllers/role.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';

class RoleRoute implements Route {
    public path = '/api/roles';
    public router = Router();
    public roleController = new RoleController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware, this.roleController.getRoles);
        this.router.get('/:id', authMiddleware, this.roleController.getRoleById);
        this.router.post('/', authMiddleware, this.roleController.createRole);
        this.router.put('/:id', authMiddleware, this.roleController.updateRole);
        this.router.delete('/:id', authMiddleware, this.roleController.deleteRole);
    }
}

export default RoleRoute;
