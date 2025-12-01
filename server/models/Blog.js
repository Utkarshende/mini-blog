import { model, Schema } from 'mongoose';

const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['draft','published','archived'], default: 'draft' },
  category: { type: String, required: true },
  publishedAt: { type: Date },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  slug: { type: String, required: true, unique: true },
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

export default model('Blog', blogSchema);
