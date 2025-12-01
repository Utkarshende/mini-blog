import React, { useEffect, useState } from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { BLOG_CATEGORIES } from "./../CONSTANTS.jsx";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";

function NewBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", "light");
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must login first.");
      setTimeout(() => (window.location.href = "/login"), 1000);
    }
  }, []);

  const saveBlog = async () => {
    if (!title || !content || !category) {
      toast.error("All fields are required!");
      return;
    }

    const token = localStorage.getItem("token")?.replace(/"/g, "");
console.log("TOKEN SENT:", token);
if (!token) {
      toast.error("You must login first.");
      setTimeout(() => (window.location.href = "/login"), 1000);
      return;
    }


    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/blogs`,
        { title, content, category },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Blog created successfully and saved as draft!");
        // Redirect to MyPosts after short delay
        setTimeout(() => (window.location.href = "/myposts"), 1500);
      } else {
        toast.error(res.data.message || "Failed to save blog");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
      } else {
        toast.error(err.response?.data?.message || "Server error creating blog.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Create New Blog</h1>

      <input
        type="text"
        placeholder="Blog Title"
        className="border p-2 w-full my-4 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 my-4 rounded"
      >
        {BLOG_CATEGORIES.map((cate) => (
          <option key={cate} value={cate}>
            {cate}
          </option>
        ))}
      </select>

      <div className="rounded overflow-hidden border border-gray-300 shadow-md">
        <MarkdownEditor
          value={content}
          onChange={(value) => setContent(value)}
          height="500px"
        />
      </div>

      <button
        type="button"
        onClick={saveBlog}
        className="bg-indigo-600 text-white px-6 py-2 mt-4 rounded hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Draft"}
      </button>

      <Toaster />
    </div>
  );
}

export default NewBlog;
