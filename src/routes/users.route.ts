import { Router } from 'express';
import UserController from '../controllers/users.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';

class UserRoute implements Route {
    public path = '/api/users';
    public router = Router();
    public userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware, this.userController.getUsers);
        this.router.get('/:id', authMiddleware, this.userController.getUserById);
        this.router.post('/', authMiddleware, this.userController.createUser);
        this.router.put('/:id', authMiddleware, this.userController.updateUser);
        this.router.delete('/:id', authMiddleware, this.userController.deleteUser);
        this.router.post('/:id/reset-password', authMiddleware, this.userController.resetUserPassword);
    }
}

export default UserRoute;
