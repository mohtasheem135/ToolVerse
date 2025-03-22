"use client";

import React, { useState } from "react";
import Select from "react-select";
import { baseOptions } from "./_constants/data";
import useMounted from "@/hooks/useMounted";
import Loader from "@/components/ui/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  const mounted = useMounted();

  const [fromBase, setFromBase] = useState(
    baseOptions.find((option) => option.value === 10)
  ); // Default to Decimal
  const [toBase, setToBase] = useState(
    baseOptions.find((option) => option.value === 16)
  ); // Default to Hex
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const handleFromBaseChange = (selectedOption) => setFromBase(selectedOption);
  const handleToBaseChange = (selectedOption) => setToBase(selectedOption);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    convertBase(value, fromBase.value, toBase.value);
  };

  const convertBase = (value, from, to) => {
    if (value === "") {
      setOutputValue("");
      return;
    }

    // Convert from the 'from' base to decimal first
    const decimalValue = parseInt(value, from);
    if (isNaN(decimalValue)) {
      setOutputValue("Invalid Input");
      return;
    }

    // Convert from decimal to the 'to' base
    const convertedValue = decimalValue.toString(to).toUpperCase();
    setOutputValue(convertedValue);
  };

  if (!mounted) {
    return <Loader />;
  }
  return (
    <div className="w-[100%] p-2 py-[100px] flex justify-center items-center">
      <Card className="w-[750px]">
        <CardHeader>
          <CardTitle className="text-center">Base Converter</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="w-full">
            <label htmlFor="value" className="block text-sm font-medium opacity-70">
              Enter Number
            </label>
            <input
              type="number"
              id="value"
              className="w-full px-4 py-2 border rounded outline-none"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter value"
              required
            />
          </div>

          <div className="flex justify-between space-x-4 mt-4">
            <div className="w-full">
              <label
                htmlFor="fromBase"
                className="block text-sm font-medium opacity-70"
              >
                From Base:
              </label>
              <Select
                id="fromBase"
                value={fromBase}
                onChange={handleFromBaseChange}
                options={baseOptions}
                isClearable
                isSearchable
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="toBase"
                className="block text-sm font-medium opacity-70"
              >
                To Base:
              </label>
              <Select
                id="toBase"
                value={toBase}
                onChange={handleToBaseChange}
                options={baseOptions}
                isClearable
                isSearchable
              />
            </div>
          </div>
          <div className="w-full mt-4">
            <label
              htmlFor="result"
              className="block text-sm font-medium opacity-70"
            >
              Result:
            </label>
            <input
            id="result"
              className="w-full h-[65px] px-4 py-2 border rounded outline-none"
              type="text"
              value={outputValue}
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
    // <div>
    //   <div>
    // <label>From Base:</label>
    // <Select
    //   value={fromBase}
    //   onChange={handleFromBaseChange}
    //   options={baseOptions}
    // />
    //   </div>

    //   <div>
    //     <label>To Base:</label>
    // <Select
    //   value={toBase}
    //   onChange={handleToBaseChange}
    //   options={baseOptions}
    // />
    //   </div>

    //   <div>
    //     <label>Input Value:</label>
    //     <input
    //       type="text"
    //       value={inputValue}
    //       onChange={handleInputChange}
    //       placeholder="Enter a number"
    //     />
    //   </div>

    //   <div>
    //     <label>Converted Value:</label>
    //     <input type="text" value={outputValue} readOnly />
    //   </div>
    // </div>
  );
};

export default Page;
