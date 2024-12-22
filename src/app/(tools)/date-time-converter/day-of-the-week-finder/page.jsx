"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";

const DayOfWeekFinder = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [weekday, setWeekday] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const today = DateTime.now().toISODate(); // Get today's date in YYYY-MM-DD format
    setSelectedDate(today);
    setWeekday(DateTime.now().toFormat("cccc")); // Set weekday for today
  }, []);

  // Handle date change
  const handleDateChange = (event) => {
    const date = event.target.value;
    const parsedDate = DateTime.fromISO(date);

    setSelectedDate(date);

    // Get the weekday name
    const weekdayName = parsedDate.toFormat("cccc"); // Full name of the weekday (e.g., Monday)
    setWeekday(weekdayName);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center p-[20px]">
      <label htmlFor="date-picker" className="text-[16px] mb-[10px]">
        Select a Date:
      </label>

      <input
        id="date-picker"
        type="date"
        className="p-[10px] outline-none rounded-[8px] border-[1px] border-[#ccc] text-[16px] w-[100%] max-w-[250px]"
        onChange={handleDateChange}
        value={selectedDate || ""}
      />

      {weekday && (
        <div className="text-[#333] text-[18px] mt-[20px]">
          <p>
            The selected day is: <strong>{weekday}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default DayOfWeekFinder;
