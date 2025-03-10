"use client"; 
import useMounted from "@/hooks/useMounted";
import { useState } from "react";

export default function page() {
  const mounted = useMounted();

  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [yearsToRetirement, setYearsToRetirement] = useState('');
  const [annualReturn, setAnnualReturn] = useState(5);
  const [result, setResult] = useState(null);

  const formatIndianNumber = (num) => {
    return num.toLocaleString("en-IN");
  };

  const parseIndianNumber = (str) => {
    return parseFloat(str.replace(/,/g, "")) || 0;
  };

  const calculateRetirementSavings = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = yearsToRetirement * 12; 

    // Future value of current savings
    const futureValueSavings = currentSavings * Math.pow(1 + monthlyRate, totalMonths);

    // Future value of monthly contributions (annuity formula)
    const futureValueContributions =
      monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

    // Total retirement savings
    const totalSavings = futureValueSavings + futureValueContributions;

    setResult(totalSavings.toFixed(2)); // Round to 2 decimal places
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateRetirementSavings();
  };

  if (!mounted) return null;
  return (
    <div className="flex mt-10 justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Retirement Savings Calculator
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Current Savings (₹)
            </label>
            <input
              type="text"
              value={formatIndianNumber(currentSavings)}
              onChange={(e) => setCurrentSavings(parseIndianNumber(e.target.value))}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Monthly Contribution (₹)
            </label>
            <input
              type="text"
              value={formatIndianNumber(monthlyContribution)}
              onChange={(e) => setMonthlyContribution(parseIndianNumber(e.target.value))}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Years Until Retirement
            </label>
            <input
              type="number"
              value={yearsToRetirement}
              onChange={(e) => setYearsToRetirement(parseFloat(e.target.value) || 0)}
              // min="0"
              placeholder="0"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Annual Return (%)
            </label>
            <input
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.1"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
        </form>

        {result && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Estimated Retirement Savings: ₹{formatIndianNumber(parseFloat(result))}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}