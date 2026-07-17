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