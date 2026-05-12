import { Router } from "express";
import { assignRequest, createRequest, getRequests, updateStatus } from "../controllers/request.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/request", protect, createRequest);
router.get("/requests", protect, getRequests);
router.put("/assign-request/:id", protect, authorize("admin"), assignRequest);
router.put("/update-status/:id", protect, authorize("admin"), updateStatus);

export default router;
