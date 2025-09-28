const API_BASE_URL = '/api';

class NotesApiService {
  async fetchNotes(params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        inputType = '',
        startDate = '',
        endDate = ''
      } = params;

      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (inputType) queryParams.append('inputType', inputType);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      // Default sorting - newest first
      queryParams.append('sort', 'desc');
      queryParams.append('sortBy', 'createdAt');

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
export default notesApiService;
