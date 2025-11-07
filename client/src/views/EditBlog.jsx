import MarkdownEditor from '@uiw/react-markdown-editor';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast,{ Toaster } from 'react-hot-toast';
import { BLOG_CATEGORIES } from './../CONSTANTS.jsx';
import { getCurrentUser } from './../util.js';
import {useParams} from 'react-router'

function EditBlog() {
 const [content, setContent]= useState("");
 const [title, setTitle]= useState("");
 const [category, setCategory]= useState(BLOG_CATEGORIES[0]);
  const [user, setUser]= useState(null);
  const {slug} = useParams();

const loadBlog = async()=>{
  if(!slug)return;
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs/${slug}`);

const blogData = response?.data?.blog;

  setTitle (blogData.title);
  setContent(blogData.content);
  setCategory(blogData.category);
}

 useEffect(()=>{
  document.documentElement.setAttribute("data-color-mode","light");
  setUser(getCurrentUser());
},[]);

const updateBlog = async () => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/blogs`,{
    title,
    content,
    category,
   author:user?._id 
});

if (response?.data?.success){
  toast.success("Blog created successfully");
  setTimeout(()=>{
    window.location.href="/";
  },2000);
};
}

const publishBlog = async () => {
  const response = await axios.patch(
    `${import.meta.env.VITE_API_URL}/blogs/${slug}/publish`
  )
  if (response?.data?.sucess){
toast.success("Blog published succeefully");
setTimeout(()=>{
  window.location.href="/"
},2000);
  }
};


  return (
    <div className='container mx-auto p-4'>
      <h1>New Blog</h1>
<input type="text" placeholder='Blog Title' 
className='border p-2 w-full my-4'
value={title}
onChange={(e)=>setTitle(e.target.value)}/>

<select value={category} onChange={(e)=>
  setCategory(e.target.value)} className="border p-2 my-4"
>
  {BLOG_CATEGORIES.map((cate)=>(
    <option key={cate} value={cate}>{cate}</option>
  ))}
</select>
      <MarkdownEditor 
      value={content}
        onChange={(value, viewUpdate)=>{
          setContent(value);
        }}
        height='500px'
      />
      <button className='bg-blue-500 text-white px-4 py-2 mt-4 rounded
      cursor-pointer' type='button'
      onClick={updateBlog}>
        Update Blog
      </button>

            <button className='bg-blue-500 text-white px-4 py-2 mt-4 rounded
      cursor-pointer' type='button'
      onClick={publishBlog}>
        Publish
      </button>
      <Toaster/>
    </div>
  )
}

export default EditBlog
