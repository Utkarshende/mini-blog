import { Link } from 'react-router'; // Assuming react-router-dom
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';

function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const loginUser = async () => {
        if (!user.email || !user.password) {
            alert("Email and Password are required.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/login`, user);
            
            if (response?.data?.success) {
                // ⭐ Store user and token
                localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
                localStorage.setItem("token", response.data.token);

                window.location.href = "/"; // Redirect to home
            } else {
                alert("Login failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Login API error", error);
            // Use response message if available, otherwise generic error
            alert(error.response?.data?.message || "An error occurred during login."); 
        }
    };

    return (
        <div>
            <Navbar/> {/* ⭐ Added Navbar */}
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
        </div>
    );
}

export default Login;