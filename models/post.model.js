// models/post.model.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    image: { type: String, required: true }, // URL for the image
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of user IDs who liked the post
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
