import express from 'express';
import { postBlogs, getBlogs, getBlogForSlug, patchPublishBlog, putBlogs, getMyPosts } from '../controllers/blog.js';
import { jwtCheck } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogForSlug);
router.get('/myposts', jwtCheck, getMyPosts);
router.post('/', jwtCheck, postBlogs);
router.put('/:slug', jwtCheck, putBlogs);
router.patch('/:slug/publish', jwtCheck, patchPublishBlog);

export default router;
