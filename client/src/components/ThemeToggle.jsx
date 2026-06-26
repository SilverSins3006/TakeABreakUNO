import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ dark, setDark }) {
  return (
    <button className="theme-toggle" onClick={() => setDark(!dark)}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{dark ? "LIGHT_MODE" : "DARK_MODE"}</span>
    </button>
  );
}