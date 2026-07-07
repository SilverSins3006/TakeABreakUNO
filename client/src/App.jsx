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

// Custom wrapper to protect routes from unauthenticated users
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  
  if (isLoading) {
    return <div className="container" style={{ padding: "2rem", textAlign: "center" }}>Checking authentication...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/account" replace />;
}

function App() {
  const [seconds, setSeconds] = useState(1800);
  const [isRunning, setIsRunning] = useState(false);
  const [dark, setDark] = useState(true); // Global theme state
  const [hasConfigured, setHasConfigured] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const { isLoading, error } = useAuth0();

  // Timer side-effect logic (moved safely away from early returns)
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

  if (isLoading) {
    return <div className="container" style={{ padding: "2rem", textAlign: "center" }}>Initializing application...</div>;
  }

  if (error) {
    return <div className="container" style={{ padding: "2rem", color: "red" }}>Authentication Error: {error.message}</div>;
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
                <Settings seconds={seconds} setSeconds={setSeconds} />
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
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
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