"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import moment from "moment-timezone";

const TimezoneList = ({ onSelectedTimezonesChange, selectedTimezones }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTimezones, setFilteredTimezones] = useState([]);
  const [isListVisible] = useState(true);
  // const [width, setWidth] = useState()

  const containerRef = useRef(null);

  // useEffect(() => {
  //   const updateWidth = () => {
  //     if (containerRef.current) {
  //       setWidth(containerRef.current.clientWidth);
  //     }
  //   };
  //   updateWidth();
  //   window.addEventListener("resize", updateWidth);
  //   return () => {
  //     window.removeEventListener("resize", updateWidth);
  //   };
  // }, []);

  useEffect(() => {
    const timezones = moment.tz.names();
    setFilteredTimezones(timezones);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const timezones = moment.tz.names();
    const filtered = timezones.filter((timezone) =>
      timezone.toLowerCase().includes(query)
    );
    setFilteredTimezones(filtered);
  };

  const toggleTimezoneSelection = (timezone) => {
    if (selectedTimezones.includes(timezone)) {
      onSelectedTimezonesChange(
        selectedTimezones.filter((item) => item !== timezone)
      );
    } else {
      onSelectedTimezonesChange([...selectedTimezones, timezone]);
    }
  };

  // const toggleListVisibility = () => {
  //   setIsListVisible((prev) => !prev);
  // };

  // const handleClickOutside = (event) => {
  //   if (containerRef.current && !containerRef.current.contains(event.target)) {
  //     setIsListVisible(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full shadow-md rounded-[8px] ${
        isListVisible ? "h-[250px] md:h-[500px]" : "border-2 border-gray-400"
      } overflow-y-auto`}
    >
      {/* Search Input */}

      <input
        type="text"
        placeholder="Search timezones..."
        value={searchQuery}
        onChange={handleSearch}
        // onClick={toggleListVisibility}
        className="sticky top-0 w-full p-2 border-0 outline-none border-b-2 rounded-md z-10"
      />

      {/* Timezone List */}
      {isListVisible && (
        <motion.div
          className="timezone-list px-2 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ul className="rounded-md">
            {filteredTimezones.map((timezone, index) => (
              <motion.li
                key={timezone}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="py-[5px] px-2 mt-[4px] rounded-md"
                onClick={() => toggleTimezoneSelection(timezone)}
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedTimezones.includes(timezone)
                    ? "#007BFF"
                    : "rgb(229 231 235)",
                  color: selectedTimezones.includes(timezone)
                    ? "white"
                    : "black",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {timezone}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default TimezoneList;
