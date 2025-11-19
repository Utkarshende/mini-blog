import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// Import getMyPosts along with other blog controllers if using separate files.
// Since the current file includes controller logic, we will define getMyPosts here.
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
    // Exit process on failure for robust applications
    process.exit(1); 
}};

app.get("/", (req, res) => {
res.json({
    success:true,
    message:"Server is running..."});
}) ;

/**
 * Middleware to check for a valid JWT token and attach decoded user data to req.user.
 */
const jwtCheck = (req, res, next)=>{
    req.user=null;

    // Correctly accessing the authorization header from req.headers (plural)
    const { authorization } = req.headers; 

    if(!authorization){
        return res.status(401).json({message : "Authorization token missing"});
    }
    
    try{
        // Token is expected to be in "Bearer <token>" format
        const token = authorization.split(" ")[1]; 
        
        if (!token) {
            return res.status(401).json({ message: "Token format incorrect." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded object typically contains { _id: user_id, email: user_email, iat, exp }
        req.user = decoded;
        next();
    } catch(error){
       return res.status(401).json({message : "Invalid JWT token"})
    }
};

/**
 * Middleware to increment the view count for a specific blog slug.
 */
const increasedViewCount =async (req, res, next )=>{
const {slug} = req.params;

try{
    await Blog.updateOne(
        { slug: slug },
        { $inc: { viewCount: 1 } }
    );
}
catch (error){
    // This middleware should not stop the request chain on error, 
    // but should log the error and call next().
    console.error("Error increasing view count", error);
}
next();
};

// --- NEW CONTROLLER FUNCTION ADDED HERE ---
/**
 * Controller function to fetch all blogs owned by the authenticated user.
 * Requires jwtCheck middleware to ensure req.user is set.
 */
const getMyPosts = async (req, res) => {
    try {
        // req.user contains the decoded JWT payload (e.g., { _id: 'user_id', ... })
        const userId = req.user._id; 

        if (!userId) {
             return res.status(401).json({ 
                success: false, 
                message: "User ID not found in token." 
            });
        }

        // Find all blogs where the 'author' field matches the authenticated user's ID.
        // Sort by the latest update time (most recently edited/created).
        const myPosts = await Blog.find({ author: userId })
            .sort({ updatedAt: -1 })
            // If the Blog schema references User, use .populate() here if needed:
            // .populate('author', 'name email') 

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