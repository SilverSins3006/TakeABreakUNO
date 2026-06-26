import takeABreakLogo from '../assets/takeabreak.svg'
import ThemeToggle from './ThemeToggle';

export default function Header({ dark, setDark }) {
  return (
    <header className="header">
      <div className="logo-row" style={{ margin: 0 }}>
        <img src={takeABreakLogo} className="logo" alt="Take a Break logo" />
        <h1>Take a Break</h1>
      </div>
      <ThemeToggle dark={dark} setDark={setDark} />
    </header>
  );
}