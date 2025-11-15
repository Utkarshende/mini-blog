import axios from 'axios';
import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard.jsx';
import { getCurrentUser } from './../util.js';
import Navbar from '../components/Navbar.jsx';

function AllBlogs() {
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // ⭐ Added loading state

    // ⭐ Defined API_URL with a fallback for robustness
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // ⭐ Combined useEffect logic for efficiency (runs only once on mount)
    useEffect(() => {
        const loggedInUser = getCurrentUser();
        setUser(loggedInUser);

        const fetchBlogs = async (currentUser) => {
            setIsLoading(true);

            // Use the user ID if available, otherwise an empty string
            const authorId = currentUser?._id || "";
            const url = `${API_URL}/blogs?author=${authorId}`;
            
            try {
                const response = await axios.get(url);
                setBlogs(response.data.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                // In a real app, you might set an error state here
            } finally {
                setIsLoading(false); 
            }
        };

        fetchBlogs(loggedInUser);

    }, []); // Empty dependency array means this runs only once on mount

    // --- Conditional Rendering ---
    
    if (isLoading) {
        return (
            <div className='container mx-auto p-4 text-center'>
                <Navbar />
                <div className='mt-8 text-xl text-gray-600'>Loading blogs...</div>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className='container mx-auto p-4 text-center'>
                <Navbar />
                <div className='mt-8 text-xl text-gray-600'>
                    {user ? "You haven't posted any blogs yet." : "No published blogs found."}
                </div>
            </div>
        );
    }


    return (
        <div>
            <div className='container mx-auto p-4'>
                <Navbar />
                {
                    // ⭐ CRITICAL FIX: Ensure the BlogCard is explicitly returned from the map function
                    blogs.map((blog) => {
                        const {
                            _id, 
                            title, 
                            content, 
                            author, 
                            category, 
                            slug, 
                            updatedAt,
                            publishedAt,
                            viewCount
                        } = blog;

                        // Explicit return is necessary when using curly braces
                        return (
                            <BlogCard 
                                key={_id}
                                title={title}
                                content={content}
                                author={author}
                                category={category}
                                slug={slug}
                                updatedAt={updatedAt}
                                publishedAt={publishedAt}
                                viewCount={viewCount}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
}

export default AllBlogs;