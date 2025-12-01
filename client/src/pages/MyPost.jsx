import React, { useEffect, useState } from 'react';
import API from '../api/axios.js';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getCurrentUser } from '../util.js';

export default function MyPost() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const user = getCurrentUser();
      if (!user) {
        toast.error('Please login.');
        setTimeout(() => (window.location.href = '/login'), 900);
        return;
      }

      try {
        const res = await API.get(`/blogs?userId=${user.id}`);
        if (res.data?.success) setBlogs(res.data.blogs || []);
        else toast.error(res.data?.message || 'Failed');
      } catch (err) {
        console.error('Fetch my posts error', err);
        toast.error('Error loading posts');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">My Posts</h2>

      {loading ? <p>Loading...</p> : blogs.length === 0 ? (
        <p>No posts yet. <a href="/new" className="text-blue-500">Create one</a></p>
      ) : (
        blogs.map(b => <BlogCard key={b._id} {...b} />)
      )}

      <Toaster />
    </div>
  );
}
