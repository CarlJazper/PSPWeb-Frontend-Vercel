import { Navigate } from "react-router-dom";
import { getUser } from "./helpers";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const user = getUser(); // Get user details synchronously

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
