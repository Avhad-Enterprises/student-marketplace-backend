import { Request, Response, NextFunction } from "express";
import { BlogsService } from "@/services/blogs.service";

export class BlogController {
    private blogService = new BlogsService();

    // GET all blogs
    public getBlogs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blogs = await this.blogService.findAll();
            res.json(blogs);
        } catch (err) {
            next(err);
        }
    };

    // GET single blog by ID
    public getBlogById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blog = await this.blogService.findById(req.params.id);
            if (!blog) {
                return res.status(404).json({ error: "Blog not found" });
            }
            res.json(blog);
        } catch (err) {
            next(err);
        }
    };

    // POST create blog
    public createBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blog = await this.blogService.create(req.body);
            res.status(201).json(blog);
        } catch (err) {
            next(err);
        }
    };

    // PUT update blog
    public updateBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blog = await this.blogService.update(req.params.id, req.body);
            if (!blog) {
                return res.status(404).json({ error: "Blog not found" });
            }
            res.json(blog);
        } catch (err) {
            next(err);
        }
    };

    // DELETE blog
    public deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deleted = await this.blogService.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Blog not found" });
            }
            res.json({ message: "Blog deleted successfully" });
        } catch (err) {
            next(err);
        }
    };
}
