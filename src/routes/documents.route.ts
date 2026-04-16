import { Router } from "express";
import { DocumentController } from "@/controllers/documents.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateDocumentDto, UpdateDocumentDto } from "@/dtos/documents.dto";

export class DocumentRoute implements Route {
  public path = "/api/documents";
  public router = Router();
  public documentController = new DocumentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all document routes
    this.router.use(authMiddleware);

    // Publicly accessible by authenticated users (specific to the student)
    this.router.get("/:studentDbId", this.documentController.getDocumentsByStudentId);

    // Administrative Actions (Admin only + Validation)
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateDocumentDto, 'body'), this.documentController.createDocument);
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateDocumentDto, 'body'), this.documentController.updateDocument);
    this.router.delete("/:id", roleMiddleware(['admin']), this.documentController.deleteDocument);
  }
}
