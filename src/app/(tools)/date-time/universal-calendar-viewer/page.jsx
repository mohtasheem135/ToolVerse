"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import moment from "moment-hijri";
import momentJalaali from "moment-jalaali";
import useMounted from "@/hooks/useMounted";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const MultiCalendar = () => {
  const mounted = useMounted();

  const [inputDate, setInputDate] = useState(DateTime.local().toISODate());
  const [gregorianInWords, setGregorianInWords] = useState("");
  const [islamicDate, setIslamicDate] = useState("");
  const [islamicInWords, setIslamicInWords] = useState("");

  const [persianDate, setPersianDate] = useState("");
  const [persianInWords, setPersianInWords] = useState("");

  useEffect(() => {
    const luxonDate = DateTime.local();

    // Gregorian
    const gregorianWords = luxonDate.toFormat("cccc, dd MMMM yyyy");
    setGregorianInWords(gregorianWords);

    // Hijri
    const hijriDate = moment(luxonDate.toISODate(), "YYYY-MM-DD").format(
      "iYYYY/iMM/iDD"
    );
    setIslamicDate(hijriDate);

    const hijriInWords = moment(luxonDate.toISODate(), "YYYY-MM-DD").format(
      "dddd, iD iMMMM iYYYY"
    );
    const hijriInWordsEnglish = moment(luxonDate.toISODate(), "YYYY-MM-DD")
      .locale("en")
      .format("dddd, iD iMMMM iYYYY");
    setIslamicInWords(`${hijriInWords} (${hijriInWordsEnglish})`);

    // Persian Calendar
    const persianDate = momentJalaali(luxonDate.toISODate()).format(
      "jYYYY/jMM/jDD"
    );
    setPersianDate(persianDate);

    const persianInWords = momentJalaali(luxonDate.toISODate()).format(
      "dddd, jD jMMMM jYYYY"
    );
    const persianInWordsEnglish = momentJalaali(luxonDate.toISODate())
      .locale("en")
      .format("dddd, jD jMMMM jYYYY");
    setPersianInWords(`${persianInWords} (${persianInWordsEnglish})`);
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setInputDate(date);

    const luxonDate = DateTime.fromISO(date);

    // Gregorian
    const gregorianWords = luxonDate.toFormat("cccc, dd MMMM yyyy");
    setGregorianInWords(gregorianWords);

    // Hijri
    const hijriDate = moment(date, "YYYY-MM-DD").format("iYYYY/iMM/iDD"); // Format as Islamic (Hijri)
    setIslamicDate(hijriDate);

    const hijriInWords = moment(luxonDate.toISODate(), "YYYY-MM-DD").format(
      "dddd, iD iMMMM iYYYY"
    );
    const hijriInWordsEnglish = moment(luxonDate.toISODate(), "YYYY-MM-DD")
      .locale("en")
      .format("dddd, iD iMMMM iYYYY");
    setIslamicInWords(`${hijriInWords} (${hijriInWordsEnglish})`);

    // Persian Calendar
    const persianDate = momentJalaali(luxonDate.toISODate()).format(
      "jYYYY/jMM/jDD"
    );
    setPersianDate(persianDate);

    const persianInWords = momentJalaali(luxonDate.toISODate()).format(
      "dddd, jD jMMMM jYYYY"
    );
    const persianInWordsEnglish = momentJalaali(luxonDate.toISODate())
      .locale("en")
      .format("dddd, jD jMMMM jYYYY");
    setPersianInWords(`${persianInWords} (${persianInWordsEnglish})`);
  };

  if (!mounted) return <p>Loading...</p>;
  return (
    <div className="w-[100%] p-2">
      <Card className="flex flex-col items-center p-6 space-y-4 bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Universal Calendar Viewer
          </CardTitle>
        </CardHeader>

        <div className="mb-4">
          <label
            htmlFor="date-input"
            className="block text-lg font-medium text-gray-700"
          >
            Enter Date:
          </label>
          <input
            type="date"
            id="date-input"
            value={inputDate}
            onChange={handleDateChange}
            className="w-full px-4 py-2 text-lg border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              Gregorian Calendar
            </h3>
            <p>{gregorianInWords}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              Islamic (Hijri) Calendar
            </h3>
            <p>{islamicDate} (Hijri)</p>
            <p>{islamicInWords}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              Persian (Solar Hijri) Calendar
            </h3>
            <p>{persianDate} (Hijri)</p>
            <p>{persianInWords}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MultiCalendar;
