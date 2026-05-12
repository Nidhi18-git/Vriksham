import { Router } from "express";
import Gardener from "../models/Gardener.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, authorize("admin", "superadmin"), async (_req, res, next) => {
  try {
    res.json(await Gardener.find().sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, authorize("admin", "superadmin"), async (req, res, next) => {
  try {
    res.status(201).json(await Gardener.create(req.body));
  } catch (error) {
    next(error);
  }
});

export default router;
