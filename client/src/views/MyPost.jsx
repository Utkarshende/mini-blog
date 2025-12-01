import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import BlogCard from "../components/BlogCard.jsx";
import { getToken } from "../util.js";

function MyPost() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchMyPosts = async () => {
      const token = getToken();

      if (!token) {
        toast.error("Please login first.");
        setTimeout(() => (window.location.href = "/login"), 1000);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/blogs/myposts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setBlogs(res.data.blogs);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        console.log(err);
        toast.error("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">My Posts</h1>

      {loading ? (
        <p>Loading posts...</p>
      ) : blogs.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        blogs.map((blog) => (
          <BlogCard key={blog._id} {...blog} />
        ))
      )}

      <Toaster />
    </div>
  );
}

export default MyPost;
