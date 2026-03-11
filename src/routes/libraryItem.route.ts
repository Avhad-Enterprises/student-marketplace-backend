import { Router } from "express";
import { LibraryItemController } from "@/controllers/libraryItem.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class LibraryItemRoute implements Route {
    public path = "/api/library-items";
    public router = Router();
    public libraryItemController = new LibraryItemController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        // GET all items
        this.router.get("/", this.libraryItemController.getAllItems);

        // GET item by id
        this.router.get("/:id", this.libraryItemController.getItemById);

        // POST create item
        this.router.post("/", this.libraryItemController.createItem);

        // PUT update item
        this.router.put("/:id", this.libraryItemController.updateItem);

        // DELETE item
        this.router.delete("/:id", this.libraryItemController.deleteItem);
    }
}
