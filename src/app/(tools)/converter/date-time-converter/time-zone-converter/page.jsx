"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import TimezoneList from "./_components/TimezoneList";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const page = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedTimezones, setSelectedTimezones] = useState([]);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Callback to receive selected timezones from the child component
  const handleSelectedTimezonesChange = (newSelectedTimezones) => {
    setSelectedTimezones(newSelectedTimezones);
  };
  const removeTimezone = (timezone) => {
    setSelectedTimezones((prevSelected) =>
      prevSelected.filter((item) => item !== timezone)
    );
  };

  if (!mounted) {
    return null; // Or a loading spinner if necessary
  }

  return (
    <div className="w-[100%] p-2">
      <Card className="w-[full]">
        <CardHeader>
          <CardTitle className="px-1">Multiple Time Zone Converter</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col-reverse md:flex md:flex-row">
          <div className="mb-4 md:w-[70%] border-2">
            {/* Display the selected timezones */}
            <div style={{ marginTop: "20px" }}>
              <h3>Selected Timezones:</h3>
              <div className="pt-2 px-1">
                {selectedTimezones.length > 0 ? (
                  selectedTimezones.map((timezone) => (
                    <Badge key={timezone} className="font-light">
                      {timezone}
                      <Button className="p-0 h-[20px] ml-2 cursor-pointer" onClick={() => removeTimezone(timezone)}>
                        <CircleX />
                      </Button>
                    </Badge>
                  ))
                ) : (
                  <p>No timezones selected.</p>
                )}
              </div>
            </div>
          </div>
          <div className="mb-4 md:w-[30%]">
            <TimezoneList
              onSelectedTimezonesChange={handleSelectedTimezonesChange}
              selectedTimezones={selectedTimezones}
            />
          </div>
        </CardContent>
      </Card>
    </div>
    // <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
    //   <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
    //     Multiple Time Zone Converter
    //   </h1>

    //   {/* Input Section */}
    //   <div className="mb-4">
    //     <label className="block text-lg font-medium text-gray-700">
    //       Enter Date/Time (ISO format):
    //     </label>
    //     <input
    //       type="text"
    //       value={date}
    //       onChange={(e) => setDate(e.target.value)}
    //       className="mt-2 p-2 w-full max-w-sm border border-gray-300 rounded-lg"
    //       placeholder="e.g., 2024-12-25T12:00:00"
    //     />
    //   </div>

    //   {/* Time Zone Selection */}
    //   <div className="mb-4">
    //     <label className="block text-lg font-medium text-gray-700">
    //       Select Time Zones:
    //     </label>
    //     <select
    //       multiple
    //       value={timeZones}
    //       onChange={(e) =>
    //         setTimeZones(
    //           [...e.target.selectedOptions].map((option) => option.value)
    //         )
    //       }
    //       className="mt-2 p-2 w-full max-w-sm border border-gray-300 rounded-lg"
    //     >
    //       <option value="America/New_York">America/New_York</option>
    //       <option value="Europe/London">Europe/London</option>
    //       <option value="Asia/Tokyo">Asia/Tokyo</option>
    //       <option value="Australia/Sydney">Australia/Sydney</option>
    //       <option value="Asia/Kolkata">Asia/Kolkata</option>
    //       <option value="America/Los_Angeles">America/Los_Angeles</option>
    //     </select>
    //   </div>

    //   {/* Convert Button */}
    //   <button
    //     onClick={handleConvertTimeZones}
    //     className="px-6 py-2 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-blue-700 transition"
    //   >
    //     Convert Time Zones
    //   </button>

    //   {/* Converted Times Display */}
    //   <div className="mt-6 space-y-4">
    //     {convertedTimes.length > 0 &&
    //       convertedTimes.map(({ zone, time }) => (
    //         <div
    //           key={zone}
    //           className="p-4 bg-white shadow-lg rounded-lg w-full max-w-md text-gray-700"
    //         >
    //           <p className="text-xl font-medium">{zone}</p>
    //           <p className="text-lg">{time}</p>
    //         </div>
    //       ))}
    //   </div>
    // </div>
  );
};

export default page;
