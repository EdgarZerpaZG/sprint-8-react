import { useIsAdmin } from "../hooks/useIsAdmin";
import AdminUsersMetrics from "../components/admin/AdminUsersMetrics";

export default function Graphics() {
  const { isAdmin, loadingAdmin } = useIsAdmin();

  if (loadingAdmin) {
    return (
      <main className="h-full flex justify-center items-center">
        <p className="text-gray-400">Checking permissions...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="h-full flex justify-center items-center">
        <p className="text-gray-400">
          You do not have permission to see user metrics.
        </p>
      </main>
    );
  }

  return (
    <main className="h-full flex justify-center items-start">
      <section className="w-full max-w-6xl px-4">
        <AdminUsersMetrics />
      </section>
    </main>
  );
}