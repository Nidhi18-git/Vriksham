import Gardener from "../models/Gardener.js";
import AIReport from "../models/AIReport.js";
import Order from "../models/Order.js";
import Plant from "../models/Plant.js";
import ServiceRequest from "../models/ServiceRequest.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

export async function getAnalytics(_req, res, next) {
  try {
    const [totalUsers, activeRequests, activeSubscriptions, completedRequests, gardeners, shopOrders] = await Promise.all([
      User.countDocuments({ role: "user" }),
      ServiceRequest.countDocuments({ status: { $in: ["Pending", "Under Review", "Assigned", "In Progress"] } }),
      Subscription.countDocuments({ status: "Active" }),
      ServiceRequest.countDocuments({ status: "Completed" }),
      Gardener.countDocuments({ status: { $ne: "Inactive" } }),
      Order.countDocuments({ fulfillmentStatus: { $ne: "Cancelled" } })
    ]);

    const revenue = await Subscription.aggregate([
      { $match: { status: "Active" } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const shopRevenue = await Order.aggregate([
      { $match: { fulfillmentStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const byStatus = await ServiceRequest.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

    res.json({
      totalUsers,
      activeRequests,
      monthlyRevenue: revenue[0]?.total || 0,
      shopRevenue: shopRevenue[0]?.total || 0,
      activeSubscriptions,
      completedRequests,
      gardeners,
      shopOrders,
      serviceCompletionRate:
        activeRequests + completedRequests === 0
          ? 0
          : Math.round((completedRequests / (activeRequests + completedRequests)) * 100),
      requestsByStatus: byStatus
    });
  } catch (error) {
    next(error);
  }
}

export async function getManagementData(_req, res, next) {
  try {
    const [requests, orders, users, plants, gardeners, aiReports] = await Promise.all([
      ServiceRequest.find().populate("assignedGardener", "name").sort({ createdAt: -1 }).limit(50),
      Order.find().sort({ createdAt: -1 }).limit(50),
      User.find().select("-password").sort({ createdAt: -1 }).limit(50),
      Plant.find().sort({ createdAt: -1 }).limit(50),
      Gardener.find().sort({ createdAt: -1 }).limit(50),
      AIReport.find().populate("user", "name email").sort({ createdAt: -1 }).limit(50)
    ]);

    res.json({ requests, orders, users, plants, gardeners, aiReports });
  } catch (error) {
    next(error);
  }
}
