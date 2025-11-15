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
                // The author is extracted from the JWT token on the backend
            },
            {
                // Correctly sending the JWT token in the Authorization header
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data?.success) {
                toast.success("Blog created successfully and saved as a draft!");
                setTimeout(() => {
                    // Redirect to My Posts page after creation
                    window.location.href = "/myposts";
                }, 1500);
            }
        }
        catch (err) {
            // ⭐ DEBUGGING: Log the full response to the console to see the server's error message
            console.error("API Error Response:", err.response);
            toast.error(err?.response?.data?.message || "Error creating blog. Check console for details.");
        }
    };
    
    // ⭐ Component return is placed correctly after all functions
    return (
        <div className='container mx-auto p-4'>
            <Navbar />
            <h1 className='text-3xl font-bold mb-4 text-gray-800'>Create New Post</h1>
            
            <input 
                type="text" 
                placeholder='Blog Title'
                // ⭐ Theming: Indigo focus ring
                className='border p-2 w-full my-4 rounded focus:ring-indigo-500 focus:border-indigo-500'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                // ⭐ Theming: Indigo focus ring
                className="border p-2 my-4 rounded focus:ring-indigo-500 focus:border-indigo-500"
            >
                {BLOG_CATEGORIES.map((cate) => (
                    <option key={cate} value={cate}>{cate}</option>
                ))}
            </select>
            
            <div className='rounded overflow-hidden border border-gray-300 shadow-md'>
                <MarkdownEditor 
                    value={content}
                    onChange={(value) => {
                        setContent(value);
                    }}
                    height='500px'
                />
            </div>
            
            <button 
                // ⭐ Theming: Indigo button
                className='bg-indigo-600 text-white px-6 py-2 mt-4 rounded cursor-pointer hover:bg-indigo-700 transition-colors shadow-md' 
                type='button'
                onClick={saveBlog}
            >
                Save Draft
            </button>
            <Toaster />
        </div>
    );
}

export default NewBlog;