import { Link } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import toast, { Toaster } from 'react-hot-toast'; // Import Toast

function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const loginUser = async () => {
        if (!user.email || !user.password) {
            toast.error("Email and Password are required.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/login`, user);
            
            if (response?.data?.success) {
                localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
                localStorage.setItem("token", response.data.token);

                toast.success("Login successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/"; // Redirect to home
                }, 1000); 
            } else {
                toast.error("Login failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Login API error", error);
            toast.error(error.response?.data?.message || "An error occurred during login."); 
        }
    };

    return (
        <div>
            <Navbar/> 
            <div className='max-w-[400px] mx-auto border border-gray-300
            py-10 px-14 rounded shadow-lg mt-10'>
                <h1 className='text-center text-3xl font-bold my-4'>Login</h1>
                <div>
                    <input 
                        type="email"
                        placeholder='Email'
                        className="border p-2 rounded w-full mb-4 focus:ring-blue-500 focus:border-blue-500" 
                        value={user.email}
                        onChange={(e) => {
                            setUser({ ...user, email: e.target.value })
                        }}
                    />
        
                    <input 
                        type="password" 
                        placeholder='Password'
                        className="border p-2 rounded w-full mb-6 focus:ring-blue-500 focus:border-blue-500" 
                        value={user.password}
                        onChange={(e) => {
                            setUser({ ...user, password: e.target.value })
                        }}
                    />
        
                    <button 
                        className='bg-gray-700 text-white px-6 py-2 rounded mb-4 hover:bg-gray-800 transition-colors w-full'
                        type='button'
                        onClick={loginUser}
                    >
                        Login
                    </button>
                    
                    <p className='text-center text-sm'>
                        Don't have an account? {""}
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