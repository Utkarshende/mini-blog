import axios from 'axios';
import { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard.jsx';
import { getCurrentUser } from './../util.js';
import Navbar from '../components/Navbar.jsx';


function AllBlogs() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs?author=${user?._id || ""}`);
  setBlogs(response.data.data);
  };

  useEffect(() => {
    setUser(getCurrentUser());
  },[]);

useEffect(()=>{
fetchBlogs();
},[user])

  return (
    <div>
      
<div className='container mx-auto p-4'>
  <Navbar/>
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
