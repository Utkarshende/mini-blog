import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import BlogCard from "../components/BlogCard.jsx";
import toast, { Toaster } from "react-hot-toast";

function MyPost() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:8080/api/blogs/myposts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setBlogs(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to load posts.");
      }
    } catch (error) {
      console.error("Error fetching user's blogs:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <Toaster />

      <div className="container mx-auto px-4 mt-6">
        <h1 className="text-2xl font-bold mb-4">My Blogs</h1>

        {loading ? (
          <p className="text-gray-500">Loading your blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-600">You haven't created any blogs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyPost;
