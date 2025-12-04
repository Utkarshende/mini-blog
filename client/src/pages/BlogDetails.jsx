import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import API from "../api/axios";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

function BlogDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Helper to get token cleanly
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    async function fetchBlog() {
      try {
        // CLEANUP: Using simple getItem, assuming token is stored correctly in Login.jsx
        const token = getToken(); 
        const res = await API.get(`/blogs/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlog(res.data.data);
      } catch (err) {
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug]);

  const deleteBlog = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      // CLEANUP: Using simple getItem, assuming token is stored correctly
      const token = getToken(); 
      await API.delete(`/blogs/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Blog deleted successfully");
      navigate("/myposts");
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!blog) return <div className="p-4">Blog not found.</div>;

  const isOwner = currentUser?._id === blog?.author?._id;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      {/* Blog Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-200">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">{blog.title}</h1>

        {/* Author, Category, Status */}
        <p className="text-gray-500 mt-2">
          By <span className="font-medium">{blog.author?.name || "Unknown"}</span> •{" "}
          <span className="font-medium">{blog.category}</span> •{" "}
          <span className="capitalize">{blog.status}</span>
        </p>

        {/* Edit/Delete buttons */}
        {isOwner && (
          <div className="flex gap-3 mt-4">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              onClick={() => navigate(`/edit/${slug}`)}
            >
              Edit
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={deleteBlog}
            >
              Delete
            </button>
          </div>
        )}

        {/* Blog Content */}
        <div className="prose mt-6">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;