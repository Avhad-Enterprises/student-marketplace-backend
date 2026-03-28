import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users.service';
import { User } from '../interfaces/users.interface';

class UserController {
    public userService = new UserService();

    /**
     * Create a new user
     */
    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.body;
            const createUserData: User = await this.userService.createUser(userData);
            res.status(201).json({ data: createUserData, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get all users
     */
    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllUsersData: any[] = await this.userService.findAllUsers();
            res.status(200).json({ data: findAllUsersData, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get user by ID
     */
    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const findOneUserData: User = await this.userService.findUserById(userId);
            res.status(200).json({ data: findOneUserData, message: 'findOne' });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update user details
     */
    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const userData: Partial<User> = req.body;
            const updateUserData: User = await this.userService.updateUser(userId, userData);
            res.status(200).json({ data: updateUserData, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete user
     */
    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            await this.userService.deleteUser(userId);
            res.status(200).json({ message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };
}

export default UserController;
