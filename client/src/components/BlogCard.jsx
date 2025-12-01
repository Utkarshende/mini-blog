import React from 'react';
import { Link } from 'react-router';

export default function BlogCard({ title, author, category, slug, publishedAt, viewCount, status }) {
  const authorName = author?.name || (author?.name === undefined ? author : '');
  return (
    <div className="border p-4 rounded mb-3 shadow">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">By {authorName} • {category} • {status}</p>
      <div className="mt-2">
        <Link to={`/blog/${slug}`} className="text-blue-600 hover:underline">Read</Link>
      </div>
    </div>
  );
}
