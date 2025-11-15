import MarkdownEditor from '@uiw/react-markdown-editor';
import { useEffect, useState } from 'react';
import { BLOG_CATEGORIES } from './../CONSTANTS.jsx';
import axios from 'axios';
import { getCurrentUser } from './../util.js';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';

function NewBlog() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
    const [user, setUser] = useState(null);
    
    // ⭐ Define API_URL once
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    useEffect(() => {
        document.documentElement.setAttribute("data-color-mode", "light");
        setUser(getCurrentUser());
    }, []);

    const saveBlog = async () => {
        if (!title || !content || !category) {
            toast.error("All fields are required.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You must be logged in to create a blog.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/blogs`, {
                title,
                content,
                category,
                // The author is extracted from the JWT token on the backend, 
                // so passing it here (user?._id) is redundant but harmless 
                // if the backend relies on the token.
            },
            {
                // ⭐ CRITICAL FIX: Use 'headers' (plural)
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data?.success) {
                toast.success("Blog created successfully");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            }
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Error creating blog");
        }
    };
    
    // ⭐ Component return is placed correctly after all functions
    return (
        <div className='container mx-auto p-4'>
            <Navbar />
            <h1 className='text-3xl font-bold mb-4'>New Blog</h1>
            
            <input 
                type="text" 
                placeholder='Blog Title'
                className='border p-2 w-full my-4'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="border p-2 my-4"
            >
                {BLOG_CATEGORIES.map((cate) => (
                    <option key={cate} value={cate}>{cate}</option>
                ))}
            </select>
            
            <MarkdownEditor 
                value={content}
                onChange={(value) => {
                    setContent(value);
                }}
                height='500px'
            />
            
            <button 
                className='bg-blue-500 text-white px-4 py-2 mt-4 rounded cursor-pointer hover:bg-blue-600 transition-colors' 
                type='button'
                onClick={saveBlog}
            >
                Save Blog
            </button>
            <Toaster />
        </div>
    );
}

export default NewBlog;