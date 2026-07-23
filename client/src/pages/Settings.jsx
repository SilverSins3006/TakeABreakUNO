import { useState } from "react";

/**
 * @file Settings component. Renders the preferences form for session length,
 * challenge difficulty, and challenge categories. Can render as a standalone
 * page or as a modal, depending on the isModal prop. Saves changes to local
 * state and syncs them to the backend.
 */

/**
 * Renders the preferences form and handles saving changes both to local
 * app state (via the setters passed in) and to the backend.
 * @param {Object} props
 * @param {boolean} [props.isModal] - Whether to render as a modal (with backdrop and close button) or a standalone page.
 * @param {Function} [props.onClose] - Called when the modal's close button is clicked.
 * @param {Function} [props.onSave] - Called after preferences are saved.
 * @param {number} [props.seconds] - Fallback session length in seconds, used if sessionLength isn't set.
 * @param {number} [props.sessionLength] - Current session length in seconds.
 * @param {Function} props.setSeconds - Updates the seconds state after saving.
 * @param {Function} props.setSessionLength - Updates the session length state after saving.
 * @param {Function} [props.setIsRunning] - Stops the timer when preferences are saved.
 * @param {string} [props.challengeDifficulty] - Current difficulty setting, defaults to "medium".
 * @param {Function} props.setChallengeDifficulty - Updates the difficulty state after saving.
 * @param {string[]} [props.challengeCategories] - Currently selected challenge categories.
 * @param {Function} props.setChallengeCategories - Updates the categories state after saving.
 * @param {string} props.userId - Auth0 user ID, used to sync preferences to the backend.
 * @returns {JSX.Element} The rendered preferences form, wrapped in a modal or plain container.
 */
export default function Settings({
  isModal = false,
  onClose,
  onSave,
  seconds,
  sessionLength,
  setSeconds,
  setSessionLength,
  setIsRunning,
  challengeDifficulty = "medium",
  setChallengeDifficulty,
  challengeCategories = [],
  setChallengeCategories,
  userId,
}) {
  const configuredSeconds = sessionLength ?? seconds;
  const [sessionTime, setSessionTime] = useState(() =>
    Math.max(1, configuredSeconds / 60),
  );

  const [difficulty, setDifficulty] = useState(challengeDifficulty);
  const [categories, setCategories] = useState(challengeCategories);

  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  /**
   * Formats a minute count into a readable string, e.g. "90" becomes "1 hr 30 min".
   * @param {number} minutes - Session length in minutes.
   * @returns {string} The formatted duration string.
   */
  const formatSessionTime = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes === 0
        ? `${hours} hr${hours > 1 ? "s" : ""}`
        : `${hours} hr${hours > 1 ? "s" : ""} ${remainingMinutes} min`;
    }

    return `${minutes} min`;
  };

  /**
   * Pushes the current preferences to the backend so they persist across
   * sessions. Fails silently (just logs) if the request errors out, since
   * local state is already updated regardless.
   * @returns {Promise<void>}
   */
  const syncPreferencesToDB = async () => {
    try {
      await fetch(`${apiBaseUrl}/api/users/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          auth0Id: userId,
          sessionLengthMinutes: sessionTime * 60,
          challengeDifficulty: difficulty,
          preferredChallengeTypes: categories,
        }),
      });
    } catch (error) {
      console.error("Failed to sync preferences to DB:", error);
    }
  };

  /**
   * Handles the form submission. Pushes local preference changes up to the
   * parent's state, stops the timer, and syncs everything to the backend.
   * @param {Event} e - The form submission event.
   */
  const handleSave = (e) => {
    e.preventDefault();
    const nextSeconds = sessionTime * 60;
    setSeconds(nextSeconds);
    setSessionLength(nextSeconds);
    setIsRunning?.(false);
    setChallengeDifficulty?.(difficulty);
    setChallengeCategories?.(categories);
    syncPreferencesToDB();
    if (onSave) onSave();
  };

  const content = (
    <form className="card" onSubmit={(e) => handleSave(e)}>
      <h2 style={{ color: "var(--accent)" }}>Preferences</h2>

      <div>
        <label htmlFor="time">
          Session Length:{" "}
          <span style={{ color: "var(--accent)" }}>
            {formatSessionTime(sessionTime)}
          </span>
        </label>
        <input
          id="time"
          name="time"
          type="range"
          className="slider"
          min="1"
          max="180"
          value={sessionTime}
          onChange={(e) => setSessionTime(Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="difficulty">Challenge Difficulty Level</label>
        <select
          className="select"
          id="difficulty"
          name="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Handling multiple selection for challenge categories */}
      <div>
        <label htmlFor="categories">Challenge Categories</label>

        <select
          className="select"
          id="categories"
          name="categories"
          multiple
          value={categories}
          onChange={(e) => {
            const selectedCategories = Array.from(
              e.target.selectedOptions,
              (option) => option.value,
            );

            setCategories(selectedCategories);
          }}
        >
          <option value="hunt">Scavenger Hunt</option>
          <option value="brain">Brain Teaser</option>
          <option value="outside">Get Outside</option>
          <option value="exercise">Exercise</option>
          <option value="stretch">Stretch</option>
          <option value="chores">Chores</option>
        </select>
      </div>

      <div className="button-row">
        <button type="submit" className="btn-accent">
          Save Changes
        </button>
        {isModal && (
          <button type="button" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </form>
  );

  // If it's a modal, wrap it in the backdrop, otherwise return just the card
  return isModal ? (
    <div className="modal-backdrop">{content}</div>
  ) : (
    <div className="container">{content}</div>
  );
}