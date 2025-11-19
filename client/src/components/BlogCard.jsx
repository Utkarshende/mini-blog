import React from 'react';
import { Link } from 'react-router'; 

const safeDateFormatter = (dateInput, options = { year: 'numeric', month: 'short', day: 'numeric' }) => {
    if (!dateInput) {
        return 'N/A';
    }
    const dateObject = new Date(dateInput);
    
    if (isNaN(dateObject.getTime())) {
        return 'Invalid Date';
    }
    
    return dateObject.toLocaleString('en-US', options);
};

function BlogCard({
    title,
    author,
    publishedAt,
    updatedAt,
    status,
    category,
    slug,
    // Add default value assignment for viewCount
    viewCount = 0, // <--- FIX 1: Provide a default value
    description
}) {
    const safeStatus = status || 'draft'; 
    const isPublished = safeStatus === 'published';

    const publishedDate = safeDateFormatter(publishedAt);
    
    const updatedDate = safeDateFormatter(updatedAt, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    const showUpdated = updatedAt && publishedAt && 
                        new Date(updatedAt).getTime() > new Date(publishedAt).getTime();
    
    const buttonClasses = isPublished 
        ? 'bg-gray-700 hover:bg-gray-800' 
        : 'bg-blue-600 hover:bg-blue-700';

    return (
        <div className='
            border p-5 my-4 rounded-xl relative shadow-lg hover:shadow-xl transition-all duration-300 bg-white
        '> 
            <span className='absolute top-5 right-5 bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-xs font-semibold tracking-wider'>   
                {category}
            </span>

            <h2 className='text-xl font-extrabold text-gray-900 mb-2 pr-20'>
                {!isPublished && (
                    <span className='mr-2 text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full font-bold uppercase'>
                        {safeStatus.toUpperCase()} 
                    </span>
                )}
                {title}
            </h2>
            
            {description && (
                <p className='text-base text-gray-600 mt-2 mb-4'>
                    {description}
                </p>
            )}
            
            <hr className='border-gray-100 my-4' />

            <div className='flex items-center gap-4 mb-4'>
                <div className='flex items-center text-xl font-semibold justify-center bg-orange-500 w-10 h-10 text-white rounded-full' >
                    {author?.name?.substring(0, 1) || 'A'} 
                </div>
                <div>
                    <p className='font-semibold text-gray-800 text-sm'>{author?.name || 'Unknown Author'}</p>
                    <p className='text-xs text-gray-500'>{author?.email}</p>
                </div>
            </div>
            
            <div className='text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1 mt-4'>
                <p>
                    <span className='font-medium text-gray-700'>Published:</span> {publishedDate}
                </p>
                {showUpdated && (
                    <p className='text-sm text-green-600 font-semibold flex items-center gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9.5 7.7a.75.75 0 0 1 1.5 0v4.866l1.986-1.144a.75.75 0 1 1 .75 1.298l-3.25 1.875a.75.75 0 0 1-1.125-.65V7.7Z" clipRule="evenodd" />
                        </svg>
                        Last Updated: {updatedDate}
                    </p>
                )}
                <p>
                    <span className='font-medium text-gray-700'>Views:</span> **{viewCount.toLocaleString()}** {/* Safe now because viewCount defaults to 0 */}
                </p>
            </div>
            
            <div className='mt-6 pt-4 border-t border-gray-100'>
                <Link 
                    className={`inline-block text-white px-5 py-2 rounded-lg text-sm font-semibold tracking-wide shadow-md transition-colors ${buttonClasses}`}
                    to={isPublished ? `/blog/${slug}` : `/edit/${slug}`}
                >
                    {isPublished ? 'Read Article' : 'Continue Editing'}
                </Link>
            </div>
        </div>
    );
}

export default BlogCard;