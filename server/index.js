import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Blog from "./models/Blog.js";
import { postSignup, postLogin } from "./controllers/user.js";
import { postBlogs, getBlogs, getBlogForSlug, patchPublishBlog, putBlogs } from "./controllers/blog.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ---- JWT MIDDLEWARE MUST BE ABOVE ROUTES ----
const jwtCheck = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired JWT token" });
  }
};

// ---- ROUTES ----
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server running..." });
});

app.get("/test-auth", jwtCheck, (req, res) => {
  res.json({ success: true, message: "JWT Verified!", user: req.user });
});

app.post("/signup", postSignup);
app.post("/login", postLogin);

app.get("/blogs", getBlogs);
app.get("/blogs/myposts", jwtCheck, async (req, res) => {
  const myPosts = await Blog.find({ author: req.user._id });
  res.json({ success: true, data: myPosts });
});
app.get("/blogs/:slug", getBlogForSlug);
app.post("/blogs", jwtCheck, postBlogs);
app.patch("/blogs/:slug/publish", jwtCheck, patchPublishBlog);
app.put("/blogs/:slug", jwtCheck, putBlogs);

// ---- CONNECT DB & START SERVER ----
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.listen(8080, () => console.log("Server running on port 8080"));
