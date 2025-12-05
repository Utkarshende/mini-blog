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
  "https://mini-blog-mpxciqyw5-utkarshas-projects-b2961f40.vercel.app",
  "https://mini-blog-front.onrender.com",
  "https://mineeblog.netlify.app",
  'https://mini-blog-two-theta.vercel.app'
];

// ---- CORS FIX: Clean + supports OPTIONS ----
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ---- Ensures preflight passes ----
app.options("*", cors());

app.use(express.json());

// ---- Test Routes first ----
app.get("/", (req, res) => res.send("API is running"));
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Backend working" });
});

// ---- Database ----
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB Error:', err));

// ---- Logging middleware ----
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ---- Routes ----
app.use('/api/blogs', blogRoutes);
app.use('/api', userRoutes);

// ---- Server ----
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
