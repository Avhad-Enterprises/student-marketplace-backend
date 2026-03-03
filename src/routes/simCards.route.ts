import { Router } from "express";
import { SimCardController } from "@/controllers/simCards.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class SimCardRoute implements Route {
    public path = "/api/sim-cards";
    public router = Router();
    public simCardController = new SimCardController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        this.router.get("/", this.simCardController.getSimCards);
        this.router.get("/metrics", this.simCardController.getMetrics);
        this.router.get("/:id", this.simCardController.getSimCardById);
        this.router.post("/", this.simCardController.createSimCard);
        this.router.put("/:id", this.simCardController.updateSimCard);
        this.router.delete("/:id", this.simCardController.deleteSimCard);
    }
}
