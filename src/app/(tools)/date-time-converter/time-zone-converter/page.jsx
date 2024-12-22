"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import TimezoneList from "./_components/TimezoneList";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useMounted from "@/hooks/useMounted";

const page = () => {
  const mounted = useMounted();
  const [selectedTimezones, setSelectedTimezones] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCurrentTimes, setSelectedCurrentTimes] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      const updatedTimes = selectedTimezones.map((timezone) => {
        const currentTime = DateTime.now().setZone(timezone);
        const time = currentTime.toLocaleString(DateTime.TIME_SIMPLE);
        const date = currentTime.toLocaleString(DateTime.DATE_FULL);
        return { timezone, time, date };
      });
      setSelectedCurrentTimes(updatedTimes);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [selectedTimezones]);

  const handleSelectedTimezonesChange = (newSelectedTimezones) => {
    setSelectedTimezones(newSelectedTimezones);
  };
  const removeTimezone = (timezone) => {
    setSelectedTimezones((prevSelected) =>
      prevSelected.filter((item) => item !== timezone)
    );
  };

  const time = currentTime.toLocaleTimeString();
  const date = currentTime.toLocaleDateString();

  if (!mounted) return null;

  return (
    <div className="w-[100%] p-2">
      <Card className="w-[full]">
        <CardHeader>
          <CardTitle className="px-1">
            <div className="flex justify-between items-center">
              <div>Multiple Time Zone Converter</div>
              <div className="flex flex-col items-end">
                <div className="text-[#333] text-[18px]">{date}</div>
                <div className="text-[#000099] text-[36px] font-bold mt-[10px]">
                  {time}
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="md:flex md:justify-between md:h-[500px]">
          <div className="mb-4 md:w-[30%]">
            <TimezoneList
              onSelectedTimezonesChange={handleSelectedTimezonesChange}
              selectedTimezones={selectedTimezones}
            />
          </div>
          <div className="md:w-[70%] md:px-2  ">
            <Card className="md:h-[500px] overflow-y-auto">
              <div>
                <div className=" flex flex-wrap">
                  {selectedTimezones.length > 0 ? (
                    selectedTimezones.map((timezone) => (
                      <div key={timezone} className="pt-2 px-1 ">
                        <Badge className="cursor-default font-light">
                          {timezone}
                          <Button
                            className="p-0 h-[20px] ml-2 cursor-pointer"
                            onClick={() => removeTimezone(timezone)}
                          >
                            <CircleX />
                          </Button>
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="px-1">No timezones selected.</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                {/* Display the converted times for each selected timezone */}
                <div style={{ marginTop: "20px" }} className="flex flex-wrap">
                  {selectedCurrentTimes.length > 0 &&
                    selectedCurrentTimes.map(({ timezone, time }) => (
                      <div key={timezone} className="px-1 pt-2">
                        <div className="shadow-md rounded-md p-2 flex flex-col justify-center items-center">
                          <strong>{timezone}</strong>
                          <br />

                          <div className="text-[#333] text-[18px]">{date}</div>
                          <div className="text-[#000099] text-[36px] font-bold mt-[10px]">
                            {time}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
