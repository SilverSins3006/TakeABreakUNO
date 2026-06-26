import { useState, useEffect } from "react";

// The running state and its setter are passed in as props from Active.jsx
function Timer({ isRunning, setIsRunning }) {
  // Set to 1800 seconds (30 minutes) to align with the Active page layout
  const [seconds, setSeconds] = useState(1800);

  useEffect(() => {
    let interval;

    // While the timer is active and time remains, decrement by one each second.
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((previousSeconds) => previousSeconds - 1);
      }, 1000);
    }
    
    // Runs when the work timer reaches zero
    if (seconds === 0) {
      setIsRunning(false);
      console.log("Take A Break, Timer Value 0");
    }
    
    // Cleanup function to prevent memory leaks when navigating between pages
    return () => clearInterval(interval);
  }, [isRunning, seconds, setIsRunning]);

  // Helper to format numbers like 1800 into digital clock format (30:00)
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    // Adds a leading zero if seconds are single digits (e.g., 09 instead of 9)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Returns only the text string for direct use in the span in Active.jsx
  return (
    <>
      {formatTime(seconds)}
    </>
  );
}

export default Timer;