import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Booking } from "../types/bookingTypes";

export function useBookings(resource?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from("bookings").select("*");
      if (resource) query = query.eq("resource", resource);
      const { data, error } = await query.order("start_time", { ascending: true });
      if (error) throw error;
      setBookings(data ?? []);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    fetchBookings();
    const channel = supabase
      .channel("public:bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          // payload: { eventType: 'INSERT' | 'UPDATE' | 'DELETE', ...}
          const ev = payload.eventType;
          const newRow = payload.new as Booking | null;
          const oldRow = payload.old as Booking | null;
          setBookings((prev) => {
            if (ev === "INSERT" && newRow) return [...prev, newRow].sort((a,b)=> a.start_time.localeCompare(b.start_time));
            if (ev === "UPDATE" && newRow) return prev.map(p => p.id === newRow.id ? newRow : p).sort((a,b)=> a.start_time.localeCompare(b.start_time));
            if (ev === "DELETE" && oldRow) return prev.filter(p => p.id !== oldRow.id);
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}