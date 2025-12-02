import { model, Schema } from "mongoose";
import slugify from "slugify";

const blogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  category: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

// Auto-generate slug
blogSchema.pre("save", function(next) {
  if(!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now();
  }
  next();
});

export default model("Blog", blogSchema);
