import React, { useState } from 'react';
import API from '../api/axios.js';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
// 1. Import useNavigate from react-router-dom
import { useNavigate } from 'react-router'; 

export default function Login() {
    // 2. Initialize useNavigate hook
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return toast.error('Fill all fields');

        try {
            setLoading(true);
            const res = await API.post('/login', { email, password });
            if (res.data?.success) {
                const user = res.data.data;
                localStorage.setItem('token', user.token);
                localStorage.setItem('user', JSON.stringify(user));
                toast.success('Logged in');
                
                // 3. CORRECTED REDIRECT: Use navigate() instead of window.location.href
                // This ensures the client-side router handles the path change, 
                // which prevents the 404 error in the deployed environment.
                setTimeout(() => navigate('/myposts'), 800);
                
            } else {
                toast.error(res.data?.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login API Error:', err);
            // Enhanced error handling to show message from server if available
            toast.error(err.response?.data?.message || 'Server error or Network Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <Navbar />
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <input 
                    className="border p-2" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                />
                <input 
                    className="border p-2" 
                    placeholder="Password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
                <button 
                    disabled={loading} 
                    className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50" // Added disabled styling
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <Toaster />
        </div>
    );
}