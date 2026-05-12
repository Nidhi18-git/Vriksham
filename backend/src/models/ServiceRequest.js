import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    trackingId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    serviceType: { type: String, required: true },
    budgetRange: String,
    propertyType: String,
    preferredDate: Date,
    notes: String,
    imageUrl: String,
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Assigned", "In Progress", "Completed"],
      default: "Pending"
    },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    assignedGardener: { type: mongoose.Schema.Types.ObjectId, ref: "Gardener" },
    assignedNurseryPartner: String,
    maintenanceHistory: [
      {
        title: String,
        description: String,
        completedAt: Date,
        gardener: { type: mongoose.Schema.Types.ObjectId, ref: "Gardener" }
      }
    ],
    internalNotes: String
  },
  { timestamps: true }
);

export default mongoose.model("ServiceRequest", serviceRequestSchema);
