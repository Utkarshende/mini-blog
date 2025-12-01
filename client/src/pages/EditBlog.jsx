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
    const [loading, setLoading] = useState(true);

    const { slug } = useParams();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const getToken = () => localStorage.getItem("token");

    
    const loadBlog = useCallback(async (currentUser) => {
        if (!slug || !currentUser) return;

        try {
            const token = getToken();

            const response = await axios.get(`${API_URL}/api/blogs/${slug}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            const blog = response?.data?.data;

            if (!blog) {
                toast.error("Blog not found.");
                return;
            }

            // Normalize ID comparison
            const loggedInUserId = currentUser._id || currentUser.id;

            if (blog.author._id !== loggedInUserId) {
                toast.error("🚫 Unauthorized access!");
                setTimeout(() => window.location.href = "/", 1500);
                return;
            }

            setTitle(blog.title);
            setContent(blog.content);
            setCategory(blog.category);
            setLoading(false);

        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Error fetching blog");
            setTimeout(() => window.location.href = "/", 1500);

        }
    }, [slug, API_URL]);



    useEffect(() => {
        document.documentElement.setAttribute("data-color-mode", "light");

        const currentUser = getCurrentUser();

        if (!currentUser) {
            toast.error("Authentication required!");
            window.location.href = "/login";
            return;
        }

        setUser(currentUser);
    }, []);


    useEffect(() => {
        if (user) loadBlog(user);
    }, [user, loadBlog]);



    const updateBlog = async () => {
        if (!title || !content) {
            toast.error("All fields are required.");
            return;
        }

        try {
            const token = getToken();

            const response = await axios.put(
                `${API_URL}/api/blogs/${slug}`,
                { title, content, category },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response?.data?.success) {
                toast.success("Blog updated successfully!");
                setTimeout(() => window.location.href = `/blog/${slug}`, 1500);
            }

        } catch (err) {
            toast.error(err?.response?.data?.message || "Update failed.");
        }
    };


    const publishBlog = async () => {
        try {
            const token = getToken();

            const response = await axios.patch(
                `${API_URL}/api/blogs/${slug}/publish`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response?.data?.success) {
                toast.success("Blog Published!");
                setTimeout(() => window.location.href = `/blog/${slug}`, 1500);
            }

        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to publish.");
        }
    };



    if (loading) {
        return (
            <div className="container mx-auto p-4 text-center">
                <Navbar />
                <div className="mt-10 text-lg text-gray-500">Loading Editor...</div>
            </div>
        );
    }


    return (
        <div className="container mx-auto p-4">
            <Navbar />
            <h1 className="text-3xl font-bold mb-4">Edit Blog</h1>

            <input
                type="text"
                placeholder="Blog Title"
                className="border p-2 w-full my-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2 my-4">
                {BLOG_CATEGORIES.map((cate) => (
                    <option key={cate} value={cate}>{cate}</option>
                ))}
            </select>

            <MarkdownEditor
                value={content}
                onChange={setContent}
                height="480px"
            />

            <div className="flex gap-4 mt-6">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={updateBlog}>
                    Update Blog
                </button>

                <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={publishBlog}>
                    Publish
                </button>
            </div>

            <Toaster />
        </div>
    );
}

export default EditBlog;
