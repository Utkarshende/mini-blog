import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import blogRoutes from './routes/blogRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    'https://mini-blog-5n8i5cs9k-utkarshas-projects-b2961f40.vercel.app/',
    "https://mini-blog-front.onrender.com",
    "https://mineeeblog.netlify.app",
    'https://mini-blog-two-theta.vercel.app' 
];


app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE", 
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => res.send("API is running"));
app.get("/api/test", (req, res) => {
    res.json({ success: true, message: "Backend working" });
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("🚫 ERROR: MONGODB_URI is not defined.");
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
        console.error('❌ MongoDB Error: Failed to connect', err);
        process.exit(1); 
    });


app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
});

app.use('/api/blogs', blogRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));