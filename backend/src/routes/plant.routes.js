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

router.post("/", protect, authorize("admin", "superadmin"), async (req, res, next) => {
  try {
    res.status(201).json(await Plant.create(req.body));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, authorize("admin", "superadmin"), async (req, res, next) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protect, authorize("admin", "superadmin"), async (req, res, next) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json({ message: "Plant deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
