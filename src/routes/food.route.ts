import { Router } from "express";
import { FoodController } from "@/controllers/food.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class FoodRoute implements Route {
    public path = "/api/food";
    public router = Router();
    public foodController = new FoodController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        this.router.get("/", this.foodController.getAllFood);
        this.router.get("/metrics", this.foodController.getFoodMetrics);
        this.router.get("/:id", this.foodController.getFoodById);
        this.router.post("/", this.foodController.createFood);
        this.router.put("/:id", this.foodController.updateFood);
        this.router.delete("/:id", this.foodController.deleteFood);
    }
}
