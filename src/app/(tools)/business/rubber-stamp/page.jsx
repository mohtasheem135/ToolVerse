"use client"

import Loader from "@/components/ui/Loader";
import useMounted from "@/hooks/useMounted";

// import { useState } from "react";

// export default function RoundStampTemplate() {
//     const mounted = useMounted();
//   const [outerDiameter, setOuterDiameter] = useState(200); // Default 200px
//   const [innerDiameter, setInnerDiameter] = useState(150); // Default 150px
//   const [text, setText] = useState("Your Text Here");
//   const [isReversed, setIsReversed] = useState(false);
//   const [textOffset, setTextOffset] = useState(50); // Start offset for text, default to 50%

//   // Calculate radii
//   const outerRadius = outerDiameter / 2;
//   const innerRadius = innerDiameter / 2;

//   // Reverse text if needed
//   const displayedText = isReversed
//     ? text.split("").reverse().join("")
//     : text;

//   // Handle the movement of text around the circle
//   const moveTextUp = () => {
//     setTextOffset((prev) => (prev + 1) % 100); // Increase offset
//   };

//   const moveTextDown = () => {
//     setTextOffset((prev) => (prev - 1 + 100) % 100); // Decrease offset
//   };

//   if (!mounted) {
//     return <Loader />;
//   }
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4">
//       {/* Input for outer and inner diameters */}
//       <div className="mb-4">
//         <label className="block mb-1">Outer Circle Diameter (px):</label>
//         <input
//           type="number"
//           value={outerDiameter}
//           onChange={(e) => setOuterDiameter(e.target.value)}
//           className="border p-2 rounded w-full"
//         />

//         <label className="block mt-4 mb-1">Inner Circle Diameter (px):</label>
//         <input
//           type="number"
//           value={innerDiameter}
//           onChange={(e) => setInnerDiameter(e.target.value)}
//           className="border p-2 rounded w-full"
//         />

//         <label className="block mt-4 mb-1">Text:</label>
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="border p-2 rounded w-full"
//         />

//         <button
//           onClick={() => setIsReversed(!isReversed)}
//           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           {isReversed ? "Unreverse Text" : "Reverse Text"}
//         </button>

//         {/* Arrow buttons to move text */}
//         <div className="flex space-x-4 mt-4">
//           <button
//             onClick={moveTextUp}
//             className="bg-gray-300 px-3 py-2 rounded text-lg"
//           >
//             ↑ Move Up
//           </button>
//           <button
//             onClick={moveTextDown}
//             className="bg-gray-300 px-3 py-2 rounded text-lg"
//           >
//             ↓ Move Down
//           </button>
//         </div>
//       </div>

//       {/* SVG Circle with Text */}
//       <svg
//         width={outerDiameter}
//         height={outerDiameter}
//         viewBox={`0 0 ${outerDiameter} ${outerDiameter}`}
//         className="border border-gray-400 rounded-full"
//       >
//         {/* Outer Circle */}
//         <circle
//           cx={outerRadius}
//           cy={outerRadius}
//           r={outerRadius}
//           stroke="black"
//           strokeWidth="4"
//           fill="none"
//         />

//         {/* Inner Circle */}
//         <circle
//           cx={outerRadius}
//           cy={outerRadius}
//           r={innerRadius}
//           stroke="black"
//           strokeWidth="2"
//           fill="none"
//         />

//         {/* Circular Text Path */}
//         <defs>
//           <path
//             id="textPath"
//             d={`M ${outerRadius},${outerRadius} m -${innerRadius},0 a ${innerRadius},${innerRadius} 0 1,1 ${innerDiameter},0 a ${innerRadius},${innerRadius} 0 1,1 -${innerDiameter},0`}
//           />
//         </defs>
//         <text fontSize="16" fill="black">
//           <textPath
//             href="#textPath"
//             startOffset={`${textOffset}%`}
//             textAnchor="middle"
//             style={{
//               transform: isReversed ? "scale(-1, 1)" : "scale(1, 1)",
//               fontFamily: "Arial, sans-serif",
//             }}
//           >
//             {displayedText}
//           </textPath>
//         </text>
//       </svg>
//     </div>
//   );
// }




import { useState } from "react";

export default function RoundStampTemplate() {
  const [outerDiameter, setOuterDiameter] = useState(200); // Default 200px
  const [innerDiameter, setInnerDiameter] = useState(150); // Default 150px
  const [text, setText] = useState("Your Text Here");
  const [isReversed, setIsReversed] = useState(false);
  const [textOffset, setTextOffset] = useState(50); // Start offset for text
  const [fontSize, setFontSize] = useState(16); // Default font size

  // Calculate radii
  const outerRadius = outerDiameter / 2;
  const innerRadius = innerDiameter / 2;

  // Reverse text if needed
  const displayedText = isReversed
    ? text.split("").reverse().join("")
    : text;

  // Handle the movement of text around the circle
  const moveTextUp = () => {
    setTextOffset((prev) => (prev + 1) % 100); // Increase offset
  };

  const moveTextDown = () => {
    setTextOffset((prev) => (prev - 1 + 100) % 100); // Decrease offset
  };

  // Increase/decrease font size
  const increaseFontSize = () => setFontSize((prev) => prev + 1);
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 1, 10)); // Minimum 10px

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Input for outer and inner diameters */}
      <div className="mb-4">
        <label className="block mb-1">Outer Circle Diameter (px):</label>
        <input
          type="number"
          value={outerDiameter}
          onChange={(e) => setOuterDiameter(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <label className="block mt-4 mb-1">Inner Circle Diameter (px):</label>
        <input
          type="number"
          value={innerDiameter}
          onChange={(e) => setInnerDiameter(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <label className="block mt-4 mb-1">Text:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={() => setIsReversed(!isReversed)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isReversed ? "Unreverse Text" : "Reverse Text"}
        </button>

        {/* Arrow buttons to move text */}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={moveTextUp}
            className="bg-gray-300 px-3 py-2 rounded text-lg"
          >
            ↑ Move Up
          </button>
          <button
            onClick={moveTextDown}
            className="bg-gray-300 px-3 py-2 rounded text-lg"
          >
            ↓ Move Down
          </button>
        </div>

        {/* Font size adjustment */}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={increaseFontSize}
            className="bg-green-300 px-3 py-2 rounded text-lg"
          >
            + Increase Font
          </button>
          <button
            onClick={decreaseFontSize}
            className="bg-red-300 px-3 py-2 rounded text-lg"
          >
            - Decrease Font
          </button>
        </div>
      </div>

      {/* SVG Circle with Text */}
      <svg
        width={outerDiameter}
        height={outerDiameter}
        viewBox={`0 0 ${outerDiameter} ${outerDiameter}`}
        className="border border-gray-400 rounded-full"
      >
        {/* Outer Circle */}
        <circle
          cx={outerRadius}
          cy={outerRadius}
          r={outerRadius}
          stroke="black"
          strokeWidth="4"
          fill="none"
        />

        {/* Inner Circle */}
        <circle
          cx={outerRadius}
          cy={outerRadius}
          r={innerRadius}
          stroke="black"
          strokeWidth="2"
          fill="none"
        />

        {/* Circular Text Path */}
        <defs>
          <path
            id="textPath"
            d={`M ${outerRadius},${outerRadius} m -${innerRadius},0 a ${innerRadius},${innerRadius} 0 1,1 ${innerDiameter},0 a ${innerRadius},${innerRadius} 0 1,1 -${innerDiameter},0`}
          />
        </defs>
        <text
          fontSize={fontSize}
          fill="black"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          <textPath
            href="#textPath"
            startOffset={`${textOffset}%`}
            textAnchor="middle"
            style={{
              transform: isReversed ? "scale(-1, 1)" : "scale(1, 1)",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {displayedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
