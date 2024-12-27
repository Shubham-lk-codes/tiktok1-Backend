import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

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
