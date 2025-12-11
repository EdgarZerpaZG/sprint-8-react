import LineChart from "../components/chart/lineChart";
import BarChart from "../components/chart/barChart";
import { PieChart } from "../components/chart/pieChart";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { useUserProfilesStats } from "../hooks/useUserProfilesStats";

export default function Graphics() {
  const { isAdmin, loadingAdmin } = useIsAdmin();
  const {
    loading,
    error,
    registrationsByMonth,
    usersByLocation,
    activeVsInactive,
  } = useUserProfilesStats(isAdmin);

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

  if (loading) {
    return (
      <main className="h-full flex justify-center items-center">
        <p className="text-gray-400">Loading user metrics...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="h-full flex justify-center items-center">
        <p className="text-red-400">Error loading metrics: {error}</p>
      </main>
    );
  }

  return (
    <main className="h-full">
      <section className="w-full my-5">
        <h2 className="text-center text-2xl font-bold mb-4">
          Users registered per month
        </h2>
        <LineChart
          labels={registrationsByMonth.labels}
          data={registrationsByMonth.data}
          title="New users by month"
        />
      </section>

      <section className="w-full my-5">
        <h2 className="text-center text-2xl font-bold mb-4">
          Users by location
        </h2>
        <BarChart
          labels={usersByLocation.labels}
          data={usersByLocation.data}
          title="Users per location"
        />
      </section>

      <section className="w-full my-5">
        <h2 className="text-center text-2xl font-bold mb-4">
          Active vs inactive users
        </h2>
        <PieChart
          labels={activeVsInactive.labels}
          data={activeVsInactive.data}
          title="Users by status"
        />
      </section>
    </main>
  );
}