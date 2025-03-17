"use client"


// import useMounted from '@/hooks/useMounted';
// import { useEffect, useState } from 'react';

// const SortingVisualizer = () => {
//   const mounted = useMounted();

//   const [data, setData] = useState(generateRandomArray(20)); // Default array size
//   const [size, setSize] = useState(20); // Initial size of the array
//   const [message, setMessage] = useState(""); // State to hold the comparison message

//   // Generate random array of numbers
//   function generateRandomArray(size) {
//     return Array.from({ length: size }, () => Math.floor(Math.random() * 500));
//   }

//   // Update the array when the user changes the input size
//   const handleChangeSize = (e) => {
//     const newSize = parseInt(e.target.value, 10);
//     setSize(newSize);
//     setData(generateRandomArray(newSize));
//   };

//   // Update the boxes based on the array
//   const updateBoxes = async (arr) => {
//     const boxes = document.querySelectorAll('.box');
//     arr.forEach((value, index) => {
//       const box = boxes[index];
//       box.style.height = `50px`; // Set box height based on the array value
//       box.innerText = value; // Set box text to display the value
//     });
//   };

//   // Function to pause for a certain time (for animation)
//   const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//   // Bubble Sort with animations and delay
//   const bubbleSort = async () => {
//     const arr = [...data]; // Copy of data
//     const boxes = document.querySelectorAll('.box');

//     for (let i = 0; i < arr.length - 1; i++) {
//       for (let j = 0; j < arr.length - 1 - i; j++) {
//         // Highlight the boxes being compared
//         const currentBox = boxes[j];
//         const nextBox = boxes[j + 1];
//         currentBox.style.backgroundColor = 'red';
//         nextBox.style.backgroundColor = 'red';

//         // First delay: show the message for 1 second before doing anything
//         await sleep(1000); // 1 second delay to show the message

//         // Perform the swap after the message
//         if (arr[j] > arr[j + 1]) {
//           // Swap the elements and animate
//           [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
//           await updateBoxes(arr);
//         }

//         // Reset background color
//         currentBox.style.backgroundColor = 'steelblue';
//         nextBox.style.backgroundColor = 'steelblue';
//       }
//     }

//     // Mark the array as sorted
//     boxes.forEach(box => box.style.backgroundColor = 'green');
//     setData(arr);
//     setMessage('Sorting is complete!'); // Final message
//   };

//   useEffect(() => {
//     updateBoxes(data);
//   }, [data]);

//   if (!mounted) return null;

//   return (
//     <div className='p-4'>
//       <h1>Sorting Algorithms Visualizer</h1>
      
//       <div className='flex space-x-2'>
//         <input
//           type="number"
//           value={size}
//           min="1"
//           max="100"
//           onChange={handleChangeSize}
//           className="block w-[60%] border border-gray-300 rounded-md p-2"
//         />
//         <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={bubbleSort} style={{ padding: '10px', fontSize: '16px', marginLeft: '10px' }}>
//           Bubble Sort
//         </button>
//       </div>

//       {/* Display the current message */}
//       {/* <div style={{ marginTop: '20px', fontSize: '16px', color: 'black', fontWeight: 'bold' }}>
//         {message}
//       </div> */}

//       <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
//         {data.map((value, index) => (
//           <div
//             key={index}
//             className="box w-[50px] h-[50px] flex items-center justify-center text-white font-semibold rounded-md"
//             style={{
//               backgroundColor: 'steelblue',
//               margin: '0 2px',
//               transition: 'height 1s ease',
//             }}
//           >
//             {value}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SortingVisualizer;


import useMounted from '@/hooks/useMounted';
import { useEffect, useState } from 'react';

const SortingVisualizer = () => {
  const mounted = useMounted();

  const [data, setData] = useState(generateRandomArray(20)); // Default array size
  const [size, setSize] = useState(20); // Initial size of the array
  const [message, setMessage] = useState(""); // State to hold the comparison message

  // Generate random array of numbers
  function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 500));
  }

  // Update the array when the user changes the input size
  const handleChangeSize = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setSize(newSize);
    setData(generateRandomArray(newSize));
  };

  // Update the boxes based on the array
  const updateBoxes = async (arr) => {
    const boxes = document.querySelectorAll('.box');
    arr.forEach((value, index) => {
      const box = boxes[index];
      box.style.height = `50px`; // Set box height based on the array value
      box.innerText = value; // Set box text to display the value
    });
  };

  // Function to pause for a certain time (for animation)
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Bubble Sort with animations and delay
  const bubbleSort = async () => {
    const arr = [...data]; // Copy of data
    const boxes = document.querySelectorAll('.box');

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        // Highlight the boxes being compared
        const currentBox = boxes[j];
        const nextBox = boxes[j + 1];
        currentBox.style.backgroundColor = 'red';
        nextBox.style.backgroundColor = 'red';

        // First delay: show the message for 1 second before doing anything
        await sleep(2000); // 1 second delay to show the message

        // Perform the swap after the message
        if (arr[j] > arr[j + 1]) {
          // Swap the elements and animate
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          await updateBoxes(arr);
        }

        // Reset background color
        currentBox.style.backgroundColor = 'steelblue';
        nextBox.style.backgroundColor = 'steelblue';
      }
    }

    // Mark the array as sorted
    boxes.forEach(box => box.style.backgroundColor = 'green');
    setData(arr);
    setMessage('Sorting is complete!'); // Final message
  };

  // Selection Sort with animations and delay
  const selectionSort = async () => {
    const arr = [...data]; // Copy of data
    const boxes = document.querySelectorAll('.box');

    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        // Highlight the boxes being compared
        const currentBox = boxes[j];
        currentBox.style.backgroundColor = 'red';

        await sleep(500); // Wait to visualize the comparison

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }

        // Reset background color
        currentBox.style.backgroundColor = 'steelblue';
      }

      // Swap the elements
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        await updateBoxes(arr);
      }
    }

    // Mark the array as sorted
    boxes.forEach(box => box.style.backgroundColor = 'green');
    setData(arr);
    setMessage('Sorting is complete!'); // Final message
  };

  // Counting Sort with animations and delay
  const countingSort = async () => {
    const arr = [...data]; // Copy of data
    const boxes = document.querySelectorAll('.box');
    const maxValue = Math.max(...arr);

    const count = new Array(maxValue + 1).fill(0);

    // Count occurrences of each value in the array
    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
    }

    let index = 0;
    for (let i = 0; i <= maxValue; i++) {
      while (count[i] > 0) {
        arr[index] = i;
        count[i]--;
        await updateBoxes(arr);
        index++;
        await sleep(500); // Delay to visualize sorting
      }
    }

    // Mark the array as sorted
    boxes.forEach(box => box.style.backgroundColor = 'green');
    setData(arr);
    setMessage('Sorting is complete!'); // Final message
  };

  useEffect(() => {
    updateBoxes(data);
  }, [data]);

  if (!mounted) return null;

  return (
    <div className='p-4'>
      <h1>Sorting Algorithms Visualizer</h1>

      <div className='md:flex md:space-x-2'>
        <input
          type="number"
          value={size}
          min="1"
          max="100"
          onChange={handleChangeSize}
          className="block w-full md:w-[60%] mb-2 md:mb-0 border border-gray-300 rounded-md p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={bubbleSort} style={{ padding: '10px', fontSize: '16px', marginLeft: '10px' }}>
          Bubble Sort
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={selectionSort} style={{ padding: '10px', fontSize: '16px', marginLeft: '10px' }}>
          Selection Sort
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={countingSort} style={{ padding: '10px', fontSize: '16px', marginLeft: '10px' }}>
          Counting Sort
        </button>
      </div>

      {/* Display the current message */}
      {/* <div style={{ marginTop: '20px', fontSize: '16px', color: 'black', fontWeight: 'bold' }}>
        {message}
      </div> */}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
        {data.map((value, index) => (
          <div
            key={index}
            className="box w-[50px] h-[50px] flex items-center justify-center text-white font-semibold rounded-md"
            style={{
              backgroundColor: 'steelblue',
              margin: '0 2px',
              transition: 'height 2s ease',
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;
