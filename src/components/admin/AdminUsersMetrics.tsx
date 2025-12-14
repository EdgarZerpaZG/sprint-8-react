import LineChart from "../chart/lineChart";
import { PieChart } from "../chart/pieChart";
import { useUserProfilesStats } from "../../hooks/useUserProfilesStats";

export default function AdminUsersMetrics() {
  const { loading, error, registrationsByMonth, activeVsInactive } =
    useUserProfilesStats(true);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-6">
        <p className="text-gray-400 text-sm">Loading user metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-6">
        <p className="text-red-400 text-sm">
          Error loading metrics: {error}
        </p>
      </div>
    );
  }

  return (
    <section className="w-full my-8 grid gap-10 md:grid-cols-2 auto-rows-fr">
      <div>
        <h2 className="text-center text-2xl font-bold mb-4">
          Users registered per month
        </h2>
        <LineChart
          labels={registrationsByMonth.labels}
          data={registrationsByMonth.data}
          title="New users by month"
        />
      </div>

      <div>
        <h2 className="text-center text-2xl font-bold mb-4">
          Active vs inactive users
        </h2>
        <PieChart
          labels={activeVsInactive.labels}
          data={activeVsInactive.data}
          title="Users by status"
        />
      </div>
    </section>
  );
}