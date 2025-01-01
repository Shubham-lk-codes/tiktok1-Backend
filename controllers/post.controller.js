// controllers/post.controller.js
import Post from '../models/post.model.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  try {
    console.log("File received in req.file:", req.file); // Log file information
    console.log("Body received in req.body:", req.body); // Log body information

    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "Image is required." });
    }

    const { caption } = req.body;

    const post = new Post({
      caption,
      image: req.file.path, // Save the file path from Cloudinary
      author: req.user._id,  // Assuming user ID is added to req via middleware
    });

    await post.save();

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Error creating post", error });
  }
};







export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching posts', error });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter((userId) => userId.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error liking post', error });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({ user: req.user._id, text });
    await post.save();

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding comment', error });
  }
};


// Assuming you have a User model
// Example Backend Controller for Posts
export const getPostsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you get user ID from token
    const posts = await Post.find({ user: userId }); // Query posts for the user
    return res.status(200).json(posts); // Send posts as an array
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
};





