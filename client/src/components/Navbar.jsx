import React from 'react';
import { getCurrentUser } from '../util.js';
import { Link , useNavigate} from 'react-router';

export default function Navbar() {
  const user = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="flex justify-between p-4 shadow bg-white">
      <Link to="/" className="font-bold text-xl">MiniBlog</Link>

      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-indigo-600">Home</Link>

        {user ? (
          <>
            <Link to="/new" className="hover:text-indigo-600">New</Link>
            <Link to="/myposts" className="hover:text-indigo-600">My Posts</Link>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            <span className="font-semibold">{user.name}</span>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-indigo-600 text-white px-3 py-1 rounded">Login</Link>
            <Link to="/signup" className="hover:text-indigo-600">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
