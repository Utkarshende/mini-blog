import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/api/login`, { email, password });

      if (res.data.success) {
        const user = res.data.data; // <-- CORRECT: user object comes from .data

        // Save data correctly
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login successful!");
        setTimeout(() => (window.location.href = "/myposts"), 1000);
      } else {
        toast.error(res.data.message || "Invalid login.");
      }
    } catch (err) {
      console.error("Login API Error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <Toaster />
    </div>
  );
}

export default Login;
