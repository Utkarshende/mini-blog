import React, {useState, useEffect } from 'react'
import { getCurrentUser } from '../util';
import { Link } from 'react-router'; 

function Navbar() {
    const [user, setUser] = useState(null);
    
    useEffect(()=>{
        setUser(getCurrentUser());
    },[]);
    
    return (
        <div className='bg-indigo-700 text-white p-4 mb-4 flex justify-between items-center shadow-lg'>
            <Link to="/" className="text-xl font-bold hover:text-indigo-200 transition-colors">
                Mini Blog App
            </Link>
            
            <div className="flex items-center space-x-4">
                {user && (
                    <>
                        <Link to="/new" className="hover:text-indigo-200 transition-colors">
                            New Blog
                        </Link>
                        <Link to="/myposts" className="hover:text-indigo-200 transition-colors">
                            My Posts
                        </Link>
                    </>
                )}

                <div className='ml-4'>
                    {user ? (
                    <span 
                        className="cursor-pointer hover:text-red-400 transition-colors"
                        onClick={()=>{
                            localStorage.clear();
                            window.location.href = "/login"; 
                        }}>
                        Logout ({user.name})
                    </span>
                    ) : (
                        <Link to ="/login" className="hover:text-indigo-200 transition-colors">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;