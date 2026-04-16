import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import roleMiddleware from "../../middlewares/role.middleware";
import {
    runReport,
    saveReport,
    exportReport,
    getReports,
    getReportById,
    updateReport,
    exportReportById,
} from "../controllers/report.controller";

const router = Router();

// Apply authMiddleware and roleMiddleware to all reporting routes
// Only admins are allowed to access the reporting module
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.post("/run", runReport);

router.post("/export", exportReport);

router.get("/:id/export", exportReportById);

router.post("/", saveReport);

router.put("/:id", updateReport);

router.get("/", getReports);

router.get("/:id", getReportById);

export default router;