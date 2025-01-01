// routes/messageRoutes.js
import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:conversationId', protect, getMessages);

export default router;