import FullCalendar from "@fullcalendar/react";
import type { DateSelectArg } from "@fullcalendar/core";
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

export default function BookingCalendar({ resource = "default-resource" }: Props) {
  const { bookings } = useBookings(resource);
  const [selectInfo, setSelectInfo] = useState<{ startStr: string; endStr: string } | null>(null);

  const events = useMemo(() => {
    return bookings.map((b) => ({
      id: b.id,
      title: b.title || "Reserve",
      start: b.start_time,
      end: b.end_time,
    }));
  }, [bookings]);

  const handleSelect = (selectInfo: DateSelectArg) => {
    // FullCalendar give start/end as Date | string; convert to ISO local strings via Luxon
    const startISO = DateTime.fromJSDate(selectInfo.start).toISO() ?? "";
    const endISO = DateTime.fromJSDate(selectInfo.end).toISO() ?? "";
    setSelectInfo({ startStr: startISO, endStr: endISO });
  };

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
      />

      {selectInfo && (
        <BookingModal
          open={true}
          onClose={() => setSelectInfo(null)}
          start={selectInfo.startStr}
          end={selectInfo.endStr}
          resource={resource}
          onSuccess={() => setSelectInfo(null)}
        />
      )}
    </>
  );
}