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

      // Create generic change record
      createChangeRecord: async (changeData) => {
        return this.request('/seeds/changes', {
          method: 'POST',
          body: JSON.stringify(changeData),
        });
      },
    };

    // Farm Patches API methods
    this.farmPatches = {
      // Get all farm patches
      getAll: async () => {
        return this.request('/farm-patches');
      },

      // Get farm patch by ID
      getById: async (id) => {
        return this.request(`/farm-patches/${id}`);
      },

      // Create new farm patch
      create: async (patchData) => {
        return this.request('/farm-patches', {
          method: 'POST',
          body: JSON.stringify(patchData),
        });
      },

      // Update farm patch by ID
      update: async (id, updateData) => {
        return this.request(`/farm-patches/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData),
        });
      },

      // Delete farm patch by ID
      delete: async (id) => {
        return this.request(`/farm-patches/${id}`, {
          method: 'DELETE',
        });
      },

      // Get farm patches by location
      getByLocation: async (location) => {
        return this.request(`/farm-patches/location/${encodeURIComponent(location)}`);
      },

      // Get farm patches by patch type
      getByPatchType: async (patchType) => {
        return this.request(`/farm-patches/type/${encodeURIComponent(patchType)}`);
      },

      // Search farm patches
      search: async (searchTerm) => {
        return this.request(`/farm-patches/search/${encodeURIComponent(searchTerm)}`);
      },

      // Get unique locations
      getUniqueLocations: async () => {
        return this.request('/farm-patches/meta/locations');
      },

      // Get unique patch types
      getUniquePatchTypes: async () => {
        return this.request('/farm-patches/meta/patch-types');
      },
    };

    // Farm Runs API methods
    this.farmRuns = {
      // Get all farm runs with their steps
      getAll: async () => {
        return this.request('/farm-runs');
      },

      // Get farm run by ID with steps
      getById: async (id) => {
        return this.request(`/farm-runs/${id}`);
      },

      // Create new farm run
      create: async (farmRunData) => {
        return this.request('/farm-runs', {
          method: 'POST',
          body: JSON.stringify(farmRunData),
        });
      },

      // Update farm run by ID
      update: async (id, updateData) => {
        return this.request(`/farm-runs/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData),
        });
      },

      // Delete farm run by ID
      delete: async (id) => {
        return this.request(`/farm-runs/${id}`, {
          method: 'DELETE',
        });
      },

      // Get farm run steps for a specific farm run
      getSteps: async (farmRunId) => {
        return this.request(`/farm-runs/${farmRunId}/steps`);
      },

      // Create new farm run step
      createStep: async (farmRunId, stepData) => {
        return this.request(`/farm-runs/${farmRunId}/steps`, {
          method: 'POST',
          body: JSON.stringify(stepData),
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
