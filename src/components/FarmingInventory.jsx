import React, { useState, useEffect } from 'react';
import Seed from '../models/Seed';
import apiService from '../services/api';

function FarmingInventory() {
  const [seeds, setSeeds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    seedCount: 0,
    yieldCount: 0,
    averageYieldPerSeed: 1
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSeeds();
  }, []);

  const loadSeeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.seeds.getAll();
      const seedObjects = response.data.map(seedData => new Seed(seedData));
      setSeeds(seedObjects);
    } catch (error) {
      console.error('Error loading seeds:', error);
      setError('Failed to load seeds. Please check if the backend server is running.');
      setSeeds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedUpdate = async (id, updateData) => {
    try {
      const response = await apiService.seeds.update(id, updateData);
      const updatedSeed = new Seed(response.data);
      
      // Update the seeds array
      setSeeds(prevSeeds => 
        prevSeeds.map(seed => 
          seed.id === id ? updatedSeed : seed
        )
      );
      
      // Update selected seed if it's the one being updated
      if (selectedSeed && selectedSeed.id === id) {
        setSelectedSeed(updatedSeed);
      }
      
      return updatedSeed;
    } catch (error) {
      console.error('Error updating seed:', error);
      throw error;
    }
  };

  const handleSeedSelect = (seed) => {
    setSelectedSeed(seed);
    setEditMode(false);
    // Initialize edit form with current seed data
    setEditForm({
      seedCount: seed.seedCount,
      yieldCount: seed.yieldCount,
      averageYieldPerSeed: seed.averageYieldPerSeed
    });
  };

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset form to current seed data
    if (selectedSeed) {
      setEditForm({
        seedCount: selectedSeed.seedCount,
        yieldCount: selectedSeed.yieldCount,
        averageYieldPerSeed: selectedSeed.averageYieldPerSeed
      });
    }
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedSeed) return;

    try {
      setSaving(true);
      await handleSeedUpdate(selectedSeed.id, editForm);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to save seed:', error);
      // You could add a toast notification here
    } finally {
      setSaving(false);
    }
  };

  const getTotalSeeds = () => {
    return seeds.reduce((total, seed) => total + seed.seedCount, 0);
  };

  const getTotalYields = () => {
    return seeds.reduce((total, seed) => total + seed.yieldCount, 0);
  };

  const getExpectedTotalYield = () => {
    return seeds.reduce((total, seed) => total + seed.getExpectedYield(), 0);
  };

  if (loading) {
    return (
      <div className="farming-inventory">
        <h2>Farming Inventory Management</h2>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading seed data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="farming-inventory">
        <h2>Farming Inventory Management</h2>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button onClick={loadSeeds} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="farming-inventory">
      <h2>Farming Inventory Management</h2>
      <p>Manage your seed inventory and track expected yields for your farming operations.</p>
      
      {/* Summary Stats */}
      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-number">{getTotalSeeds()}</div>
          <div className="stat-label">Total Seeds</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{getTotalYields()}</div>
          <div className="stat-label">Current Yields</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{getExpectedTotalYield()}</div>
          <div className="stat-label">Expected Yield</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{seeds.length}</div>
          <div className="stat-label">Seed Types</div>
        </div>
      </div>
      
      <div className="farming-layout">
        {/* Left Column - Seed List */}
        <div className="seeds-column">
          <div className="seeds-table-container">
            <h3>Available Seeds</h3>
            {seeds.length === 0 ? (
              <div className="no-data">
                <p>No seed data available. Please check the data file.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="seeds-table">
                  <thead>
                    <tr>
                      <th>Seed Name</th>
                      <th>Type</th>
                      <th>Level</th>
                      <th>Seeds</th>
                      <th>Yields</th>
                      <th>Expected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seeds.map(seed => (
                      <tr 
                        key={seed.id} 
                        className={`seed-row ${selectedSeed?.id === seed.id ? 'selected' : ''}`}
                        onClick={() => handleSeedSelect(seed)}
                      >
                        <td className="seed-name">
                          <strong>{seed.seedName}</strong>
                        </td>
                        <td>
                          <span className="seed-type-badge">{seed.seedType}</span>
                        </td>
                        <td>
                          <span className="farming-level-badge">{seed.requiredFarmingLevel}</span>
                        </td>
                        <td className="numeric-cell">{seed.seedCount}</td>
                        <td className="numeric-cell">{seed.yieldCount}</td>
                        <td className="numeric-cell expected-yield-cell">{seed.getExpectedYield()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Detail View */}
        <div className="details-column">
          {selectedSeed ? (
            <div className="seed-details">
              <div className="detail-header-with-actions">
                <div className="detail-header">
                  <h4>{selectedSeed.seedName}</h4>
                  <span className="seed-type-badge large">{selectedSeed.seedType}</span>
                </div>
                <div className="detail-actions">
                  {!editMode ? (
                    <button onClick={handleEditMode} className="edit-button">
                      Edit
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button 
                        onClick={handleSave} 
                        className="save-button"
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={handleCancelEdit} 
                        className="cancel-button"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-card">
                  <div className="detail-label">Required Level</div>
                  <div className="detail-value level">{selectedSeed.requiredFarmingLevel}</div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-label">Seed Count</div>
                  {editMode ? (
                    <input
                      type="number"
                      value={editForm.seedCount}
                      onChange={(e) => handleFormChange('seedCount', parseInt(e.target.value) || 0)}
                      className="edit-input"
                      min="0"
                    />
                  ) : (
                    <div className="detail-value seeds">{selectedSeed.seedCount}</div>
                  )}
                </div>
                
                <div className="detail-card">
                  <div className="detail-label">Yield Count</div>
                  {editMode ? (
                    <input
                      type="number"
                      value={editForm.yieldCount}
                      onChange={(e) => handleFormChange('yieldCount', parseInt(e.target.value) || 0)}
                      className="edit-input"
                      min="0"
                    />
                  ) : (
                    <div className="detail-value yields">{selectedSeed.yieldCount}</div>
                  )}
                </div>
                
                <div className="detail-card highlight">
                  <div className="detail-label">Expected Yield</div>
                  <div className="detail-value expected">
                    {editMode ? 
                      Math.floor(editForm.seedCount * editForm.averageYieldPerSeed) :
                      selectedSeed.getExpectedYield()
                    }
                  </div>
                </div>
              </div>

              <div className="detail-info">
                <div className="info-item">
                  <label>Yield Name:</label>
                  <span>{selectedSeed.yieldName}</span>
                </div>
                <div className="info-item">
                  <label>Average per Seed:</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={editForm.averageYieldPerSeed}
                      onChange={(e) => handleFormChange('averageYieldPerSeed', parseFloat(e.target.value) || 1)}
                      className="edit-input small"
                      min="0"
                      step="0.1"
                    />
                  ) : (
                    <span>{selectedSeed.averageYieldPerSeed}</span>
                  )}
                </div>
                <div className="info-item">
                  <label>Seed ID:</label>
                  <span>{selectedSeed.id}</span>
                </div>
              </div>

              {!editMode && (
                <div className="summary-section">
                  <h4>Raw Data</h4>
                  <pre>{JSON.stringify(selectedSeed.getSummary(), null, 2)}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">🌱</div>
              <h3>Select a Seed</h3>
              <p>Click on any seed in the table to view detailed information here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FarmingInventory;
