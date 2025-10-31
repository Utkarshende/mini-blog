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
    console.log("MongoDB connected");}
    } catch(error){
    console.error("MongoDB connection error:", error);
}};

app.get("/", (req, res) => {
res.json({
    success:true,
    message:"Server is running..."});
})  ;
const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});