import React, { useState } from 'react';
import API from '../api/axios.js';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/signup', { name, email, password });
      if (res.data?.success) {
        toast.success('Registered. Please login.');
        setTimeout(() => (window.location.href = '/login'), 900);
      } else {
        toast.error(res.data?.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error', err);
      toast.error(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <input className="border p-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Sign up</button>
      </form>
      <Toaster />
    </div>
  );
}
