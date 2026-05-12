import { Router } from "express";
import Subscription from "../models/Subscription.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    res.json(await Subscription.find(filter).populate("user", "name email").sort({ renewalDate: 1 }));
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    res.status(201).json(await Subscription.create(req.body));
  } catch (error) {
    next(error);
  }
});

export default router;
