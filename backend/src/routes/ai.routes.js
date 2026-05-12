import { Router } from "express";
import { createAIReport } from "../controllers/ai.controller.js";

const router = Router();

router.post("/:module", createAIReport);

export default router;
