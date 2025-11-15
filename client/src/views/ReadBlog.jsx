import {useParams} from "react-router";
import {useState,useEffect} from "react";
import axios from "axios";  
import MarkdownEditor from '@uiw/react-markdown-editor';
import Navbar from "../components/Navbar.jsx";
import { getCurrentUser } from './../util.js'; // Needed to check auth for drafts

function ReadBlog() {
    const {slug}= useParams();
    const [blog, setBlog]= useState({});
    const [user, setUser] = useState(getCurrentUser()); // Get current user

    // ⭐ Define API_URL once
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const fetchBlog= async()=>{
        try {
            // ⭐ CRITICAL FIX: Corrected typo from /bllogs/ to /blogs/
            const response = await axios.get(`${API_URL}/blogs/${slug}`); 
            setBlog (response.data.data);
        } catch (error) {
            console.error("Error fetching blog:", error);
            // Handle 404/403 errors appropriately here
        }
    };

    useEffect(()=>{
        document.documentElement.setAttribute("data-color-mode","light");
        fetchBlog();
    },[slug]); // Depend on slug just in case

    // Fallback for null blog object while loading
    if (!blog.title) {
        return (
            <div className="mx-auto container p-4">
                <Navbar/>
                <h1 className="text-center mt-5">Loading...</h1>
            </div>
        );
    }
    
    return (
        <div className="mx-auto container p-4">
            <Navbar/>
            <h1 className="text-2xl font-bold mb-4">
                {blog.title}
            </h1>
            
            <p className='text-gray-500 text-sm mb-4'>
                {/* ⭐ FIX: Use publishedAt, fallback to updatedAt */}
                Published On: {new Date (blog.publishedAt || blog.updatedAt).toLocaleString()},
                Read By : {blog.viewCount} people
            </p>
            
            <div className="flex items-center mb-4">
                <span className="text-sm bg-orange-400 px-3 py-1 
                rounded-full text-white font-semibold">
                    {blog.category}
                </span>

                <div className='flex items-center gap-4 my-2 ml-14'>
                    <div className='flex items-center text-xl font-semibold justify-center bg-orange-500 w-[50px] h-[50px] text-white rounded-full' >
                        {blog?.author?.name?.substring(0,1)}
                    </div>
                    
                    <div>
                        <p className="font-medium">{blog?.author?.name}</p>
                        <p className="text-sm text-gray-500">{blog?.author?.email}</p>
                    </div>
                </div>
            </div>
            {/* The Markdown content viewer */}
            <MarkdownEditor.Markdown source={blog.content} />
        </div>
    );
}

export default ReadBlog;