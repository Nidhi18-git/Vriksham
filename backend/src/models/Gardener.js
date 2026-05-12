import mongoose from "mongoose";

const gardenerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: String,
    serviceZones: [String],
    specialties: [String],
    rating: { type: Number, default: 4.7 },
    completedJobs: { type: Number, default: 0 },
    activeJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest" }],
    status: { type: String, enum: ["Available", "Assigned", "Inactive"], default: "Available" }
  },
  { timestamps: true }
);

export default mongoose.model("Gardener", gardenerSchema);
