import EconomyCalendarWidth from "../components/ui/EconomyCalendarWidth";

function EconomyCalendar() {
  return (
    <div>
      <div className="text-start pb-5">
        <h2 className="text-3xl font-bold text-gray-900">Economy Calendar</h2>
      </div>
      <div className="w-full h-[700px] md:h-[900px] ">
        <EconomyCalendarWidth />
      </div>
    </div>
  );
}

export default EconomyCalendar;
