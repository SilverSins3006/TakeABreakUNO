/**
 * @file Footer component. Displays the UNO logo (swapped for light/dark
 * mode) and a course attribution line at the bottom of the page.
 */

import unoLogoWhite from '../assets/O-UNO_Type_Color_White.png';
import unoLogoBlack from '../assets/O-UNO_Type_Color_Black.png';

/**
 * Presentational footer with a link to the UNO homepage and a
 * theme-appropriate logo.
 * @param {Object} props
 * @param {boolean} props.dark - Whether dark mode is active. Controls
 * which logo variant (white for dark mode, black for light mode) is shown.
 * @returns {JSX.Element} The rendered footer.
 */
export default function Footer({ dark }) {
  return (
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
  );
}