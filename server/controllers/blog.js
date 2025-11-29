import Blog from "./../models/Blog.js";
import jwt from 'jsonwebtoken'; 
import mongoose from 'mongoose'; 

const postBlogs = async (req, res) => {
    try {
        const {title, content, category} = req.body;
        
        // The auth middleware attaches the decoded JWT payload to req.user.
        // The payload contains { id: user.id, ... }
        const {user} = req; 

        if (!user || !user.id) {
            // This error should now only occur if the middleware fails or is missing
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
            author: user.id, // Use user.id which comes from the token payload
            slug:`temp-slug-${Date.now()}-${Math.random().toString()}`,
            status: 'draft' 
        });
        
        const savedBlog = await newBlog.save();

        savedBlog.slug = `${title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,"")}-${savedBlog._id}`;

        await savedBlog.save();
        
        res.status(201).json({
            success:true,
            message:"Blog created successfully",
            data:savedBlog 
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

        if (author) {
            if (!mongoose.Types.ObjectId.isValid(author)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid author ID format."
                });
            }
            
            query.author = author;
        } else {
            query.status = "published";
        }

        const blogs = await Blog.find(query)
        .populate('author', '_id name email')
        .sort({ publishedAt: -1, createdAt: -1 }); 
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

/**
 * NEW FUNCTION ADDED: Handles GET /blogs/myposts
 * This function uses the user ID attached by the auth middleware (req.user.id).
 */
const getMyPosts = async (req, res) => {
    try {
        const { user } = req;

        // This check confirms the user is authenticated
        if (!user || !user.id) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required to view your posts." 
            });
        }
        
        // Find blogs where the 'author' field matches the authenticated user's ID (user.id)
        const myBlogs = await Blog.find({ author: user.id })
            .populate('author', '_id name email')
            .sort({ createdAt: -1 }); 

        res.status(200).json({ 
            success: true, 
            data: myBlogs, 
            message: "User-specific posts fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching my posts:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching user posts.',
            error: error.message
        });
    }
};


const getBlogForSlug = async (req, res) => {
    try {
        const {slug} = req.params;
        const {user} = req; 
        const blog = await Blog.findOne({slug:slug}).populate('author','_id name email');

        if (!blog){
            return res.status(404).json({
                success:false,
                message:"Blog not found"
            });
        }
        
        const isAuthor = user && blog.author._id.toString() === user.id;

        if (blog.status !== 'published' && !isAuthor) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this content."
            });
        }
    
        if (blog.status === 'published' && (!user || blog.author._id.toString() !== user.id)) {
             await Blog.updateOne({ slug: slug }, { $inc: { viewCount: 1 } });
             
             blog.viewCount += 1; 
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

        if(blog.author.toString() !== user.id){
            return res.status(403).json({
                success:false,
                message : "You are not authorized to publish this blog"
            });
        }

        if (!blog.title || !blog.content || !blog.category) {
            return res.status(400).json({
                success: false,
                message: "Cannot publish a blog without a title, content, or category."
            });
        }

        const updatedBlog = await Blog.findOneAndUpdate(
            { slug: slug },
            { status: "published", publishedAt: new Date() }, 
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
        
        const updatedBlog = await Blog.findOneAndUpdate(
            { slug: slug }, 
            { title, category, content, updatedAt: new Date() },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message : "Blog Updated Successfully",
            data : updatedBlog, 
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

// EXPORT STATEMENT UPDATED to include the new getMyPosts function
export { postBlogs, getBlogs, getBlogForSlug ,patchPublishBlog, putBlogs, getMyPosts};