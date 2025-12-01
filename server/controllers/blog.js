import Blog from "./../models/Blog.js";
import mongoose from 'mongoose';

const postBlogs = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { title, content, category } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    if (!title || !content || !category) {
      return res.status(400).json({ success: false, message: "All fields (title, content, category) are required" });
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      author: userId,
      slug: `temp-${Date.now()}`,
      status: "draft",
    });

    const savedBlog = await newBlog.save();

    savedBlog.slug = `${title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")}-${savedBlog._id}`;
    await savedBlog.save();

    res.status(201).json({ success: true, message: "Blog created successfully", data: savedBlog });
  } catch (error) {
    console.error("Error posting blog:", error);
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};


const getBlogs = async (req, res) => {
  try {
    const { author } = req.query;
    let query = {};

    if (author) {
      if (!mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({ success: false, message: "Invalid author ID format." });
      }
      query.author = author;
    } else {
      query.status = "published";
    }

    const blogs = await Blog.find(query)
      .populate('author', '_id name email')
      .sort({ publishedAt: -1, createdAt: -1 });

    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};


 const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });

    if (blogs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No blogs found for this user.",
        blogs: [],
      });
    }

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};



const getBlogForSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const blog = await Blog.findOne({ slug }).populate('author', '_id name email');

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    const isAuthor = blog.author._id.toString() === userId;

    if (blog.status !== "published" && !isAuthor) {
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }

    if (blog.status === "published" && !isAuthor) {
      blog.viewCount += 1;
      await blog.save();
    }

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching blog.", error: error.message });
  }
};


const patchPublishBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const blog = await Blog.findOne({ slug });

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized action." });
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      { status: "published", publishedAt: new Date() },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Blog published!", data: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error publishing.", error: error.message });
  }
};


const putBlogs = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;
    const { title, category, content } = req.body;

    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized update." });
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      { title, category, content, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Updated!", data: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating.", error: error.message });
  }
};


export { postBlogs, getBlogs, getBlogForSlug, patchPublishBlog, putBlogs, getMyPosts };
