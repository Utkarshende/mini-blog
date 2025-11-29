import express from "express";
import { getMyPosts, postBlogs, putBlogs, patchPublishBlog, getBlogForSlug } from "../controllers/blog.js";
import { jwtCheck } from "../middleware/auth.js";

const router = express.Router();

router.get("/myposts", jwtCheck, getMyPosts);
router.post("/", jwtCheck, postBlogs);
router.put("/:slug", jwtCheck, putBlogs);
router.patch("/:slug/publish", jwtCheck, patchPublishBlog);

router.get("/", getBlogs);
router.get("/:slug", getBlogForSlug); // No auth needed to read blog

export default router;
