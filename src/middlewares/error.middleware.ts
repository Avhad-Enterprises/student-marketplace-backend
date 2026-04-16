import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { logger } from '../utils/logger';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
        const status: number = error.status || 500;
        const message: string = error.message || 'Something went wrong';

        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

        // Security: Mask internal error messages (500) in non-development environments
        const responseMessage = (status === 500 && process.env.NODE_ENV !== 'development') 
            ? 'Internal server error' 
            : message;

        const errorResponse: any = {
            success: false,
            error: {
                message: responseMessage,
                status,
            },
            timestamp: new Date().toISOString(),
            path: req.path,
            requestId: (req as any).id,
        };

        if (process.env.NODE_ENV === 'development') {
            errorResponse.error.stack = error.stack;
        }

        res.status(status).json(errorResponse);
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
