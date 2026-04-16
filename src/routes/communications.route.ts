import { Router } from "express";
import { CommunicationController } from "@/controllers/communications.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateCommunicationDto, UpdateCommunicationDto } from "@/dtos/communications.dto";

export class CommunicationRoute implements Route {
  public path = "/api/communications";
  public router = Router();
  public communicationController = new CommunicationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all communication routes
    this.router.use(authMiddleware);

    // Publicly accessible by authenticated users (specific to the student)
    this.router.get("/:student_id", this.communicationController.getCommunicationsByStudentId);
    this.router.get("/detail/:id", this.communicationController.getCommunicationById);

    // Administrative Actions (Admin only + Validation)
    this.router.get("/", roleMiddleware(['admin']), this.communicationController.getCommunications);
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateCommunicationDto, 'body'), this.communicationController.createCommunication);
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateCommunicationDto, 'body'), this.communicationController.updateCommunication);
    this.router.delete("/:id", roleMiddleware(['admin']), this.communicationController.deleteCommunication);
  }
}
