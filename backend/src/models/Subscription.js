import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    planName: { type: String, required: true },
    planType: { type: String, enum: ["Monthly", "Quarterly", "Annual AMC"], default: "Monthly" },
    price: Number,
    status: { type: String, enum: ["Active", "Paused", "Expired", "Cancelled"], default: "Active" },
    startDate: Date,
    renewalDate: Date,
    includedVisits: Number,
    completedVisits: { type: Number, default: 0 },
    predictedNextMaintenance: Date
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
