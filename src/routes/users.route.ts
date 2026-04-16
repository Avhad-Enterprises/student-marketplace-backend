import { Router } from 'express';
import UserController from '../controllers/users.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';

class UserRoute implements Route {
    public path = '/api/users';
    public router = Router();
    public userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Only admin can access user management
        this.router.use(authMiddleware);
        this.router.use(roleMiddleware(['admin']));

        this.router.get('/', this.userController.getUsers);
        this.router.get('/:id', this.userController.getUserById);
        
        // POST create user with validation
        this.router.post('/', validationMiddleware(CreateUserDto, 'body'), this.userController.createUser);
        
        // PUT update user with validation
        this.router.put('/:id', validationMiddleware(UpdateUserDto, 'body'), this.userController.updateUser);
        
        this.router.delete('/:id', this.userController.deleteUser);
        this.router.post('/:id/reset-password', this.userController.resetUserPassword);
    }
}

export default UserRoute;
