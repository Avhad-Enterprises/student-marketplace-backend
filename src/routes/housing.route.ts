import { Router } from "express";
import { HousingController } from "@/controllers/housing.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateHousingDto, UpdateHousingDto } from "@/dtos/housing.dto";

export class HousingRoute implements Route {
    public path = "/api/housing";
    public router = Router();
    public housingController = new HousingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all housing routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/", this.housingController.getAllHousing);
        this.router.get("/metrics", this.housingController.getHousingMetrics);
        this.router.get("/:id", this.housingController.getHousingById);

        // Administrative & Provider Actions (+ Validation)
        this.router.post("/", roleMiddleware(['admin', 'provider']), validationMiddleware(CreateHousingDto, 'body'), this.housingController.createHousing);
        this.router.put("/:id", roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateHousingDto, 'body'), this.housingController.updateHousing);
        this.router.delete("/:id", roleMiddleware(['admin', 'provider']), this.housingController.deleteHousing);
    }
}
