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
        author,
        slug:`temp-slug-${Date.now()}`
    });
    
    const savedBlog = await newBlog.save();

    savedBlog.slug =`${title.lowerCase().replace(/ /g,'-')}-${savedBlog._id}`.replace(/[^\w-]+/g,"");

    await savedBlog.save();
    
    res.status(201).json({
        success:true,
        message:"Blog created successfully",
        blog:savedBlog
    });
};

const getBlogs = async (req, res) => {
    const blogs = await Blog.find().populate('author','_id name email');
    res.status(200).json({
        success:true,
        data:blogs,
        message:"Blogs fetched successfully"
    });
};

export { postBlogs, getBlogs };
