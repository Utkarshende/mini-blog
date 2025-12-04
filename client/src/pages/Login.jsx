import React, { useState } from 'react';
import API from '../api/axios.js';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Fill all fields');

    try {
      setLoading(true);
      // CORRECTION: Changed '/login' to '/api/login' to match backend prefix
      const res = await API.post('/api/login', { email, password }); 
      if (res.data?.success) {
        const user = res.data.data;
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Logged in');
        setTimeout(() => (window.location.href = '/myposts'), 800);
      } else {
        toast.error(res.data?.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login API Error:', err);
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input className="border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <Toaster />
    </div>
  );
}