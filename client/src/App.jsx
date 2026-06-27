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
