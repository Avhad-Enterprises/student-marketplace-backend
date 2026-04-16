import { Router } from "express";
import { FoodController } from "@/controllers/food.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateFoodDto, UpdateFoodDto } from "@/dtos/food.dto";

export class FoodRoute implements Route {
    public path = "/api/food";
    public router = Router();
    public foodController = new FoodController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all food routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/", this.foodController.getAllFood);
        this.router.get("/metrics", this.foodController.getFoodMetrics);
        this.router.get("/:id", this.foodController.getFoodById);

        // Administrative & Provider Actions (+ Validation)
        this.router.post("/", roleMiddleware(['admin', 'provider']), validationMiddleware(CreateFoodDto, 'body'), this.foodController.createFood);
        this.router.put("/:id", roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateFoodDto, 'body'), this.foodController.updateFood);
        this.router.delete("/:id", roleMiddleware(['admin', 'provider']), this.foodController.deleteFood);
    }
}
