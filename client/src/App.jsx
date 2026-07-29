/**
 * @file Main application shell for Take A Break.
 * @brief Configures routing, authentication guards, and global UI state.
 */
import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import AddChallenge from "./pages/AddChallenge";
import Stats from "./pages/Stats";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth0 } from "@auth0/auth0-react";
import { normalizeCategories } from "./utils/categories";
import { getRemainingSeconds } from "./utils/timer";

/**
 * @brief Custom wrapper to protect routes from unauthenticated users.
 * @param {Object} props Component props containing children.
 * @param {React.ReactNode} props.children Child components to render when authenticated.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div
        className="container"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        Checking authentication...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/account" replace />;
}

/**
 * @brief Root application component.
 * @returns {JSX.Element} The application layout and route structure.
 */
function App() {
  const [seconds, setSeconds] = useState(1800);
  const [sessionLength, setSessionLength] = useState(1800);
  const [isRunning, setIsRunning] = useState(false);
  const [challengeDifficulty, setChallengeDifficulty] = useState("medium");
  const [challengeCategories, setChallengeCategories] = useState([]);
  const [dark, setDark] = useState(true); // Global theme state
  // hasConfigured starts as null ("unknown") until we've checked the backend
  // for saved preferences. Starting it at true made the "needs setup"
  // redirect below unreachable, since every session began already
  // "configured". null lets the "/" route wait for that check instead of
  // guessing.
  const [hasConfigured, setHasConfigured] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const timerEndRef = useRef(null);

  const { isLoading, error, isAuthenticated, user } = useAuth0();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  /**
   * Syncs the authenticated Auth0 user to the backend and loads their
   * saved preferences (session length, challenge difficulty, and
   * categories) into app state. Runs whenever auth status or the user
   * changes.
   */
  useEffect(() => {
    /**
     * Upserts the current user in the backend, then fetches and applies
     * their saved preferences. No-ops if not authenticated.
     * @returns {Promise<void>}
     */
    const syncUserToDatabase = async () => {
      if (!isAuthenticated || !user?.sub) return;

      try {
        await fetch(`${apiBaseUrl}/api/users/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth0Id: user.sub,
            email: user.email,
            name: user.name,
          }),
        });

        const res = await fetch(
          `${apiBaseUrl}/api/users/preferences?auth0Id=${encodeURIComponent(user.sub)}`,
        );
        const data = await res.json();

        if (data.user) {
          // set saved preferences here
          console.log("Fetched user preferences:", data.user);
          // NOTE: despite the "_minutes" name, this field actually holds
          // seconds (see Settings.jsx: sessionLengthMinutes is set to
          // sessionTime * 60 before saving). Consumed here as seconds to
          // match. Worth renaming on the backend at some point to avoid
          // confusion, but left as-is here to match the existing API
          // contract.
          setSessionLength(data.user.session_length_minutes ?? 1800);
          setSeconds(data.user.session_length_minutes ?? 1800);
          setChallengeDifficulty(data.user.challenge_difficulty ?? "medium");
          setChallengeCategories(
            normalizeCategories(data.user.preferred_challenge_types),
          );
          // A saved session length is our signal that this user has been
          // through Settings before.
          setHasConfigured(Boolean(data.user.session_length_minutes));
        } else {
          setHasConfigured(false);
        }
      } catch (err) {
        console.error("Failed to sync Auth0 user to backend:", err);
        // Fail open rather than leaving hasConfigured stuck at null, which
        // would trap the user on a permanent loading state.
        setHasConfigured(true);
      }
    };

    syncUserToDatabase();
  }, [isAuthenticated, user]);

  // Timer side-effect logic (moved safely away from early returns)
  /**
   * Drives the countdown while isRunning is true. Computes an absolute
   * end timestamp once, then polls every 250ms to derive the remaining
   * seconds from wall-clock time (rather than decrementing a counter),
   * so the timer stays accurate even if the tab is throttled in the
   * background. Stops itself once the remaining time hits zero.
   */
  useEffect(() => {
    if (!isRunning) {
      timerEndRef.current = null;
      return;
    }

    timerEndRef.current = Date.now() + seconds * 1000;

    const updateTimer = () => {
      const remainingSeconds = getRemainingSeconds(timerEndRef.current);

      setSeconds(remainingSeconds);

      if (remainingSeconds === 0) {
        setIsRunning(false);
      }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 250);

    return () => clearInterval(interval);
  }, [isRunning]);

  if (isLoading) {
    return (
      <div
        className="container"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        Initializing application...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "2rem", color: "red" }}>
        Authentication Error: {error.message}
      </div>
    );
  }

  return (
    <div className={`app-wrapper ${dark ? "dark" : "light"}`}>
      <Router>
        <Header dark={dark} setDark={setDark} />

        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <Navigate to="/account" replace />
              ) : hasConfigured === null ? (
                <div
                  className="container"
                  style={{ padding: "2rem", textAlign: "center" }}
                >
                  Loading your preferences...
                </div>
              ) : hasConfigured ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/settings" replace />
              )
            }
          />

          {/* Public authentication landing page */}
          <Route path="/account" element={<Account />} />

          {/* Protected Routes - Wrapping these ensures users must log in first */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings
                  seconds={seconds}
                  setSeconds={setSeconds}
                  setSessionLength={setSessionLength}
                  userId={user?.sub}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard
                  seconds={seconds}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                  setSeconds={setSeconds}
                  sessionLength={sessionLength}
                  challengeDifficulty={challengeDifficulty}
                  challengeCategories={challengeCategories}
                  onOpenSettings={() => setShowSettingsModal(true)}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/addchallenge"
            element={
              <ProtectedRoute>
                <AddChallenge userId={user?.sub} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/account" replace />} />
        </Routes>

        <Footer dark={dark} />

        {showSettingsModal && (
          <Settings
            seconds={seconds}
            sessionLength={sessionLength}
            setSeconds={setSeconds}
            setSessionLength={setSessionLength}
            isRunning={isRunning}
            challengeDifficulty={challengeDifficulty}
            setChallengeDifficulty={setChallengeDifficulty}
            challengeCategories={challengeCategories}
            setChallengeCategories={setChallengeCategories}
            isModal={true}
            onClose={() => setShowSettingsModal(false)}
            onSave={() => {
              setHasConfigured(true);
              setShowSettingsModal(false);
            }}
            userId={user?.sub}
          />
        )}
      </Router>
    </div>
  );
}

export default App;