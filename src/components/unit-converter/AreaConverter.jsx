"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  areaConversionRates,
  areaUnits,
} from "./_constants/areaConversionRates";
import { Badge } from "@/components/ui/badge";

export default function AreaConverter() {
  const [value, setValue] = useState(0);
  const [fromUnit, setFromUnit] = useState("squareMeters");
  const [toUnit, setToUnit] = useState("squareKilometers");
  const [result, setResult] = useState(0);

  // Conversion function
  const convert = (value, fromUnit, toUnit, rates) => {
    const conversionRate = rates[fromUnit][toUnit];
    console.log(conversionRate);
    return value * conversionRate;
  };

  useEffect(() => {
    let convertedValue;

    // Use appropriate conversion rates based on the selected category
    convertedValue = convert(
      parseFloat(value),
      fromUnit,
      toUnit,
      areaConversionRates
    );

    setResult(convertedValue);
  }, [fromUnit, toUnit, value]);

  const availableToUnits = Object.keys(areaConversionRates[fromUnit]);

  const filteredAreaUnits = areaUnits.filter((unit) =>
    availableToUnits.includes(unit.key)
  );

  const unitSymbols = areaUnits.reduce((acc, unit) => {
    acc[unit.key] = unit.symbol;
    return acc;
  }, {});

  const formatConversion = (value, fromUnit, result, toUnit) => {
    const fromUnitSymbol = unitSymbols[fromUnit] || fromUnit;
    const toUnitSymbol = unitSymbols[toUnit] || toUnit;
    return `${value} ${fromUnitSymbol} is equal to ${result.toFixed(
      4
    )} ${toUnitSymbol}`;
  };

  return (
    <div className="w-[100%] mt-2">
      <Card className="w-[full]">
        <CardHeader>
          <CardTitle className="px-1">Area Converter</CardTitle>
          <CardDescription>
            <p className="px-1">Units between which you can convert.</p>
            <div className="flex">
              <div className="flex flex-wrap w-1/2 border-r pr-2">
                {" "}
                {areaUnits.map((unit) => (
                  <div key={unit.key} className="pt-2 px-1">
                    <Badge
                      onClick={() => {
                        setFromUnit(unit.key);
                        if (!availableToUnits.includes(toUnit)) {
                          setToUnit(availableToUnits[0]);
                        }
                      }}
                      className={`font-light cursor-default hover:text-white ${
                        unit.key === fromUnit
                          ? "bg-[#000099] text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {unit.name.charAt(0).toUpperCase() + unit.name.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap w-1/2 px-2">
                {" "}
                {filteredAreaUnits.map((unit) => (
                  <div key={unit.key} className="pt-2 px-1">
                    <Badge
                      onClick={() => {
                        setToUnit(unit.key);
                      }}
                      className={`font-light cursor-default hover:text-white ${
                        unit.key === toUnit
                          ? "bg-[#000099] text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {unit.name.charAt(0).toUpperCase() + unit.name.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="max-w-lg mx-auto space-y-4">
            <div className="flex justify-between">
              <div className="w-full">
                <label htmlFor="value" className="block text-sm font-medium">
                  Enter Value
                </label>
                <input
                  type="number"
                  id="value"
                  className="w-full px-4 py-2 border rounded outline-none"
                  value={value == 0 ? "" : value}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                  placeholder="Enter value"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold">Conversion Result</h2>
            <p className="text-lg">
              {formatConversion(value, fromUnit, result, toUnit)}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
