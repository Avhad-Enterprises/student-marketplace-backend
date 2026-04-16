import { Router } from "express";
import { LibraryItemController } from "@/controllers/libraryItem.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateLibraryItemDto, UpdateLibraryItemDto } from "@/dtos/libraryItem.dto";

export class LibraryItemRoute implements Route {
    public path = "/api/library-items";
    public router = Router();
    public libraryItemController = new LibraryItemController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all library item routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/", this.libraryItemController.getAllItems);
        this.router.get("/:id", this.libraryItemController.getItemById);

        // Administrative Actions (Admin only + Validation)
        this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateLibraryItemDto, 'body'), this.libraryItemController.createItem);
        this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateLibraryItemDto, 'body'), this.libraryItemController.updateItem);
        this.router.delete("/:id", roleMiddleware(['admin']), this.libraryItemController.deleteItem);
    }
}
