import Blog from "./../models/Blog.js";

const postBlogs = async (req, res) => {
const {title, content, category, author} = req.body;

if(!title || !content || !category || !author){
    return res.status(400).json({
        success:false,
        message:"All fields are required"
    });
}

    const newBlog = new Blog({
        title,
        content,
        category,
        author
    });
    
    const savedBlog = await newBlog.save();
    res.status(201).json({
        success:true,
        message:"Blog created successfully",
        blog:savedBlog
    });
};
export { postBlogs };
