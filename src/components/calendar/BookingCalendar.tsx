import FullCalendar from "@fullcalendar/react";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import luxonPlugin from "@fullcalendar/luxon";
import { DateTime } from "luxon";
import { useState, useMemo, useCallback } from "react";
import BookingModal from "./BookingModal";
import { useBookings } from "../../hooks/useBooking";

type Props = {
  resource?: string;
};

type SelectedRange = { startStr: string; endStr: string } | null;

export default function BookingCalendar({
  resource = "default-resource",
}: Props) {
  const { bookings, loading, error, refetch } = useBookings(resource);

  const [selectInfo, setSelectInfo] = useState<SelectedRange>(null);

  const [editingEvent, setEditingEvent] = useState<{
    id: string;
    title: string;
    start: string;
    end: string;
  } | null>(null);

  const events = useMemo(
    () =>
      bookings.map((b) => ({
        id: b.id,
        title: b.title || "Reserve",
        start: b.start_time,
        end: b.end_time,
      })),
    [bookings]
  );

  // Handler when the user chooses a time slot
  const handleSelect = useCallback((info: DateSelectArg) => {
    const startISO = DateTime.fromJSDate(info.start).toISO() ?? "";
    const endISO = DateTime.fromJSDate(info.end).toISO() ?? "";
    setSelectInfo({ startStr: startISO, endStr: endISO });
  }, []);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const { event } = clickInfo;

    setEditingEvent({
      id: event.id,
      title: event.title,
      start: event.start ? DateTime.fromJSDate(event.start).toISO() ?? "" : "",
      end: event.end ? DateTime.fromJSDate(event.end).toISO() ?? "" : "",
    });
  }, []);

  const handleSuccess = useCallback(() => {
    setSelectInfo(null);
    setEditingEvent(null);
    refetch();
  }, [refetch]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-8">
        <p className="text-gray-500">Cargando reservas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center py-8">
        <p className="text-red-600">
          Error al cargar las reservas. Intenta recargar la página.
        </p>
      </div>
    );
  }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, luxonPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable={true}
        selectMirror={true}
        select={handleSelect}
        events={events}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        timeZone="local"
        height="auto"
        editable={false}
        eventClick={handleEventClick}
      />

      {selectInfo && (
        <BookingModal
          mode="create"
          open={true}
          onClose={() => setSelectInfo(null)}
          start={selectInfo.startStr}
          end={selectInfo.endStr}
          resource={resource}
          onSuccess={handleSuccess}
        />
      )}

      {editingEvent && (
        <BookingModal
          mode="edit"
          open={true}
          onClose={() => setEditingEvent(null)}
          start={editingEvent.start}
          end={editingEvent.end}
          resource={resource}
          onSuccess={handleSuccess}
          bookingId={editingEvent.id}
          initialTitle={editingEvent.title}
        />
      )}
    </>
  );
}