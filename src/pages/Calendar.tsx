import BookingCalendar from "../components/calendar/BookingCalendar"

export default function Calendar() {
    return(
        <>
            <main className="flex justify-center items-center h-full">
                <section className="w-full">
                    <h2 className="text-center text-2xl font-bold mb-4">Schedule</h2>
                    <BookingCalendar resource="consultorio-A" />
                </section>
            </main>
        </>
    )
}