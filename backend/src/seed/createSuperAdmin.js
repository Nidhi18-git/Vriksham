import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

async function createSuperAdmin() {
  await connectDB();

  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME || "Vriksham Owner";

  if (!email || !password) {
    throw new Error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (user) {
    user.role = "superadmin";
    if (password) user.password = password;
    user.name = user.name || name;
    await user.save();
    console.log(`Updated ${email} as superadmin`);
  } else {
    await User.create({ name, email, password, role: "superadmin" });
    console.log(`Created ${email} as superadmin`);
  }

  process.exit(0);
}

createSuperAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
