import React, { useState, useEffect } from "react";

function DateTimeDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update the date and time every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(timerID);
  }, []);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  const formattedDateTime = currentDateTime.toLocaleString(undefined, options);

  return <div>{formattedDateTime}</div>;
}

export default DateTimeDisplay;
