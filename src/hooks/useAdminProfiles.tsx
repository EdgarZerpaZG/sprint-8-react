import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type {
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "../types/usersTypes";

export function useAdminProfiles(enabled: boolean) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProfiles = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("user_profiles")
      .select(
        "id, auth_user_id, created_at, username, email, name, lastname, phone, location, hobby, is_active"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch profiles error:", error);
      setErrorMsg(error.message);
      setProfiles([]);
    } else {
      setProfiles((data ?? []) as UserProfile[]);
    }

    setLoading(false);
  }, [enabled]);

  const createProfile = useCallback(
    async (payload: UserProfileCreateInput) => {
      setErrorMsg("");

      const { error } = await supabase
        .from("user_profiles")
        .insert([payload]);

      if (error) {
        setErrorMsg(error.message);
        throw error;
      }

      await fetchProfiles();
    },
    [fetchProfiles]
  );

  const updateProfile = useCallback(
    async (id: string, patch: UserProfileUpdateInput) => {
      setErrorMsg("");

      const { error } = await supabase
        .from("user_profiles")
        .update(patch)
        .eq("id", id);

      if (error) {
        setErrorMsg(error.message);
        throw error;
      }

      await fetchProfiles();
    },
    [fetchProfiles]
  );

  const deleteProfile = useCallback(
    async (id: string) => {
      setErrorMsg("");

      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("id", id);

      if (error) {
        setErrorMsg(error.message);
        throw error;
      }

      await fetchProfiles();
    },
    [fetchProfiles]
  );

  const toggleActive = useCallback(
    async (row: UserProfile) => {
      await updateProfile(row.id, { is_active: !row.is_active });
    },
    [updateProfile]
  );

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const stats = useMemo(() => {
    const total = profiles.length;
    const active = profiles.filter((p) => p.is_active).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [profiles]);

  return {
    profiles,
    loading,
    errorMsg,
    stats,
    fetchProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    toggleActive,
  };
}