import { Router } from "express";
import { NoteController } from "@/controllers/notes.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateNoteDto, UpdateNoteDto } from "@/dtos/notes.dto";

export class NoteRoute implements Route {
  public path = "/api/notes";
  public router = Router();
  public noteController = new NoteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all note routes
    this.router.use(authMiddleware);

    // Publicly accessible by authenticated users (specific to the student)
    this.router.get("/:studentDbId", this.noteController.getNotesByStudentId);

    // Administrative Actions (Admin only + Validation)
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateNoteDto, 'body'), this.noteController.createNote);
    this.router.put("/:id/pin", roleMiddleware(['admin']), this.noteController.togglePin);
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateNoteDto, 'body'), this.noteController.updateNote);
    this.router.delete("/:id", roleMiddleware(['admin']), this.noteController.deleteNote);
  }
}
