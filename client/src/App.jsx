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

/* ROADMAP: CURRENT FOCUS - MILESTONE 2 (Core Challenge + Settings) */

// TODO [WBS-1.0] [Phase: M2] - Refactor route protection: Only allow access to '/dashboard' if authenticated
// TODO [WBS-3.0] [Phase: M2] - Implement basic challenge selection endpoint
// TODO [WBS-4.1] [Phase: M2] - Sync 'Settings' UI input with database table
// TODO [WBS-5.0] [Phase: M3] - Add persistence for timer state (Scheduled for M3)

function App() {
  const [seconds, setSeconds] = useState(1800);
  const [isRunning, setIsRunning] = useState(false);
  const [dark, setDark] = useState(true); // Global theme state
  const [hasConfigured, setHasConfigured] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const {
    isLoading, // Loading state, the SDK needs to reach Auth0 on load
    isAuthenticated,
    error,
    loginWithRedirect: login, // Starts the login flow
    logout: auth0Logout, // Starts the logout flow
    user, // User profile
  } = useAuth0();
  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) return "Loading...";

  return isAuthenticated ? (
    <>
      <p>Logged in as {user.email}</p>

      <h1>User Profile</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <button onClick={logout}>Logout</button>
    </>
  ) : (
    <>
      {error && <p>Error: {error.message}</p>}

      <button onClick={signup}>Signup</button>

      <button onClick={login}>Login</button>
    </>
  );

  useEffect(() => {
    let interval;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }
    if (seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

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

          {/* Pages receive 'dark' prop for footer consistency */}
          <Route path="/account" element={<Account dark={dark} />} />
          <Route
            path="/settings"
            element={<Settings seconds={seconds} setSeconds={setSeconds} />}
          />
          <Route path="/insights" element={<Insights dark={dark} />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                dark={dark}
                seconds={seconds}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                onOpenSettings={() => setShowSettingsModal(true)}
              />
            }
          />
          <Route path="*" element={<Navigate to="/account" replace />} />
        </Routes>

        <Footer dark={dark} />

        {showSettingsModal && (
          <Settings
            seconds={seconds}
            setSeconds={setSeconds}
            isModal={true}
            onClose={() => setShowSettingsModal(false)}
            onSave={() => {
              setHasConfigured(true);
              setShowSettingsModal(false);
            }}
          />
        )}
      </Router>
    </div>
  );
}

export default App;
