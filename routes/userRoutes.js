import express from 'express';
import { registerUser, loginUser,getUsers,uploadProfileImage } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';
import { uploadUserProfile } from '../middlewares/multerConfig.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.get('/', protect, getUsers);
  router.post('/uploadProfileImage', protect, uploadUserProfile.single('profileImage'), uploadProfileImage);
export default router;
