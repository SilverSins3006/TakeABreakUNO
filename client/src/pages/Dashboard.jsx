import Timer from "../components/Timer";
import { useAuth0 } from "@auth0/auth0-react";
import Status from "../components/Status";

function Dashboard({
  seconds,
  isRunning,

  setIsRunning,
  setSeconds,
  sessionLength,
  challengeDifficulty,
  challengeCategories,
  onOpenSettings,
}) {

  const { logout } = useAuth0();
  const handleLogout = () => {
    logout({
      logoutParams: { returnTo: window.location.origin },
    });
  };

  const handleReset = () => {
    setSeconds(sessionLength);
    setIsRunning(false);
  };

  const handleToggleTimer = () => {
    if (seconds === 0) {
      setSeconds(sessionLength);
      setIsRunning(true);
      return;
    }

    setIsRunning(!isRunning);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="timer-header">
          <span className="timer-label">Timer</span>
          <span className="timer-display">
            {/* CORRECTED: Passing the seconds state down to the presentation component */}
            <Timer seconds={seconds} />
          </span>
        </div>

        <div className="status">
          <Status
            key={seconds === 0 ? "break" : "work"}
            isBreakTime={seconds === 0}
            difficulty={challengeDifficulty}
            categories={challengeCategories}
          />
        </div>

        <div className="button-row">
          <button className="btn-accent" onClick={handleToggleTimer}>
            {seconds === 0 ? "Restart" : isRunning ? "Pause" : "Start"}
          </button>
          <button onClick={handleReset}>Reset</button>
          <button onClick={onOpenSettings}>Settings</button>
        </div>
        <div className="button-row">
          <button onClick={handleLogout}>Log_Out</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
