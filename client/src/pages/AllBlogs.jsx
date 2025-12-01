import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import toast, { Toaster } from 'react-hot-toast';

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    axios.get(`${API_URL}/api/blogs`)
      .then(res => setBlogs(res.data.data || []))
      .catch(err => toast.error(err.response?.data?.message || "Failed to fetch blogs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container p-4"><Navbar /><p>Loading...</p></div>;
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
      {blogs.map(b => <BlogCard key={b._id} {...b} />)}
      <Toaster />
    </div>
  );
}
