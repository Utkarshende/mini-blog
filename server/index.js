import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import blogRoutes from './routes/blogRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// --- START CORRECTION & REFINEMENT ---

// Define the allowed origins for CORS. 
// 1. http://localhost:5173 is for local dev testing.
// 2. The Netlify URL is for production access.
// These should be configured via environment variables for security and deployment flexibility.
const allowedOrigins = [
    'http://localhost:5173', 
    'https://mineeblog.netlify.app' // YOUR DEPLOYED FRONT-END URL
    // You can add other environments here if needed (e.g., staging)
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, or same-origin requests)
        if (!origin) return callback(null, true); 
        
        // Check if the request origin is in our allowed list
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Block the request if the origin is not allowed
            const errorMessage = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            callback(new Error(errorMessage), false);
        }
    },
    credentials: true // ESSENTIAL: Allows cookies, authorization headers, etc.
}));

// --- END CORRECTION & REFINEMENT ---

// Middleware to parse incoming JSON payloads (must be after CORS)
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api', userRoutes); // Assumes /api/login is here

// Logging Middleware (good for debugging)
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// Basic check route
app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));