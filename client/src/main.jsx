import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import MyPost from "./views/MyPost";
import NewBlog from "./views/NewBlog";
import Home from "./views/Home";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/myposts"
          element={
            <ProtectedRoute>
              <MyPost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/new"
          element={
            <ProtectedRoute>
              <NewBlog />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
