import React, { useState, useEffect } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFiltersChange, loading, hideSubject }) => {
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    language: '',
    subject: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Set default date range (last 30 days)
  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    setFilters(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
  }, []);

  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      startDate: '',
      endDate: '',
      language: '',
      subject: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.startDate || filters.endDate || filters.language || filters.subject;

  return (
    <div className="filter-bar">
      <div className="filter-main">
        <div className="search-section">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search notes..."
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="search-input"
              disabled={loading}
            />
            <div className="search-icon">🔍</div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="advanced-toggle"
            disabled={loading}
          >
            {showAdvanced ? 'Hide Filters' : 'Show Filters'}
            <span className="toggle-icon">{showAdvanced ? '▲' : '▼'}</span>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="clear-filters-btn"
            disabled={loading}
          >
            Clear All
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-row">
            {/* Input type removed: default to all types */}

            <div className="filter-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={filters.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="filter-date"
                disabled={loading}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                value={filters.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="filter-date"
                disabled={loading}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={filters.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="filter-select"
                disabled={loading}
              >
                <option value="">All Languages</option>
                <option value="Kannada">Kannada</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            {!hideSubject && (
              <div className="filter-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  value={filters.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="filter-select"
                  disabled={loading}
                >
                  <option value="">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Programming">Programming</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Literature">Literature</option>
                  <option value="Language">Language</option>
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="General">General</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
