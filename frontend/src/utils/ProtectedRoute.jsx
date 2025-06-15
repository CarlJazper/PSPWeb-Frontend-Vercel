import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "./helpers";

const ProtectedRoute = ({ isAdmin = false }) => {
  const user = getUser();

  if (!user) return <Navigate to="/login" />;
  if (isAdmin && user.role !== "admin") return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;
