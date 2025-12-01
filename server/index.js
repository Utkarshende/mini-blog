import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { postSignup, postLogin } from "./controllers/user.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- Connect to DB ----
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB Error:", error);
  }
};

// ---- Test Route ----
app.get("/api", (req, res) =>
  res.json({ success: true, message: "Server is running..." })
);

// ---- Auth Routes ----
app.post("/api/signup", postSignup);
app.post("/api/login", postLogin);

// ---- Blog Routes (IMPORTANT FIX) ----
app.use("/api/blogs", blogRoutes);

// ---- Start Server ----
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
