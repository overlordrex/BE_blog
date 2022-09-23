import express from 'express';
import {
  subscribe,
  addPost,
  addView,
  deletePost,
  getPost,
  getPosts,
  search,
  tags,
  trending,
  updatePost,
} from '../controllers/post.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, addPost);
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyToken, deletePost);
router.get('/find/:id', getPost);
router.put('/view/:id', addView);
router.get('/trend', trending);
router.get('/random', getPosts);
router.get('/tags', tags);
router.get('/search', search);
router.get('/sub', verifyToken, subscribe);

export default router;
