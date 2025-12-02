import Blog from '../models/Blog.js';
import mongoose from 'mongoose';

export const postBlogs = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const user = req.user; // { id, name }
    if (!user || !user.id) return res.status(401).json({ success:false, message: 'Authentication required.' });

    if (!title || !content || !category) {
      return res.status(400).json({ success:false, message: 'All fields required' });
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      author: user.id,
      slug: `temp-${Date.now()}`,
      status: 'draft'
    });

    const saved = await newBlog.save();
    saved.slug = `${title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')}-${saved._id}`;
    await saved.save();

    return res.status(201).json({ success:true, data: saved });
  } catch (err) {
    console.error('Error creating blog:', err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success:false, message: 'Invalid userId' });
      }
      query.author = userId;
    } else {
      query.status = 'published';
    }

    const blogs = await Blog.find(query).populate('author','_id name email').sort({ publishedAt:-1, createdAt:-1 });
    return res.status(200).json({ success:true, blogs });
  } catch (err) {
    console.error('Error fetching blogs:', err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ success:false, message: 'Authentication required' });

    const myBlogs = await Blog.find({ author: user.id }).populate('author','_id name email').sort({ createdAt:-1 });
    return res.status(200).json({ success:true, blogs: myBlogs });
  } catch (err) {
    console.error('Error fetching my posts:', err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

export const getBlogForSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug }).populate('author','_id name email');
    if (!blog) return res.status(404).json({ success:false, message: 'Blog not found' });

    return res.status(200).json({ success:true, data: blog });
  } catch (err) {
    console.error('Error getting blog:', err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

export const putBlogs = async (req, res) => {
  try {
    const { slug } = req.params;
    const user = req.user;
    const { title, content, category } = req.body;

    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ success:false, message: 'Blog not found' });
    if (blog.author.toString() !== user.id) return res.status(403).json({ success:false, message: 'Unauthorized' });

    if (!title || !content || !category) return res.status(400).json({ success:false, message: 'All fields required' });

    const updated = await Blog.findOneAndUpdate({ slug }, { title, content, category, updatedAt: new Date() }, { new: true });
    return res.status(200).json({ success:true, data: updated });
  } catch (err) {
    console.error('Error updating blog:', err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

export const patchPublishBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const user = req.user;

    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ success:false, message: 'Blog not found' });
    if (blog.author.toString() !== user.id) return res.status(403).json({ success:false, message: 'Unauthorized' });

    if (!blog.title || !blog.content || !blog.category) {
      return res.status(400).json({ success:false, message: 'Cannot publish incomplete blog' });
    }

    const updated = await Blog.findOneAndUpdate({ slug }, { status: 'published', publishedAt: new Date() }, { new: true });
    return res.status(200).json({ success:true, data: updated });
  } catch (err) {
    console.error('Error publishing:', err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Only owner can delete
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized request" });
    }

    await Blog.deleteOne({ slug });

    res.json({ success: true, message: "Blog deleted successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
