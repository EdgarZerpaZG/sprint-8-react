import FullCalendar from "@fullcalendar/react";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import luxonPlugin from "@fullcalendar/luxon";
import { DateTime } from "luxon";
import { useState, useMemo } from "react";
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

  const handleSelect = (info: DateSelectArg) => {
    const startISO = DateTime.fromJSDate(info.start).toISO() ?? "";
    const endISO = DateTime.fromJSDate(info.end).toISO() ?? "";
    setSelectInfo({ startStr: startISO, endStr: endISO });
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const { event } = clickInfo;

    setEditingEvent({
      id: event.id,
      title: event.title,
      start: event.start ? DateTime.fromJSDate(event.start).toISO() ?? "" : "",
      end: event.end ? DateTime.fromJSDate(event.end).toISO() ?? "" : "",
    });
  };

  const handleSuccess = () => {
    setSelectInfo(null);
    setEditingEvent(null);
    // opcional, porque ya tienes realtime, pero viene bien por si acaso
    refetch();
  };

  return (
    <>
      {/* Si quieres, aquí puedes mostrar loading/error */}
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
        editable={false} // si luego quieres drag&drop, aquí iría true + lógica extra
        eventClick={handleEventClick}
      />

      {/* Modal para CREAR reserva */}
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

      {/* Modal para EDITAR / ELIMINAR reserva */}
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