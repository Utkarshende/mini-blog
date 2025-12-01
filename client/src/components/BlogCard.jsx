import { Link } from 'react-router';

export default function BlogCard({ title, author, category, slug, viewCount, status }) {
  return (
    <div className="border rounded p-4 mb-4 shadow-md">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">Author: {author?.name}</p>
      <p className="text-gray-600">Category: {category}</p>
      <p>Status: {status}</p>
      <p>Views: {viewCount}</p>
      <Link to={`/blogs/${slug}`} className="text-blue-500 hover:underline">Read More</Link>
    </div>
  );
}
