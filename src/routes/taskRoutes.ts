import { Router } from "express";
import { authenticate } from "../middlewares/middleware";
import { createTask, updateTask, getTasks, getTaskStatistics } from "../controllers/taskController";

const router = Router();

router.post("/", authenticate, createTask);
router.put("/:id", authenticate, updateTask);
router.get("/", authenticate, getTasks);
router.get("/statistics", authenticate, getTaskStatistics);

export { router as taskRoutes };
