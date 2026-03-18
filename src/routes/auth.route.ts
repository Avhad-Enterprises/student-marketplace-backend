import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';

class AuthRoute implements Route {
    public path = '/';
    public router = Router();
    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login', this.authController.logIn);
        this.router.post('/change-password', authMiddleware, this.authController.changePassword);
    }
}

export default AuthRoute;
