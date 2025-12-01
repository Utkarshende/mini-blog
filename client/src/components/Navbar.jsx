import { Link } from 'react-router';
import { getCurrentUser, logoutUser } from '../util.js';

export default function Navbar() {
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">MiniBlog</Link>
      <div>
        <Link to="/" className="mr-4">All Blogs</Link>
        {user ? (
          <>
            <Link to="/new" className="mr-4">New Blog</Link>
            <Link to="/myposts" className="mr-4">My Posts</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
