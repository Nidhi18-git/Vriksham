import { Router } from "express";
import { getAnalytics, getManagementData } from "../controllers/admin.controller.js";
import { getAdminRequests, reviewAdminRequest, updateUserRole } from "../controllers/adminRequest.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/analytics", protect, authorize("admin", "superadmin"), getAnalytics);
router.get("/management", protect, authorize("admin", "superadmin"), getManagementData);
router.get("/admin-requests", protect, authorize("superadmin"), getAdminRequests);
router.put("/admin-requests/:id/review", protect, authorize("superadmin"), reviewAdminRequest);
router.put("/users/:id/role", protect, authorize("superadmin"), updateUserRole);

export default router;
