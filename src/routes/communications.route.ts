import { Router } from "express";
import { CommunicationController } from "@/controllers/communications.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class CommunicationRoute implements Route {
  public path = "/api/communications";
  public router = Router();
  public communicationController = new CommunicationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all communications for a student
    this.router.get("/:student_id", this.communicationController.getCommunicationsByStudentId);

    // POST create communication
    this.router.post("/", this.communicationController.createCommunication);

    // PUT update communication
    this.router.put("/:id", this.communicationController.updateCommunication);

    // DELETE communication
    this.router.delete("/:id", this.communicationController.deleteCommunication);
  }
}
