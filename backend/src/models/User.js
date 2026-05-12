import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
    blocked: { type: Boolean, default: false },
    location: { type: String, trim: true },
    avatarUrl: String,
    preferences: {
      propertyType: String,
      sunlight: String,
      budgetRange: String,
      plantCareLevel: String
    },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
