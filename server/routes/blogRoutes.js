import express from "express";
import {
  postBlogs, getBlogs, getBlogForSlug, patchPublishBlog, putBlogs, getMyPosts
} from "../controllers/blog.js";
import { jwtCheck } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getBlogs);
router.post("/", jwtCheck, postBlogs);
router.get("/myposts", jwtCheck, getMyPosts);
router.get("/:slug", getBlogForSlug);
router.patch("/:slug/publish", jwtCheck, patchPublishBlog);
router.put("/:slug", jwtCheck, putBlogs);

export default router;
