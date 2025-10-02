const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class NotesApiService {
  async fetchNotes(params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        inputType = '',
        startDate = '',
        endDate = '',
        language = '',
        subject = '',
        sort = '',
        sortBy = ''
      } = params;

      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (inputType) queryParams.append('inputType', inputType);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (language) queryParams.append('language', language);
      if (subject) queryParams.append('subject', subject);
      if (sort) queryParams.append('sort', sort);
      if (sortBy) queryParams.append('sortBy', sortBy);

      const url = `${API_BASE_URL}/notes?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }

  // Helper method to format date for API
  formatDateForApi(date) {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  // Helper method to get current date range (last 30 days)
  getDefaultDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    return {
      startDate: this.formatDateForApi(startDate),
      endDate: this.formatDateForApi(endDate)
    };
  }
}

const notesApiService = new NotesApiService();

// Add updateNote method to prototype for convenience
NotesApiService.prototype.updateNote = async function(id, body = {}) {
  try {
    const url = `${API_BASE_URL}/notes/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Add deleteNote method
NotesApiService.prototype.deleteNote = async function(id) {
  try {
    const url = `${API_BASE_URL}/notes/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};
export default notesApiService;
