import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import takeABreakLogo from '../assets/takeabreak.svg'
import unoLogoWhite from '../assets/O-UNO_Type_Color_White.png'
import unoLogoBlack from '../assets/O-UNO_Type_Color_Black.png'
import Timer from '../components/Timer'

function Active() {
  const [dark, setDark] = useState(true);
  
  // Lifted state passed to Timer component so control buttons here can toggle it
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className={`container ${dark ? "dark" : "light"}`}>
      {/* Theme toggle using clean Lucide vectors instead of native emojis */}
      <button className="theme-toggle" onClick={() => setDark(!dark)}>
        {dark ? <Sun size={18} /> : <Moon size={18} />}
        <span>{dark ? "Light Mode" : "Dark Mode"}</span>
      </button>

      <div className="logo-row">
        <img src={takeABreakLogo} className="logo" alt="Take a Break logo" />
        <h1>Take a Break</h1>
      </div>

      {/* Main Timer Box (Mid-Interval View) */}
      <div className="timer-box">
        <div className="timer-header">
          <span className="timer-label">Timer</span>
          <span className="timer-display">
            <Timer isRunning={isRunning} setIsRunning={setIsRunning} />
          </span>
        </div>
        
        <div className="status">Not Break Time</div>
        
        <div className="button-row">
          <button onClick={handleToggleTimer}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button onClick={() => navigate('/menu')}>Settings</button>
        </div>
        <div className="button-row">
          <button onClick={() => navigate('/login')}>Log Out</button>
        </div>
      </div>

      <footer className="footer">
        <a href="https://www.unomaha.edu/" target="_blank" rel="noreferrer">
          <img
            src={dark ? unoLogoWhite : unoLogoBlack}
            alt="University of Nebraska Omaha"
            className="uno-logo"
          />
        </a>
        <p className="course">Built for CSCI 4830/8836</p>
      </footer>
    </div>
  );
}

export default Active;