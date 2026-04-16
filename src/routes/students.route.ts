import { Router } from "express";
import { StudentController } from "@/controllers/students.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateStudentDto, UpdateStudentDto } from "@/dtos/students.dto";

export class StudentRoute implements Route {
  public path = "/api/students";
  public router = Router();
  public studentController = new StudentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all student routes
    this.router.use(authMiddleware);

    // GET all students and metrics (Admin only)
    this.router.get("/metrics", roleMiddleware(['admin']), this.studentController.getMetrics);
    this.router.get("/", roleMiddleware(['admin']), this.studentController.getAllStudents);

    // GET student by ID and profile completion
    this.router.get("/:id/profile-completion", this.studentController.getProfileCompletion);
    this.router.get("/:id", this.studentController.getStudentById);

    // POST create student (Admin only + Validation)
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateStudentDto, 'body'), this.studentController.createStudent);
    this.router.post("/import", roleMiddleware(['admin']), this.studentController.importStudents);

    // PUT update student (Admin only + Validation)
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateStudentDto, 'body'), this.studentController.updateStudent);

    // DELETE student and dummy students (Admin only)
    this.router.delete("/delete/dummy", roleMiddleware(['admin']), this.studentController.deleteDummyStudents);
    this.router.delete("/:id", roleMiddleware(['admin']), this.studentController.deleteStudent);
  }
}
