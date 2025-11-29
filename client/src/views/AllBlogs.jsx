import axios from 'axios';
import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard.jsx';
import { getCurrentUser } from './../util.js';
import Navbar from '../components/Navbar.jsx';

function AllBlogs() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const loggedInUser = getCurrentUser();
    setUser(loggedInUser);

    const fetchBlogs = async () => {
      setIsLoading(true);
      const url = `${API_URL}/api/blogs`; // <-- added /api prefix

      try {
        const response = await axios.get(url);
        setBlogs(response.data.data);
      } catch (error) {
        console.error("Error fetching blogs:", error.response?.data || error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Navbar />
        <div className="mt-8 text-xl text-gray-600">Loading blogs...</div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Navbar />
        <div className="mt-8 text-xl text-gray-600">No published blogs found.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto p-4">
        <Navbar />
        {blogs.map((blog) => {
          const {
            _id,
            title,
            author,
            category,
            slug,
            updatedAt,
            publishedAt,
            viewCount,
            status = 'published',
          } = blog;

          return (
            <BlogCard
              key={_id}
              title={title}
              author={author}
              category={category}
              slug={slug}
              updatedAt={updatedAt}
              publishedAt={publishedAt}
              viewCount={viewCount}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AllBlogs;
