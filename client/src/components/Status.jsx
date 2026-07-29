/**
 * @file Status component. Displays either a "Not Break Time" placeholder
 * or, once the session timer reaches zero, the user's current challenge
 * (fetched from the server) along with a button to mark it complete.
 */

import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import completionSound from "../assets/challenge-complete.mp3";
import breakTimeSound from "../assets/chimes.mp3";

/**
 * Shows the current break status. While it is not break time, renders a
 * simple placeholder. Once break time starts, fetches a random challenge
 * matching the given difficulty/categories, plays a chime, and lets the
 * user mark the challenge complete for XP.
 * @param {Object} props
 * @param {string} [props.userId] - Explicit user id override. Falls back
 * to the authenticated Auth0 user's `sub` claim when not provided.
 * @param {boolean} props.isBreakTime - Whether the session timer has
 * reached zero and a break is currently active.
 * @param {string} [props.difficulty] - Preferred challenge difficulty,
 * passed as a query param when fetching a random challenge.
 * @param {string[]} [props.categories=[]] - Preferred challenge
 * categories. One is picked at random and passed as a query param.
 * @returns {JSX.Element} The rendered status panel.
 */
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
  /**
   * Plays the "challenge complete" chime at a fixed volume. Playback
   * failures (e.g. blocked autoplay) are logged rather than thrown.
   * @returns {void}
   */
  const playCompletionSound = () => {
    const audio = new Audio(completionSound);
    audio.volume = 0.6;
    audio.play().catch((error) => {
      console.warn("ERRROR SOUND", error);
    });
  };
  /**
   * Plays the "break time started" chime at a fixed volume. Playback
   * failures (e.g. blocked autoplay) are logged rather than thrown.
   * @returns {void}
   */
  const playBreakTimeSound = () => {
    const audio = new Audio(breakTimeSound);
    audio.volume = 0.6;
    audio.play().catch((error) => {
      console.warn("ERRROR SOUND", error);
    });
  };

  /**
   * When break time starts, plays the chime and fetches a random
   * challenge matching the current difficulty/categories from the
   * server. Aborts the in-flight request on cleanup (e.g. if break time
   * ends or props change before the fetch resolves).
   */
  useEffect(() => {
    if (!isBreakTime) return;

    playBreakTimeSound();

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

  /**
   * Marks the current challenge as complete: fetches the user's latest
   * preferences, submits updated XP and completed-challenge counts to
   * the server, updates local state to show the XP reward, and plays
   * the completion sound. Errors are logged and otherwise swallowed.
   * @returns {Promise<void>}
   */
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
      playCompletionSound();
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