import { Link } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // LOGIN FUNCTION
  const loginUser = async () => {
    if (!user.email || !user.password) {
      toast.error("Email and Password are required.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, user);

      console.log("LOGIN RESPONSE:", response.data);

      if (response.data.success && response.data.token) {
        // Store token & user in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));

        toast.success("Login successful!");

        // Redirect after login
        setTimeout(() => {
          window.location.href = "/";
        }, 700);
      } else {
        toast.error("Login failed: Token missing in response.");
      }
    } catch (error) {
      console.error("Login API error:", error.response?.data);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // TEST AUTH FUNCTION
  const testAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No token found. Login first.");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/test-auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("TEST AUTH RESPONSE:", res.data);
      toast.success("Token verified!");
    } catch (err) {
      console.error("Auth failed:", err.response?.data);
      toast.error(err.response?.data?.message || "Auth failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className='max-w-[400px] mx-auto border border-gray-300 py-10 px-14 rounded shadow-lg mt-10'>
        <h1 className='text-center text-3xl font-bold my-4'>Login</h1>
        <div>
          <input
            type="email"
            placeholder='Email'
            className="border p-2 rounded w-full mb-4 focus:ring-blue-500 focus:border-blue-500"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <input
            type="password"
            placeholder='Password'
            className="border p-2 rounded w-full mb-6 focus:ring-blue-500 focus:border-blue-500"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <button
            className='bg-gray-700 text-white px-6 py-2 rounded mb-4 hover:bg-gray-800 transition-colors w-full'
            type='button'
            onClick={loginUser}
          >
            Login
          </button>

          <button
            className='bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 transition-colors w-full'
            type='button'
            onClick={testAuth}
          >
            TEST AUTH
          </button>

          <p className='text-center text-sm'>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Login;
