import { Router } from "express";
import { BankController } from "@/controllers/banks.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class BankRoute implements Route {
    public path = "/api/banks";
    public router = Router();
    public bankController = new BankController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        this.router.get("/", this.bankController.getBanks);
        this.router.get("/metrics", this.bankController.getMetrics);
        this.router.get("/:id", this.bankController.getBankById);
        this.router.post("/", this.bankController.createBank);
        this.router.put("/:id", this.bankController.updateBank);
        this.router.delete("/:id", this.bankController.deleteBank);
    }
}
