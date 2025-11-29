import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        const loggedInUser = getCurrentUser();
        setUser(loggedInUser);

        if (!loggedInUser) {
            toast.error("Please login first!");
            setTimeout(() => window.location.href = "/login", 1200);
            return;
        }

        const fetchMyBlogs = async () => {
            setIsLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Authentication token missing. Please login again.");
                setTimeout(() => window.location.href = "/login", 1200);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/blogs/myposts`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setBlogs(response.data.data);
            } catch (error) {
                console.error("Error fetching user's blogs:", error);

                if (error.response?.status === 401) {
                    toast.error("Session expired. Please login again.");
                    localStorage.removeItem("token");
                    localStorage.removeItem("loggedInUser");
                    setTimeout(() => window.location.href = "/login", 1200);
                } else {
                    toast.error(error.response?.data?.message || "Failed to load posts.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyBlogs();
    }, []);

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
                    No posts found. <br />
                    <a href="/new" className="text-blue-500 hover:underline">
                        Create your first post →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className='container mx-auto p-4'>
                <h1 className='text-3xl font-bold mb-6'>My Posts ({user?.name})</h1>

                {blogs.map(blog => (
                    <BlogCard 
                        key={blog._id}
                        {...blog}
                    />
                ))}
            </div>
            <Toaster />
        </div>
    );
}

export default MyPost;
