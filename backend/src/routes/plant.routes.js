import { Router } from "express";
import Plant from "../models/Plant.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await Plant.find().sort({ name: 1 }));
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    res.status(201).json(await Plant.create(req.body));
  } catch (error) {
    next(error);
  }
});

export default router;
