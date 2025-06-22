import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "./helpers";

const ProtectedRoute = ({ isAdmin = false }) => {
  const user = getUser();

  if (!user) return <Navigate to="/login" />;
    // Only allow admins or superadmins if isAdmin is true
  if (isAdmin && user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
