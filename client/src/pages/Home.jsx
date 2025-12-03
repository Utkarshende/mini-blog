import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await API.get("/blogs");
        if (res.data?.success) setBlogs(res.data.blogs || []);
      } catch {
        console.error("Failed to fetch blogs");
      }
    }
    loadBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase()) ||
    blog.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HEADER */}
      <div className="text-center py-8 animate-fadeIn">
        <h1 className="text-3xl font-semibold">Explore Blogs</h1>
        <p className="text-gray-500 mt-1">
          Read, learn, and share what matters to you.
        </p>
      </div>

      {/* SEARCH */}
      <div className="max-w-md mx-auto px-4 mb-8 flex gap-2">
        <Input
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button disabled>Search</Button>
      </div>

      {/* BLOG LIST */}
      <div className="max-w-5xl mx-auto px-4">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <p className="text-gray-500 mb-4 text-lg">No blogs found.</p>
            <Button asChild>
              <a href="/new">Write a Blog ➜</a>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredBlogs.map(blog => (
              <BlogCard key={blog._id} {...blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
