
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // Wait until authentication check finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-purple-600">
          Checking authentication...
        </p>
      </div>
    );
  }

  // If user is not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check user role
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/student-dashboard" replace />;
  }

  // Allow access
  return children;
}

export default ProtectedRoute;
