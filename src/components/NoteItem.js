import React from 'react';
import ReactMarkdown from 'react-markdown';
import './NoteItem.css';

const NoteItem = ({ note, formatDate, onClick }) => {
  const getInputTypeIcon = (inputType) => {
    switch (inputType) {
      case 'text': return '📝';
      case 'audio': return '🎵';
      default: return '📄';
    }
  };

  const getInputTypeLabel = (inputType) => {
    switch (inputType) {
      case 'text': return 'Text';
      case 'audio': return 'Audio';
      default: return 'Unknown';
    }
  };

  // Function to create a preview of the content
  const createPreview = (content) => {
    // Remove markdown syntax and get plain text
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list items
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    // Limit to 150 characters
    const preview = plainText.length > 150 
      ? plainText.substring(0, 150) + '...' 
      : plainText;
    return preview;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(note);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className="note-item"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${getInputTypeLabel(note.inputType)} note`}
    >
      <div className="note-header">
        <div className="note-type-badge">
          <span className="type-icon">{getInputTypeIcon(note.inputType)}</span>
          <span className="type-label">{getInputTypeLabel(note.inputType)}</span>
        </div>
        <div className="note-date">
          {formatDate(note.createdAt)}
        </div>
      </div>
      
      <div className="note-content">
        <div className="note-preview">
          {createPreview(note.generatedNotes)}
        </div>
        <div className="note-click-hint">
          Click to view full content
        </div>
      </div>
      
      {note.updatedAt && note.updatedAt !== note.createdAt && (
        <div className="note-footer">
          <span className="updated-indicator">
            Updated: {formatDate(note.updatedAt)}
          </span>
        </div>
      )}
    </div>
  );
};

export default NoteItem;
