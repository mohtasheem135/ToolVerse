"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useMounted from "@/hooks/useMounted";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function InflationCalculator() {
  const mounted = useMounted();

  const [amount, setAmount] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [direction, setDirection] = useState("future");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("india"); // Default to India
  const [selectedYear, setSelectedYear] = useState("");
  const [yearlyRate, setYearlyRate] = useState(null);
  const [monthlyRates, setMonthlyRates] = useState([]);
  const [allYearsData, setAllYearsData] = useState([]);

  const countries = [
    { code: "india", name: "India", currencySymbol: "₹", currencyCode: "INR" },
    {
      code: "united_states",
      name: "United States",
      currencySymbol: "$",
      currencyCode: "USD",
    },
    {
      code: "united_kingdom",
      name: "United Kingdom",
      currencySymbol: "£",
      currencyCode: "GBP",
    },
    {
      code: "canada",
      name: "Canada",
      currencySymbol: "$",
      currencyCode: "CAD",
    },
    {
      code: "australia",
      name: "Australia",
      currencySymbol: "$",
      currencyCode: "AUD",
    },
    {
      code: "germany",
      name: "Germany",
      currencySymbol: "€",
      currencyCode: "EUR",
    },
    {
      code: "france",
      name: "France",
      currencySymbol: "€",
      currencyCode: "EUR",
    },
    { code: "japan", name: "Japan", currencySymbol: "¥", currencyCode: "JPY" },
    { code: "china", name: "China", currencySymbol: "¥", currencyCode: "CNY" },
    {
      code: "south_korea",
      name: "South Korea",
      currencySymbol: "₩",
      currencyCode: "KRW",
    },
    {
      code: "brazil",
      name: "Brazil",
      currencySymbol: "R$",
      currencyCode: "BRL",
    },
    {
      code: "russia",
      name: "Russia",
      currencySymbol: "₽",
      currencyCode: "RUB",
    },
    {
      code: "mexico",
      name: "Mexico",
      currencySymbol: "$",
      currencyCode: "MXN",
    },
    {
      code: "south_africa",
      name: "South Africa",
      currencySymbol: "R",
      currencyCode: "ZAR",
    },
    { code: "italy", name: "Italy", currencySymbol: "€", currencyCode: "EUR" },
  ];

  // Fetch current inflation rate
  useEffect(() => {
    async function fetchInflationRate() {
      try {
        const res = await fetch(`/api/inflation?country=${selectedCountry}`);
        const data = await res.json();
        setInflationRate(data.inflationRate);
      } catch (error) {
        console.error("Failed to fetch inflation rate:", error);
        setInflationRate(selectedCountry === "india" ? "4.31" : "3.0"); // India fallback: 4.31%
      } finally {
        setLoading(false);
      }
    }
    fetchInflationRate();
  }, [selectedCountry]);

  // Fetch historical inflation data
  useEffect(() => {
    if (!selectedYear) return;

    async function fetchInflationHistory() {
      try {
        const res = await fetch(
          `/api/inflation-history?year=${selectedYear}&country=${selectedCountry}`
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setYearlyRate(data.yearlyRate);
        setMonthlyRates(data.monthlyRates);
      } catch (error) {
        console.error("Failed to fetch inflation history:", error);
        setYearlyRate(null);
        setMonthlyRates([]);
      }
    }
    fetchInflationHistory();
  }, [selectedYear, selectedCountry]);

  // Fetch all years inflation data
  useEffect(() => {
    async function fetchAllYearsData() {
      try {
        const res = await fetch(
          `/api/inflation-all-years?country=${selectedCountry}`
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setAllYearsData(data.yearlyData);
      } catch (error) {
        console.error("Failed to fetch all years data:", error);
        setAllYearsData([]);
      }
    }
    fetchAllYearsData();
  }, [selectedCountry]);

  const calculateInflation = () => {
    const initialAmount = parseFloat(amount);
    const start = parseInt(startYear);
    const end = parseInt(endYear);
    const rate = parseFloat(inflationRate) / 100;
    const years = end - start;

    if (
      isNaN(initialAmount) ||
      isNaN(start) ||
      isNaN(end) ||
      isNaN(rate) ||
      years < 0
    ) {
      setResult("Please enter valid inputs.");
      return;
    }

    const countryData = countries.find((c) => c.code === selectedCountry);
    const currencySymbol = countryData ? countryData.currencySymbol : "₹"; // Fallback to India
    let calculatedValue;
    if (direction === "future") {
      calculatedValue = initialAmount * Math.pow(1 + rate, years);
      setResult(
        `${currencySymbol}${initialAmount.toFixed(
          2
        )} in ${start} is worth ${currencySymbol}${calculatedValue.toFixed(
          2
        )} in ${end}.`
      );
    } else {
      calculatedValue = initialAmount / Math.pow(1 + rate, years);
      setResult(
        `${currencySymbol}${initialAmount.toFixed(
          2
        )} in ${end} was worth ${currencySymbol}${calculatedValue.toFixed(
          2
        )} in ${start}.`
      );
    }
  };

  const resetForm = () => {
    setAmount("");
    setStartYear("");
    setEndYear("");
    setInflationRate("");
    setDirection("future");
    setResult(null);
    setLoading(true);
    setSelectedYear("");
    setYearlyRate(null);
    setMonthlyRates([]);
  };

  const years = Array.from(
    { length: 2025 - 1913 + 1 },
    (_, i) => 1913 + i
  ).reverse();

  const monthlyChartData = {
    labels: monthlyRates.map((rate) => rate.month),
    datasets: [
      {
        label: `Monthly Inflation Rate (${selectedYear})`,
        data: monthlyRates.map((rate) => parseFloat(rate.rate)),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const allYearsChartData = {
    labels: allYearsData.map((data) => data.year),
    datasets: [
      {
        label: "Yearly Inflation Rate (1913-2025)",
        data: allYearsData.map((data) => parseFloat(data.rate)),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    // maintainAspectRatio: false,
    plugins: { legend: { position: "top" }, title: { display: true } },
    scales: { y: { title: { display: true, text: "Inflation Rate (%)" } } },
  };

  if (!mounted) return null;
  return (
    <div className="px-4 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inflation Calculator</h1>

      {/* Calculator Form */}
      <div className="space-y-4">
        <div className="flex space-x-3">
          {/* Country Selection */}
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Select Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block mb-1">
              Amount (
              {countries.find((c) => c.code === selectedCountry)
                ?.currencySymbol || "₹"}
              )
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., 100"
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="w-1/2">
            <label className="block mb-1">Starting Year</label>
            <input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., 2010"
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1">Ending Year</label>
            <input
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., 2025"
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="w-1/2">
            <label className="block mb-1">Annual Inflation Rate (%)</label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder={loading ? "Fetching..." : "e.g., 4.31"}
              step="0.1"
              disabled={loading}
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1">Calculate:</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="future">Future Value</option>
              <option value="present">Present Value</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={calculateInflation}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            Calculate
          </button>
          <button
            onClick={resetForm}
            className="bg-gray-300 p-2 rounded hover:bg-gray-400"
          >
            Reset
          </button>
        </div>
        {result && <p className="mt-4 text-lg">{result}</p>}
      </div>

      {/* Historical Inflation Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">
          Historical Inflation Rates (
          {countries.find((c) => c.code === selectedCountry)?.name})
        </h2>
        <div>
          <label className="block mb-1">Select Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select a Year --</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="md:flex space-x-3 items-center">
          {allYearsData.length > 0 && (
            <div className="mt-8 md:w-1/2 md:border-r-2 md:border-gray-400">
              <h2 className="text-xl font-semibold mb-2">
                Inflation Over All Years
              </h2>
              <Line
                data={allYearsChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      text: `Yearly Inflation (1913-2025) - ${
                        countries.find((c) => c.code === selectedCountry)?.name
                      }`,
                    },
                  },
                }}
              />
            </div>
          )}
          {selectedYear && (
            <div className="mt-8 md:w-1/2">
              <h2 className="text-xl font-semibold mb-2">
                Inflation Over Year {selectedYear}
              </h2>
              <Line
                data={monthlyChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { text: `Monthly Inflation (${selectedYear})` },
                  },
                }}
              />
            </div>
          )}
        </div>
        {selectedYear && yearlyRate && (
          <div className="mt-4">
            <p className="mb-2">
              Yearly Inflation Rate for {selectedYear}: {yearlyRate}%
            </p>
            <table className="w-full border-collapse border mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Month</th>
                  <th className="border p-2">Inflation Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRates.map((rate, index) => (
                  <tr key={index}>
                    <td className="border p-2">{rate.month}</td>
                    <td className="border p-2">{rate.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
