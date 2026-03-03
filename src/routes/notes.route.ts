import { Router } from "express";
import { NoteController } from "@/controllers/notes.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class NoteRoute implements Route {
  public path = "/api/notes";
  public router = Router();
  public noteController = new NoteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all notes for a student
    this.router.get("/:studentDbId", this.noteController.getNotesByStudentId);

    // POST create note
    this.router.post("/", this.noteController.createNote);

    // PUT update note and toggle pin (before :id routes)
    this.router.put("/:id/pin", this.noteController.togglePin);
    this.router.put("/:id", this.noteController.updateNote);

    // DELETE note
    this.router.delete("/:id", this.noteController.deleteNote);
  }
}
