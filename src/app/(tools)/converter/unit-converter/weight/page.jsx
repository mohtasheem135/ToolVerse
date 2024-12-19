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
import { weightConversionRates, weightUnits } from "./_constants/conversionRates";
import { Badge } from "@/components/ui/badge";

export default function WeightConverter() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("grams");
  const [toUnit, setToUnit] = useState("kilograms");
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Conversion function
  const convert = (value, fromUnit, toUnit, rates) => {
    const conversionRate = rates[fromUnit][toUnit];
    console.log(conversionRate);
    return value * conversionRate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let convertedValue;

    // Use appropriate conversion rates based on the selected category
    convertedValue = convert(
      parseFloat(value),
      fromUnit,
      toUnit,
      weightConversionRates
    );

    setResult(convertedValue);
    setSubmitted(true);
  };

  const availableToUnits = Object.keys(weightConversionRates[fromUnit]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-[100%] p-2">
      <Card className="w-[full]">
        <CardHeader>
          <CardTitle>Weight Converter</CardTitle>
          <CardDescription>
          <p className="px-1">Units between which you can convert.</p>
            <div className="flex flex-wrap">
              {weightUnits.map((unit) => (
                <div key={unit.key} className="pt-2 px-1">
                  <Badge
                    className={`font-light ${
                      unit.key === fromUnit || unit.key === toUnit
                        ? "bg-[#000099] text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {unit.name.charAt(0).toUpperCase() + unit.name.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
            <div className="flex w-full space-x-3">
              <div className="w-1/2">
                <label htmlFor="fromUnit" className="block text-sm font-medium">
                  From Unit
                </label>
                <select
                  id="fromUnit"
                  className="w-full px-4 py-2 border rounded"
                  value={fromUnit}
                  onChange={(e) => {
                    setFromUnit(e.target.value);
                    setSubmitted(false);
                  }}
                  required
                >
                  <option>Select Value</option>
                  {Object.keys(weightConversionRates).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label htmlFor="toUnit" className="block text-sm font-medium">
                  To Unit
                </label>
                <select
                  id="toUnit"
                  className="w-full px-4 py-2 border rounded"
                  value={toUnit}
                  onChange={(e) => {
                    setToUnit(e.target.value);
                    if (!availableToUnits.includes(toUnit)) {
                      setToUnit(availableToUnits[0]);
                    }
                    setSubmitted(false);
                  }}
                  required
                >
                  <option>Select Value</option>
                  {availableToUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-full">
                <label htmlFor="value" className="block text-sm font-medium">
                  Enter Value
                </label>
                <input
                  type="number"
                  id="value"
                  className="w-full px-4 py-2 border rounded outline-none"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setSubmitted(false);
                  }}
                  placeholder="Enter value"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Convert
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {submitted && result !== null && (
            <div className="mt-6 text-center">
              <h2 className="text-xl font-semibold">Conversion Result</h2>
              <p className="text-lg">
                {value} {fromUnit} is equal to {result.toFixed(4)} {toUnit}
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
