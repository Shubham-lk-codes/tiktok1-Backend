import Video from '../models/Video.js';
import cloudinary from '../config/cloudinary.js';

// Upload video (Creator only)
export const uploadVideo = async (req, res) => {
  const { title, tags } = req.body;
  console.log(req.file); // Check if file data is available

  const fileUrl = req.file?.path; // Cloudinary URL

  try {
    const video = await Video.create({
      title,
      tags,
      creator: req.user.id,
      url: fileUrl, // Store the Cloudinary URL in the database
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload video' });
  }
};



// Get all videos
export const getVideos = async (req, res) => {
  const videos = await Video.find().populate('creator', 'name');
  res.json(videos);
};

// Search videos by title or tags
export const searchVideos = async (req, res) => {
  const { query } = req.query; // Search keyword
  const videos = await Video.find({
    $or: [
      { title: { $regex: query, $options: 'i' } }, // Case-insensitive search for title
      { tags: { $regex: query, $options: 'i' } },  // Case-insensitive search for tags
    ],
  }).populate('creator', 'name');
  res.json(videos);
};

// Comment on a video
export const commentOnVideo = async (req, res) => {
  const { videoId } = req.params;
  const { text } = req.body;

  const video = await Video.findById(videoId);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  video.comments.push({ user: req.user.id, text });
  await video.save();

  res.status(201).json({ message: 'Comment added', comments: video.comments });
};

// Rate a video
// Rate a video
export const rateVideo = async (req, res) => {
  const { videoId } = req.params;
  const { rating } = req.body;

  const video = await Video.findById(videoId);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  // Check if user has already rated
  const existingRating = video.ratings.find((r) => r.user.toString() === req.user.id);
  if (existingRating) {
    existingRating.rating = rating; // Update the rating
  } else {
    video.ratings.push({ user: req.user.id, rating }); // Add new rating
  }

  await video.save();

  res.status(201).json({ message: 'Rating added/updated', ratings: video.ratings });
};

// Delete a video (Creator or Admin only)
export const deleteVideo = async (req, res) => {
  const { videoId } = req.params;

  try {
    // Find the video by ID
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if the user is the creator or an admin
    if (video.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this video' });
    }

    // Optionally, delete the video from Cloudinary
    const cloudinaryPublicId = video.url.split('/').pop().split('.')[0]; // Extract public ID from the URL
    await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: 'video' });

    // Remove the video from the database
    await video.remove();

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
};
