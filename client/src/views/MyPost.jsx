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
            window.location.href = "/login";
            return;
        }

        const fetchMyBlogs = async () => {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
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
                toast.error(error.response?.data?.message || "Failed to load your posts.");
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