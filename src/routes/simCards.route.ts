import { Router } from "express";
import { SimCardController } from "@/controllers/simCards.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateSimCardDto, UpdateSimCardDto } from "@/dtos/simCards.dto";

export class SimCardRoute implements Route {
    public path = "/api/sim-cards";
    public router = Router();
    public simCardController = new SimCardController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all SIM card routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/", this.simCardController.getSimCards);
        this.router.get("/metrics", this.simCardController.getMetrics);
        this.router.get("/:id", this.simCardController.getSimCardById);

        // Administrative & Provider Actions (+ Validation)
        this.router.post("/", roleMiddleware(['admin', 'provider']), validationMiddleware(CreateSimCardDto, 'body'), this.simCardController.createSimCard);
        this.router.put("/:id", roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateSimCardDto, 'body'), this.simCardController.updateSimCard);
        this.router.delete("/:id", roleMiddleware(['admin', 'provider']), this.simCardController.deleteSimCard);
    }
}
