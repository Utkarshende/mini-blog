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

// Removed 'requestCount' as it's not currently used.

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
 * FIX 1: Corrected header access from req.header.authorization to req.headers.authorization.
 * In Express, headers are accessed via the req.headers (plural) object.
 * Fix 2: Changed status code for missing auth to 401 (Unauthorized) from 400 (Bad Request).
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
    // This middleware should not stop the request chain on error, 
    // but should log the error and call next().
    console.error("Error increasing view count", error);
 
}
next();
};

app.post("/signup",postSignup);
app.post("/login",postLogin);
app.get("/blogs",getBlogs);
// FIX 3: Route parameter syntax requires a colon. The original was missing it.
app.get("/blogs/:slug",increasedViewCount,getBlogForSlug); 
app.post("/blogs",jwtCheck,postBlogs);
app.patch("/blogs/:slug/publish",jwtCheck,patchPublishBlog);
app.put("/blogs/:slug",jwtCheck, putBlogs);

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});