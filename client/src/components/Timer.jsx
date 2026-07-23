/**
 * @file Timer component. Formats and renders remaining session time as MM:SS
 * (or H:MM:SS once you're past an hour).
 */

/**
 * Presentational component that formats a raw seconds integer into a digital
 * clock layout. Receives seconds as a prop from App.jsx so the time doesn't
 * reset when the page changes.
 * @param {Object} props
 * @param {number} props.seconds - Seconds remaining in the current session.
 * @returns {JSX.Element} The formatted time as plain text.
 */
function Timer({ seconds }) {
  /**
   * Formats a raw seconds count into MM:SS, or H:MM:SS if it's over an hour.
   * @param {number} totalSeconds - Seconds remaining.
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