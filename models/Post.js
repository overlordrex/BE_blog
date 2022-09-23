import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    userId: { type: String, required: true },
    likes: { type: [String] },
    dislikes: { type: [String] },
    views: { type: Number, default: 0 },
    tags: { type: [String] },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
