import { useState } from 'react'
import takeABreakLogo from './assets/takeabreak.svg'
import unoLogoWhite from './assets/O-UNO_Type_Color_White.png'
import unoLogoBlack from './assets/O-UNO_Type_Color_Black.png'
import './App.css'
import Timer from './Timer'

// Placeholder UI based on initial wireframe - not final design
// Dark/light mode toggle included for development convenience
// Timer display is static for now - functionality comes in Milestone 1
// Button clicks are not wired up yet

function App() {
  const [dark, setDark] = useState(true)

  return (
    <div className={`container ${dark ? 'dark' : 'light'}`}>

      <button className="theme-toggle" onClick={() => setDark(!dark)}>
        {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div className="logo-row">
          <img src={takeABreakLogo} className="logo" alt="Take a Break logo" />
        <h1>Take a Break</h1>
      </div>

      <div className="timer-box">
        <div className="timer-header">
          <span className="timer-label">Timer</span>
          <span className="timer-display">30:00</span>
        </div>
        <div className="status">Not Break Time</div>
        <div className="button-row">
          <button>Pause</button>
          <button>Settings</button>
        </div>
        <div className="button-row">
          <button>Log Out</button>
        </div>
      </div>

      <div className="hint">
        <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
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
  )
}

export default App