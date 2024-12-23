import React from "react";
import {
  FaChartLine,
  FaPalette,
  FaArrowsAltH,
  FaRulerHorizontal,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatsDisplay = ({ stats, metadata }) => {
  if (!stats) return null;

  const channelData = stats.channels.map((channel) => ({
    min: channel.min,
    max: channel.max,
    mean: channel.mean,
  }));

  const histogramData = {
    labels: ["Red", "Green", "Blue"],
    datasets: [
      {
        label: "Mean",
        data: channelData.map((channel) => channel.mean),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
      {
        label: "Min",
        data: channelData.map((channel) => channel.min),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
      {
        label: "Max",
        data: channelData.map((channel) => channel.max),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Channel Statistics",
      },
    },
  };

  return (
    <div>
      {/* Part 1 */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Image Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.channels.map((channel, index) => (
            <div key={index} className="border rounded-md p-4">
              <h3 className="font-semibold text-md mb-2">
                {["Red", "Green", "Blue"][index]} Channel
              </h3>
              <div className="flex items-center mb-1">
                <FaArrowsAltH className="mr-2" /> Min: {channel.min}
              </div>
              <div className="flex items-center mb-1">
                <FaArrowsAltH className="mr-2 rotate-180" /> Max: {channel.max}
              </div>
              <div className="flex items-center mb-1">
                <FaChartLine className="mr-2" /> Mean: {channel.mean.toFixed(2)}
              </div>
              <div className="flex items-center">
                <FaRulerHorizontal className="mr-2" /> Std Dev:{" "}
                {channel.stdev.toFixed(2)}
              </div>
            </div>
          ))}
          <div className="border rounded-md p-4">
            <h3 className="font-semibold text-md mb-2">Overall</h3>
            <div className="flex items-center mb-1">
              <FaChartLine className="mr-2" /> Entropy:{" "}
              {stats.entropy.toFixed(2)}
            </div>
            <div className="flex items-center">
              <FaRulerHorizontal className="mr-2" /> Sharpness:{" "}
              {stats.sharpness.toFixed(2)}
            </div>
          </div>
          <div className="border rounded-md p-4">
            <h3 className="font-semibold text-md mb-2 flex items-center">
              <FaPalette className="mr-2" /> Dominant Color
            </h3>
            <div className="flex items-center">
              <div
                className="w-8 h-8 rounded-full mr-2"
                style={{
                  backgroundColor: `rgb(${stats.dominant.r}, ${stats.dominant.g}, ${stats.dominant.b})`,
                }}
              ></div>
              {`rgb(${stats.dominant.r}, ${stats.dominant.g}, ${stats.dominant.b})`}
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">Live Image Insights.</p>
      </div>
      {/* Part 2 */}
      <div className="image-dashboard bg-white rounded-lg shadow-md p-6 mt-6">
        <div
          className="dominant-color p-4 rounded-md mb-4"
          style={{
            backgroundColor: `rgb(${stats.dominant.r}, ${stats.dominant.g}, ${stats.dominant.b})`,
          }}
        >
          <p className="text-white font-semibold">
            Dominant Color: RGB({stats.dominant.r}, {stats.dominant.g},{" "}
            {stats.dominant.b})
          </p>
        </div>

        <div className="color-channel-bars mb-4">
          <Bar options={options} data={histogramData} />
        </div>
        {/* Metadata */}
        {/* <div className="metadata-info mb-4">
          {Object.entries(metadata).map(([key, value]) => (
            <p key={key}>
              {key}: {value}
            </p>
          ))}
        </div> */}
        <div className="entropy-sharpness flex justify-between mb-4">
          <p>Entropy: {stats.entropy.toFixed(2)}</p>
          <p>Sharpness: {stats.sharpness.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
