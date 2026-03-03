import { Router } from "express";
import { StudentController } from "@/controllers/students.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class StudentRoute implements Route {
  public path = "/api/students";
  public router = Router();
  public studentController = new StudentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all students and metrics
    this.router.get("/metrics", this.studentController.getMetrics);
    this.router.get("/", this.studentController.getAllStudents);

    // GET student by ID and profile completion
    this.router.get("/:id/profile-completion", this.studentController.getProfileCompletion);
    this.router.get("/:id", this.studentController.getStudentById);

    // POST create student
    this.router.post("/", this.studentController.createStudent);

    // PUT update student
    this.router.put("/:id", this.studentController.updateStudent);

    // DELETE student and dummy students
    this.router.delete("/delete/dummy", this.studentController.deleteDummyStudents);
    this.router.delete("/:id", this.studentController.deleteStudent);
  }
}
