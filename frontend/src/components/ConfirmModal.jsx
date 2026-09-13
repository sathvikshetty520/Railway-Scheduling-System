function ConfirmModal({ message, onConfirm, onCancel }) {
  if (!message) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button
            type="button"
            style={{ background: '#dc2626' }}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;