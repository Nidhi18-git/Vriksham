import { Router } from "express";
import { createAdminRequest, getMyAdminRequests } from "../controllers/adminRequest.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createAdminRequest);
router.get("/mine", protect, getMyAdminRequests);

export default router;
