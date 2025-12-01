import Blog from '../models/Blog.js';
import mongoose from 'mongoose';

export const postBlogs = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user.id;

    if (!title || !content || !category) return res.status(400).json({ success: false, message: "All fields required." });

    const blog = new Blog({
      title,
      content,
      category,
      author: userId,
      slug: `${title.toLowerCase().replace(/ /g, "-")}-${Date.now()}`,
      status: "draft"
    });
    await blog.save();
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).populate('author', '_id name email').sort({ publishedAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBlogForSlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', '_id name email');
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const patchPublishBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Unauthorized." });

    blog.status = "published";
    blog.publishedAt = new Date();
    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const putBlogs = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Unauthorized." });

    const { title, content, category } = req.body;
    blog.title = title;
    blog.content = content;
    blog.category = category;
    blog.updatedAt = new Date();
    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });

    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

