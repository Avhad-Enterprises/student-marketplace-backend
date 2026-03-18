import { NextFunction, Request, Response } from 'express';
import { LoginUserDto } from '../dtos/users.dto';
import AuthService from '../services/auth.service';
import { User } from '../interfaces/users.interface';
import { RequestWithUser } from '../interfaces/auth.interface';

class AuthController {
    public authService = new AuthService();

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: LoginUserDto = req.body;
            const { cookie, findUser, token } = await this.authService.login(userData);

            res.setHeader('Set-Cookie', [cookie]);
            res.status(200).json({ data: findUser, token: token, message: 'login' });
        } catch (error) {
            next(error);
        }
    };

    public changePassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            await this.authService.changePassword(userId, currentPassword, newPassword);

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            next(error);
        }
    };
}

export default AuthController;
