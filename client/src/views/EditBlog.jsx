import MarkdownEditor from '@uiw/react-markdown-editor';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
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
    const [originalAuthorId, setOriginalAuthorId] = useState(null); // State to store the author's ID
    const { slug } = useParams();
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    
    // Utility function to get the current token
    const getToken = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please log in to perform this action.");
        }
        return token;
    }

    // Load the blog data
    const loadBlog = useCallback(async (currentUser) => {
        if (!slug || !currentUser) return;

        try {
            // Fetch the blog data
            const response = await axios.get(`${API_URL}/blogs/${slug}`);
            const blogData = response?.data?.data; 

            if (!blogData) {
                toast.error("Blog data not found.");
                return;
            }

            // 🛑 SECURITY CHECK: Ensure current user is the author
            if (blogData.author._id !== currentUser.id) {
                toast.error("You are not authorized to edit this blog.");
                window.location.href = "/"; // Redirect unauthorized user
                return;
            }

            // Set state only after passing the security check
            setTitle(blogData.title);
            setContent(blogData.content);
            setCategory(blogData.category);
            setOriginalAuthorId(blogData.author._id); // Store the author ID

        } catch (err) {
            console.error("Error loading blog:", err);
            // Handle 404/not found errors gracefully
            if (err?.response?.status === 404) {
                 toast.error("Blog not found.");
            } else {
                 toast.error(err?.response?.data?.message || "Error loading blog for edit.");
            }
            // Optional: Redirect home on failure
            // setTimeout(() => window.location.href = "/", 1500); 
        }
    }, [slug, API_URL]);

    // 1. Load current user and set color mode on mount
    useEffect(() => {
        document.documentElement.setAttribute("data-color-mode", "light");
        const currentUser = getCurrentUser();
        setUser(currentUser);

        if (!currentUser) {
            toast.error("Please log in to edit a blog.");
            window.location.href = "/login"; // Force login if not logged in
        }
    }, []);

    // 2. Load blog data only after user state is set
    useEffect(() => {
        if (user) {
            loadBlog(user);
        }
    }, [user, loadBlog]);


    // Update Blog (PUT)
    const updateBlog = async () => {
        if (!title || !content || !category) {
            toast.error("All fields are required.");
            return;
        }
        
        const token = getToken();
        if (!token) return;

        try {
            const response = await axios.put(`${API_URL}/blogs/${slug}`, {
                title,
                content,
                category
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data?.success) {
                // 🔑 Optional: Set a flag to refresh MyPost page if you redirect there
                // localStorage.setItem('blogsUpdated', 'true'); 
                
                toast.success("Blog updated successfully");
                setTimeout(() => {
                    // Consider redirecting to the single blog view page instead of home
                    window.location.href = `/blog/${slug}`; 
                }, 1500); 
            }
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Error updating blog");
        }
    };

    // Publish Blog (PATCH)
    const publishBlog = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await axios.patch(
                `${API_URL}/blogs/${slug}/publish`,
                {}, // Empty body for a PATCH status update
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            if (response?.data?.success) { 
                toast.success("Blog published successfully");
                setTimeout(() => {
                    window.location.href = `/blog/${slug}`;
                }, 1500);
            }
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Error publishing blog");
        }
    };

    // Optionally show a loading indicator if needed
    if (!user || !title) {
        return (
            <div className='container mx-auto p-4 text-center'>
                <Navbar />
                <div className='mt-8 text-xl text-gray-600'>Loading edit form...</div>
            </div>
        );
    }


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