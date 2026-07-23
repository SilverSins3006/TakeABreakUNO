import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// When the timer reaches zero
// if it not, it will display "Not Break Time"
// else display the current challenge's title and description

function Status({
  userId: propUserId,
  isBreakTime,
  difficulty,
  categories = [],
}) {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [completedXpReward, setCompletedXpReward] = useState(0);
  const { user } = useAuth0();
  const userId = propUserId ?? user?.sub;
  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    if (!isBreakTime) return;

    const params = new URLSearchParams();
    if (difficulty) {
      params.set("difficulty", difficulty);
    }

    if (categories.length > 0) {
      const randomIndex = Math.floor(Math.random() * categories.length);
      params.set("category", categories[randomIndex]);
    }

    const query = params.toString();
    const challengeUrl = `/api/challenges/random${query ? `?${query}` : ""}`;

    // Fetch the current challenge from the server.
    // Use a relative path so the dev proxy or same-origin deployment works.
    const ac = new AbortController();
    (async () => {
      try {
        const response = await fetch(challengeUrl, {
          signal: ac.signal,
        });
        if (!response.ok) {
          console.error("Failed to fetch challenge, status:", response.status);
          setCurrentChallenge(null);
          return;
        }
        const data = await response.json();
        setChallengeCompleted(false);
        setCompletedXpReward(0);
        setCurrentChallenge(data);
        console.log("Fetched challenge:", data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching current challenge:", error);
        }
      }
    })();
    return () => ac.abort();
  }, [isBreakTime, difficulty, categories]);

  const handleCompleteChallenge = async () => {
    try {
      const userResponse = await fetch(
        `${apiBaseUrl}/api/users/preferences?auth0Id=${encodeURIComponent(userId || "")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userData = await userResponse.json();
      console.log("User data before completing challenge:", userData);
      console.log("Current challenge data:", currentChallenge);

      await fetch(`${apiBaseUrl}/api/users/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          auth0Id: userId,
          xp: (userData.user?.xp || 0) + (currentChallenge?.xp_reward || 0),
          challengesCompleted: (userData.user?.challenges_completed || 0) + 1,
          sessionLengthMinutes: userData.user?.session_length_minutes,
          challengeDifficulty: userData.user?.challenge_difficulty,
          preferredChallengeTypes: userData.user?.preferred_challenge_types,
        }),
      });

      setCompletedXpReward(currentChallenge?.xp_reward || 0);
      setChallengeCompleted(true);
      setCurrentChallenge(null);
    } catch (error) {
      console.error("Error completing challenge:", error);
    }
  };

  return isBreakTime ? (
    <div className="status-container">
      {challengeCompleted ? (
        <h2>+{completedXpReward}XP Rewarded</h2>
      ) : currentChallenge ? (
        <>
          <h2>{currentChallenge.title}</h2>
          <p>{currentChallenge.description}</p>
          <br />
          <button className="btn-accent" onClick={handleCompleteChallenge}>
            complete challenge +{currentChallenge.xp_reward}XP
          </button>
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
