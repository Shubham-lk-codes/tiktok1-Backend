import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import mongoose from 'mongoose';

// Register user
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload user profile image
export const uploadProfileImage = async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    console.log(file);  // Log the uploaded file to inspect the response

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Assuming file.path contains the Cloudinary URL for the uploaded image
    user.profileImage = file.path;  // or file.secure_url if you prefer the HTTPS URL
    await user.save();

    res.status(200).json({ message: 'Profile image uploaded', profileImage: user.profileImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




export const followUser = async (req, res) => {
  const { id: targetUserId, action } = req.params; // Extract user ID and action (follow/unfollow)
  const currentUserId = req.user.id;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: 'You cannot follow/unfollow yourself.' });
  }

  try {
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) return res.status(404).json({ message: 'User not found.' });

    if (action === 'follow') {
      if (!currentUser.following.includes(targetUserId)) {
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({ message: `You are now following ${targetUser.name}.` });
      } else {
        return res.status(400).json({ message: 'You are already following this user.' });
      }
    } else if (action === 'unfollow') {
      const index = currentUser.following.indexOf(targetUserId);
      const targetIndex = targetUser.followers.indexOf(currentUserId);

      if (index !== -1) {
        currentUser.following.splice(index, 1);
        targetUser.followers.splice(targetIndex, 1);

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({ message: `You have unfollowed ${targetUser.name}.` });
      } else {
        return res.status(400).json({ message: 'You are not following this user.' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid action.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
};



export const unfollowUser = async (req, res) => {
  const targetUserId = req.params.id;  // User to unfollow
  const currentUserId = req.user.id;   // Logged-in user ID

  try {
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) return res.status(404).json({ message: 'User not found.' });

    if (currentUser.following.includes(targetUserId)) {
      currentUser.following = currentUser.following.filter(
        (userId) => userId.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (userId) => userId.toString() !== currentUserId
      );

      await currentUser.save();
      await targetUser.save();

      res.status(200).json({ message: `You have unfollowed ${targetUser.name}.` });
    } else {
      res.status(400).json({ message: 'You are not following this user.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};


// Get user's followers
export const getFollowers = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('followers', 'name email profileImage');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get users the user is following
export const getFollowing = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('following', 'name email profileImage');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single user profile by ID
// In the controller, ensure you populate followers and following fields correctly
export const getUserProfile = async (req, res) => {
  const { id } = req.params;  // Get the user ID from the URL

  try {
    // Find the user by ID and populate the followers and following fields
    const user = await User.findById(id)
      .populate('followers', 'name email profileImage')  // Populate only necessary fields
      .populate('following', 'name email profileImage'); // Same here for following

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      followers: user.followers, // Return the full followers data
      following: user.following, // Return the full following data
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// controllers/userController.js


export const searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    let searchCriteria;

    // Check if the query is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(query)) {
      searchCriteria = { _id: query }; // Search by _id if valid
    } else {
      searchCriteria = {
        $or: [
          { name: { $regex: query, $options: 'i' } }, // Case-insensitive name search
          { email: { $regex: query, $options: 'i' } }, // Case-insensitive email search
        ],
      };
    }

    const users = await User.find(searchCriteria).select('_id name email');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

