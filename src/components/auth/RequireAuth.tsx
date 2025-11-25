import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>Debes iniciar sesión para acceder.</p>;

  return <>{children}</>;
}