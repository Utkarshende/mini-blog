import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

      {/* --- HERO SECTION --- */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Discover Ideas & Stories
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Read insightful blogs from the community.
        </p>
      </section>

      {/* --- SEARCH BAR --- */}
      <div className="max-w-xl mx-auto px-4 flex gap-2">
        <Input
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="default">Search</Button>
      </div>

      {/* --- BLOGS SECTION --- */}
      <div className="max-w-5xl mx-auto mt-10 px-4">
        {filteredBlogs.length === 0 ? (
          <Card className="p-6 text-center">
            <CardContent>
              <p className="text-gray-500">No blogs found 👀</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} {...blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
