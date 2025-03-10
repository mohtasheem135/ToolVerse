"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useMounted from "@/hooks/useMounted";
import { CircleAlert } from "lucide-react";
import { useState, useEffect } from "react";

export default function page() {
  const mounted = useMounted();

  const [principalDisplay, setPrincipalDisplay] = useState(""); // Formatted display value
  const [principalValue, setPrincipalValue] = useState(""); // Raw number value
  const [rate, setRate] = useState("");
  const [compounds, setCompounds] = useState("1"); // Default to yearly
  const [time, setTime] = useState("");

  // State for results
  const [totalAmount, setTotalAmount] = useState(0);
  const [interestEarned, setInterestEarned] = useState(0);
  const [error, setError] = useState("");

  // Calculate compound interest
  const calculateCompoundInterest = () => {
    if (!principalValue || !rate || !compounds || !time) {
      setError("Please fill in all fields.");
      setTotalAmount(0);
      setInterestEarned(0);
      return;
    }

    const p = Number(principalValue);
    const r = Number(rate);
    const n = Number(compounds);
    const t = Number(time);

    if (p < 0 || r < 0 || n < 1 || t < 0) {
      setError("Values must be positive, and compounds must be at least 1.");
      setTotalAmount(0);
      setInterestEarned(0);
      return;
    }

    setError("");
    const rateDecimal = r / 100; // Convert percentage to decimal
    const amount = p * Math.pow(1 + rateDecimal / n, n * t);
    const interest = amount - p;

    setTotalAmount(parseFloat(amount.toFixed(2)));
    setInterestEarned(parseFloat(interest.toFixed(2)));
  };

  // Real-time calculation
  useEffect(() => {
    calculateCompoundInterest();
  }, [principalValue, rate, compounds, time]);

  // Handle principal input change
  const handlePrincipalChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // Remove existing commas
    if (rawValue === "" || isNaN(rawValue)) {
      setPrincipalDisplay("");
      setPrincipalValue("");
    } else {
      const numValue = Number(rawValue);
      setPrincipalValue(rawValue); // Store raw value as string for calculation
      setPrincipalDisplay(numValue.toLocaleString("en-IN")); // Format with commas
    }
  };

  // Reset function
  const resetFields = () => {
    setPrincipalDisplay("");
    setPrincipalValue("");
    setRate("");
    setCompounds("1");
    setTime("");
    setTotalAmount(0);
    setInterestEarned(0);
    setError("");
  };

  if (!mounted) return null;
  return (
    <div className="pt-5 pb-3 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Compound Interest Calculator (₹)
        </h1>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Principal Amount (₹)
            </label>
            <input
              type="text" // Changed to text for comma formatting
              value={principalDisplay}
              onChange={handlePrincipalChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., 35,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            {/* <label className="block text-sm font-medium">
              
            </label> */}
            <label className="flex items-center text-sm font-medium mb-1">
              Compounds per Year{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleAlert className="ml-2" size={20} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      "Compounds per year" means how often interest is added to<br/>
                      your money in a year. For example, if it’s 12, interest is<br/>
                      added every month. More compounds mean your money grows<br/>
                      faster.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <input
              type="number"
              value={compounds}
              onChange={(e) => setCompounds(e.target.value)}
              className="w-full p-2 border rounded"
              min="1"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time (Years)</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Results */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Results</h2>
          <p>Total Amount: ₹{totalAmount.toLocaleString("en-IN")}</p>
          <p>Interest Earned: ₹{interestEarned.toLocaleString("en-IN")}</p>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFields}
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
