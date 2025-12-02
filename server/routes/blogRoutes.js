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

router.post('/', jwtCheck, postBlogs);

// 🔥 Add DELETE route here
router.delete('/:slug', jwtCheck, deleteBlog);

router.put('/:slug', jwtCheck, putBlogs);
router.patch('/:slug/publish', jwtCheck, patchPublishBlog);

router.get('/:slug', getBlogForSlug);

export default router;
