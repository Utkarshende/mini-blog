import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import AllBlogs from './views/AllBlogs.jsx';
import ReadBlog from './views/ReadBlog.jsx';
import Login from './views/Login.jsx';
import Signup from './views/Signup.jsx';
import MyPosts from './views/MyPost.jsx';
import BlogCard from './components/BlogCard.jsx';
import NewBlog from './views/NewBlog.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
     <Routes>
        <Route path="/" element={<AllBlogs />} />
        <Route path="/new" element={<NewBlog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
          {/* Protected Routes */}
        <Route
          path="/myposts"
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          }
        />
      </Routes>
  </BrowserRouter>
);
