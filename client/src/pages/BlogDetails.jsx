import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import API from "../api/axios";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function BlogDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user")); // stored during login

  useEffect(() => {
    async function fetchBlog() {
      try {
        const token = localStorage.getItem("token");
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

  async function deleteBlog() {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;

    try {
      await API.delete(`/blogs/${slug}`);
      toast.success("Blog deleted successfully");
      navigate("/myposts");
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  }

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!blog) return <div className="p-4">Blog not found.</div>;

  const isOwner = currentUser?._id === blog?.author?._id;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-3xl">{blog.title}</CardTitle>
          <CardDescription className="flex flex-col md:flex-row gap-2 text-gray-500 mt-2">
            <span>By {blog.author?.name || "Unknown"}</span>
            <span>Category: {blog.category}</span>
            <span>Status: <span className="capitalize">{blog.status}</span></span>
          </CardDescription>
        </CardHeader>

        {isOwner && (
          <div className="flex gap-3 mt-4 px-4">
            <Button variant="outline" onClick={() => navigate(`/edit/${slug}`)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={deleteBlog}>
              Delete
            </Button>
          </div>
        )}

        <CardContent className="prose mt-6 px-4">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}

export default BlogDetails;
