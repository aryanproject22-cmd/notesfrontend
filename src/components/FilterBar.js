import React, { useState, useEffect } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFiltersChange, loading }) => {
  const [filters, setFilters] = useState({
    search: '',
    inputType: '',
    startDate: '',
    endDate: ''
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
      inputType: '',
      startDate: '',
      endDate: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.inputType || filters.startDate || filters.endDate;

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
            <div className="filter-group">
              <label htmlFor="inputType">Input Type</label>
              <select
                id="inputType"
                value={filters.inputType}
                onChange={(e) => handleInputChange('inputType', e.target.value)}
                className="filter-select"
                disabled={loading}
              >
                <option value="">All Types</option>
                <option value="text">Text</option>
                <option value="audio">Audio</option>
              </select>
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
