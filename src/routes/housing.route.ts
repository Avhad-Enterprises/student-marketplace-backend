import { Router } from "express";
import { HousingController } from "@/controllers/housing.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class HousingRoute implements Route {
    public path = "/api/housing";
    public router = Router();
    public housingController = new HousingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        this.router.get("/", this.housingController.getAllHousing);
        this.router.get("/metrics", this.housingController.getHousingMetrics);
        this.router.get("/:id", this.housingController.getHousingById);
        this.router.post("/", this.housingController.createHousing);
        this.router.put("/:id", this.housingController.updateHousing);
        this.router.delete("/:id", this.housingController.deleteHousing);
    }
}
