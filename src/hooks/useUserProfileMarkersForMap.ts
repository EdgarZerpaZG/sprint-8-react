import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./useAuth";
import { useIsAdmin } from "./useIsAdmin";

export type UserProfileMarker = {
  id: string;
  username: string;
  location: string;
  hobby: string;
  lat: number;
  lng: number;
};

export function useUserProfileMarkersForMap() {
  const { user, loading } = useAuth();
  const { isAdmin, loadingAdmin } = useIsAdmin();

  const [markers, setMarkers] = useState<UserProfileMarker[]>([]);
  const [loadingMarkers, setLoadingMarkers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (loading || loadingAdmin) return;
      if (!user) {
        setMarkers([]);
        setLoadingMarkers(false);
        setError("No user logged in.");
        return;
      }

      setLoadingMarkers(true);
      setError(null);

      let query = supabase
        .from("user_profiles")
        .select("id, username, location, hobby, lat, lng, auth_user_id, is_active")
        .eq("is_active", true);

      if (!isAdmin) {
        query = query.eq("auth_user_id", user.id);
      }

      const { data, error } = await query;

      if (!alive) return;

      if (error) {
        console.error("Error loading profiles for map:", error);
        setError(error.message);
        setMarkers([]);
      } else {
        const mapped =
          (data ?? [])
            .filter((r: any) => r.lat !== null && r.lng !== null)
            .map((r: any) => ({
              id: r.id as string,
              username: r.username as string,
              location: (r.location as string) ?? "",
              hobby: (r.hobby as string) ?? "",
              lat: r.lat as number,
              lng: r.lng as number,
            })) ?? [];

        setMarkers(mapped);
      }

      setLoadingMarkers(false);
    }

    load();

    return () => {
      alive = false;
    };
  }, [user, loading, isAdmin, loadingAdmin]);

  return { markers, loading: loadingMarkers, error, isAdmin };
}