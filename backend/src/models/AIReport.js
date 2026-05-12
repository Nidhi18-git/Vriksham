import mongoose from "mongoose";

const aiReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest" },
    module: {
      type: String,
      enum: [
        "Disease Detection",
        "Plant Recommendation",
        "Garden Design",
        "Care Assistant",
        "Subscription Prediction",
        "Weather Alert",
        "Green Space Analytics",
        "IoT Health Monitoring"
      ],
      required: true
    },
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    confidence: Number,
    status: { type: String, enum: ["Queued", "Processed", "Failed"], default: "Queued" },
    modelVersion: { type: String, default: "placeholder-v1" }
  },
  { timestamps: true }
);

export default mongoose.model("AIReport", aiReportSchema);
