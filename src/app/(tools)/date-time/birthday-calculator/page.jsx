"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import useMounted from "@/hooks/useMounted";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const BirthdayCalculator = () => {
  const mounted = useMounted();

  const [birthDate, setBirthDate] = useState("");
  const [currentAge, setCurrentAge] = useState("");
  const [timeUntilBirthday, setTimeUntilBirthday] = useState(null);
  const [zodiacSign, setZodiacSign] = useState("");

  const zodiacSigns = [
    { sign: "Aries", start: "03-21", end: "04-19" },
    { sign: "Taurus", start: "04-20", end: "05-20" },
    { sign: "Gemini", start: "05-21", end: "06-20" },
    { sign: "Cancer", start: "06-21", end: "07-22" },
    { sign: "Leo", start: "07-23", end: "08-22" },
    { sign: "Virgo", start: "08-23", end: "09-22" },
    { sign: "Libra", start: "09-23", end: "10-22" },
    { sign: "Scorpio", start: "10-23", end: "11-21" },
    { sign: "Sagittarius", start: "11-22", end: "12-21" },
    { sign: "Capricorn", start: "12-22", end: "01-19" },
    { sign: "Aquarius", start: "01-20", end: "02-18" },
    { sign: "Pisces", start: "02-19", end: "03-20" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (birthDate) {
        const now = DateTime.now();
        const dob = DateTime.fromISO(birthDate);
        let nextBirthday = dob.set({ year: now.year });

        // If this year's birthday has passed, set next birthday to next year
        if (now >= nextBirthday) {
          nextBirthday = nextBirthday.plus({ years: 1 });
        }

        const diff = nextBirthday.diff(now, [
          "months",
          "days",
          "hours",
          "minutes",
          "seconds",
        ]);

        // Update state with the calculated time until birthday
        setTimeUntilBirthday(diff);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [birthDate]);

  const calculateAge = (birthDate) => {
    const now = DateTime.now();
    const dob = DateTime.fromISO(birthDate);
    const years = now.diff(dob, "years").years;
    const months = now.diff(
      dob.plus({ years: Math.floor(years) }),
      "months"
    ).months;
    const days = now.diff(
      dob.plus({ years: Math.floor(years), months: Math.floor(months) }),
      "days"
    ).days;

    return {
      years: Math.floor(years),
      months: Math.floor(months),
      days: Math.floor(days),
    };
  };

  const getZodiacSign = (birthDate) => {
    const date = DateTime.fromISO(birthDate);
    const monthDay = date.toFormat("MM-dd");

    for (const { sign, start, end } of zodiacSigns) {
      if (monthDay >= start && monthDay <= end) {
        return sign;
      }

      if (sign === "Capricorn") {
        if (monthDay >= start || monthDay <= end) {
          return sign;
        }
      }
    }

    return "Unknown"; // Fallback if no match found
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (birthDate) {
      const { years, months, days } = calculateAge(birthDate);
      const zodiac = getZodiacSign(birthDate);
      setCurrentAge(`${years} years, ${months} months, ${days} days`);
      setZodiacSign(zodiac);
    }
  };
  if (!mounted) return null;
  return (
    // <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
    <div className="w-[100%] p-2">
      <Card className="flex flex-col items-center p-6 space-y-4 bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Birthday/Age Calculator
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} className="mb-4">
          <label htmlFor="birthDate" className="block text-lg mb-2">
            Enter Your Birth Date:
          </label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Calculate Age
          </button>
        </form>
        {currentAge && timeUntilBirthday && (
          <div className="md:flex justify-between mt-6  bg-orange-300 py-3 shadow-md rounded-md">
            <div className="text-center py-3 px-10 border-b-0 border-gray-300">
              <h3 className="text-xl">Your Age:</h3>
              <p className="text-lg mt-2">{currentAge}</p>
            </div>
<hr/>
            <div className="text-center py-3 px-10">
              <h3 className="text-xl">Time Left Until Your Birthday:</h3>
              <p className="text-lg mt-2">
                {timeUntilBirthday.months.toFixed(0)} months,{" "}
                {timeUntilBirthday.days.toFixed(0)} days,
                {timeUntilBirthday.hours.toFixed(0)} hours,
                {timeUntilBirthday.minutes.toFixed(0)} minutes,
                {timeUntilBirthday.seconds.toFixed(0)} seconds
              </p>
            </div>
          </div>
        )}
        {zodiacSign && (
          <div className="text-center mt-6 shadow-md rounded-md bg-blue-400 px-10 py-3">
            <h3 className="text-xl">Your Zodiac Sign:</h3>
            <p className="text-lg">{zodiacSign}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BirthdayCalculator;
