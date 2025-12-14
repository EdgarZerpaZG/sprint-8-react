import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type StatsSeries = {
  labels: string[];
  data: number[];
};

type UserProfilesStats = {
  loading: boolean;
  error: string | null;
  registrationsByMonth: StatsSeries;
  usersByLocation: StatsSeries;
  activeVsInactive: StatsSeries;
};

type UserProfileRow = {
  id: string;
  created_at: string | null;
  location: string;
  is_active: boolean;
};

export function useUserProfilesStats(enabled: boolean): UserProfilesStats {
  const [rows, setRows] = useState<UserProfileRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setRows([]);
      setLoading(false);
      setError(null);
      return;
    }

    let alive = true;

    async function fetchStats() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, created_at, location, is_active");

      if (!alive) return;

      if (error) {
        console.error("Error loading user_profiles for stats:", error);
        setError(error.message);
        setRows([]);
      } else {
        setRows((data ?? []) as UserProfileRow[]);
      }

      setLoading(false);
    }

    fetchStats();

    return () => {
      alive = false;
    };
  }, [enabled]);

  // 1) Users by month (registrations)
  const registrationsByMonth = useMemo<StatsSeries>(() => {
    const counts = new Map<string, number>();

    rows.forEach((r) => {
      if (!r.created_at) return;
      // YYYY-MM
      const key = r.created_at.slice(0, 7);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    const sortedKeys = Array.from(counts.keys()).sort();

    const labels = sortedKeys.map((key) => {
      const [year, month] = key.split("-");
      const d = new Date(Number(year), Number(month) - 1, 1);
      return d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    });

    const data = sortedKeys.map((key) => counts.get(key) ?? 0);

    return { labels, data };
  }, [rows]);

  // 2) Users by location
  const usersByLocation = useMemo<StatsSeries>(() => {
    const counts = new Map<string, number>();

    rows.forEach((r) => {
      const loc =
        r.location && r.location.trim().length > 0
          ? r.location.trim()
          : "Unknown";

      counts.set(loc, (counts.get(loc) ?? 0) + 1);
    });

    const sorted = Array.from(counts.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    const labels = sorted.map(([loc]) => loc);
    const data = sorted.map(([, count]) => count);

    return { labels, data };
  }, [rows]);

  // 3) Actives vs Inactives
  const activeVsInactive = useMemo<StatsSeries>(() => {
    let active = 0;
    let inactive = 0;

    rows.forEach((r) => {
      if (r.is_active) active++;
      else inactive++;
    });

    return {
      labels: ["Active", "Inactive"],
      data: [active, inactive],
    };
  }, [rows]);

  return {
    loading,
    error,
    registrationsByMonth,
    usersByLocation,
    activeVsInactive,
  };
}