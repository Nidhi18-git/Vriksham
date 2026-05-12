import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: String,
    name: { type: String, required: true },
    productType: { type: String, enum: ["Indoor Plant", "Outdoor Plant", "Air Purifying Plant", "Corporate Plant", "Flowering Plant", "Flower", "Flowers", "Bouquet"], default: "Indoor Plant" },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    deliveryAddress: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash on Delivery", "UPI", "Card", "Net Banking"], default: "Cash on Delivery" },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
    checkoutStatus: { type: String, enum: ["Cart", "Details Added", "Payment Selected", "Order Confirmed"], default: "Order Confirmed" },
    fulfillmentStatus: { type: String, enum: ["Placed", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"], default: "Placed" },
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
