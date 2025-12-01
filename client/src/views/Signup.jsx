import { useState } from 'react';
import axios from 'axios';
import { saveCurrentUser } from '../util.js';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleSignup = async () => {
    if (!name || !email || !password) return toast.error("All fields are required.");
    try {
      const { data } = await axios.post(`${API_URL}/api/signup`, { name, email, password });
      if (data.success) {
        saveCurrentUser(data.data);
        toast.success("Signup successful!");
        setTimeout(() => window.location.href = '/', 1000);
      }
    } catch (err) {
      console.error("Signup API error:", err);
      toast.error(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}
        className="border p-2 w-full my-2 rounded" />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
        className="border p-2 w-full my-2 rounded" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
        className="border p-2 w-full my-2 rounded" />
      <button className="bg-indigo-600 text-white px-4 py-2 mt-2 rounded" onClick={handleSignup}>Signup</button>
      <Toaster />
    </div>
  );
}
