import { Router } from "express";
import { getAnalytics, getManagementData } from "../controllers/admin.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/analytics", protect, authorize("admin"), getAnalytics);
router.get("/management", protect, authorize("admin"), getManagementData);

export default router;
