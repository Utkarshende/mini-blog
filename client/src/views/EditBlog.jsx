import MarkdownEditor from '@uiw/react-markdown-editor';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BLOG_CATEGORIES } from './../CONSTANTS.jsx';
import { getCurrentUser } from './../util.js';
import { useParams } from 'react-router';
import Navbar from '../components/Navbar.jsx';

function EditBlog() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
    const [user, setUser] = useState(null);
    const { slug } = useParams();
    
    // ⭐ Define API_URL once
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // Function to load the blog content when the component mounts or slug changes
    const loadBlog = async () => {
        if (!slug) return;
        try {
            // Note: The backend route should be '/blogs/:slug'
            const response = await axios.get(`${API_URL}/blogs/${slug}`);

            const blogData = response?.data?.data; // Adjusted to match the backend structure (data: blog)

            if (blogData) {
                setTitle(blogData.title);
                setContent(blogData.content);
                setCategory(blogData.category);
            } else {
                toast.error("Blog data not found.");
            }
        } catch (err) {
            console.error("Error loading blog:", err);
            toast.error(err?.response?.data?.message || "Error loading blog for edit.");
        }
    }

    // ⭐ Separate useEffect to load the blog data based on slug
    useEffect(() => {
        loadBlog();
    }, [slug]); // Depend on slug

    // useEffect to set user and dark mode preference once on mount
    useEffect(() => {
        document.documentElement.setAttribute("data-color-mode", "light");
        setUser(getCurrentUser());
    }, []);

    const updateBlog = async () => {
        if (!title || !content || !category) {
            toast.error("All fields are required.");
            return;
        }
        
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in to update a blog.");
                return;
            }

            const response = await axios.put(`${API_URL}/blogs/${slug}`, {
                title,
                content,
                category
            },
            {
                // ⭐ CRITICAL FIX: Use 'headers' (plural)
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data?.success) {
                toast.success("Blog updated successfully");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500); // Shorter timeout for better UX
            }
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Error updating blog");
        }
    };

    const publishBlog = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in to publish a blog.");
                return;
            }

            const response = await axios.patch(
                `${API_URL}/blogs/${slug}/publish`,
                // PATCH requests for status change usually don't need a body, but must carry the config object
                {}, 
                {
                    // ⭐ CRITICAL FIX: Use 'headers' (plural)
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // ⭐ CRITICAL FIX: Check for 'success' (lowercase 's') if your backend uses that
            if (response?.data?.success) { 
                toast.success("Blog published successfully");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            }
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Error publishing blog");
        }
    };

    return (
        <div className='container mx-auto p-4'>
            <Navbar />
            <h1 className='text-3xl font-bold mb-4'>Edit Blog</h1>
            
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
            
            <div className="flex gap-4 mt-4">
                <button 
                    className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors' 
                    type='button'
                    onClick={updateBlog}
                >
                    Update Blog
                </button>

                <button 
                    className='bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition-colors' 
                    type='button'
                    onClick={publishBlog}
                >
                    Publish
                </button>
            </div>
            <Toaster />
        </div>
    )
}

export default EditBlog;