import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;