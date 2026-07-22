import takeABreakLogo from "../assets/takeabreak.svg";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

export default function Header({ dark, setDark }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo-row" style={{ margin: 0 }}>
        <img src={takeABreakLogo} className="logo" alt="Take a Break logo" />
        <h1>Take a Break</h1>
      </div>
      <button
        className="btn-accent"
        onClick={() => navigate("/addchallenge")}
        style={{ width: "fit-content", margin: "-1rem 1rem 0 auto" }}
      >
        Add Challenge
      </button>
      <ThemeToggle dark={dark} setDark={setDark} />
    </header>
  );
}
