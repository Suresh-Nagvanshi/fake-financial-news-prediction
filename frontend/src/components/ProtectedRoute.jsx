import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ⏳ Loading state
  if (loading) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ Logged in
  return children;
}

export default ProtectedRoute;