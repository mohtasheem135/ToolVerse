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
  temperatureConversionRates,
  temperatureUnits,
} from "./_constants/tempratureConversionRate";
import { Badge } from "@/components/ui/badge";

export default function TemperatureConverter() {
  const [value, setValue] = useState(0);
  const [fromUnit, setFromUnit] = useState("celsius");
  const [toUnit, setToUnit] = useState("fahrenheit");
  const [result, setResult] = useState(0);
  // const [submitted, setSubmitted] = useState(false);
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // Conversion function
  const convert = (value, fromUnit, toUnit, rates) => {
    if (typeof rates[fromUnit][toUnit] === "function") {
      return rates[fromUnit][toUnit](value);
    }
  };

  useEffect(() => {
    let convertedValue;

    // Use appropriate conversion rates based on the selected category
    convertedValue = convert(
      parseFloat(value),
      fromUnit,
      toUnit,
      temperatureConversionRates
    );

    setResult(convertedValue);
  }, [fromUnit, toUnit, value]);

  const availableToUnits = Object.keys(temperatureConversionRates[fromUnit]);
  const filteredTemperatureUnits = temperatureUnits.filter((unit) =>
    availableToUnits.includes(unit.key)
  );

  const unitSymbols = temperatureUnits.reduce((acc, unit) => {
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
          <CardTitle>Temperature Converter</CardTitle>
          <CardDescription>
            <p className="px-1">Units between which you can convert.</p>
            <div className="flex ">
              <div className="flex flex-wrap w-1/2 border-r pr-2">
                {temperatureUnits.map((unit) => (
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
                {filteredTemperatureUnits.map((unit) => (
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
              {/* {value} {fromUnit} is equal to {result.toFixed(4)} {toUnit} */}
              {formatConversion(value, fromUnit, result, toUnit)}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
