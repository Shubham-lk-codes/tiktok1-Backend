// routes/post.routes.js
import express from 'express';
import { createPost, getAllPosts, likePost, addComment,getPostsByUser } from '../controllers/post.controller.js';
import { protect } from '../middlewares/authMiddleware.js'; // Middleware for authentication
import { uploadPostImage } from '../middlewares/multerConfig.js';

const router = express.Router();

// Create a new post
router.post(
    '/',
    protect,
    uploadPostImage.single('image'),
    (req, res, next) => {
      // Log multer's result
      console.log("Multer processed req.file:", req.file);
      console.log("Multer processed req.body:", req.body);
      next();
    },
    createPost
  );
  
  
router.get('/getprop',protect,getPostsByUser )

// Get all posts
router.get('/', getAllPosts);

// Like or unlike a post
router.put('/:id/like', protect, likePost);

// Add a comment to a post
router.post('/:id/comment', protect, addComment);

export default router;
