import { NextFunction, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { RequestWithUser } from '../interfaces/auth.interface';

/**
 * Middleware to check if the user has one of the allowed roles (user_type).
 * Should be used AFTER authMiddleware.
 * 
 * @param allowedRoles Array of user_type values that are permitted (e.g. ['admin', 'staff'])
 */
const roleMiddleware = (allowedRoles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (req.user && allowedRoles.includes(req.user.user_type)) {
        next();
      } else {
        next(new HttpException(403, 'Access denied: insufficient permissions'));
      }
    } catch (error) {
      next(new HttpException(403, 'Access denied: authorization error'));
    }
  };
};

export default roleMiddleware;
