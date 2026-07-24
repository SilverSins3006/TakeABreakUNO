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
  setSeconds,
  setSessionLength,
}) {
  const [sessionTime, setSessionTime] = useState(seconds / 60);
  const [categories, setCategories] = useState([]);

  const categoryOptions = [
    "Scavenger Hunt",
    "Brain Teaser",
    "Get Outside",
    "Exercise",
    "Stretch",
    "Chores",
  ];

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

  const handleCategoryChange = (category) => {
    setCategories((currentCategories) => {
      if (currentCategories.includes(category)) {
        return currentCategories.filter(
          (currentCategory) => currentCategory !== category,
        );
      }

      return [...currentCategories, category];
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    const nextSeconds = sessionTime * 60;

    setSeconds(nextSeconds);
    setSessionLength(nextSeconds);

    console.log("Selected categories:", categories);

    if (onSave) {
      onSave();
    }
  };

  const content = (
    <form className="card" onSubmit={handleSave}>
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
        <p>Challenge Categories</p>

        <div className="category-checkboxes">
          {categoryOptions.map((category) => (
            <label key={category} className="category-checkbox">
              <input
                type="checkbox"
                checked={categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />

              <span>{category}</span>
            </label>
          ))}
        </div>
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

  return isModal ? (
    <div className="modal-backdrop">{content}</div>
  ) : (
    <div className="container">{content}</div>
  );
}