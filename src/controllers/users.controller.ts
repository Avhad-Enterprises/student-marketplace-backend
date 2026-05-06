import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users.service';
import { User } from '../interfaces/users.interface';
import { EmailSendingService } from '../communications/services/email-sending.service';

class UserController {
    public userService = new UserService();
    public emailSendingService = new EmailSendingService();

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
    /**
     * Reset user password (admin action)
     */
    public resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const { password } = req.body;
            if (!password) {
                res.status(400).json({ message: 'Password is required' });
                return;
            }
            await this.userService.resetUserPassword(userId, password);
            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Invite a new user via email
     */
    public inviteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            
            // Generate the setup-account link
            // In a real scenario, this might include a token
            const setupLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/setup-account?email=${encodeURIComponent(email)}`;
            
            const emailContent = `
                <h2>You have been invited!</h2>
                <p>You have been invited to join the Student Marketplace platform.</p>
                <p>Please click the link below to set up your account:</p>
                <a href="${setupLink}" style="padding: 10px 20px; background-color: #0f172b; color: white; text-decoration: none; border-radius: 8px;">Set Up Account</a>
                <p>If you cannot click the button, copy and paste this link: ${setupLink}</p>
            `;

            await this.emailSendingService.sendEmail({
                to: email,
                subject: 'Invitation to join Student Marketplace',
                html: emailContent,
                text: `You have been invited to join Student Marketplace. Set up your account here: ${setupLink}`
            });

            res.status(200).json({ message: 'Invitation sent successfully' });
        } catch (error) {
            next(error);
        }
    };
}

export default UserController;
