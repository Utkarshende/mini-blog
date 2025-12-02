import express from 'express';
import { 
  postBlogs, 
  getBlogs, 
  getBlogForSlug, 
  patchPublishBlog, 
  putBlogs, 
  getMyPosts,
  deleteBlog
} from '../controllers/blog.js';
import { jwtCheck } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/myposts', jwtCheck, getMyPosts);

// 🔥 DELETE must come BEFORE :slug route
router.delete('/:slug', jwtCheck, deleteBlog);

// edit route
router.put('/:slug', jwtCheck, putBlogs);

// publish route
router.patch('/:slug/publish', jwtCheck, patchPublishBlog);

// 🔥 keep this LAST always:
router.get('/:slug', getBlogForSlug);

export default router;
