import React, { useState } from 'react';
import NoteItem from './NoteItem';
import NoteModal from './NoteModal';
import Pagination from './Pagination';
import './NotesList.css';

const NotesList = ({ 
  notes, 
  pagination, 
  loading, 
  error, 
  onPageChange,
  appliedFilters,
  isAdmin
}) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  if (loading) {
    return (
      <div className="notes-list">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notes-list">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Notes</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-list">
      <div className="notes-header">
        <h2 className="notes-list-title">Notes</h2>
        {pagination && (
          <div className="notes-stats">
            <span className="total-count">
              {pagination.totalCount} note{pagination.totalCount !== 1 ? 's' : ''}
            </span>
            {appliedFilters && Object.keys(appliedFilters).length > 0 && (
              <span className="filter-indicator">
                Filtered results
              </span>
            )}
          </div>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No notes found</h3>
          <p>
            {appliedFilters && Object.keys(appliedFilters).length > 0
              ? "Try adjusting your filters to see more notes."
              : "No notes available at the moment."}
          </p>
        </div>
      ) : (
        <>
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteItem
                key={note._id}
                note={note}
                formatDate={formatDate}
                onClick={handleNoteClick}
              />
            ))}
          </div>
          
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={onPageChange}
              loading={loading}
            />
          )}
        </>
      )}

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formatDate={formatDate}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default NotesList;
