import React, { useEffect, useState } from 'react';
import API from '../api/axios.js';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/blogs');
        if (res.data?.success) setBlogs(res.data.blogs || []);
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">Latest Blogs</h2>
      {blogs.map(b => <BlogCard key={b._id} {...b} />)}
    </div>
  );
}
