import { useState } from "react";
import { DateTime } from "luxon";
import { supabase } from "../../lib/supabaseClient";
import type { Props } from "../../types/bookingTypes";

export default function BookingModal({ open, onClose, start, end, resource, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // Convert to ISO in UTC
      const startISO = DateTime.fromISO(start).toUTC().toISO();
      const endISO = DateTime.fromISO(end).toUTC().toISO();

      if (!startISO || !endISO) {
        throw new Error("Invalid dates.");
      }

      // 1) Get authenticated user
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) {
        throw new Error("Debes iniciar sesión para crear una reserva.");
      }

      const userId = session.user.id;

      // 2) Validate availability via RPC
      const { data: available, error: rpcErr } = await supabase.rpc("is_available", {
        p_resource: resource,
        p_start: startISO,
        p_end: endISO,
      });

      if (rpcErr) throw rpcErr;

      if (!available) {
        setErrorMsg("El horario seleccionado ya está ocupado. Elige otro.");
        setLoading(false);
        return;
      }

      // 3) Insert booking complying with RLS
      const { error: insertErr } = await supabase.from("bookings").insert([
        {
          user_id: userId,
          resource,
          title,
          start_time: startISO,
          end_time: endISO,
        },
      ]);

      if (insertErr) throw insertErr;

      if (onSuccess) onSuccess();
      onClose();

    } catch (err: any) {
      console.error("Error creando reserva:", err);
      setErrorMsg(err.message ?? "Error al crear la reserva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-2">Confirmar reserva</h3>

        <p className="text-sm text-gray-600 mb-4">
          {DateTime.fromISO(start).toLocaleString(DateTime.DATETIME_FULL)} →
          {DateTime.fromISO(end).toLocaleString(DateTime.DATETIME_FULL)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event or Title"
            className="w-full p-2 border rounded text-black"
            required
          />

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1 bg-blue-600 text-white rounded"
            >
              {loading ? "Saving..." : "Reserved"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}