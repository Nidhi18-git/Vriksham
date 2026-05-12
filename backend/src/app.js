import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import requestRoutes from "./routes/request.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import gardenerRoutes from "./routes/gardener.routes.js";
import orderRoutes from "./routes/order.routes.js";
import plantRoutes from "./routes/plant.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", platform: "Vriksham", timestamp: new Date().toISOString() });
});

app.use("/api", authRoutes);
app.use("/api", requestRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/gardeners", gardenerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
