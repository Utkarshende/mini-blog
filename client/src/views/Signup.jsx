import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';

function Signup() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const signupUser = async () => {
        // Basic frontend validation check
        if (!user.name || !user.email || !user.password) {
            alert("All fields are required.");
            return;
        }
        
        try {
            const response = await axios.post(`${API_URL}/signup`, user);
            
            if (response.data.success) {
                alert("Signup successful! Please log in.");
                navigate('/login');
            } else {
                // Handle cases where server returns 200 OK but success: false
                alert(response.data.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Signup failed:", error);
            
            // ⭐ CRITICAL FIX: Extract specific error message from the server response
            const errorMessage = error.response
                ? error.response.data.message // Message from the backend (e.g., "User with this email already exists")
                : "A network error occurred. Please check your connection."; // Generic network/connection error

            alert(errorMessage);
        }
    };

    return (
        <div>
            <Navbar/>
            <div className='max-w-[400px] mx-auto border border-gray-300
            py-10 px-14 rounded shadow-lg mt-10'>
                <h1 className='text-center text-3xl font-bold my-4'>Signup</h1>
                <div>
                    {/* Input fields remain the same */}
                    <input type="text" placeholder='Name' className="border p-2 rounded w-full mb-4 focus:ring-blue-500 focus:border-blue-500" value={user.name} onChange={(e) => { setUser({ ...user, name: e.target.value }); }}/>
                    <input type="email" placeholder='Email' className="border p-2 rounded w-full mb-4 focus:ring-blue-500 focus:border-blue-500" value={user.email} onChange={(e) => { setUser({ ...user, email: e.target.value }) }}/>
                    <input type="password" placeholder='Password' className="border p-2 rounded w-full mb-6 focus:ring-blue-500 focus:border-blue-500" value={user.password} onChange={(e) => { setUser({ ...user, password: e.target.value }) }} />
                    
                    <button className='bg-gray-700 text-white px-6 py-2 rounded mb-4 hover:bg-gray-800 transition-colors w-full' type='button' onClick={signupUser}>
                        Signup
                    </button>
                    
                    <p className='text-center text-sm'>
                        Already have an account? {""}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;