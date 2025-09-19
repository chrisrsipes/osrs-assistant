// API service for communicating with the Express backend

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  constructor() {
    // Seed API methods
    this.seeds = {
      // Get all seeds
      getAll: async () => {
        return this.request('/seeds');
      },

      // Get seed by ID
      getById: async (id) => {
        return this.request(`/seeds/${id}`);
      },

      // Create new seed
      create: async (seedData) => {
        return this.request('/seeds', {
          method: 'POST',
          body: JSON.stringify(seedData),
        });
      },

      // Update seed by ID
      update: async (id, updateData) => {
        return this.request(`/seeds/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData),
        });
      },

      // Partial update seed by ID
      patch: async (id, updateData) => {
        return this.request(`/seeds/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(updateData),
        });
      },

      // Delete seed by ID
      delete: async (id) => {
        return this.request(`/seeds/${id}`, {
          method: 'DELETE',
        });
      },

      // Reset to initial data
      reset: async () => {
        return this.request('/seeds/reset', {
          method: 'POST',
        });
      },

      // Get change records for a specific seed
      getChangeRecords: async (seedId) => {
        return this.request(`/seeds/${seedId}/changes`);
      },

      // Get all change records
      getAllChangeRecords: async () => {
        return this.request('/seeds/changes/all');
      },

      // Create reconciliation change record
      reconcile: async (seedId, seedCountChange, yieldCountChange, notes = '') => {
        return this.request(`/seeds/${seedId}/reconcile`, {
          method: 'POST',
          body: JSON.stringify({
            seedId: parseInt(seedId),
            changeType: 'reconciliation',
            seedCountChange,
            yieldCountChange,
            notes
          }),
        });
      },

      // Create increment change record
      increment: async (seedId, seedCountChange, yieldCountChange, notes = '') => {
        return this.request(`/seeds/${seedId}/increment`, {
          method: 'POST',
          body: JSON.stringify({
            seedId: parseInt(seedId),
            changeType: 'increment',
            seedCountChange,
            yieldCountChange,
            notes
          }),
        });
      },
    };

    // Health check
    this.health = async () => {
      return this.request('/health');
    };
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
