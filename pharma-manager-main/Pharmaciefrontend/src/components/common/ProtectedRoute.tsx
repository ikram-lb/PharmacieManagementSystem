import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";


interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, only users with this role can access the route. */
  role?: "DoctorAdmin" | "Caissier";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, isDoctorAdmin, isCaissier, loading } = useAuth();

  // Still rehydrating token from localStorage — show nothing
  if (loading) return null;

  // Not logged in → redirect to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Role check
  if (role === "DoctorAdmin" && !isDoctorAdmin) {
    return <Navigate to="/" replace />;
  }
  if (role === "Caissier" && !isCaissier) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
