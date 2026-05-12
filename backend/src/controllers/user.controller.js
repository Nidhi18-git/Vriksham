import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import ServiceRequest from "../models/ServiceRequest.js";
import User from "../models/User.js";

export async function getProfile(req, res, next) {
  try {
    const requests = await ServiceRequest.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(15);
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);

    res.json({ user: req.user, requests, notifications, orders });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const allowed = ["name", "phone", "location", "avatarUrl", "preferences"];
    const updates = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json({ message: "Profile updated", user });
  } catch (error) {
    next(error);
  }
}
