import React, { useEffect, useState } from 'react';
import API from '../api/axios.js';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';

export default function MyPost() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await API.get(`/blogs/myposts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")?.replace(/"/g, "")}`,
          }
        });

        if (res.data?.success) {
          setBlogs(res.data.blogs || []);
        } else {
          toast.error(res.data?.message || 'Failed to load posts');
        }
      } catch (err) {
        console.error('Fetch my posts error', err);
        toast.error('Error loading posts');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const deleteBlog = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await API.delete(`/blogs/${slug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")?.replace(/"/g, "")}`,
        }
      });

      if (res.data?.success) {
        toast.success("Blog deleted successfully");
        setBlogs(prev => prev.filter((b) => b.slug !== slug));
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Error deleting blog");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">My Posts</h2>

      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No posts yet. <a href="/new" className="text-blue-500 underline">Create one</a></p>
      ) : (
        blogs.map((b) => (
          <BlogCard 
            key={b._id} 
            {...b} 
            onDelete={deleteBlog}
          />
        ))
      )}

      <Toaster />
    </div>
  );
}
