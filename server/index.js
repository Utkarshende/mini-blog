import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Controllers
import { postSignup, postLogin } from "./controllers/user.js";
import {
  getBlogs,
  getBlogForSlug,
  postBlogs,
  putBlogs,
  patchPublishBlog,
  getMyPosts,
} from "./controllers/blog.js";

// Middleware
const jwtCheck = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // frontend expects req.user
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired JWT token" });
  }
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ---------------- API ROUTES ----------------

// Test server
app.get("/api", (req, res) =>
  res.json({ success: true, message: "Server is running..." })
);

// Auth routes
app.post("/api/signup", postSignup);
app.post("/api/login", postLogin);

// Blog routes
app.get("/api/blogs", getBlogs);
app.get("/api/blogs/:slug", getBlogForSlug);

// Protected blog routes
app.post("/api/blogs", jwtCheck, postBlogs);
app.put("/api/blogs/:slug", jwtCheck, putBlogs);
app.patch("/api/blogs/:slug/publish", jwtCheck, patchPublishBlog);
app.get("/api/blogs/myposts", jwtCheck, getMyPosts);

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
