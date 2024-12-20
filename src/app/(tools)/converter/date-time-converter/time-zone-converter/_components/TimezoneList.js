"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import moment from "moment-timezone";

const TimezoneList = ({ onSelectedTimezonesChange, selectedTimezones }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTimezones, setFilteredTimezones] = useState([]);
  const [width, setWidth] = useState(0); // State to store the container's width

  const containerRef = useRef(null); // Create a reference to the container

  useEffect(() => {
    // Function to update the width
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth); // Get the container width
      }
    };

    // Update width initially when component mounts
    updateWidth();

    // Optionally, you can add an event listener to resize the width on window resize
    window.addEventListener("resize", updateWidth);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  // Get the list of all timezones using moment-timezone
  useEffect(() => {
    const timezones = moment.tz.names();
    setFilteredTimezones(timezones);
  }, []);

  // Filter timezones based on search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const timezones = moment.tz.names();
    const filtered = timezones.filter((timezone) =>
      timezone.toLowerCase().includes(query)
    );
    setFilteredTimezones(filtered);
  };

 // Handle selection or removal of a timezone
 const toggleTimezoneSelection = (timezone) => {
    if (selectedTimezones.includes(timezone)) {
      // Remove from selected
      onSelectedTimezonesChange(selectedTimezones.filter(item => item !== timezone));
    } else {
      // Add to selected
      onSelectedTimezonesChange([...selectedTimezones, timezone]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full shadow-md rounded-[8px] h-[250px] md:h-[500px] overflow-y-auto bg-gray-300"
    >
      {/* Search Input */}
      <div
        style={{ width: `${width}px` }}
        className="rounded-md fixed bg-white z-10"
      >
        <input
          type="text"
          placeholder="Search timezones..."
          value={searchQuery}
          onChange={handleSearch}
          className="rounded-md w-full p-2 border-2 outline-none border-gray-600"
        />
      </div>

      {/* Timezone List */}
      <motion.div
        className="timezone-list px-2 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ul className="mt-[45px] rounded-md">
          {filteredTimezones.map((timezone, index) => (
            <motion.li
              key={timezone}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
                className="py-[5px] px-2 mt-[4px] rounded-md"
              onClick={() => toggleTimezoneSelection(timezone)} // Toggle selection on click
              style={{
                cursor: "pointer",
                backgroundColor: selectedTimezones.includes(timezone)
                  ? "#007BFF"
                  : "rgb(229 231 235)",
                color: selectedTimezones.includes(timezone) ? "white" : "black",
                // padding: "8px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              {timezone}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default TimezoneList;
