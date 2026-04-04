import { Router } from "express";
import {
    getTables,
    getFields,
} from "../controllers/schema.controller";

const router = Router();

router.get("/tables", getTables);

router.get("/fields", getFields);

export default router;