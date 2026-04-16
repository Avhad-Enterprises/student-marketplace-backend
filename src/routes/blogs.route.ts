import { Router } from "express";
import { BlogController } from "@/controllers/blogs.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateBlogDto, UpdateBlogDto } from "@/dtos/blogs.dto";

export class BlogRoute implements Route {
    public path = "/api/blogs";
    public router = Router();
    public blogController = new BlogController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all blog routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/", this.blogController.getBlogs);
        this.router.get("/:id", this.blogController.getBlogById);

        // Administrative Actions (Admin only + Validation)
        this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateBlogDto, 'body'), this.blogController.createBlog);
        this.router.post("/import", roleMiddleware(['admin']), this.blogController.importBlogs);
        this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateBlogDto, 'body'), this.blogController.updateBlog);
        this.router.delete("/:id", roleMiddleware(['admin']), this.blogController.deleteBlog);
    }
}
