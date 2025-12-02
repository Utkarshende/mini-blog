import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getToken } from "../util.js";
import MarkdownEditor from "@uiw/react-markdown-editor";

export default function EditBlog() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    axios.get(`${API_URL}/api/blogs/${slug}`).then(res => setBlog(res.data.blog));
  }, []);

  const saveChanges = async () => {
    try {
      const token = getToken();
      const res = await axios.put(
        `${API_URL}/api/blogs/${slug}`,
        blog,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Blog updated!");
        setTimeout(() => window.location.href = `/blog/${slug}`, 1000);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <input
        type="text"
        value={blog.title}
        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
        className="border p-3 w-full rounded mb-4"
      />

      <MarkdownEditor
        value={blog.content}
        onChange={(value) => setBlog({ ...blog, content: value })}
        height="500px"
      />

      <button 
        onClick={saveChanges}
        className="bg-indigo-600 text-white px-6 py-2 rounded mt-4"
      >
        Save Changes
      </button>
    </div>
  );
}
