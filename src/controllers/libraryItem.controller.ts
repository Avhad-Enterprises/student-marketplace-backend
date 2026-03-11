import { Request, Response, NextFunction } from "express";
import { LibraryItemService } from "@/services/libraryItem.service";

export class LibraryItemController {
    private libraryItemService = new LibraryItemService();

    public getAllItems = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const items = await this.libraryItemService.findAll();
            res.json(items);
        } catch (err) {
            next(err);
        }
    };

    public getItemById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const item = await this.libraryItemService.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ error: "Library item not found" });
            }
            res.json(item);
        } catch (err) {
            next(err);
        }
    };

    public createItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const item = await this.libraryItemService.create(req.body);
            res.status(201).json(item);
        } catch (err) {
            next(err);
        }
    };

    public updateItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const item = await this.libraryItemService.update(req.params.id, req.body);
            if (!item) {
                return res.status(404).json({ error: "Library item not found" });
            }
            res.json(item);
        } catch (err) {
            next(err);
        }
    };

    public deleteItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deleted = await this.libraryItemService.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Library item not found" });
            }
            res.json({ message: "Library item deleted successfully" });
        } catch (err) {
            next(err);
        }
    };
}
