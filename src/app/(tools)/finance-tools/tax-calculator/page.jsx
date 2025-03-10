// import React from 'react'
// import WorkInProgress from '../../../../components/WorkInProgress'
// const page = () => {
//   return (
//     <div>
//       <WorkInProgress />
//     </div>
//   )
// }

// export default page

"use client";

import { useState } from "react";
import taxData from "./_data/data.json";
import useMounted from "@/hooks/useMounted";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleAlert } from "lucide-react";

export default function page() {
  const mounted = useMounted();
  const [income, setIncome] = useState(0);
  const [age, setAge] = useState("below60");
  const [regime, setRegime] = useState("new");
  const [deductions80C, setDeductions80C] = useState(0);
  const [deductions80D, setDeductions80D] = useState(0);
  const [isSalaried, setIsSalaried] = useState(true);
  const [result, setResult] = useState(null);

  // Helper to determine age category
  const getAgeCategory = (age) => {
    if (age === "below60") return "below60";
    if (age === "60to80") return "60to80";
    return "above80";
  };

  // Format number to Indian style (e.g., 1400000 -> 14,00,000)
  const formatIndianNumber = (value) => {
    const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (isNaN(num)) return "";
    return num.toLocaleString("en-IN");
  };

  // Handle income input change
  const handleIncomeChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    setIncome(rawValue); // Store raw value as string
  };

  // Get raw number for calculation
  const getRawIncome = () => {
    return parseInt(income.replace(/[^0-9]/g, ""), 10) || 0;
  };

  // Calculate taxable income
  const calculateTaxableIncome = (income, deductions, regime, isSalaried) => {
    let taxableIncome = income;
    const regimeData =
      regime === "new" ? taxData.regimes.new : taxData.regimes.old;

    if (isSalaried) {
      taxableIncome -= regimeData.standardDeduction.salaried;
    }
    if (regime === "old") {
      taxableIncome -= Math.min(
        deductions["80C"],
        regimeData.deductions["80C"]
      );
      taxableIncome -= Math.min(
        deductions["80D"],
        regimeData.deductions["80D"]
      );
    }
    return Math.max(0, taxableIncome);
  };

  // Apply tax slabs
  const applyTaxSlabs = (taxableIncome, regime, age) => {
    const slabs =
      regime === "new"
        ? taxData.regimes.new.slabs
        : taxData.regimes.old.slabs[getAgeCategory(age)];
    let tax = 0;

    for (const slab of slabs) {
      if (taxableIncome > slab.range[0]) {
        const taxableInBracket =
          Math.min(taxableIncome, slab.range[1] || Infinity) - slab.range[0];
        tax += taxableInBracket * (slab.rate / 100);
      }
    }
    return tax;
  };

  // Apply rebate
  const applyRebate = (tax, taxableIncome, regime) => {
    const rebate = taxData.regimes[regime].rebate;
    if (taxableIncome <= rebate.incomeThreshold) {
      return Math.max(0, tax - rebate.maxAmount);
    }
    return tax;
  };

  // Add cess and surcharge
  const addCessAndSurcharge = (tax, taxableIncome) => {
    const cess = tax * (taxData.cess.rate / 100);
    let surchargeRate = 0;
    for (const slab of taxData.surcharge) {
      if (
        taxableIncome > slab.range[0] &&
        taxableIncome <= (slab.range[1] || Infinity)
      ) {
        surchargeRate = slab.rate;
        break;
      }
    }
    const surcharge = tax * (surchargeRate / 100);
    return tax + cess + surcharge;
  };

  // Handle form submission
  const handleCalculate = (e) => {
    e.preventDefault();
    const rawIncome = getRawIncome();
    const deductions = { "80C": deductions80C, "80D": deductions80D };
    const taxableIncome = calculateTaxableIncome(
      rawIncome,
      deductions,
      regime,
      isSalaried
    );
    const baseTax = applyTaxSlabs(taxableIncome, regime, age);
    const taxAfterRebate = applyRebate(baseTax, taxableIncome, regime);
    const finalTax = addCessAndSurcharge(taxAfterRebate, taxableIncome);

    setResult({
      taxableIncome: taxableIncome.toLocaleString("en-IN"),
      baseTax: baseTax.toLocaleString("en-IN"),
      finalTax: finalTax.toLocaleString("en-IN"),
    });
  };

  // Get slabs for table display
  const getSlabs = () => {
    return regime === "new"
      ? taxData.regimes.new.slabs
      : taxData.regimes.old.slabs[getAgeCategory(age)];
  };

  if (!mounted) return null;
  return (
    <div className="container mx-auto p-4 px-4">
      <h1 className="text-2xl font-bold mb-4">
        India Tax Calculator (FY 2025-26)
      </h1>

      {/* Form */}
      <form onSubmit={handleCalculate} className="space-y-4">
        <div className="md:flex space-y-4 md:space-y-0 md:space-x-3">
          <div className="md:w-1/3">
            <label className="block mb-1">Annual Income (₹)</label>
            <input
              type="text" // Changed to text for custom formatting
              value={income ? formatIndianNumber(income) : ""}
              onChange={handleIncomeChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., 14,00,000"
              required
            />
          </div>
          <div className="md:w-1/3">
            <label className="block mb-1">Age</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="below60">Below 60</option>
              <option value="60to80">60 to 80</option>
              <option value="above80">Above 80</option>
            </select>
          </div>
          <div className="md:w-1/3">
            <label className="block mb-1">Tax Regime</label>
            <select
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="new">New Regime</option>
              <option value="old">Old Regime</option>
            </select>
          </div>
        </div>
        {regime === "old" && (
          <>
            <div>
              <label className="flex items-center mb-1">
                80C Deductions (₹){" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleAlert className="ml-2" size={20} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Save tax by investing up to ₹1,50,000 in things like
                        life insurance, PPF, or school fees (Old Regime only).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <input
                type="number"
                value={deductions80C}
                onChange={(e) => setDeductions80C(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min="0"
                max="150000"
              />
            </div>
            <div>
              <label className="flex items-center mb-1">
                80D Deductions (₹){" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleAlert className="ml-2" size={20} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Get a tax break up to ₹25,000 for health insurance
                        premiums for yourself or family (Old Regime only).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <input
                type="number"
                value={deductions80D}
                onChange={(e) => setDeductions80D(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min="0"
                max="25000"
              />
            </div>
          </>
        )}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isSalaried}
              onChange={(e) => setIsSalaried(e.target.checked)}
              className="mr-2"
            />
            Salaried Individual
          </label>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Calculate Tax
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold">Tax Calculation Results</h2>
          <p>Taxable Income: ₹{result.taxableIncome}</p>
          <p>Base Tax: ₹{result.baseTax}</p>
          <p>Final Payble Tax (incl. Cess & Surcharge): ₹{result.finalTax}</p>
        </div>
      )}

      {/* Tax Slabs Table */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          Tax Slabs ({regime === "new" ? "New" : "Old"} Regime)
        </h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Income Range (₹)</th>
              <th className="border p-2">Tax Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {getSlabs().map((slab, index) => (
              <tr key={index}>
                <td className="border p-2">
                  {slab.range[0].toLocaleString("en-IN")} -{" "}
                  {slab.range[1] === Infinity
                    ? "Above"
                    : slab.range[1].toLocaleString("en-IN")}
                </td>
                <td className="border p-2 text-center">{slab.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
