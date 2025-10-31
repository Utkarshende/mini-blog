import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

let requestCount = 0;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
    if(conn){
    console.log("MongoDB connected");
    }
    } catch(error){
    console.error("MongoDB connection error:", error);
}
};

app.get("/", (req, res) => {
res.json({
    success:true,
    message:"Server is running..."});
})  ;

const checkHeaderKey=(req, res, next)=>{
        const { api_token}=req.headers;
        console.log("Checking API key:", api_token);
    if(api_token == "admin"){
        console.log("API key valid");
        next();
    } else {
        console.log("API key invalid");
        res.status(401).json({message:"Unauthorized"});
        }
    };
app.use(checkHeaderKey);




const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});