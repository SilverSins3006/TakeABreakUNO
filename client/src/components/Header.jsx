/**
 * @file Header component. Renders the app logo/title, navigation buttons
 * to the Stats and Add Challenge pages, and the theme toggle.
 */

import takeABreakLogo from "../assets/takeabreak.svg";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

/**
 * Top navigation bar for the app. Combines branding, page navigation,
 * and the light/dark mode toggle.
 * @param {Object} props
 * @param {boolean} props.dark - Whether dark mode is currently active.
 * Passed through to ThemeToggle.
 * @param {Function} props.setDark - Setter used to toggle dark mode.
 * Passed through to ThemeToggle.
 * @returns {JSX.Element} The rendered header.
 */
export default function Header({ dark, setDark }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo-row" style={{ margin: 0 }}>
        <img src={takeABreakLogo} className="logo" alt="Take a Break logo" />
        <h1>Take a Break</h1>
      </div>
      <button
        onClick={() => navigate("/stats")}
        style={{ width: "fit-content", marginLeft: "auto"}}
      >
        Stats
      </button>
      <button
        className="btn-accent"
        onClick={() => navigate("/addchallenge")}
        style={{ width: "fit-content"}}
      >
        Add Challenge
      </button>
      <ThemeToggle dark={dark} setDark={setDark} />
    </header>
  );
}