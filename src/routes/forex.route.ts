import { Router } from "express";
import { ForexController } from "@/controllers/forex.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateForexDto, UpdateForexDto } from "@/dtos/forex.dto";

export class ForexRoute implements Route {
    public path = "/api/forex";
    public router = Router();
    public forexController = new ForexController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all forex routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/", this.forexController.getAllForex);
        this.router.get("/metrics", this.forexController.getForexMetrics);
        this.router.get("/:id", this.forexController.getForexById);

        // Administrative & Provider Actions (+ Validation)
        this.router.post("/", roleMiddleware(['admin', 'provider']), validationMiddleware(CreateForexDto, 'body'), this.forexController.createForex);
        this.router.put("/:id", roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateForexDto, 'body'), this.forexController.updateForex);
        this.router.delete("/:id", roleMiddleware(['admin', 'provider']), this.forexController.deleteForex);
    }
}
