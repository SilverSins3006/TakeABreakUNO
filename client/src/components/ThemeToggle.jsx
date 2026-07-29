/**
 * @file ThemeToggle component. A single button that flips the app between
 * light and dark mode and shows the corresponding icon/label.
 */

import { Sun, Moon } from 'lucide-react';

/**
 * Button that toggles the app's color theme. Displays a sun icon and
 * "LIGHT_MODE" label when dark mode is on (clicking switches to light),
 * and a moon icon with "DARK_MODE" when light mode is on.
 * @param {Object} props
 * @param {boolean} props.dark - Whether dark mode is currently active.
 * @param {Function} props.setDark - State setter used to flip the dark
 * mode boolean.
 * @returns {JSX.Element} The rendered toggle button.
 */
export default function ThemeToggle({ dark, setDark }) {
  return (
    <button className="theme-toggle" onClick={() => setDark(!dark)}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{dark ? "LIGHT_MODE" : "DARK_MODE"}</span>
    </button>
  );
}