// 'use client';

// import { useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import useMounted from '@/hooks/useMounted';

// // Register ChartJS components
// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function page() {
//   const mounted = useMounted();
//   const [loanAmountRaw, setLoanAmountRaw] = useState('');
//   const [loanAmountDisplay, setLoanAmountDisplay] = useState('');
//   const [loanTermYears, setLoanTermYears] = useState('');
//   const [loanTermMonths, setLoanTermMonths] = useState('');
//   const [interestRate, setInterestRate] = useState('');
//   const [totalAmountPaid, setTotalAmountPaid] = useState(0);
//   const [totalInterestPaid, setTotalInterestPaid] = useState(0);
//   const [monthlyPayment, setMonthlyPayment] = useState(0);
//   const [monthlySchedule, setMonthlySchedule] = useState([]);
//   const [yearlySchedule, setYearlySchedule] = useState([]);
//   const [viewType, setViewType] = useState('annual');

//   const handleLoanAmountChange = (e) => {
//     const value = e.target.value.replace(/[^0-9]/g, '');
//     setLoanAmountRaw(value);
//     if (value) {
//       const formatted = Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 });
//       setLoanAmountDisplay(formatted);
//     } else {
//       setLoanAmountDisplay('');
//     }
//   };

//   const calculateAmortization = () => {
//     const principal = parseFloat(loanAmountRaw);
//     const yearlyRate = parseFloat(interestRate) / 100;
//     const monthlyRate = yearlyRate / 12;
//     const totalMonths = (parseInt(loanTermYears) || 0) * 12 + (parseInt(loanTermMonths) || 0);

//     if (!principal || !totalMonths || !yearlyRate) return;

//     const monthlyPaymentCalc = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
//                               (Math.pow(1 + monthlyRate, totalMonths) - 1);

//     let balance = principal;
//     let totalInterest = 0;
//     const newMonthlySchedule = [];
//     const newYearlySchedule = [];

//     for (let month = 1; month <= totalMonths; month++) {
//       const interest = balance * monthlyRate;
//       const principalPayment = monthlyPaymentCalc - interest;
//       balance -= principalPayment;

//       if (balance < 0) balance = 0;
//       totalInterest += interest;

//       newMonthlySchedule.push({
//         month,
//         year: Math.floor((month - 1) / 12) + 1,
//         interest,
//         principal: principalPayment,
//         balance,
//       });
//     }

//     for (let year = 0; year < Math.ceil(totalMonths / 12); year++) {
//       const yearStart = year * 12;
//       const yearEnd = Math.min((year + 1) * 12, totalMonths);

//       const yearData = newMonthlySchedule.slice(yearStart, yearEnd).reduce(
//         (acc, curr) => ({
//           interest: acc.interest + curr.interest,
//           principal: acc.principal + curr.principal,
//         }),
//         { interest: 0, principal: 0 }
//       );

//       newYearlySchedule.push({
//         year: year + 1,
//         interest: yearData.interest,
//         principal: yearData.principal,
//         balance: newMonthlySchedule[yearEnd - 1].balance,
//       });
//     }

//     setMonthlySchedule(newMonthlySchedule);
//     setYearlySchedule(newYearlySchedule);
//     setTotalAmountPaid(principal + totalInterest);
//     setTotalInterestPaid(totalInterest);
//     setMonthlyPayment(monthlyPaymentCalc);
//   };

//   const clearForm = () => {
//     setLoanAmountRaw('');
//     setLoanAmountDisplay('');
//     setLoanTermYears('');
//     setLoanTermMonths('');
//     setInterestRate('');
//     setTotalAmountPaid(0);
//     setTotalInterestPaid(0);
//     setMonthlyPayment(0);
//     setMonthlySchedule([]);
//     setYearlySchedule([]);
//   };

//   const currentSchedule = viewType === 'annual' ? yearlySchedule : monthlySchedule;

//   // Pie chart data
//   const principalPercent = totalAmountPaid ? (parseFloat(loanAmountRaw) / totalAmountPaid) * 100 : 0;
//   const interestPercent = totalAmountPaid ? (totalInterestPaid / totalAmountPaid) * 100 : 0;

//   const pieData = {
//     labels: ['Principal', 'Interest'],
//     datasets: [{
//       data: [principalPercent, interestPercent],
//       backgroundColor: ['#36A2EB', '#FF6384'],
//       hoverBackgroundColor: ['#36A2EB', '#FF6384'],
//     }]
//   };

//   const pieOptions = {
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom',
//       },
//       tooltip: {
//         callbacks: {
//           label: (context) => `${context.label}: ${context.parsed.toFixed(1)}%`
//         }
//       }
//     }
//   };
//   if (!mounted) return null;
//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <h1 className="text-3xl font-bold text-center mb-8">Amortization Calculator (₹)</h1>

//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Left Side - Form */}
//         <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Loan Amount (₹)</label>
//               <input
//                 type="text"
//                 value={loanAmountDisplay}
//                 onChange={handleLoanAmountChange}
//                 className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm p-2 outline-none"
//                 placeholder="Enter amount in Rupees"
//               />
//             </div>

//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700">Loan Term (Years)</label>
//                 <input
//                   type="number"
//                   value={loanTermYears}
//                   onChange={(e) => setLoanTermYears(e.target.value)}
//                   className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm p-2 outline-none"
//                   placeholder="Years"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700">Loan Term (Months)</label>
//                 <input
//                   type="number"
//                   value={loanTermMonths}
//                   onChange={(e) => setLoanTermMonths(e.target.value)}
//                   className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm p-2 outline-none"
//                   placeholder="Months"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
//               <input
//                 type="number"
//                 step="0.1"
//                 value={interestRate}
//                 onChange={(e) => setInterestRate(e.target.value)}
//                 className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm p-2 outline-none"
//                 placeholder="Annual interest rate"
//               />
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={calculateAmortization}
//                 className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
//               >
//                 Calculate
//               </button>
//               <button
//                 onClick={clearForm}
//                 className="flex-1 bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>

//           <div className="mt-6 space-y-2">
//             <p className="text-lg">
//               Total Amount Paid: ₹{totalAmountPaid.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//             </p>
//             <p className="text-lg">
//               Total Interest Paid: ₹{totalInterestPaid.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//             </p>
//             <p className="text-lg bg-green-400 p-2 rounded-lg">
//               Monthly Payment: ₹{monthlyPayment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//             </p>
//             <div className="h-64">
//               <Pie data={pieData} options={pieOptions} />
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Table */}
//         <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
//           <div className="mb-4 flex gap-4">
//             <button
//               onClick={() => setViewType('annual')}
//               className={`px-4 py-2 rounded-md ${
//                 viewType === 'annual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//               }`}
//             >
//               Annual
//             </button>
//             <button
//               onClick={() => setViewType('monthly')}
//               className={`px-4 py-2 rounded-md ${
//                 viewType === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//               }`}
//             >
//               Monthly
//             </button>
//           </div>

//           <table className="w-full text-sm text-left">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="px-4 py-2">{viewType === 'annual' ? 'Year' : 'Month'}</th>
//                 <th className="px-4 py-2">Interest (₹)</th>
//                 <th className="px-4 py-2">Principal (₹)</th>
//                 <th className="px-4 py-2">Ending Balance (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentSchedule.map((row, index) => {
//                 const isNewYear = viewType === 'monthly' &&
//                   (index === 0 || row.month % 12 === 1);

//                 return (
//                   <>
//                     {isNewYear && index !== 0 && (
//                       <tr className="bg-gray-100">
//                         <td colSpan={4} className="px-4 py-2 font-bold">
//                           Year {row.year}
//                         </td>
//                       </tr>
//                     )}
//                     <tr key={viewType === 'annual' ? row.year : row.month} className="border-b">
//                       <td className="px-4 py-2">
//                         {viewType === 'annual' ? row.year : row.month}
//                       </td>
//                       <td className="px-4 py-2">
//                         {row.interest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//                       </td>
//                       <td className="px-4 py-2">
//                         {row.principal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//                       </td>
//                       <td className="px-4 py-2">
//                         {row.balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//                       </td>
//                     </tr>
//                   </>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/AmortizationCalculator.jsx
"use client";

import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useMounted from "@/hooks/useMounted";
import { Printer } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function page() {
  const mounted = useMounted();

  const [loanAmountRaw, setLoanAmountRaw] = useState("");
  const [loanAmountDisplay, setLoanAmountDisplay] = useState("");
  const [loanTermYears, setLoanTermYears] = useState("");
  const [loanTermMonths, setLoanTermMonths] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [monthlySchedule, setMonthlySchedule] = useState([]);
  const [yearlySchedule, setYearlySchedule] = useState([]);
  const [viewType, setViewType] = useState("annual");
  const [showData, setShowData] = useState(false);

  const handleLoanAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setLoanAmountRaw(value);
    if (value) {
      const formatted = Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      });
      setLoanAmountDisplay(formatted);
    } else {
      setLoanAmountDisplay("");
    }
  };

  const calculateAmortization = () => {
    const principal = parseFloat(loanAmountRaw);
    const yearlyRate = parseFloat(interestRate) / 100;
    const monthlyRate = yearlyRate / 12;
    const totalMonths =
      (parseInt(loanTermYears) || 0) * 12 + (parseInt(loanTermMonths) || 0);

    if (!principal || !totalMonths || !yearlyRate) return;

    const monthlyPaymentCalc =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    let balance = principal;
    let totalInterest = 0;
    const newMonthlySchedule = [];
    const newYearlySchedule = [];

    for (let month = 1; month <= totalMonths; month++) {
      const interest = balance * monthlyRate;
      const principalPayment = monthlyPaymentCalc - interest;
      balance -= principalPayment;

      if (balance < 0) balance = 0;
      totalInterest += interest;

      newMonthlySchedule.push({
        month,
        year: Math.floor((month - 1) / 12) + 1,
        interest,
        principal: principalPayment,
        balance,
      });
    }

    for (let year = 0; year < Math.ceil(totalMonths / 12); year++) {
      const yearStart = year * 12;
      const yearEnd = Math.min((year + 1) * 12, totalMonths);

      const yearData = newMonthlySchedule.slice(yearStart, yearEnd).reduce(
        (acc, curr) => ({
          interest: acc.interest + curr.interest,
          principal: acc.principal + curr.principal,
        }),
        { interest: 0, principal: 0 }
      );

      newYearlySchedule.push({
        year: year + 1,
        interest: yearData.interest,
        principal: yearData.principal,
        balance: newMonthlySchedule[yearEnd - 1].balance,
      });
    }

    setMonthlySchedule(newMonthlySchedule);
    setYearlySchedule(newYearlySchedule);
    setTotalAmountPaid(principal + totalInterest);
    setTotalInterestPaid(totalInterest);
    setMonthlyPayment(monthlyPaymentCalc);
    setShowData(true);
  };

  const clearForm = () => {
    setShowData(false);
    setLoanAmountRaw("");
    setLoanAmountDisplay("");
    setLoanTermYears("");
    setLoanTermMonths("");
    setInterestRate("");
    setTotalAmountPaid(0);
    setTotalInterestPaid(0);
    setMonthlyPayment(0);
    setMonthlySchedule([]);
    setYearlySchedule([]);
  };

  const currentSchedule =
    viewType === "annual" ? yearlySchedule : monthlySchedule;

  // Pie chart data
  const principalPercent = totalAmountPaid
    ? (parseFloat(loanAmountRaw) / totalAmountPaid) * 100
    : 0;
  const interestPercent = totalAmountPaid
    ? (totalInterestPaid / totalAmountPaid) * 100
    : 0;

  const pieData = {
    labels: ["Principal", "Interest"],
    datasets: [
      {
        data: [principalPercent, interestPercent],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed.toFixed(1)}%`,
        },
      },
    },
  };

  // Render table rows
  const renderTableRows = () => {
    if (viewType === "annual") {
      return yearlySchedule.map((row) => (
        <tr key={`year-${row.year}`} className="border-b">
          <td className="px-4 py-2">{row.year}</td>
          <td className="px-4 py-2">
            {row.interest.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </td>
          <td className="px-4 py-2">
            {row.principal.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </td>
          <td className="px-4 py-2">
            {row.balance.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </td>
        </tr>
      ));
    } else {
      // Group monthly data by year
      const rows = [];
      let currentYear = null;

      monthlySchedule.forEach((row) => {
        if (currentYear !== row.year) {
          currentYear = row.year;
          rows.push(
            <tr key={`year-separator-${row.year}`} className="bg-gray-100">
              <td colSpan={4} className="px-4 py-2 font-bold">
                Year {row.year}
              </td>
            </tr>
          );
        }
        rows.push(
          <tr key={`month-${row.month}`} className="border-b">
            <td className="px-4 py-2">{row.month}</td>
            <td className="px-4 py-2">
              {row.interest.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </td>
            <td className="px-4 py-2">
              {row.principal.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </td>
            <td className="px-4 py-2">
              {row.balance.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        );
      });

      return rows;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return null;
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center ">
        Amortization Calculator
      </h1>
      <div className="flex justify-end mb-8">
        <button
          onClick={handlePrint}
          className="px-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors print:hidden"
        >
          <Printer />
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side - Form */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loan Amount (₹)
              </label>
              <input
                type="text"
                value={loanAmountDisplay}
                onChange={handleLoanAmountChange}
                className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm p-2 outline-none"
                placeholder="Enter amount in Rupees"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Loan Term (Years)
                </label>
                <input
                  type="number"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm p-2 outline-none"
                  placeholder="Years"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Loan Term (Months)
                </label>
                <input
                  type="number"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm p-2 outline-none"
                  placeholder="Months"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm p-2 outline-none"
                placeholder="Annual interest rate"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={calculateAmortization}
                className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              >
                Calculate
              </button>
              <button
                onClick={clearForm}
                className="flex-1 bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
              >
                Clear
              </button>
            </div>
          </div>
          {showData && (
            <div className="mt-6 space-y-2">
              <p className="text-lg pl-2">
                Total Amount Paid: ₹
                {totalAmountPaid.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-lg pl-2">
                Total Interest Paid: ₹
                {totalInterestPaid.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-lg bg-green-400 rounded-lg px-2 py-1">
                Monthly Payment: ₹
                {monthlyPayment.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="h-64">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Table */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <div className="mb-4 flex gap-4">
            <button
              onClick={() => setViewType("annual")}
              className={`px-4 py-2 rounded-md ${
                viewType === "annual"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Annual
            </button>
            <button
              onClick={() => setViewType("monthly")}
              className={`px-4 py-2 rounded-md ${
                viewType === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Monthly
            </button>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">
                  {viewType === "annual" ? "Year" : "Month"}
                </th>
                <th className="px-4 py-2">Interest (₹)</th>
                <th className="px-4 py-2">Principal (₹)</th>
                <th className="px-4 py-2">Ending Balance (₹)</th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
