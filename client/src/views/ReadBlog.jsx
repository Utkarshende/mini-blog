import {useParams} from "react-router";
import {useState,useEffect} from "react";
import axios from "axios";  
import MarkdownEditor from '@uiw/react-markdown-editor';


function ReadBlog() {

  const {slug}= useParams();
  const [blog, setBlog]= useState({});

  const fetchBlog= async()=>{
    const response= await axios.get(`${import.meta.env.VITE_API_URL}/bllogs/${slug}`);
    setBlog (response.data.data);
  };

  useEffect(()=>{
      document.documentElement.setAttribute("data-color-mode","light");
      fetchBlog();
  },[]);
    
  return (
    <div className="mx-auto container p-4">
      <h1 className="text-2xl font-bold mb-4">
        {blog.title}
      </h1>
      <p>
        Published On: {new Date (blog.updatedAt || blog.updateedAt).toLocaleString()}
      </p>
      <div className="flex items-center mb-4">
         <span className="text-2xl bg-orange-400 px-4 py-2 
         rounded-full text-white ">
          {blog.category}
         </span>

          <div className='flex items-center gap-4 my-2 ml-14'>
        <div className=' flex item-center text-2xl font-semibold justify-center bg-orange-500 w-[50px] h-[50px] text-center rounded-full' >
            {blog?.author?.name?.substring(0,1)}
            </div>
            
            <div>
        <p>{blog?.author?.name}</p>
       <p>{blog?.author?.email}</p>
            </div>
</div>
            </div>
      <MarkdownEditor.Markdown source={blog.content} />
   
    </div>
  )
}

export default ReadBlog
