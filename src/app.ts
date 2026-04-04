import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import compression from "compression";
import path from "path";
import Routes from "./interfaces/routes.interface";
import errorMiddleware from "./middlewares/error.middleware";
import { logger, stream } from "./utils/logger";
import { v4 as uuidv4 } from 'uuid';
import reportRoutes from "./reporting/routes/report.routes";
import schemaRoutes from "./reporting/routes/schema.routes";

class App {
    public app: express.Application;
    public port: string | number;
    public env: string;

    constructor(routes: Routes[]) {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.env = process.env.NODE_ENV || "development";

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    public listen() {
        const server = this.app.listen(Number(this.port), "0.0.0.0", () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${this.env} =======`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info(`=================================`);
        });

        server.on('error', (error: any) => {
            logger.error('Server failed to start:', error);
            process.exit(1);
        });

        this.setupGracefulShutdown(server);
    }

    private setupGracefulShutdown(server: any) {
        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} signal received: closing HTTP server`);

            server.close(() => {
                logger.info('HTTP server closed');
                process.exit(0);
            });

            // Force close after 30 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        // Request ID
        this.app.use((req: any, res, next) => {
            req.id = uuidv4();
            res.setHeader('X-Request-ID', req.id);
            next();
        });

        if (this.env === "production") {
            this.app.use(morgan("combined", { stream }));
        } else {
            this.app.use(morgan("dev", { stream }));
        }

        // CORS - Restrict to allowed origins
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
        this.app.use(cors({
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    logger.warn(`CORS blocked origin: ${origin}`);
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
            maxAge: 86400, // Cache preflight requests for 24 hours
        }));

        this.app.use(hpp());
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                },
            },
        }));
        this.app.use(compression());
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ limit: '10mb', extended: true }));
        this.app.use(cookieParser());
    }



    private initializeRoutes(routes: Routes[]) {
        // Existing class-based routes
        routes.forEach((route) => {
            this.app.use(route.path || "/", route.router);
        });

        // External module routes
        this.app.use("/reports", reportRoutes);
        this.app.use("/schemas", schemaRoutes);
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;
