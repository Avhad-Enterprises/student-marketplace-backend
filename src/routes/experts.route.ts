import { Router } from "express";
import { ExpertController } from "@/controllers/experts.controller";
import Routes from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateExpertDto, UpdateExpertDto } from "@/dtos/experts.dto";

export class ExpertRoute implements Routes {
    public path = "/api/experts";
    public router = Router();
    public expertController = new ExpertController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all expert routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get(`/`, this.expertController.getExperts);
        this.router.get(`/:id`, this.expertController.getExpertById);

        // Administrative Actions (Admin only + Validation)
        this.router.post(`/`, roleMiddleware(['admin']), validationMiddleware(CreateExpertDto, 'body'), this.expertController.createExpert);
        this.router.post(`/import`, roleMiddleware(['admin']), this.expertController.importExperts);
        this.router.put(`/:id`, roleMiddleware(['admin']), validationMiddleware(UpdateExpertDto, 'body'), this.expertController.updateExpert);
        this.router.delete(`/:id`, roleMiddleware(['admin']), this.expertController.deleteExpert);
    }
}
