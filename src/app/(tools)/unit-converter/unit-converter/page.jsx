"use client";

import React, { useState } from "react";
import VolumeConverter from "@/components/unit-converter/VolumeConverter";
import WeightConverter from "@/components/unit-converter/WeightConverter";
import LengthConverter from "@/components/unit-converter/LengthConverter";
import TemperatureConverter from "@/components/unit-converter/TemperatureConverter";
import AreaConverter from "@/components/unit-converter/AreaConverter";
import { Card } from "@/components/ui/card";
import Select from "react-select";
import useMounted from "@/hooks/useMounted";
import Loader from "@/components/ui/Loader";

const page = () => {
  const mounted = useMounted();
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);

  const options = [
    { value: "length", label: "Length" },
    { value: "temperature", label: "Temperature" },
    { value: "volume", label: "Volume" },
    { value: "area", label: "Area" },
    { value: "weight", label: "Weight" },
  ];

  if (!mounted) {
    return <Loader />;
  }
  return (
    <div className="w-[100%] p-2">
      <Card className="w-[full] py-2 px-4">
        <div className=" mb-4">
          <label htmlFor="category" className="block font-[15px] opacity-70">
            Select Unit to Convert
          </label>
          <Select
            id="category"
            value={selectedUnit}
            onChange={(option) => setSelectedUnit(option)}
            options={options}
            className="w-full rounded outline-none md:w-1/2"
            placeholder="Select Unit"
            isSearchable={isSearchable}
            isClearable={isClearable}
          />
          {/* {selectedUnit?.value} */}
        </div>
      </Card>

      {/* Conditionally render the selected converter */}
      {selectedUnit?.value === "volume" && <VolumeConverter />}
      {selectedUnit?.value === "weight" && <WeightConverter />}
      {selectedUnit?.value === "length" && <LengthConverter />}
      {selectedUnit?.value === "temperature" && <TemperatureConverter />}
      {selectedUnit?.value === "area" && <AreaConverter />}
    </div>
  );
};

export default page;
