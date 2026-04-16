import { Router } from "express";
import { BankController } from "@/controllers/banks.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateBankDto, UpdateBankDto } from "@/dtos/banks.dto";

export class BankRoute implements Route {
    public path = "/api/banks";
    public router = Router();
    public bankController = new BankController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all bank routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/", this.bankController.getBanks);
        this.router.get("/metrics", this.bankController.getMetrics);
        this.router.get("/:id", this.bankController.getBankById);

        // Administrative & Provider Actions (+ Validation)
        this.router.post("/", roleMiddleware(['admin', 'provider']), validationMiddleware(CreateBankDto, 'body'), this.bankController.createBank);
        this.router.put("/:id", roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateBankDto, 'body'), this.bankController.updateBank);
        this.router.delete("/:id", roleMiddleware(['admin', 'provider']), this.bankController.deleteBank);
    }
}
