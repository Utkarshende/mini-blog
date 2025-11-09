import React, {useState, useEffect } from 'react'
import { getCurrentUser } from '../util';
import { Link } from 'react-router';

function Navbar() {
const [user, setUser] = useState(null);
useEffect(()=>{
    setUser(getCurrentUser());
},[]);
  return (
    <div className='bg-gray-700 text-white p-4 mb-4 flex justify-between items-center'>
      {""}
     {user ? `Hello, ${user.name} !` : "Welcome Guest !"}
    <div>
    {user ? (
    <span 
    className="cursor-pointer"
    onClick={()=>{
      localStorage.clear();
      window.location.href = "/login";
    }}>
      Logout
    </span>
    ) : (
       <Link to ="/login">Login</Link>
       )}
    </div>
    </div>
  );
}

export default Navbar
