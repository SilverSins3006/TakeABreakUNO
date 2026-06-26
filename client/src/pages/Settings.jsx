export default function Settings({ isModal = false, onClose, onSave }) {

  const content = (
    <div className="card"> 
      <h2 style={{ color: 'var(--accent)' }}>Preferences</h2>
      <p style={{ color: 'var(--text)' }}>
        System configuration and user settings.
      </p>
      
      <div className="button-row">
        <button className="btn-accent" onClick={onSave}>Save Changes</button>
        {isModal && <button onClick={onClose}>Close</button>}
      </div>
    </div>
  );

  // If it's a modal, wrap it in the backdrop, otherwise return just the card
  return isModal ? <div className="modal-backdrop">{content}</div> : <div className="container">{content}</div>;
}