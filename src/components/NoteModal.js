import React from 'react';
import ReactMarkdown from 'react-markdown';
import './NoteModal.css';

const NoteModal = ({ note, isOpen, onClose, formatDate }) => {
  if (!isOpen || !note) return null;

  const getInputTypeIcon = (inputType) => {
    switch (inputType) {
      case 'text': return '📝';
      case 'audio': return '🎵';
      default: return '📄';
    }
  };

  const getInputTypeLabel = (inputType) => {
    switch (inputType) {
      case 'text': return 'Text Note';
      case 'audio': return 'Audio Note';
      default: return 'Unknown Type';
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-type-badge">
              <span className="modal-type-icon">{getInputTypeIcon(note.inputType)}</span>
              <span className="modal-type-label">{getInputTypeLabel(note.inputType)}</span>
            </div>
            <div className="modal-dates">
              <div className="modal-date">
                <strong>Created:</strong> {formatDate(note.createdAt)}
              </div>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <div className="modal-date">
                  <strong>Updated:</strong> {formatDate(note.updatedAt)}
                </div>
              )}
            </div>
          </div>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-note-content">
            <ReactMarkdown>{note.generatedNotes}</ReactMarkdown>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="modal-close-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
