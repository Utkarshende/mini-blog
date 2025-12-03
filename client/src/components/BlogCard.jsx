import React from "react";
import { Link } from "react-router";

export default function BlogCard({
  title,
  author,
  category,
  slug,
  publishedAt,
  viewCount,
  status,
  onDelete
}) {
  const authorName = author?.name || author;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      onDelete(slug);
    }
  };

  return (
    <div className="border p-5 rounded-lg shadow-md bg-white hover:shadow-lg transition-all duration-200">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">
        By {authorName} • {category} •{" "}
        <span className="capitalize">{status}</span>
      </p>

      <div className="flex items-center gap-2 mt-4">
        
        {/* Read */}
        <Link
          to={`/blog/${slug}`}
          className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
        >
          Read
        </Link>

        {/* Edit */}
        <Link
          to={`/edit/${slug}`}
          className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition"
        >
          Edit
        </Link>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
