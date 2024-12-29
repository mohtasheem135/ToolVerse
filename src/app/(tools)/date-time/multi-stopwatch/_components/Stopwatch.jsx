"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, TimerReset, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const formatTime = (milliseconds) => {
  const totalMilliseconds = Math.floor(milliseconds);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60; // Calculate seconds
  const centiseconds = Math.floor((totalMilliseconds % 1000) / 10);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    centiseconds: String(centiseconds).padStart(2, "0"),
  };
};

const Stopwatch = ({ stopwatch, onRename, onDelete }) => {
  const [isRunning, setIsRunning] = useState(stopwatch.isRunning);
  const [elapsedTime, setElapsedTime] = useState(stopwatch.elapsedTime);
  const [startTime, setStartTime] = useState(stopwatch.startTime);
  const [name, setName] = useState(stopwatch.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
    if (isRunning) {
      const currentTime = Date.now() - startTime;
      setElapsedTime(currentTime);
    } else {
      setStartTime(Date.now() - elapsedTime);
    }
  };

  const resetStopwatch = () => {
    setElapsedTime(0);
    setStartTime(0);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  useEffect(() => {
    const updatedStopwatches =
      JSON.parse(localStorage.getItem("stopwatches")) || [];
    const updated = updatedStopwatches.map((sw) =>
      sw.id === stopwatch.id
        ? { ...sw, elapsedTime, isRunning, lastUpdateTime: Date.now() }
        : sw
    );
    localStorage.setItem("stopwatches", JSON.stringify(updated));
  }, [elapsedTime, isRunning, stopwatch.id]);

  useEffect(() => {
    const storedStopwatches =
      JSON.parse(localStorage.getItem("stopwatches")) || [];
    const storedStopwatch = storedStopwatches.find(
      (sw) => sw.id === stopwatch.id
    );

    if (storedStopwatch && storedStopwatch.isRunning) {
      const timeSinceLastUpdate = Date.now() - storedStopwatch.lastUpdateTime;
      setElapsedTime(storedStopwatch.elapsedTime + timeSinceLastUpdate);
      setStartTime(Date.now() - elapsedTime);
    } else {
      setElapsedTime(storedStopwatch ? storedStopwatch.elapsedTime : 0);
    }
  }, [stopwatch.id]);

  const handleRename = () => {
    onRename(stopwatch.id, name);
    setIsEditing(false);
  };

  const time = formatTime(elapsedTime);

  return (
    <Card className="p-2 mb-5 border-[1px] border-gray-400 shadow-md">
      {isEditing ? (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          exit={{ width: 0 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rename stopwatch"
            className="outline-none border-2 border-gray-700 w-[200px] rounded-md shadow-md"
            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
          />
          <div className="flex space-x-3 justify-center items-center">
            <button
              className="rounded-md shadow-md bg-gray-700 hover:bg-gray-800 cursor-pointer text-white px-3 py-1"
              onClick={handleRename}
            >
              Rename
            </button>
            <button
              className="flex justify-center items-center rounded-md shadow-md bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-1"
              onClick={() => setIsEditing(false)}
            >
              <Trash2 size={17} className="mr-2" />
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <div>
          <h3>{name}</h3>
          <button
            onClick={() => setIsEditing(true)}
            style={{ marginBottom: "10px" }}
            className="rounded-md shadow-md bg-gray-700 hover:bg-gray-800 cursor-pointer text-white px-3 py-1"
          >
            Edit
          </button>
        </div>
      )}
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
        {time.days === "00" ? "" : `${time.days}:`}
        {time.hours}:{time.minutes}:{time.seconds}.{time.centiseconds}
      </div>
      <div className="flex justify-start items-center space-x-3">

      <button className={`rounded-md shadow-md ${isRunning ? "bg-green-500": "bg-red-500"} cursor-pointer text-white px-3 py-1`} onClick={toggleRunning} style={{ marginRight: "10px" }}>
        {isRunning ? <Pause /> : <Play />}
      </button>
      <button className="rounded-md shadow-md bg-gray-700 hover:bg-gray-800 cursor-pointer text-white px-3 py-1" onClick={resetStopwatch} style={{ marginRight: "10px" }}>
      <TimerReset />
      </button>
      <motion.button
        className="flex justify-center items-center rounded-md shadow-md bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-1"
        onClick={() => onDelete(stopwatch.id)}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            width: isHovered ? "20px" : "0px",
          }}
          transition={{ duration: 0.3 }}
        >
          <Trash2 size={17} className="m" />
        </motion.div>
        <span className="">Delete</span>
      </motion.button>
      </div>
    </Card>
  );
};

export default Stopwatch;
