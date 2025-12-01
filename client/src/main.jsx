import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import MyPost from './pages/MyPost.jsx';
import NewBlog from './pages/NewBlog.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/myposts" element={<MyPost />} />
      <Route path="/new" element={<NewBlog />} />
      <Route path="*" element={<div className="p-4">404 Not Found</div>} />
    </Routes>
  </BrowserRouter>
);
