"use client";
import useMounted from "@/hooks/useMounted";
import Stopwatch from "./_components/Stopwatch";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const StopwatchApp = () => {
  const mounted = useMounted();
  const [stopwatches, setStopwatches] = useState([]);
  const [name] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const savedStopwatches =
      JSON.parse(localStorage.getItem("stopwatches")) || [];
    setStopwatches(savedStopwatches);
  }, []);

  useEffect(() => {
    if (stopwatches.length > 0) {
      localStorage.setItem("stopwatches", JSON.stringify(stopwatches));
    }
  }, [stopwatches]);

  const addStopwatch = () => {
    const newStopwatch = {
      id: Date.now(),
      name: name || `Stopwatch ${stopwatches.length + 1}`,
      startTime: 0,
      elapsedTime: 0,
      isRunning: false,
      lastUpdateTime: Date.now(),
    };
    setStopwatches([...stopwatches, newStopwatch]);
  };

  const handleRename = (id, newName) => {
    setStopwatches(
      stopwatches.map((sw) => (sw.id === id ? { ...sw, name: newName } : sw))
    );
  };

  const deleteStopwatch = (id) => {
    setStopwatches(stopwatches.filter((sw) => sw.id !== id));
  };

  if (!mounted) return <p>Loading...</p>;
  return (
    <div className="w-[100%] p-2">
      <Card className="w-[full] p-2">
        {/* <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name for stopwatch"
      /> */}
        <motion.button
          className="flex justify-center items-center rounded-md shadow-md bg-gray-800 hover:bg-black cursor-pointer text-white px-3 py-1"
          onClick={addStopwatch}
          transition={{ duration: 0.3 }} 
          onHoverStart={() => setIsHovered(true)} 
          onHoverEnd={() => setIsHovered(false)} 
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, width: isHovered ? "20px" : "0px", }}
            transition={{ duration: 0.3 }}
          >
            <Plus />
          </motion.div>
          <span className="ml-2">Add Stopwatch</span>
        </motion.button>

        <div className="mt-3">
          {stopwatches.map((stopwatch) => (
            <Stopwatch
              key={stopwatch.id}
              stopwatch={stopwatch}
              onRename={handleRename}
              onDelete={deleteStopwatch}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StopwatchApp;
