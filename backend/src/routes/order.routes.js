import { Router } from "express";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", createOrder);
router.get("/", protect, getOrders);
router.put("/:id/status", protect, authorize("admin", "superadmin"), updateOrderStatus);

export default router;
