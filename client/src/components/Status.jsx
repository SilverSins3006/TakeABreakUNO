import { useState, useEffect } from "react";

// When the timer reaches zero
// if it not, it will display "Not Break Time"
// else display the current challenge's title and description

function Status({ isBreakTime }) {
  const [currentChallenge, setCurrentChallenge] = useState(null);

  useEffect(() => {
    if (isBreakTime) {
      // Fetch the current challenge from the server.
      // Use a relative path so the dev proxy or same-origin deployment works.
      const ac = new AbortController();
      (async () => {
        try {
          const response = await fetch('/api/challenges/random', { signal: ac.signal });
          if (!response.ok) {
            console.error(
              "Failed to fetch challenge, status:",
              response.status,
            );
            setCurrentChallenge(null);
            return;
          }
          const data = await response.json();
          setCurrentChallenge(data);
          console.log("Fetched challenge:", data);
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Error fetching current challenge:", error);
          }
        }
      })();
      return () => ac.abort();
    } else {
      setCurrentChallenge(null);
    }
  }, [isBreakTime]);
  return isBreakTime ? (
    <div className="status-container">
      {currentChallenge ? (
        <>
          <h2>{currentChallenge.title}</h2>
          <p>{currentChallenge.description}</p>
        </>
      ) : (
        <h2>Loading challenge...</h2>
      )}
    </div>
  ) : (
    <div className="status-container">
      <h2>Not Break Time</h2>
    </div>
  );
}

export default Status;
