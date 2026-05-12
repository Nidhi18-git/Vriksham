import Notification from "../models/Notification.js";
import ServiceRequest from "../models/ServiceRequest.js";
import { generateTrackingId } from "../utils/tracking.js";

export async function createRequest(req, res, next) {
  try {
    const request = await ServiceRequest.create({
      ...req.body,
      trackingId: generateTrackingId(),
      user: req.user?._id,
      imageUrl: req.body.imageUrl || req.file?.path
    });

    if (req.user?._id) {
      await Notification.create({
        user: req.user._id,
        title: "Request submitted",
        message: `Your Vriksham request ${request.trackingId} is pending review.`,
        type: "Request"
      });
    }

    res.status(201).json({ message: "Request submitted", request });
  } catch (error) {
    next(error);
  }
}

export async function getRequests(req, res, next) {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const requests = await ServiceRequest.find(filter)
      .populate("assignedGardener", "name phone rating specialties")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
}

export async function assignRequest(req, res, next) {
  try {
    const { gardenerId, nurseryPartner, priority, internalNotes } = req.body;
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      {
        assignedGardener: gardenerId,
        assignedNurseryPartner: nurseryPartner,
        priority,
        internalNotes,
        status: "Assigned"
      },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request assigned", request });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { status, maintenanceEntry } = req.body;
    const update = { status };

    if (maintenanceEntry) {
      update.$push = { maintenanceHistory: maintenanceEntry };
    }

    const request = await ServiceRequest.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ message: "Status updated", request });
  } catch (error) {
    next(error);
  }
}
