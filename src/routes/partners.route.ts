import { Router } from "express";
import { PartnerController } from "@/controllers/partners.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class PartnerRoute implements Route {
  public path = "/api/partners";
  public router = Router();
  public partnerController = new PartnerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all partners for a student
    this.router.get("/:student_id", this.partnerController.getPartnersByStudentId);

    // POST create partner
    this.router.post("/", this.partnerController.createPartner);

    // PUT update partner
    this.router.put("/:id", this.partnerController.updatePartner);

    // DELETE partner
    this.router.delete("/:id", this.partnerController.deletePartner);
  }
}
