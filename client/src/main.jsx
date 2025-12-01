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

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
     <Routes>
        <Route path="/" element={<AllBlogs />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/new" element={<NewBlog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
  </BrowserRouter>
);
