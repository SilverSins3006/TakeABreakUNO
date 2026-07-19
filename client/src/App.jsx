/**
 * @file Main application shell for Take A Break.
 * @brief Configures routing, authentication guards, and global UI state.
 */
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Insights from "./pages/Insights";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth0 } from "@auth0/auth0-react";

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
  const [hasConfigured, setHasConfigured] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const { isLoading, error, isAuthenticated, user } = useAuth0();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
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
          setSessionLength(data.user.session_length_minutes ?? 1800);
          setSeconds(data.user.session_length_minutes ?? 1800);
          setChallengeDifficulty(data.user.challenge_difficulty ?? "medium");
          setChallengeCategories(data.user.preferred_challenge_types ?? []);
        }
      } catch (err) {
        console.error("Failed to sync Auth0 user to backend:", err);
      }
    };

    syncUserToDatabase();
  }, [isAuthenticated, user]);

  // Timer side-effect logic (moved safely away from early returns)
  useEffect(() => {
    let interval;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

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
              !hasConfigured ? (
                <Navigate to="/settings" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Public authentication landing page */}
          <Route path="/account" element={<Account dark={dark} />} />

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
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights dark={dark} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard
                  dark={dark}
                  seconds={seconds}
                  time={seconds}
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

          <Route path="*" element={<Navigate to="/account" replace />} />
        </Routes>

        <Footer dark={dark} />

        {showSettingsModal && (
          <Settings
            seconds={seconds}
            sessionLength={sessionLength}
            setSeconds={setSeconds}
            setSessionLength={setSessionLength}
            setIsRunning={setIsRunning}
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
