import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import API from "../api/axios";
import toast from "react-hot-toast";
import MarkdownEditor from "@uiw/react-markdown-editor";

function EditBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get(`/blogs/${slug}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const blog = res.data.data;
        setTitle(blog.title);
        setContent(blog.content);
        setCategory(blog.category);
      } catch (err) {
        toast.error("Failed to fetch blog");
      }
    }
    fetchBlog();
  }, [slug]);

  async function saveChanges() {
    try {
      const token = localStorage.getItem("token");
console.log("PUT Request slug:", slug);
      await API.put(
        `/blogs/${slug}`,
        { title, content, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Blog updated successfully");
      navigate(`/blog/${slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update blog");
      console.log("UPDATE ERROR:", err.response?.data);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Edit Blog</h1>

      <input
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog Title"
      />

      <MarkdownEditor
        height={400}
        value={content}
        onChange={(value) => setContent(value)}
      />

      <input
        className="w-full p-2 border rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />

      <button
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        onClick={saveChanges}
      >
        Save Changes
      </button>
    </div>
  );
}

export default EditBlog;
