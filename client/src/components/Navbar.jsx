import React from "react";
import { getCurrentUser } from "../util.js";

function Navbar() {
  const user = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="flex justify-between p-4 shadow">
      <a href="/" className="font-bold text-lg">Mini Blog</a>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <a href="/myposts">My Posts</a>
            <a href="/new">New Blog</a>
            <button onClick={handleLogout} className="text-red-500">
              Logout
            </button>
            <span className="font-semibold">{user.name}</span>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
