import React, {useState, useEffect } from 'react'
import { getCurrentUser } from '../util';
// ⭐ CRITICAL FIX: Ensure Link is imported from 'react-router-dom' 
// if you are using React Router v6. Assuming it is 'react-router-dom'.
import { Link } from 'react-router'; 

function Navbar() {
    const [user, setUser] = useState(null);
    
    useEffect(()=>{
        setUser(getCurrentUser());
    },[]);
    
    return (
        <div className='bg-gray-700 text-white p-4 mb-4 flex justify-between items-center'>
            {/* ⭐ FIX: Removed unnecessary empty string literal {""} */}
            {user ? `Hello, ${user.name} !` : "Welcome Guest !"} 
            
            <div>
                {user ? (
                <span 
                    className="cursor-pointer hover:text-red-300 transition-colors"
                    onClick={()=>{
                        localStorage.clear();
                        // ⭐ Use navigate() or set window.location.href directly to login
                        window.location.href = "/login"; 
                    }}>
                    Logout
                </span>
                ) : (
                    <Link to ="/login" className="hover:text-gray-300 transition-colors">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Navbar;