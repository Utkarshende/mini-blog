import Blog from "../models/Blog.js";
import mongoose from "mongoose";

export const postBlogs = async (req, res) => {
  const { title, content, category } = req.body;
  const user = req.user;
  const userId = user._id || user.userId; // FIX

  if (!userId) return res.status(401).json({ success:false, message: "Authentication required" });
  if (!title || !content || !category)
    return res.status(400).json({ success:false, message: "All fields required" });

  const newBlog = new Blog({
    title,
    content,
    category,
    author: userId, // FIX
    slug: `temp-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    status: "draft"
  });

  const saved = await newBlog.save();
  saved.slug = `${title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g,"")}-${saved._id}`;
  await saved.save();

  return res.status(201).json({ success:true, message:"Blog created", data: saved });
};

export const getBlogs = async (req, res) => {
  const { author } = req.query;
  const query = {};

  if (author) {
    if (!mongoose.Types.ObjectId.isValid(author))
      return res.status(400).json({ success:false, message: "Invalid author id" });
    query.author = author;
  } else {
    query.status = "published";
  }

  const blogs = await Blog.find(query)
    .populate("author", "_id name email")
    .sort({ publishedAt: -1, createdAt: -1 });

  return res.json({ success:true, data: blogs });
};

export const getBlogForSlug = async (req, res) => {
  const { slug } = req.params;
  const user = req.user;
  const userId = user?._id || user?.userId; // FIX

  const blog = await Blog.findOne({ slug }).populate("author", "_id name email");
  if (!blog) return res.status(404).json({ success:false, message: "Blog not found" });

  const isAuthor = userId && blog.author._id.toString() === userId;

  if (blog.status !== "published" && !isAuthor)
    return res.status(403).json({ success:false, message: "You are not authorized to view this content" });

  if (blog.status === "published" && !isAuthor) {
    await Blog.updateOne({ slug }, { $inc: { viewCount: 1 } });
    blog.viewCount++;
  }

  return res.json({ success:true, data: blog });
};

export const patchPublishBlog = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user._id || req.user.userId; // FIX

  if (!userId) return res.status(401).json({ success:false, message: "Authentication required" });

  const blog = await Blog.findOne({ slug });
  if (!blog) return res.status(404).json({ success:false, message: "Blog not found" });
  if (blog.author.toString() !== userId)
    return res.status(403).json({ success:false, message: "Not authorized to publish" });

  if (!blog.title || !blog.content || !blog.category)
    return res.status(400).json({ success:false, message: "Cannot publish incomplete blog" });

  blog.status = "published";
  blog.publishedAt = new Date();
  await blog.save();

  return res.json({ success:true, message: "Blog published", data: blog });
};

export const putBlogs = async (req, res) => {
  const { slug } = req.params;
  const { title, category, content } = req.body;
  const userId = req.user._id || req.user.userId; // FIX

  if (!userId) return res.status(401).json({ success:false, message: "Authentication required" });

  const blog = await Blog.findOne({ slug });
  if (!blog) return res.status(404).json({ success:false, message: "Blog not found" });
  if (blog.author.toString() !== userId)
    return res.status(403).json({ success:false, message: "Not authorized to edit" });

  if (!title || !category || !content)
    return res.status(400).json({ success:false, message: "All fields are required" });

  blog.title = title;
  blog.category = category;
  blog.content = content;
  blog.updatedAt = new Date();
  await blog.save();

  return res.json({ success:true, message: "Blog updated", data: blog });
};

export const getMyPosts = async (req, res) => {
  const userId = req.user._id || req.user.userId; // FIX
  if (!userId) return res.status(401).json({ success:false, message: "Authentication required" });

  const myBlogs = await Blog.find({ author: userId })
    .populate("author", "_id name email")
    .sort({ createdAt: -1 });

  return res.json({ success:true, data: myBlogs });
};
