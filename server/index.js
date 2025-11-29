import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { postSignup ,postLogin,} from "./controllers/user.js";
import { postBlogs, getBlogs, getBlogForSlug, patchPublishBlog,putBlogs} from "./controllers/blog.js";
import jwt from 'jsonwebtoken';
import Blog from "./models/Blog.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
    if(conn){
    console.log("MongoDB connected");}
    } catch(error){
    console.error("MongoDB connection error:", error);
    process.exit(1); 
}};

app.get("/", (req, res) => {
res.json({
    success:true,
    message:"Server is running..."});
}) ;

app.get("/test-auth", jwtCheck, (req, res) => {
  res.json({
    success: true,
    message: "JWT Verified",
    user: req.user
  });
});


const jwtCheck = (req, res, next)=>{
    req.user=null;

    const { authorization } = req.headers; 

    if(!authorization){
        return res.status(401).json({message : "Authorization token missing"});
    }
    
    try{
        const token = authorization.split(" ")[1]; 
        
        if (!token) {
            return res.status(401).json({ message: "Token format incorrect." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error){
       return res.status(401).json({message : "Invalid JWT token"})
    }
};


const increasedViewCount =async (req, res, next )=>{
const {slug} = req.params;

try{
    await Blog.updateOne(
        { slug: slug },
        { $inc: { viewCount: 1 } }
    );
}
catch (error){
   
    console.error("Error increasing view count", error);
}
next();
};


const getMyPosts = async (req, res) => {
    try {
        const userId = req.user._id; 

        if (!userId) {
             return res.status(401).json({ 
                success: false, 
                message: "User ID not found in token." 
            });
        }

       
        const myPosts = await Blog.find({ author: userId })
            .sort({ updatedAt: -1 })
           

        return res.status(200).json({
            success: true,
            data: myPosts,
            message: "User-specific posts fetched successfully."
        });

    } catch (error) {
        console.error("Error fetching user's blogs:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching user posts."
        });
    }
};

app.post("/signup",postSignup);
app.post("/login",postLogin);

app.get("/blogs",getBlogs);
app.get("/blogs/myposts", jwtCheck, getMyPosts); 
app.get("/blogs/:slug",increasedViewCount,getBlogForSlug); 
app.post("/blogs",jwtCheck,postBlogs);
app.patch("/blogs/:slug/publish",jwtCheck,patchPublishBlog);
app.put("/blogs/:slug",jwtCheck, putBlogs);

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});