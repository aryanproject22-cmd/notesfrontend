import React, { useState, useEffect } from 'react';
import notesApi from '../services/notesApi';
import ReactMarkdown from 'react-markdown';
import './NoteModal.css';

const NoteModal = ({ note, isOpen, onClose, formatDate, isAdmin }) => {
  const [editing, setEditing] = useState(false);
  const [generatedNotesValue, setGeneratedNotesValue] = useState(note ? note.generatedNotes : '');

  // keep local state in sync when note prop changes
  useEffect(() => {
    setGeneratedNotesValue(note ? note.generatedNotes : '');
  }, [note]);

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
            {!editing && <ReactMarkdown>{note.generatedNotes}</ReactMarkdown>}
            {editing && (
              <div className="note-edit-form">
                <label>Generated Notes</label>
                <textarea
                  value={generatedNotesValue}
                  onChange={(e) => setGeneratedNotesValue(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          {isAdmin && !editing && (
            <button className="modal-edit-button" onClick={() => setEditing(true)}>Edit</button>
          )}

          {isAdmin && editing && (
            <button
              className="modal-save-button"
              onClick={async () => {
                try {
                  // Only send the generatedNotes field as requested
                  const res = await notesApi.updateNote(note._id, { generatedNotes: generatedNotesValue });
                  // On success, refresh the page to reflect changes (could be optimized to update in-place)
                  window.location.reload();
                } catch (err) {
                  console.error('Failed to save note', err);
                }
              }}
            >
              Save
            </button>
          )}

          {isAdmin && (
            <button
              className="modal-delete-button"
              onClick={async () => {
                if (!window.confirm('Delete this note?')) return;
                try {
                  await notesApi.deleteNote(note._id);
                  // refresh list
                  window.location.reload();
                } catch (err) {
                  console.error('Failed to delete note', err);
                }
              }}
            >
              Delete
            </button>
          )}

          <button 
            className="modal-close-button"
            onClick={() => { setEditing(false); onClose(); }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
