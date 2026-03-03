import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import Route from '../interfaces/routes.interface';

class AuthRoute implements Route {
    public path = '/';
    public router = Router();
    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login', this.authController.logIn);
    }
}

export default AuthRoute;
