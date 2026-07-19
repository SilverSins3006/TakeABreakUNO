import { useState } from "react";

function AddChallenge() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [type, setType] = useState("Exercise");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newChallenge = {
      difficulty,
      type,
      description,
    };

    console.log(newChallenge);

    alert("Challenge Added!");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Add New Challenge</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Challenge Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Challenge Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Exercise</option>
              <option>Stretch</option>
              <option>Brain Teaser</option>
              <option>Get Outside</option>
              <option>Scavenger Hunt</option>
              <option>Chores</option>
            </select>
          </div>

          <div className="form-group">
            <label>Challenge Description</label>
            <textarea
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter the challenge description..."
            />
          </div>

          <div className="button-row">
            <button className="btn-accent" type="submit">
              Save Challenge
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddChallenge;