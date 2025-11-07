import React from 'react'
import { Link } from 'react-router';

function BlogCard({
    title,
    author,
   publishedAt,
   updatedAt,
   status,
    category,
    slug
}) {
  return (
    <div className='border p-4 my-4 rounded-md relative'> 
      <h2>
        {status != "published" ? (
          <span>
            {status}
          </span>
        ):null }
        {title}
        </h2>
       
        <div className='flex items-center gap-4 my-2'>
        <div className=' flex item-center text-2xl font-semibold justify-center bg-orange-500 w-[50px] h-[50px] text-center rounded-full' >
            {author.name.substring(0,1)}
            </div>
            
            <div>
        <p>{author.name}</p>
       <p>{author.email}</p>
            </div>

            </div>
        <p className='text-sm mt-2'>
          Published On: {new Date(publishedAt || updatedAt).toLocaleString()}
        </p>


    <span className='absolute top-2 right-2 bg-gray-200 px-2 py-1
     rounded-md text-gray-700 text-xs font-semibold'>   
        { category}
        </span>
{
    status === "published" ? (
         <Link className='cursor-pointer absolute bg-gray-700 text-white px-6 py-2 border-md'
        to={`/blog/${slug}`}>
        Read More</Link>
  ) : (
    <Link className='cursor-pointer absolute bg-gray-700 text-white px-6 py-2 border-md'
        to={`/edit/${slug}`}>
        Edit
        </Link>
  )}
  </div>
  );
 
}

export default BlogCard
