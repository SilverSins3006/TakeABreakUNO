/**
 * @file SettingsModal component. Modal dialog for app-level settings,
 * currently exposing a display mode (theme) toggle and a static
 * notifications status row.
 */

/**
 * Modal overlay that lets the user change display settings and close
 * the dialog. Renders nothing when closed.
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal should be rendered.
 * @param {Function} props.onClose - Called when the user clicks "Close".
 * @param {string} props.theme - Current theme, expected to be either
 * "dark" or "light". Determines the toggle button's label.
 * @param {Function} props.toggleTheme - Called when the user clicks the
 * display mode button to switch themes.
 * @returns {JSX.Element|null} The rendered modal, or null when closed.
 */
const SettingsModal = ({ isOpen, onClose, theme, toggleTheme }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="timer-box">
        <div className="logo-row">
          <h1>Settings</h1>
        </div>
        
        <div className="settings-content">
          <div className="setting-item">
            <label className="course">Display Mode</label>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
          
          <div className="setting-item">
            <label className="course">Notifications</label>
            <div className="status">Enabled</div>
          </div>
        </div>

        <div className="button-row">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;