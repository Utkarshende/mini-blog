import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import blogRoutes from './routes/blogRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api', userRoutes);
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
