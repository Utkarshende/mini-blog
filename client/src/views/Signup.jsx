import { Link } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import toast, { Toaster } from 'react-hot-toast';

function Signup() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const signupUser = async () => {
    if (!user.name || !user.email || !user.password) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/signup`, user);

      console.log("SIGNUP RESPONSE:", response.data);

      if (response.data.success) {
        toast.success("Signup successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup API error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-[400px] mx-auto border border-gray-300 py-10 px-14 rounded shadow-lg mt-10">
        <h1 className="text-center text-3xl font-bold my-4">Sign Up</h1>
        <div>
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded w-full mb-4 focus:ring-blue-500 focus:border-blue-500"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-full mb-4 focus:ring-blue-500 focus:border-blue-500"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-full mb-6 focus:ring-blue-500 focus:border-blue-500"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button
            className="bg-gray-700 text-white px-6 py-2 rounded mb-4 hover:bg-gray-800 transition-colors w-full"
            type="button"
            onClick={signupUser}
          >
            Sign Up
          </button>
          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Signup;
