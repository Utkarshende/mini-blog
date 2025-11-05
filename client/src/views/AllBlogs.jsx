import React, { useEffect, useState } from 'react'
import { getCurrentUser } from './../util.js';
import axios from 'axios';
import BlogCard from '../components/BlogCard.jsx';
function AllBlogs() {

  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
  setBlogs(response.data.data);
  console.log(response.data);
  };

  useEffect(() => {
    setUser(getCurrentUser());  
    fetchBlogs();
  },[]);


  return (
    <div>
      <h1>
        All Blogs</h1>
        {user ? `Hello, ${user.name} !` : "Welcome Guest !"}
<div className='container mx-auto p-4'>
  {
    blogs.map((blog) => {
      const {_id, 
        title , 
        content,
        author, 
        category, 
        slug, 
        updatedAt,
      publishedAt} = blog;
      return
      <BlogCard key={blog._id}
      title={title}
      content={content}
      author={author}
      category={category}
      slug={slug}
      updatedAt={updatedAt}
      publishedAt={publishedAt}
      />
      })
  }
</div>

    </div>
  )
}

export default AllBlogs
