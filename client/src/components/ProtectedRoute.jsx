import { Navigate } from "react-router";
import { getToken } from "../util.js";

export default function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
