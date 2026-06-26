import unoLogoWhite from '../assets/O-UNO_Type_Color_White.png';
import unoLogoBlack from '../assets/O-UNO_Type_Color_Black.png';

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