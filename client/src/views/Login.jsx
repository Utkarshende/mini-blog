import { Link } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

    // <-- Moved here so API_URL exists
    const testAuth = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${API_URL}/test-auth`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(res.data);
    toast.success("Token is valid!");
  } catch (err) {
    console.error(err);
    toast.error("Auth failed");
  }
};

    const loginUser = async () => {
        if (!user.email || !user.password) {
            toast.error("Email and Password are required.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/login`, user);

            if (response?.data?.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));

                toast.success("Login successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-[400px] mx-auto border border-gray-300 py-10 px-14 rounded shadow-lg mt-10">
                <h1 className="text-center text-3xl font-bold my-4">Login</h1>
                <div>
                    <input
                        type="email"
                        placeholder='Email'
                        className="border p-2 rounded w-full mb-4"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 rounded w-full mb-6"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />

                    <button
                        onClick={loginUser}
                        className="bg-gray-700 text-white px-6 py-2 rounded mb-4 hover:bg-gray-800 w-full"
                    >
                        Login
                    </button>

                    {/* Debug button */}
                    <button
                        onClick={testAuth}
                        className="bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700"
                    >
                        TEST AUTH
                    </button>

                    <p className="text-center text-sm mt-2">
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
