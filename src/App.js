import React, { useState, useEffect, useCallback } from 'react';
import FilterBar from './components/FilterBar';
import AuthModal from './components/AuthModal';
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
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const role = localStorage.getItem('role');
      return role === '1';
    } catch (e) {
      return false;
    }
  });

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
    // If a subject is selected, include it in initial fetch
    const initialFilters = selectedSubject ? { subject: selectedSubject } : {};
    fetchNotes(initialFilters);
  }, [fetchNotes, selectedSubject]);

  const handleFiltersChange = useCallback((filters) => {
    setCurrentPage(1);
    // preserve subject if one is selected (don't let FilterBar override subject when on subject page)
    const filtersWithSubject = selectedSubject ? { ...filters, subject: selectedSubject } : filters;
    setAppliedFilters(filtersWithSubject);
    fetchNotes(filtersWithSubject, 1);
  }, [fetchNotes]);

  const handlePageChange = useCallback((page) => {
    fetchNotes(appliedFilters, page);
  }, [fetchNotes, appliedFilters]);

  return (
    <div className="App">
      <header className="app-header">
        <div className="app-header-top">
          <div />
          <div className="auth-section">
            {isAdmin ? (
              <button
                className="auth-icon-btn"
                title="Logout"
                aria-label="Logout"
                onClick={() => {
                  if (window.confirm('Logout?')) {
                    localStorage.removeItem('role');
                    setIsAdmin(false);
                  }
                }}
              >
                <span className="auth-icon">⎋</span>
              </button>
            ) : (
              <button
                className="auth-icon-btn"
                title="Login"
                aria-label="Login"
                onClick={() => setIsAuthOpen(true)}
              >
                <span className="auth-icon">🔐</span>
              </button>
            )}
          </div>
        </div>

        <div className="app-header-center">
          <span className="app-header-icon">📝</span>
          <h1 className="app-title">Notes App</h1>
        </div>

        <p className="app-subtitle">Discover and explore your notes</p>
      </header>
      
      <main className="app-main">
        {!selectedSubject ? (
          // Show subjects grid on homepage (compact cards with icons)
          <div className="subjects-grid">
            {[
              { key: 'Mathematics', label: 'Math problems, equations', icon: '∑', color: '#FF6B6B' },
              { key: 'Physics', label: 'Concepts & laws', icon: '🔭', color: '#6BCB77' },
              { key: 'Chemistry', label: 'Reactions & compounds', icon: '⚗️', color: '#4D96FF' },
              { key: 'Biology', label: 'Living organisms', icon: '🧬', color: '#FFD93D' },
              { key: 'Programming', label: 'Code & algorithms', icon: '</>', color: '#9B5DE5' },
              { key: 'Computer Science', label: 'CS concepts', icon: '💾', color: '#00BBF9' },
              { key: 'History', label: 'Events & figures', icon: '📜', color: '#FF8C42' },
              { key: 'Geography', label: 'Maps & places', icon: '🗺️', color: '#22C1C3' },
              { key: 'Literature', label: 'Books & analysis', icon: '📚', color: '#F15BB5' },
              { key: 'Language', label: 'Grammar & vocab', icon: '🗣️', color: '#00C2A8' },
              { key: 'Art', label: 'Visual arts', icon: '🎨', color: '#F72585' },
              { key: 'Music', label: 'Theory & composers', icon: '🎵', color: '#4361EE' },
              { key: 'Sports', label: 'Athletic activities', icon: '🏅', color: '#FB5607' },
              { key: 'Entertainment', label: 'Movies & celebrities', icon: '🎬', color: '#7BD389' },
              { key: 'General', label: 'Miscellaneous', icon: '📌', color: '#9AA5FF' }
            ].map((s) => (
              <div
                key={s.key}
                className="subject-card compact"
                role="button"
                tabIndex={0}
                onClick={() => setSelectedSubject(s.key)}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedSubject(s.key); }}
              >
                <div className="subject-icon" style={{ backgroundColor: s.color }}>
                  <span className="subject-icon-symbol">{s.icon}</span>
                </div>
                <div className="subject-content">
                  <div className="subject-name">{s.key}</div>
                  <div className="subject-desc">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="subject-page-header">
              <button className="back-to-subjects" onClick={() => { setSelectedSubject(''); setAppliedFilters({}); fetchNotes({}, 1); }}>
                ← Back
              </button>
              <h2 className="subject-title">{selectedSubject}</h2>
            </div>

            <FilterBar onFiltersChange={handleFiltersChange} loading={loading} hideSubject={true} />

            <NotesList 
              notes={notes}
              pagination={pagination}
              loading={loading}
              error={error}
              onPageChange={handlePageChange}
              appliedFilters={appliedFilters}
              isAdmin={isAdmin}
            />
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={() => { setIsAdmin(true); setIsAuthOpen(false); }}
      />
    </div>
  );
}

export default App;
