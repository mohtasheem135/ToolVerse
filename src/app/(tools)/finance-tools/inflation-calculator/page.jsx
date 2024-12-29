"use client"
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import { calculateInflation } from '../utils/inflationCalculator';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const calculateInflation = (initialAmount, inflationRate, years) => {
  const futureValue = initialAmount * Math.pow(1 + inflationRate / 100, years);
  const purchasingPower = initialAmount / Math.pow(1 + inflationRate / 100, years);
  return { futureValue, purchasingPower };
};

const InflationCalculator = () => {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const { futureValue, purchasingPower } = calculateInflation(initialAmount, inflationRate, years);
    setResult({ futureValue, purchasingPower });

    // Prepare data for the chart
    const labels = Array.from({ length: years + 1 }, (_, i) => `Year ${i}`);
    const data = Array.from({ length: years + 1 }, (_, i) =>
      calculateInflation(initialAmount, inflationRate, i).purchasingPower
    );

    setChartData({
      labels,
      datasets: [
        {
          label: 'Purchasing Power Over Time',
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    });
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  return (
    <div className="container mx-auto p-6 overflow-hidden">
      <h1 className="text-2xl font-semibold mb-6">Inflation Calculator</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <label htmlFor="initialAmount" className="block mb-2">Initial Amount</label>
          <input
            id="initialAmount"
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="inflationRate" className="block mb-2">Inflation Rate (%)</label>
          <input
            id="inflationRate"
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="years" className="block mb-2">Years</label>
          <input
            id="years"
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-md"
      >
        Calculate
      </button>

      {result && (
        <div className="mt-6">
          <p className="text-lg font-medium">Results:</p>
          <p>Future Value: ${result.futureValue.toFixed(2)}</p>
          <p>Purchasing Power: ${result.purchasingPower.toFixed(2)}</p>
        </div>
      )}

      {chartData.labels.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-4">Purchasing Power Over Time</h2>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default InflationCalculator;
