import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BlogCard({ title, slug, description, createdAt, onDelete, onEdit }) {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-md transition bg-white mb-4">
      
      {/* Clickable Blog Content */}
      <Link to={`/blog/${slug}`}>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
        <p className="text-sm text-gray-400 mt-2">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </Link>

      {/* Action Buttons (Only show if the page passes them) */}
      {(onEdit || onDelete) && (
        <div className="flex gap-3 mt-4">
          {onEdit && (
            <button
              onClick={() => onEdit(slug)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(slug)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

