/**
 * @file Dashboard page. Main authenticated view: shows the countdown
 * timer, the current break/challenge status, and controls for
 * starting/pausing/resetting the timer, opening settings, and logging out.
 */

import Timer from "../components/Timer";
import { useAuth0 } from "@auth0/auth0-react";
import Status from "../components/Status";

/**
 * Main dashboard combining the session timer with challenge status and
 * session controls. Timer/session state is lifted to the parent and
 * passed in as props so it survives navigation between pages.
 * @param {Object} props
 * @param {number} props.seconds - Seconds remaining in the current session.
 * @param {boolean} props.isRunning - Whether the timer is currently running.
 * @param {Function} props.setIsRunning - Updates the running state.
 * @param {Function} props.setSeconds - Updates the remaining seconds.
 * @param {number} props.sessionLength - Configured session length in
 * seconds, used when resetting or restarting the timer.
 * @param {string} [props.challengeDifficulty] - Preferred challenge
 * difficulty, passed through to Status.
 * @param {string[]} [props.challengeCategories] - Preferred challenge
 * categories, passed through to Status.
 * @param {Function} props.onOpenSettings - Called when the Settings
 * button is clicked.
 * @returns {JSX.Element} The rendered dashboard.
 */
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
  /**
   * Logs the user out via Auth0 and returns them to the app's origin.
   * @returns {void}
   */
  const handleLogout = () => {
    logout({
      logoutParams: { returnTo: window.location.origin },
    });
  };

  /**
   * Resets the timer back to the configured session length and stops it.
   * @returns {void}
   */
  const handleReset = () => {
    setSeconds(sessionLength);
    setIsRunning(false);
  };

  /**
   * Starts, pauses, or restarts the timer. If the timer has already hit
   * zero (break time), restarts it at the full session length; otherwise
   * flips the running state.
   * @returns {void}
   */
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