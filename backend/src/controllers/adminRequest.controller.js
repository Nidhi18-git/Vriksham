import AdminRequest from "../models/AdminRequest.js";
import User from "../models/User.js";
import { sendAdminAccessRequestEmail } from "../services/email.service.js";

export async function createAdminRequest(req, res, next) {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({ message: "Please provide a clear reason with at least 10 characters" });
    }

    if (req.user.role !== "user") {
      return res.status(400).json({ message: "Only normal users can request admin access" });
    }

    const existing = await AdminRequest.findOne({ user: req.user._id, status: "pending" });
    if (existing) {
      return res.status(409).json({ message: "You already have a pending admin access request" });
    }

    const request = await AdminRequest.create({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      reason: reason.trim()
    });

    await sendAdminAccessRequestEmail({ name: req.user.name, email: req.user.email, reason });
    res.status(201).json({ message: "Admin access request submitted", request });
  } catch (error) {
    next(error);
  }
}

export async function getMyAdminRequests(req, res, next) {
  try {
    const requests = await AdminRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
}

export async function getAdminRequests(_req, res, next) {
  try {
    const requests = await AdminRequest.find().populate("user", "name email role").sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
}

export async function reviewAdminRequest(req, res, next) {
  try {
    const { status, reviewNote } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const request = await AdminRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Admin request not found" });
    if (request.status !== "pending") return res.status(400).json({ message: "This request is already reviewed" });

    request.status = status;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    request.reviewNote = reviewNote;
    await request.save();

    if (status === "approved") {
      await User.findByIdAndUpdate(request.user, { role: "admin" });
    }

    const populated = await request.populate("user", "name email role");
    res.json({ message: `Request ${status}`, request: populated });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { role, blocked } = req.body;
    const updates = {};

    if (role && ["user", "admin", "superadmin"].includes(role)) updates.role = role;
    if (blocked !== undefined) updates.blocked = Boolean(blocked);

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user });
  } catch (error) {
    next(error);
  }
}
