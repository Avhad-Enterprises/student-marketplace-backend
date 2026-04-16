import { Request, Response, NextFunction } from "express";
import { BlogsService } from "@/services/blogs.service";

export class BlogController {
    private blogService = new BlogsService();

    // GET all blogs
    public getBlogs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const isAdmin = user?.user_type === 'admin' || user?.role === 'admin';
            const blogs = await this.blogService.findAll(isAdmin);
            res.json(blogs);
        } catch (err) {
            next(err);
        }
    };

    // GET single blog by ID
    public getBlogById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const isAdmin = user?.user_type === 'admin' || user?.role === 'admin';
            const blog = await this.blogService.findById(req.params.id, isAdmin);
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

    // POST import blogs
    public importBlogs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = Array.isArray(req.body) ? req.body : [req.body];
            const result = await this.blogService.import(data);
            
            if (result.failed === 0) {
                res.status(200).json({ 
                    message: `Successfully imported ${result.success} blogs`, 
                    ...result 
                });
            } else {
                res.status(207).json({ 
                    message: `Import partially completed: ${result.success} succeeded, ${result.failed} failed`, 
                    ...result 
                });
            }
        } catch (err) {
            next(err);
        }
    };
}
