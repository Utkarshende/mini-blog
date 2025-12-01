import { Link, useNavigate } from "react-router";
import { getCurrentUser } from "../util.js";

function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        MiniBlog
      </Link>

      {/* Links */}
      <div className="flex gap-4 items-center">

        <Link to="/blogs" className="hover:text-indigo-600 transition">
          Blogs
        </Link>

        {/* Show only if logged in */}
        {user && (
          <>
            <Link to="/newblog" className="hover:text-indigo-600 transition">
              Create Blog
            </Link>

            <Link to="/myposts" className="hover:text-indigo-600 transition">
              My Posts
            </Link>
          </>
        )}

        {/* Auth Buttons */}
        {!user ? (
          <Link
            to="/login"
            className="bg-indigo-600 px-4 py-2 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
