import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import BlogCard from "../components/BlogCard.jsx";

function MyPost() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchMyPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first.");
        setTimeout(() => (window.location.href = "/login"), 1000);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/blogs/myposts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setBlogs(res.data.blogs || []);
        } else {
          toast.error(res.data.message || "Failed to fetch your posts.");
        }
      } catch (err) {
        console.error("API Error:", err.response?.data || err);
        if (err.response?.status === 401) {
          toast.error("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("loggedInUser");
          setTimeout(() => (window.location.href = "/login"), 1000);
        } else {
          toast.error(err.response?.data?.message || "Server error fetching posts.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Navbar />
        <p className="mt-8 text-xl">Loading your posts...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Navbar />
        <p className="mt-8 text-xl">
          You have no posts yet. <br />
          <a href="/new" className="text-blue-500 hover:underline">
            Create your first blog
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">My Posts</h1>
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          title={blog.title}
          author={blog.author.name}
          category={blog.category}
          slug={blog.slug}
          updatedAt={blog.updatedAt}
          publishedAt={blog.publishedAt}
          viewCount={blog.viewCount}
          status={blog.status}
        />
      ))}
      <Toaster />
    </div>
  );
}

export default MyPost;
