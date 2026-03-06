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

router.post('/', jwtCheck, postBlogs);

router.get('/myposts', jwtCheck, getMyPosts);

router.delete('/:slug', jwtCheck, deleteBlog);

router.put('/:slug', jwtCheck, putBlogs);

router.patch('/:slug/publish', jwtCheck, patchPublishBlog);

router.get('/:slug', getBlogForSlug);

export default router;
