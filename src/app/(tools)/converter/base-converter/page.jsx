"use client";

import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { baseOptions } from "./_constants/data";
import useMounted from "@/hooks/useMounted";
import Loader from "@/components/ui/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Delete, DeleteIcon, Trash2 } from "lucide-react";

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
  const [conversionSteps, setConversionSteps] = useState("");
  const [divisionTable, setDivisionTable] = useState("");

  const handleFromBaseChange = (selectedOption) => setFromBase(selectedOption);
  const handleToBaseChange = (selectedOption) => setToBase(selectedOption);

  const inputRef = useRef(null);

  useEffect(() => {
    convertBase(inputValue, fromBase?.value, toBase?.value);

    adjustHeight();
  }, [inputValue, fromBase, toBase]);

  const adjustHeight = () => {
    if (inputRef.current) {
      const newHeight = Math.max(inputValue.length * 40, 120);
      inputRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    // convertBase(value, fromBase.value, toBase.value);
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

    const decimalSteps = generateDecimalSteps(value, from, decimalValue);
    setConversionSteps(decimalSteps);

    const { table } = convertFromDecimal(decimalValue, to);
    setDivisionTable(table);

    // Convert from decimal to the 'to' base
    const convertedValue = decimalValue.toString(to).toUpperCase();
    setOutputValue(convertedValue);
  };

  const generateDecimalSteps = (value, from, decimalValue) => {
    let steps = `${value} (${from} base) to decimal:\n`;

    for (let i = value.length - 1; i >= 0; i--) {
      const digit = value[i];
      const placeValue = Math.pow(from, value.length - 1 - i);
      steps += `   (${digit} × ${from}^${value.length - 1 - i}) = ${
        digit * placeValue
      }\n`;
    }

    steps += `Total = ${decimalValue} (decimal)`;
    return steps;
  };

  //   const convertFromDecimal = (decimalValue, to) => {
  //     let quotient = decimalValue;
  //     let remainder;
  //     let convertedValue = "";
  //     let table = "Division Quotient Remainder\n";

  //     while (quotient >= to) {
  //       remainder = quotient % to;
  //       convertedValue = remainder.toString(to).toUpperCase() + convertedValue;
  //       table += `${quotient} / ${to} = ${Math.floor(
  //         quotient / to
  //       )} ${remainder}\n`;
  //       quotient = Math.floor(quotient / to);
  //     }

  //     convertedValue = quotient.toString(to).toUpperCase() + convertedValue;
  //     table += `${quotient} / ${to} = 0 ${quotient}\n`;

  //     return { table };
  //   };

  const convertFromDecimal = (decimalValue, to) => {
    let quotient = decimalValue;
    let remainder;
    let convertedValue = "";
    let tableRows = [];

    while (quotient >= to) {
      remainder = quotient % to;
      convertedValue = remainder.toString(to).toUpperCase() + convertedValue;
      tableRows.push([quotient, Math.floor(quotient / to), remainder]);
      quotient = Math.floor(quotient / to);
    }

    convertedValue = quotient.toString(to).toUpperCase() + convertedValue;
    tableRows.push([quotient, 0, quotient]);

    return {
      table: tableRows,
    };
  };

  const handleClear = () => {
    setFromBase(fromBase);
    setToBase(toBase);
    setConversionSteps("");
    setInputValue("");
    setOutputValue("");
    setDivisionTable("");
  };

  if (!mounted) {
    return <Loader />;
  }
  return (
    <div className="w-[100%] p-2 py-4 flex justify-center items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Base Converter</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 md:flex md:space-x-2">
          <div className="md:w-[40%] md:border-r-2 md:border-[#000] md:px-2">
            <div className="w-full">
              <label
                htmlFor="value"
                className="block text-sm font-medium opacity-70"
              >
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
                isClearable={false}
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
                  isClearable={false}
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

            <div className="w-full flex justify-end mt-4">
              <button
                onClick={handleClear}
                className="flex justify-between border-none text-white rounded shadow px-6 py-2 bg-red-500 cursor-pointer hover:bg-red-600"
              >
                Clear <Trash2 className="ml-2" />{" "}
              </button>
            </div>
          </div>
          <Card className="md:w-[60%] md:flex p-2 mt-4 md:mt-0  space-y-4 md:space-y-0 md:space-x-2">
            <div className={`${fromBase?.value !== 10 ? "md:w-[50%]": "" }`}>
              {fromBase && fromBase?.value !== 10 && (
                <>
                  <label className="bg-green-500 px-2 py-1 rounded shadow text-white">
                    From Base {fromBase.value} to Decimal Conversion
                  </label>
                  <textarea
                    ref={inputRef}
                    value={conversionSteps}
                    className="w-full px-4 py-2 border rounded outline-none overflow-hidden"
                    readOnly
                    style={{
                      width: "100%",
                      fontFamily: "monospace",
                      fontSize: "14px",
                    }}
                  />
                </>
              )}
            </div>
            <div className="w-full md:w-[50%]">
              <label className="bg-green-500 px-2 py-1 rounded shadow text-white">
                Decimal to Base {toBase.value} Conversion
              </label>
              <table
                className="w-full"
                style={{
                  width: "100%",
                  fontFamily: "monospace",
                  fontSize: "14px",
                }}
              >
                <tbody>
                  <tr>
                    <th className="p-[12px] text-left border-[1px] border-[#ddd] bg-[#353434] text-white leading-4">
                      Division
                    </th>
                    <th className="p-[12px] text-left border-[1px] border-[#ddd] bg-[#353434] text-white leading-4">
                      Quotient
                    </th>
                    <th className="p-[12px] text-left border-[1px] border-[#ddd] bg-[#353434] text-white leading-4">
                      Remainder
                    </th>
                  </tr>
                  {divisionTable &&
                    divisionTable.map((row, index) => (
                      <tr key={index}>
                        <td className="p-[12px] text-left border-[1px] border-[#ddd]">{`${row[0]} / ${toBase.value}`}</td>
                        <td className="p-[12px] text-left border-[1px] border-[#ddd]">
                          {row[1]}
                        </td>
                        <td className="p-[12px] text-left border-[1px] border-[#ddd]">
                          {row[2]}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
