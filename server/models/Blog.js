import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  publishedAt: { type: Date },
});

export default mongoose.model('Blog', blogSchema);
