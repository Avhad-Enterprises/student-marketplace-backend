import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface';
import DB from '@/database';
import { logger } from '@/utils/logger';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header('Authorization');
        const Authorization = (req.cookies && req.cookies['Authorization']) || (authHeader ? authHeader.split('Bearer ')[1] : null);

        if (Authorization) {
            const secretKey = process.env.JWT_SECRET || 'secretKey';
            
            // Log warning if fallback is used in production (silent in dev)
            if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
                logger.warn('WARNING: JWT_SECRET environment variable is missing. Using insecure fallback.');
            }

            const verificationResponse = (await jwt.verify(Authorization, secretKey)) as DataStoredInToken;
            const userId = verificationResponse.id;

            const findUser = await DB('users').where({ id: userId }).first();

            if (findUser) {
                req.user = findUser;
                next();
            } else {
                next(new HttpException(401, 'Wrong authentication token'));
            }
        } else {
            next(new HttpException(401, 'Authentication token missing'));
        }
    } catch (error) {
        next(new HttpException(401, 'Wrong authentication token'));
    }
};

export default authMiddleware;
