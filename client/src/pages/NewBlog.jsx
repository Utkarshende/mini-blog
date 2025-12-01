import React, { useEffect, useState } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import API from '../api/axios.js';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import { BLOG_CATEGORIES } from '../CONSTANTS.jsx';

export default function NewBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', 'light');
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Login required');
      setTimeout(() => (window.location.href = '/login'), 900);
    }
  }, []);

  const saveBlog = async () => {
    if (!title || !content || !category) return toast.error('All fields required');
    try {
      setLoading(true);
      const res = await API.post('/blogs', { title, content, category });
      if (res.data?.success) {
        toast.success('Saved as draft');
        setTimeout(() => (window.location.href = '/myposts'), 900);
      } else {
        toast.error(res.data?.message || 'Save failed');
      }
    } catch (err) {
      console.error('Create blog error', err);
      toast.error(err.response?.data?.message || 'Server error');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => (window.location.href = '/login'), 800);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>

      <input className="border p-2 w-full my-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />

      <select className="border p-2 my-2" value={category} onChange={e => setCategory(e.target.value)}>
        {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <div className="border p-1 mb-3">
        <MarkdownEditor value={content} onChange={val => setContent(val)} height="350px" />
      </div>

      <button className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={loading} onClick={saveBlog}>
        {loading ? 'Saving...' : 'Save Draft'}
      </button>

      <Toaster />
    </div>
  );
}
