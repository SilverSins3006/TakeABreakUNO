import React from "react";

/**
 * @file Timer component.
 * @brief Formats and renders remaining session time as MM:SS.
 */
/**
 * Presentational component that formats a raw seconds integer into a digital clock layout (MM:SS).
 * Receives global seconds state from App.jsx so time doesn't reset on page changes.
 */
function Timer({ seconds }) {
  /**
   * @brief Format seconds into MM:SS.
   * @param {number} totalSeconds Seconds remaining.
   * @returns {string} The formatted time string.
   */
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    // only display hours if there are any, otherwise just show minutes and seconds
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    // Adds a leading zero if seconds are single digits (e.g., 09 instead of 9)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return <>{formatTime(seconds)}</>;
}

export default Timer;
