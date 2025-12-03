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

// List blogs
router.get('/', getBlogs);

// Create blog (🔥 this was missing)
router.post('/', jwtCheck, postBlogs);

router.get('/myposts', jwtCheck, getMyPosts);

router.delete('/:slug', jwtCheck, deleteBlog);

// edit route
router.put('/:slug', jwtCheck, putBlogs);

// publish route
router.patch('/:slug/publish', jwtCheck, patchPublishBlog);

// keep last always:
router.get('/:slug', getBlogForSlug);

export default router;
