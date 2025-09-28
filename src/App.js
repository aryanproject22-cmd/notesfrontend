import React, { useState, useEffect, useCallback } from 'react';
import FilterBar from './components/FilterBar';
import NotesList from './components/NotesList';
import notesApi from './services/notesApi';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [, setCurrentPage] = useState(1);

  const fetchNotes = useCallback(async (filters = {}, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...filters,
        page,
        limit: 10
      };
      
      const response = await notesApi.fetchNotes(params);
      
      if (response.status === 'success') {
        setNotes(response.notes);
        setPagination(response.pagination);
        setAppliedFilters(response.appliedFilters || {});
        setCurrentPage(page);
      } else {
        throw new Error('Failed to fetch notes');
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err.message || 'Failed to load notes. Please try again.');
      setNotes([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleFiltersChange = useCallback((filters) => {
    setCurrentPage(1);
    fetchNotes(filters, 1);
  }, [fetchNotes]);

  const handlePageChange = useCallback((page) => {
    fetchNotes(appliedFilters, page);
  }, [fetchNotes, appliedFilters]);

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">📝 Notes App</h1>
        <p className="app-subtitle">Discover and explore your notes</p>
      </header>
      
      <main className="app-main">
        {/* <FilterBar 
          onFiltersChange={handleFiltersChange}
          loading={loading}
        /> */}
        
        <NotesList 
          notes={notes}
          pagination={pagination}
          loading={loading}
          error={error}
          onPageChange={handlePageChange}
          appliedFilters={appliedFilters}
        />
      </main>
    </div>
  );
}

export default App;
