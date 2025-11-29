import express from "express";
import {
  postBlogs, 
  getBlogs,
   getBlogForSlug,
    patchPublishBlog, 
    putBlogs, 
    getMyPosts
} from "../controllers/blog.js";
import {jwtCheck} from "../middleware/auth.js";

const router = express.Router();

router.get("/myposts", jwtCheck, getMyPosts);
router.post("/", jwtCheck, postBlogs);
router.patch("/:slug/publish", jwtCheck, patchPublishBlog);
router.put("/:slug", jwtCheck, putBlogs);

router.get("/", getBlogs);
router.get("/:slug", getBlogForSlug);

export default router;
