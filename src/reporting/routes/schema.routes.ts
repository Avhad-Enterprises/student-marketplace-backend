import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import roleMiddleware from "../../middlewares/role.middleware";
import {
    getTables,
    getFields,
} from "../controllers/schema.controller";

const router = Router();

// Apply authMiddleware and roleMiddleware to all schema discovery routes
router.use(authMiddleware, roleMiddleware(['admin']));

router.get("/tables", getTables);

router.get("/fields", getFields);

export default router;