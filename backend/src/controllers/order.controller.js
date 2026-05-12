import Notification from "../models/Notification.js";
import Order from "../models/Order.js";

function generateOrderId() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VRK-ORDER-${stamp}-${random}`;
}

export async function createOrder(req, res, next) {
  try {
    const { name, phone, email, deliveryAddress, items, totalAmount, paymentMethod, notes } = req.body;

    if (!name || !phone || !email || !deliveryAddress || !items?.length) {
      return res.status(400).json({ message: "Customer details and at least one item are required" });
    }

    const calculatedTotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const order = await Order.create({
      orderId: generateOrderId(),
      user: req.user?._id,
      name,
      phone,
      email,
      deliveryAddress,
      items,
      totalAmount: totalAmount || calculatedTotal,
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Pending",
      checkoutStatus: "Order Confirmed",
      notes
    });

    if (req.user?._id) {
      await Notification.create({
        user: req.user._id,
        title: "Plant order placed",
        message: `Your Vriksham shop order ${order.orderId} has been placed.`,
        type: "System"
      });
    }

    res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        fulfillmentStatus: req.body.fulfillmentStatus,
        paymentStatus: req.body.paymentStatus
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order updated", order });
  } catch (error) {
    next(error);
  }
}
