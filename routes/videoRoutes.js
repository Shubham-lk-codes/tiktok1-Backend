import express from 'express';
import {
  uploadVideo,
  getVideos,
  searchVideos,
  commentOnVideo,
  rateVideo,
  deleteVideo
} from '../controllers/videoController.js';
import { protect } from '../middlewares/authMiddleware.js';
import {upload} from '../middlewares/multerConfig.js';

const router = express.Router();

// Video routes
router.post('/upload', protect, upload.single('video'), uploadVideo);
// For creators
router.get('/', getVideos); // For all users
router.get('/search', searchVideos); // Search videos
router.post('/:videoId/comment', protect, commentOnVideo); // Comment on video
router.post('/:videoId/rate', protect, rateVideo); // Rate a video
router.delete('/:videoId', protect, deleteVideo);


export default router;
