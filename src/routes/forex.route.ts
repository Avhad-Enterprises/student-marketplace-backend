import { Router } from "express";
import { ForexController } from "@/controllers/forex.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class ForexRoute implements Route {
    public path = "/api/forex";
    public router = Router();
    public forexController = new ForexController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        this.router.get("/", this.forexController.getAllForex);
        this.router.get("/metrics", this.forexController.getForexMetrics);
        this.router.get("/:id", this.forexController.getForexById);
        this.router.post("/", this.forexController.createForex);
        this.router.put("/:id", this.forexController.updateForex);
        this.router.delete("/:id", this.forexController.deleteForex);
    }
}
