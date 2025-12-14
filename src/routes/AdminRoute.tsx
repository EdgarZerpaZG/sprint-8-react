import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useIsAdmin } from "../hooks/useIsAdmin";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { isAdmin, loadingAdmin } = useIsAdmin();

  if (loading || loadingAdmin) {
    return (
      <main className="flex justify-center items-center h-full">
        <p className="text-gray-400">Checking permissions...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}