import { Request, Response, NextFunction } from "express";
import { NoteService } from "@/services/notes.service";

export class NoteController {
  private noteService = new NoteService();

  // GET all notes for a student
  public getNotesByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notes = await this.noteService.findByStudentId(req.params.studentDbId);
      res.json(notes);
    } catch (err) {
      next(err);
    }
  };

  // POST create note
  public createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const note = await this.noteService.create(req.body);
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  };

  // PUT update note
  public updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const note = await this.noteService.update(req.params.id, req.body);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    } catch (err) {
      next(err);
    }
  };

  // PUT toggle pin status
  public togglePin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const note = await this.noteService.togglePin(req.params.id);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    } catch (err) {
      next(err);
    }
  };

  // DELETE note
  public deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.noteService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json({ message: "Note deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}
