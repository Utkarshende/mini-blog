import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard.jsx';
import Navbar from '../components/Navbar.jsx';
import { getCurrentUser } from './../util.js';
import toast, { Toaster } from 'react-hot-toast';

function MyPost() {
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // 1. Define the fetch function outside of useEffect using useCallback
    const fetchMyBlogs = useCallback(async (shouldForceRefresh) => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
            setIsLoading(false);
            // Optional: Show error if user is loggedIn but token is missing
            if (getCurrentUser()) {
                 toast.error("Authentication token missing. Please log in again.");
            }
            return;
        }

        try {
            const url = `${API_URL}/blogs/myposts`; 
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setBlogs(response.data.data); 
        } catch (error) {
            console.error("Error fetching user's blogs:", error);
            // Handle 401 Unauthorized explicitly
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in.");
                // Optional: Force logout and redirect
                // window.location.href = "/login";
            } else {
                 toast.error(error.response?.data?.message || "Failed to load your posts.");
            }
            setBlogs([]); // Ensure UI shows empty state on failure
        } finally {
            setIsLoading(false); 
        }
    }, [API_URL]); // dependency on API_URL is technically needed but often safe to omit

    useEffect(() => {
        const loggedInUser = getCurrentUser();
        setUser(loggedInUser);
        
        if (!loggedInUser) {
            window.location.href = "/login";
            return;
        }

        // --- 🔑 FIX: Auto-Refresh Logic using Local Storage Flag ---
        const shouldRefresh = localStorage.getItem('blogsUpdated');

        if (shouldRefresh === 'true') {
            // 1. Clear the flag 
            localStorage.removeItem('blogsUpdated');
            // 2. Force a re-fetch immediately
            fetchMyBlogs(true); 
        } else {
            // 3. Regular initial fetch
            fetchMyBlogs(false); 
        }
        // --- End Fix ---

    }, [fetchMyBlogs]); // Dependency on fetchMyBlogs is correct due to useCallback

    if (isLoading) {
        return (
            <div className='container mx-auto p-4 text-center'>
                <Navbar />
                <div className='mt-8 text-xl text-gray-600'>Loading your posts...</div>
            </div>
        );
    }
    
    if (blogs.length === 0) {
        return (
            <div className='container mx-auto p-4 text-center'>
                <Navbar />
                <div className='mt-8 text-xl text-gray-600'>
                    You haven't created any posts yet. <br/>
                    <a href="/new" className="text-blue-500 hover:underline">Click here to create a new one.</a>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className='container mx-auto p-4'>
                <h1 className='text-3xl font-bold mb-6'>My Posts ({user?.name})</h1>
                {
                    blogs.map((blog) => {
                        const {
                            _id, 
                            title, 
                            author, 
                            category, 
                            slug, 
                            updatedAt,
                            publishedAt,
                            viewCount,
                            status 
                        } = blog;

                        return (
                            <BlogCard 
                                key={_id}
                                title={title}
                                author={author}
                                category={category}
                                slug={slug}
                                updatedAt={updatedAt}
                                publishedAt={publishedAt}
                                viewCount={viewCount}
                                status={status} 
                            />
                        );
                    })
                }
            </div>
            <Toaster />
        </div>
    );
}

export default MyPost;