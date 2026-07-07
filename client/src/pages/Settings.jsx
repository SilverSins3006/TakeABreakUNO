import { useState } from "react";

export default function Settings({
  isModal = false,
  onClose,
  onSave,
  seconds,
  setSeconds,
  setSessionLength,
}) {
  const [sessionTime, setSessionTime] = useState(seconds / 60);

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

  const handleSave = (e) => {
    e.preventDefault();
    const nextSeconds = sessionTime * 60;
    setSeconds(nextSeconds);
    setSessionLength(nextSeconds);
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
          defaultValue="medium"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <label htmlFor="categories">Challenge Categories</label>
        <select className="select" id="categories" name="categories" multiple>
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
        {isModal && <button onClick={onClose}>Close</button>}
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
