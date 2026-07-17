import { useState } from "react";

/**
 * @file Settings component.
 * @brief Renders session and challenge preference controls.
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
}) {
  const configuredSeconds = sessionLength ?? seconds;
  const [sessionTime, setSessionTime] = useState(() =>
    Math.max(1, configuredSeconds / 60),
  );

  const [difficulty, setDifficulty] = useState(challengeDifficulty);
  const [categories, setCategories] = useState(challengeCategories);

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
   * @brief Save the current preferences.
   * @param {Event} e Form submission event.
   */
  const handleSave = (e) => {
    e.preventDefault();
    const nextSeconds = sessionTime * 60;
    setSeconds(nextSeconds);
    setSessionLength(nextSeconds);
    setIsRunning?.(false);
    setChallengeDifficulty?.(difficulty);
    setChallengeCategories?.(categories);
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
        (option) => option.value
      );

      setCategories(selectedCategories);
    }}
  >
    <option value="hunt">Scavenger Hunt</option>
    <option value="brain">Brain Teaser</option>
    <option value="outside">Get Outside</option>
    <option value="exercise">Exercise</option>
    <option value="stretch">Stretch</option>
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
