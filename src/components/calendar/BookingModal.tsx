// BookingModal.tsx
import { useState } from "react";
import { DateTime } from "luxon";
import { supabase } from "../../lib/supabaseClient";
import type { BookingModalProps } from "../../types/bookingTypes";

export default function BookingModal({
  open,
  onClose,
  start,
  end,
  resource,
  onSuccess,
  mode = "create",
  bookingId,
  initialTitle = "",
}: BookingModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const startISO = DateTime.fromISO(start).toUTC().toISO();
      const endISO = DateTime.fromISO(end).toUTC().toISO();

      console.log("SUBMIT booking", {
        mode,
        bookingId,
        resource,
        start,
        end,
        startISO,
        endISO,
        title,
      });

      if (!startISO || !endISO) {
        throw new Error("Fechas inválidas.");
      }

      // 1) User authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) {
        throw new Error("Debes iniciar sesión para gestionar reservas.");
      }

      const userId = session.user.id;

      // 2) Validate availability via RPC
      const { data: available, error: rpcErr } = await supabase.rpc(
        "is_available",
        {
          p_resource: resource,
          p_start: startISO,
          p_end: endISO,
          p_booking_id: mode === "edit" ? bookingId : null,
        }
      );

      console.log("RPC is_available =>", { available, rpcErr });

      if (rpcErr) throw rpcErr;

      if (!available) {
        setErrorMsg("El horario seleccionado ya está ocupado. Elige otro.");
        setLoading(false);
        return;
      }

      if (mode === "create") {
        // 3A) Insert
        const { data: insertedRows, error: insertErr } = await supabase
          .from("bookings")
          .insert([
            {
              user_id: userId,
              resource,
              title,
              start_time: startISO,
              end_time: endISO,
            },
          ])
          .select();

        console.log("INSERT result =>", { insertedRows, insertErr });

        if (insertErr) throw insertErr;
      } else {
        // 3B) Update
        if (!bookingId) {
          throw new Error("Falta el ID de la reserva para poder editar.");
        }

        const { data: updatedRows, error: updateErr } = await supabase
          .from("bookings")
          .update({
            title,
            start_time: startISO,
            end_time: endISO,
          })
          .eq("id", bookingId)
          // .eq("resource", resource)
          .select();

        console.log("UPDATE result =>", { updatedRows, updateErr });

        if (updateErr) throw updateErr;

        if (!updatedRows || updatedRows.length === 0) {
          console.warn("⚠ UPDATE did not affect any rows. Check id/resource.");
        }
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Error saving booking:", err);
      setErrorMsg(err.message ?? "Error saving booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bookingId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const { error: deleteErr } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId)
        .eq("resource", resource);

      if (deleteErr) throw deleteErr;

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Error deleting booking:", err);
      setErrorMsg(err.message ?? "Error deleting booking.");
    } finally {
      setLoading(false);
    }
  };

  const formattedRange = `${DateTime.fromISO(start).toLocaleString(
    DateTime.DATETIME_FULL
  )} → ${DateTime.fromISO(end).toLocaleString(DateTime.DATETIME_FULL)}`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-2">
          {mode === "create" ? "Confirmar reserva" : "Editar reserva"}
        </h3>

        <p className="text-sm text-gray-600 mb-4">{formattedRange}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event or Title"
            className="w-full p-2 border rounded text-black"
            required
          />

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <div className="flex justify-between items-center gap-2 mt-4">
            {mode === "edit" && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1 border border-red-500 text-red-600 rounded text-sm"
                disabled={loading}
              >
                Delete booking
              </button>
            )}

            <div className="flex justify-end gap-2 flex-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 border rounded"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                {loading
                  ? "Saving..."
                  : mode === "create"
                  ? "Book"
                  : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}