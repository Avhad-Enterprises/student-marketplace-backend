import { NextFunction, Request, Response } from 'express';
import { CourseService } from '@/services/course.service';

export class CourseController {
    public courseService = new CourseService();

    public getAllCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const category = req.query.category as string;
            const student_visible = req.query.student_visible !== undefined ? req.query.student_visible === 'true' : undefined;
            const sort = req.query.sort as string;
            const order = req.query.order as string;

            const result = await this.courseService.findAll(page, limit, search, status, category, student_visible, sort, order);

            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };

    public getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const result = await this.courseService.findById(id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const courseData = req.body;
            const result = await this.courseService.create(courseData);

            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const courseData = req.body;
            const result = await this.courseService.update(id, courseData);

            if (!result) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    public deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const result = await this.courseService.delete(id);

            if (!result) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }

            res.status(200).json({ success: true, message: 'Course deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getCourseMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.courseService.getMetrics();
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };
}
