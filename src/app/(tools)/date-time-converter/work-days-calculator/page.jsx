"use client";
// components/WorkdayCalculator.js

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import useMounted from "@/hooks/useMounted";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Holiday list provided by the user
const holidays = [
  "2025-01-01", // New Year's Day
  "2025-01-26", // Republic Day
  "2025-03-29", // Good Friday
  "2025-05-01", // Labour Day
  "2025-08-15", // Independence Day
  "2025-10-02", // Gandhi Jayanti
  "2025-10-23", // Dussehra
  "2025-11-12", // Diwali
  "2025-11-13", // Diwali (observed in some regions)
  "2025-12-25", // Christmas Day
];

const WorkdayCalculator = () => {
  const mounted = useMounted();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workdays, setWorkdays] = useState(null);
  const [saturdays, setSaturdays] = useState(0);
  const [sundays, setSundays] = useState(0);
  const [holidaysInRange, setHolidaysInRange] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const today = DateTime.local();
    const endOfMonth = today.endOf("month");

    setStartDate(today.toISODate());
    setEndDate(endOfMonth.toISODate());
  }, []);

  const calculateWorkdays = () => {
    if (!startDate || !endDate) return;

    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);

    if (start > end) {
      alert("Start date must be before the end date.");
      return;
    }

    let currentDate = start;
    let daysCount = 0;
    let saturdayCount = 0;
    let sundayCount = 0;
    let holidaysInSelectedRange = [];

    while (currentDate <= end) {
      const dayOfWeek = currentDate.weekday;
      const currentDateISO = currentDate.toISODate();

      if (dayOfWeek === 6) saturdayCount++;
      if (dayOfWeek === 7) sundayCount++;

      if (holidays.includes(currentDateISO)) {
        const holidayDay = currentDate.toFormat("cccc");
        holidaysInSelectedRange.push({ date: currentDateISO, day: holidayDay });
      }

      if (
        dayOfWeek >= 1 &&
        dayOfWeek <= 5 &&
        !holidays.includes(currentDateISO)
      ) {
        daysCount++;
      }

      currentDate = currentDate.plus({ days: 1 });
    }

    setWorkdays(daysCount);
    setSaturdays(saturdayCount);
    setSundays(sundayCount);
    setHolidaysInRange(holidaysInSelectedRange);
    setIsCalculated(true);
  };

  const handleNextMonth = () => {
    const nextMonthStart = DateTime.local()
      .plus({ months: 1 })
      .startOf("month");
    const nextMonthEnd = nextMonthStart.endOf("month");
    setStartDate(nextMonthStart.toISODate());
    setEndDate(nextMonthEnd.toISODate());
    setIsCalculated(false);
  };

  const handleThisYear = () => {
    const thisYearStart = DateTime.local().startOf("year");
    const thisYearEnd = thisYearStart.endOf("year");
    setStartDate(thisYearStart.toISODate());
    setEndDate(thisYearEnd.toISODate());
    setIsCalculated(false);
  };

  const handleNextYear = () => {
    const nextYearStart = DateTime.local().plus({ years: 1 }).startOf("year");
    const nextYearEnd = nextYearStart.endOf("year");
    setStartDate(nextYearStart.toISODate());
    setEndDate(nextYearEnd.toISODate());
    setIsCalculated(false);
  };

  if (!mounted) return null;
  return (
    <div className="w-[100%] p-2">
      <Card className="flex flex-col items-center p-6 space-y-4 bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Workday Calculator
          </CardTitle>
        </CardHeader>
        <div className="flex space-x-4 mt-4">
          <Button
            onClick={handleNextMonth}
            className="px-4 py-2 md:font-normal bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
          >
            Next Month
          </Button>
          <Button
            onClick={handleThisYear}
            className="px-4 py-2 md:font-normal bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition duration-300"
          >
            This Year
          </Button>
          <Button
            onClick={handleNextYear}
            className="px-4 py-2 md:font-normal bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
          >
            Next Year
          </Button>
        </div>
        <div className="flex flex-col space-y-4 w-full max-w-lg">
          <div>
            <label
              htmlFor="start-date"
              className="block text-lg font-medium text-gray-700"
            >
              Start Date:
            </label>
            <input
              id="start-date"
              type="date"
              className="w-full px-4 py-2 text-lg border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setIsCalculated(false);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="end-date"
              className="block text-lg font-medium text-gray-700"
            >
              End Date:
            </label>
            <input
              id="end-date"
              type="date"
              className="w-full px-4 py-2 text-lg border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setIsCalculated(false);
              }}
            />
          </div>

          <button
            onClick={calculateWorkdays}
            disabled={isCalculated}
            className={`mt-4 px-6 py-2 font-semibold rounded-lg transition duration-300 ${
              isCalculated
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Calculate Workdays
          </button>

          {isCalculated && workdays !== null && (
            <div className="mt-4 text-lg text-gray-800">
              <p>
                <strong>Number of workdays:</strong> {workdays}
              </p>
              <p>
                <strong>Number of Saturdays:</strong> {saturdays}
              </p>
              <p>
                <strong>Number of Sundays:</strong> {sundays}
              </p>

              {holidaysInRange.length > 0 && (
                <div className="mt-4">
                  <strong>Holidays in Range:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    {holidaysInRange.map((holiday, index) => (
                      <li key={index}>
                        {holiday.date} falls on a <strong>{holiday.day}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WorkdayCalculator;
