import { Request, Response, NextFunction } from "express";
import { StudentService } from "@/services/students.service";

export class StudentController {
  private studentService = new StudentService();

  // GET /api/students
  public getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, search, status, risk_level, sort = "created_at", order = "desc" } = req.query;
      
      const result = await this.studentService.findAll(
        Number(page),
        Number(limit),
        search as string,
        status as string,
        risk_level as string,
        sort as string,
        order as string
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/students/metrics
  public getMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await this.studentService.getMetrics();
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/students/:id
  public getStudentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const student = await this.studentService.findById(req.params.id);
      
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Ownership Validation: Admin bypass OR student_code match (case-insensitive)
      const isOwner = user?.student_code && student.student_id && 
                      user.student_code.toLowerCase() === student.student_id.toLowerCase();
      
      const isAdmin = user?.user_type === 'admin' || user?.role === 'admin';

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to access this student profile" });
      }

      res.json(student);
    } catch (err) {
      next(err);
    }
  };

  // POST /api/students
  public createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.studentService.create(req.body);
      res.status(201).json({
        id: result.id,
        student_id: result.student_id,
        message: "Student created",
      });
    } catch (err) {
      next(err);
    }
  };

  // PUT /api/students/:id
  public updateStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await this.studentService.update(req.params.id, req.body);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json({ message: "Student updated" });
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/students/:id
  public deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.studentService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json({ message: "Student deleted" });
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/students/delete/dummy
  public deleteDummyStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = await this.studentService.deleteDummy();
      res.json({ message: `Deleted ${count} dummy students` });
    } catch (err) {
      next(err);
    }
  };

  // GET /api/students/:id/profile-completion
  public getProfileCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const result = await this.studentService.getProfileCompletion(req.params.id);
      
      if (!result) {
        return res.status(404).json({ error: "Student not found" });
      }

      // We need the student record to check the student_id for ownership
      const student = await this.studentService.findById(req.params.id);
      
      // Ownership Validation: Admin bypass OR student_code match (case-insensitive)
      const isOwner = user?.student_code && student?.student_id && 
                      user.student_code.toLowerCase() === student.student_id.toLowerCase();

      const isAdmin = user?.user_type === 'admin' || user?.role === 'admin';

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to access this profile completion status" });
      }

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  public importStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      if (!Array.isArray(data)) {
        res.status(400).json({ message: 'Input data must be an array' });
        return;
      }
      const result = await this.studentService.importStudents(data);
      res.status(200).json({ data: result, message: 'importStudents' });
    } catch (err) {
      next(err);
    }
  };
}
