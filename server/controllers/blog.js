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
 const {author} = req.query;

 const conditions =[
    {status: "published"}];

    if(author){
        conditions.push({author: author});}

    const blogs = await Blog.find({
        $or: conditions,
    })
    .populate('author','_id name email')
    .sort({
        status:1,
        updatedAt:-1
    });
    res.status(200).json({
        success:true,
        data:blogs,
        message:"Blogs fetched successfully"
    });
};

const getBlogForSlug = async (req, res) => {
    const {slug} = req.params;

    const blog= await Blog.findOne({slug:slug}).populate('author','_id name email');

    if (!blog){
        return res.status(404).json({
            success:false,
            message:"Blog not found"
        });
    }
    res.status(200).json({
        success:true,
        data:blog,
        message:"Blog fetched successfully"
    });
};

const patchPublishBlog = async(req, res)=>{
const{slug}=req.params;
await Blog.findByIdAndUpdate({slug : slug},{status : "published"});

res.status(200).json({
    success:true,
    message :"Blog Published Successfully !"
})
};

const putBlogs=async (req, res)=>{

    const {slug} = req.params;
    const {title, category,content}=req.body;

    if(!title || !category || !content){
        return res.status(400).json({
            success:false,
            message:"All fileds required"
        });
    }

    const blog= await Blog.findOneAndUpdate({slug: slug}, 
        {title, category,content});

        return resizeBy.status(200).json({
            success:true,
            message : "Blogs Updated Successfully",
            blog :blog,
        });

}

export { postBlogs, getBlogs, getBlogForSlug ,patchPublishBlog,putBlogs};
