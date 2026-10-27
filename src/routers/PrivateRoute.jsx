import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../componentes/ui/Loader";

/**
 * requireRole: "admin" | "director" | "estudiante" (opcional).
 * Si el usuario logueado no coincide con el rol requerido,
 * lo manda a su propio panel en vez de al login.
 */
export default function PrivateRoute({ children, requireRole }) {
  const { user, initializing } = useAuth();

  if (initializing) return <Loader label="Verificando sesión..." />;
  if (!user) return <Navigate to="/login" replace />;

  if (requireRole && user.role !== requireRole) {
    const homeByRole = {
      admin: "/admin/dashboard",
      director: "/director/dashboard",
      estudiante: "/estudiante/dashboard",
    };
    return <Navigate to={homeByRole[user.role] || "/login"} replace />;
  }

  return children;
}