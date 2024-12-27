import mongoose from 'mongoose';

const videoSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    tags: [String],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Video', videoSchema);
