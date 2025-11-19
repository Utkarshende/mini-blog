import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
// axios removed and replaced with mocked data for self-contained execution

// --- Utility Functions ---

/**
 * Mock utility function to simulate getting the current user.
 * In a real application, this would fetch user data from a token or session.
 */
const getCurrentUser = () => {
    // Mock user object for demonstration purposes.
    // In a real app, this would be retrieved from localStorage or session.
    // We mock it to ensure the component can render the 'My Posts' section.
    return { 
        id: 'user-12345', 
        name: 'Jane Doe', 
        email: 'jane.doe@example.com' 
    };
};

// --- Components ---

/**
 * Basic Navbar Component (Mocked for single-file environment).
 */
const Navbar = () => {
    return (
        <header className='py-4 border-b border-gray-200'>
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-gray-800'>Blogging Platform</h2>
                <span className='text-sm text-gray-500'>Welcome Back!</span>
            </div>
        </header>
    );
};

/**
 * Renders a card for a single blog post.
 * (Simplified/Mocked for single-file environment)
 */
const BlogCard = ({ title, content, author, status }) => {
    const isDraft = status === 'draft';
    const statusColor = isDraft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';

    // Truncate content for display
    const truncatedContent = content.substring(0, 150) + '...';

    return (
        <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-gray-100'>
            <div className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusColor} mb-3`}>
                {status.toUpperCase()}
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-2'>{title}</h3>
            <p className='text-sm text-gray-600 mb-4'>{truncatedContent}</p>
            <div className='flex justify-between items-center text-xs text-gray-400'>
                <span>Author: {author?.name || 'Unknown'}</span>
                {isDraft ? (
                    <button className='text-sm text-indigo-600 hover:text-indigo-800 font-medium'>
                        Edit Draft
                    </button>
                ) : (
                    <span>Published</span>
                )}
            </div>
        </div>
    );
};


// --- Main View Component ---

function MyPosts() {
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock API response data (simulating /blogs endpoint data)
    const mockBlogData = [
        {
            _id: 'b1', 
            title: 'The Future of AI in Web Development', 
            content: 'Artificial intelligence is rapidly changing the landscape of front-end development, offering tools for automated code generation, design system maintenance, and predictive debugging. This shift empowers developers to focus on complex logic and user experience.', 
            author: { name: 'Jane Doe', email: 'jane.doe@example.com' }, 
            status: 'published',
            category: 'Tech',
            viewCount: 150
        },
        {
            _id: 'b2', 
            title: 'A Deep Dive into React Hooks', 
            content: 'Understanding useEffect dependencies is crucial for preventing infinite loops and ensuring optimal performance. We explore common pitfalls and best practices for writing clean, efficient custom hooks.', 
            author: { name: 'Jane Doe', email: 'jane.doe@example.com' }, 
            status: 'draft',
            category: 'Tech',
            viewCount: 0
        },
        {
            _id: 'b3', 
            title: 'Learning Tailwind CSS in a Weekend', 
            content: 'Tailwind CSS is a utility-first CSS framework that allows you to build modern designs quickly without ever leaving your HTML. This guide covers setup, utility classes, and custom configuration.', 
            author: { name: 'John Smith', email: 'john.smith@example.com' }, // This should be filtered out
            status: 'published',
            category: 'Design',
            viewCount: 300
        },
    ];

    useEffect(() => {
        const loggedInUser = getCurrentUser(); // Uses mock utility
        setUser(loggedInUser);
        
        if (!loggedInUser) {
            toast.error("You must be logged in to view your posts.");
            setIsLoading(false);
            return;
        }

        const mockFetchMyBlogs = async () => {
            setIsLoading(true);
            
            // Simulate API latency
            await new Promise(resolve => setTimeout(resolve, 500)); 

            try {
                // Client-side filtering logic, matching the original file's intent
                const userBlogs = mockBlogData.filter(blog => blog.author.email === loggedInUser.email);
                
                setBlogs(userBlogs);
            } catch (error) {
                // Should not happen with mock data, but kept for structure
                console.error("Error fetching my blogs:", error);
                toast.error("Failed to load your posts.");
            } finally {
                setIsLoading(false); 
            }
        };

        mockFetchMyBlogs(); 

    }, []); 

    
    if (isLoading) {
        return (
            <div className='container mx-auto p-4 text-center'>
                <Navbar />
                <div className='mt-8 text-xl text-gray-600'>Loading your posts...</div>
            </div>
        );
    }

    // After loading, check if the user is present (important for the toast)
    if (!user) {
        return (
             <div className='container mx-auto p-4 text-center'>
                <Navbar />
                <div className='mt-8 text-xl text-red-600'>
                    Access Denied. Please log in to view this page.
                </div>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className='container mx-auto p-4 text-center'>
                <Navbar />
                <h1 className='text-3xl font-bold mb-8 text-gray-800'>My Posts (Drafts & Published)</h1>
                <div className='mt-8 text-xl text-gray-600'>
                    You haven't created any posts yet.
                </div>
            </div>
        );
    }


    return (
        <div>
            <div className='container mx-auto p-4'>
                <Navbar />
                <h1 className='text-3xl font-bold mb-8 text-gray-800'>My Posts (Drafts & Published)</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {
                        blogs.map((blog) => {
                            const {
                                _id, 
                                title, 
                                content, 
                                author, 
                                status 
                            } = blog;

                            return (
                                <BlogCard 
                                    key={_id}
                                    title={title}
                                    content={content}
                                    author={author}
                                    status={status || "draft"}
                                />
                            );
                        })
                    }
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default MyPosts;