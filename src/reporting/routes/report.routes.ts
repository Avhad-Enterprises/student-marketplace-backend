import { Router } from "express";
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

router.post("/run", runReport);

router.post("/export", exportReport);

router.get("/:id/export", exportReportById);

router.post("/", saveReport);

router.put("/:id", updateReport);

router.get("/", getReports);

router.get("/:id", getReportById);

export default router;