import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

function userPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    location: user.location
  };
}

export async function signup(req, res, next) {
  try {
    const { name, email, phone, password, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "user",
      location
    });

    res.status(201).json({ token: generateToken(user), user: userPayload(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.blocked) {
      return res.status(403).json({ message: "This account has been blocked" });
    }

    res.json({ token: generateToken(user), user: userPayload(user) });
  } catch (error) {
    next(error);
  }
}
