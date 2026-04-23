import { Router } from "express";
import { DocumentController } from "@/controllers/documents.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateDocumentDto, UpdateDocumentDto } from "@/dtos/documents.dto";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

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

    // Specific routes first
    this.router.post("/upload", upload.single("file"), this.documentController.uploadDocument);
    this.router.get("/fetch/:id", this.documentController.getDocumentUrl);

    // Parameterized routes next
    this.router.get("/:studentDbId", this.documentController.getDocumentsByStudentId);

    // Administrative Actions (Admin only + Validation)
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateDocumentDto, 'body'), this.documentController.createDocument);
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateDocumentDto, 'body'), this.documentController.updateDocument);
    this.router.delete("/:id", roleMiddleware(['admin']), this.documentController.deleteDocument);
  }
}
