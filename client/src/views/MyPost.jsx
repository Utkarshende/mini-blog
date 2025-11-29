import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard.jsx';
import Navbar from '../components/Navbar.jsx';
import { getCurrentUser } from './../util.js';
import toast, { Toaster } from 'react-hot-toast';

function MyPost() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const loggedInUser = getCurrentUser();
    setUser(loggedInUser);

    if (!loggedInUser) {
      window.location.href = "/login"; // Redirect if not logged in
      return;
    }

    const fetchMyBlogs = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No token found. Please login again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/blogs/myposts`, {
          headers: {
            Authorization: `Bearer ${token}` // Correct JWT header
          }
        });

        setBlogs(response.data.data || []);
      } catch (error) {
        console.error("Error fetching user's blogs:", error.response?.data);
        if (error.response?.status === 401) {
          toast.error("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("loggedInUser");
          setTimeout(() => window.location.href = "/login", 1000);
        } else {
          toast.error(error.response?.data?.message || "Failed to load your posts.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  if (isLoading) {
    return (
      <div className='container mx-auto p-4 text-center'>
        <Navbar />
        <div className='mt-8 text-xl text-gray-600'>Loading your posts...</div>
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className='container mx-auto p-4 text-center'>
        <Navbar />
        <div className='mt-8 text-xl text-gray-600'>
          You haven't created any posts yet. <br/>
          <a href="/new" className="text-blue-500 hover:underline">Click here to create a new one.</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-6'>My Posts ({user?.name})</h1>
        {blogs.map(blog => (
          <BlogCard
            key={blog._id}
            title={blog.title}
            author={blog.author}
            category={blog.category}
            slug={blog.slug}
            updatedAt={blog.updatedAt}
            publishedAt={blog.publishedAt}
            viewCount={blog.viewCount}
            status={blog.status}
          />
        ))}
      </div>
      <Toaster />
    </div>
  );
}

export default MyPost;
