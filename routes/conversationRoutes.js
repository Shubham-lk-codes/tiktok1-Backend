// routes/conversationRoutes.js
import express from 'express';
import { createConversation, getConversations } from '../controllers/conversationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createConversation);
router.get('/', protect, getConversations);

export default router;
