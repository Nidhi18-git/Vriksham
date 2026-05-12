import mongoose from "mongoose";

const adminRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    reason: { type: String, required: true, minlength: 10 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
    reviewNote: String
  },
  { timestamps: true }
);

adminRequestSchema.index({ user: 1, status: 1 });

export default mongoose.model("AdminRequest", adminRequestSchema);
