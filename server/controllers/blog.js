import Blog from "./../models/Blog.js";
import jwt from 'jsonwebtoken'; 
import mongoose from 'mongoose'; // Added for checking valid object IDs

const postBlogs = async (req, res) => {
    try {
        const {title, content, category} = req.body;
        
        // Auth Middleware is assumed to run before this, populating req.user
        const {user} = req; 

        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (!title || !content || !category ){
            return res.status(400).json({
                success:false,
                message:"All fields (title, content, category) are required"
            });
        }

        const newBlog = new Blog({
            title,
            content,
            category,
            author: user.id, 
            // Create a temporary slug before saving to ensure uniqueness for initial save
            slug:`temp-slug-${Date.now()}-${Math.random().toString()}`,
            status: 'draft' // Default to draft, as per Blog.js model
        });
        
        const savedBlog = await newBlog.save();

        // Generate permanent SEO-friendly slug using the title and the assigned _id
        // Replace spaces with hyphens, remove non-word characters, and append ID
        savedBlog.slug = `${title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,"")}-${savedBlog._id}`;

        await savedBlog.save();
        
        res.status(201).json({
            success:true,
            message:"Blog created successfully",
            data:savedBlog // Changed 'blog' to 'data' for consistency
        });

    } catch (error) {
        console.error("Error posting blog:", error);
        res.status(500).json({
            success: false,
            message: "Server error during blog creation.",
            error: error.message
        });
    }
};

const getBlogs = async (req, res) => {
    try {
        const { author } = req.query;

        let query = {};

        // ⭐ CRITICAL FIX: Correct query logic
        if (author) {
            // Check if the provided author ID is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(author)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid author ID format."
                });
            }
            // If author ID is provided, fetch ALL of that author's blogs 
            // (published, draft, archived) for the 'My Blogs' view on the frontend
            query.author = author;
        } else {
            // If no author ID is provided (global feed), fetch ONLY published blogs
            query.status = "published";
        }

        // Removed the unnecessary 'conditions' array and fixed the find() call
        const blogs = await Blog.find(query)
        .populate('author', '_id name email')
        .sort({ publishedAt: -1, createdAt: -1 }); // Prioritize publishedAt, then createdAt
        
        res.status(200).json({
            success:true,
            data:blogs,
            message:"Blogs fetched successfully"
        });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({
            success: false,
            message: "Server error during blog retrieval.",
            error: error.message
        });
    }
};

const getBlogForSlug = async (req, res) => {
    try {
        const {slug} = req.params;
        const {user} = req; // Logged-in user from auth middleware

        // Populate author field for security check and display
        const blog = await Blog.findOne({slug:slug}).populate('author','_id name email');

        if (!blog){
            return res.status(404).json({
                success:false,
                message:"Blog not found"
            });
        }
        
        // SECURITY CHECK:
        const isAuthor = user && blog.author._id.toString() === user.id;

        if (blog.status !== 'published' && !isAuthor) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this content."
            });
        }
        
        // ⭐ FEATURE ADDITION: Increment viewCount if the blog is published and the viewer is NOT the author
        // This prevents the author's own edits/views from constantly inflating the count.
        if (blog.status === 'published' && (!user || blog.author._id.toString() !== user.id)) {
             await Blog.updateOne({ slug: slug }, { $inc: { viewCount: 1 } });
             // Mongoose doesn't return the updated doc with updateOne by default, 
             // but we don't need it here since we already have the blog data.
             blog.viewCount += 1; // Increment the local object for the response
        }

        res.status(200).json({
            success:true,
            data:blog,
            message:"Blog fetched successfully"
        });

    } catch (error) {
        console.error("Error fetching single blog:", error);
        res.status(500).json({
            success: false,
            message: "Server error during single blog retrieval.",
            error: error.message
        });
    }
};

const patchPublishBlog = async(req, res)=>{
    try {
        const {slug} = req.params;
        const {user} = req;

        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const blog = await Blog.findOne({slug : slug});

        if(!blog){
            return res.status(404).json({
                success:false,
                message:"Blog not found"
            });
        }

        // Check if the authenticated user is the author of the blog
        if(blog.author.toString() !== user.id){
            return res.status(403).json({
                success:false,
                message : "You are not authorized to publish this blog"
            });
        }

        // Check if the blog already has a title/content before publishing
        if (!blog.title || !blog.content || !blog.category) {
            return res.status(400).json({
                success: false,
                message: "Cannot publish a blog without a title, content, or category."
            });
        }

        const updatedBlog = await Blog.findOneAndUpdate(
            { slug: slug },
            { status: "published", publishedAt: new Date() }, // Set publishedAt on publish
            { new: true }
        );

        res.status(200).json({
            success:true,
            message :"Blog Published Successfully !",
            data: updatedBlog
        });

    } catch (error) {
        console.error("Error publishing blog:", error);
        res.status(500).json({
            success: false,
            message: "Server error during blog publishing.",
            error: error.message
        });
    }
};

const putBlogs = async (req, res) => {
    try {
        const {slug} = req.params;
        const {title, category, content} = req.body;
        const {user} = req;

        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const existingBlog = await Blog.findOne({slug : slug});

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Check if the authenticated user is the author of the blog
        if (existingBlog.author.toString() !== user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog"
            });
        }

        if (!title || !category || !content) {
            return res.status(400).json({
                success: false,
                message: "All fields (title, content, category) are required"
            });
        }
        
        // Prevent accidental slug changes during update
        const updatedBlog = await Blog.findOneAndUpdate(
            { slug: slug }, 
            { title, category, content, updatedAt: new Date() },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message : "Blog Updated Successfully",
            data : updatedBlog, // Changed 'blog' to 'data' for consistency
        });

    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({
            success: false,
            message: "Server error during blog update.",
            error: error.message
        });
    }
};

export { postBlogs, getBlogs, getBlogForSlug ,patchPublishBlog, putBlogs};