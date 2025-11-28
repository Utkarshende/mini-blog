import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();
const app = express();

// --------- Security Middlewares ---------
app.use(helmet()); // Security headers
app.use(compression()); // Reduce payload size

// Rate limiting (prevent spam & brute forcing)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: "Too many requests. Try again later."
});
app.use(limiter);

// --------- CORS Configuration ---------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// --------- Body parsing ---------
app.use(express.json());

// --------- Logging ---------
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// --------- Routes ---------
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => res.json({ success: true, message: "Server running" }));

// --------- 404 Not Found ---------
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// --------- Global Error Handler ---------
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --------- Server + DB Startup ---------
const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("📌 MongoDB Connected");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

start();
