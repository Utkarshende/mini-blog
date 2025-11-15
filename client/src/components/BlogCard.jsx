import React from 'react'
import { Link } from 'react-router'; 

function BlogCard({
    title,
    author,
    publishedAt,
    updatedAt,
    status, 
    category,
    slug,
    viewCount
}) {
    return (
        <div className='border p-4 my-4 rounded-md relative shadow-md hover:shadow-lg transition-shadow'> 
            <h2 className='text-xl font-bold mb-2'>
                {status !== "published" ? (
                    <span className='mr-2 text-sm text-red-500 bg-red-100 px-2 py-1 rounded-full font-semibold'>
                        {status.toUpperCase()}
                    </span>
                ) : null}
                {title}
            </h2>
            
            <div className='flex items-center gap-4 my-2'>
                <div className='flex items-center text-xl font-semibold justify-center bg-orange-500 w-[40px] h-[40px] text-white rounded-full' >
                    {author.name.substring(0, 1)}
                </div>
                <div>
                    <p className='font-medium'>{author.name}</p>
                    <p className='text-sm text-gray-500'>{author.email}</p>
                </div>
            </div>
            
            <p className='text-sm mt-2 text-gray-600'>
                Published On: {new Date(publishedAt || updatedAt).toLocaleString()},
                Read By: {viewCount}
            </p>
            <span className='absolute top-4 right-4 bg-gray-200 px-3 py-1
            rounded-md text-gray-700 text-xs font-semibold'>   
                {category}
            </span>
            
            <div className='mt-4 pt-2 border-t border-gray-100'>
                {status === "published" ? (
                    <Link 
                        className='inline-block bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors'
                        to={`/blog/${slug}`}
                    >
                        Read More
                    </Link>
                ) : (
                    <Link 
                        className='inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors'
                        to={`/edit/${slug}`}
                    >
                        Edit
                    </Link>
                )}
            </div>
        </div>
    );
}

export default BlogCard;