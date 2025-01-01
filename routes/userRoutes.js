import express from 'express';
import {
  registerUser, loginUser, getUsers, uploadProfileImage, followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserProfile,
  searchUsers
} from '../controllers/userController.js';
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
router.get('/search', protect, searchUsers);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);


// Get followers of a user
router.get('/:id/followers', protect, getFollowers);

// Get users a user is following
router.get('/:id/following', protect, getFollowing);
router.get('/:id', protect, getUserProfile);

export default router;
