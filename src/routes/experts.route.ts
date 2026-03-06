import { Router } from "express";
import { ExpertController } from "@/controllers/experts.controller";
import Routes from "@/interfaces/routes.interface";

export class ExpertRoute implements Routes {
    public path = "/api/experts";
    public router = Router();
    public expertController = new ExpertController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/`, this.expertController.getExperts);
        this.router.get(`/:id`, this.expertController.getExpertById);
        this.router.post(`/`, this.expertController.createExpert);
        this.router.put(`/:id`, this.expertController.updateExpert);
        this.router.delete(`/:id`, this.expertController.deleteExpert);
    }
}
