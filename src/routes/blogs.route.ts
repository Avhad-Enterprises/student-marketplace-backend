import { Router } from "express";
import { BlogController } from "@/controllers/blogs.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class BlogRoute implements Route {
    public path = "/api/blogs";
    public router = Router();
    public blogController = new BlogController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        // GET all blogs
        this.router.get("/", this.blogController.getBlogs);

        // GET single blog by ID
        this.router.get("/:id", this.blogController.getBlogById);

        // POST create blog
        this.router.post("/", this.blogController.createBlog);

        // PUT update blog
        this.router.put("/:id", this.blogController.updateBlog);

        // DELETE blog
        this.router.delete("/:id", this.blogController.deleteBlog);
    }
}
