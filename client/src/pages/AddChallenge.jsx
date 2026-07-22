import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function AddChallenge({ userId: propUserId }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const userId = propUserId ?? user?.sub;

  const [difficulty, setDifficulty] = useState("Easy");
  const [type, setType] = useState("Exercise");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/account", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const newChallenge = {
      userId,
      auth0Id: userId,
      user: userId,
      title,
      difficulty,
      type,
      description,
    };

    console.log(newChallenge);
    addChallengeToDatabase(newChallenge);
  };

  const clearForm = () => {
    setDifficulty("Easy");
    setType("Exercise");
    setTitle("");
    setDescription("");
  };

  const addChallengeToDatabase = async (challenge) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/challenges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challenge),
      });

      const data = await response.json();

      if (!response.ok) {
        const messages = Object.values(data.fields || {}).join(" ");
        setErrorMessage("Failed to add challenge: " + (messages || data.error));
        throw new Error("Failed to add challenge");
      }

      console.log("Challenge added:", data);
      alert("Challenge added successfully!");
      clearForm();
    } catch (error) {
      console.error("Error adding challenge:", error);
      alert(errorMessage || "Failed to add challenge");
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Add New Challenge</h2>
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
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Exercise</option>
            <option>Stretch</option>
            <option>Brain Teaser</option>
            <option>Get Outside</option>
            <option>Scavenger Hunt</option>
            <option>Chores</option>
          </select>
        </div>

        <div className="form-group">
          <label>Challenge Title</label>
          <input
            className="input-field"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the challenge title..."
          />
        </div>

        <div className="form-group">
          <label>Challenge Description</label>
          <textarea
            className="input-field"
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

          <button type="button" onClick={() => window.history.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddChallenge;
