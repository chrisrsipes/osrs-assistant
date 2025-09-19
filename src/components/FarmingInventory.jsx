import React, { useState, useEffect } from 'react';
import Seed from '../models/Seed';
import initialSeedsData from '../../data/initial_data_farming_seeds.json';

function FarmingInventory() {
  const [seeds, setSeeds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);

  useEffect(() => {
    // Load seeds from JSON data file
    try {
      const exampleSeeds = initialSeedsData.map(seedData => new Seed(seedData));
      setSeeds(exampleSeeds);
    } catch (error) {
      console.error('Error loading seed data:', error);
      setSeeds([]);
    }
  }, []);

  const handleSeedSelect = (seed) => {
    setSelectedSeed(seed);
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
      
      <div className="seeds-container">
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
                    <th>Required Level</th>
                    <th>Seed Count</th>
                    <th>Yield Name</th>
                    <th>Yield Count</th>
                    <th>Expected Yield</th>
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
                        <span className="farming-level-badge">Level {seed.requiredFarmingLevel}</span>
                      </td>
                      <td className="numeric-cell">{seed.seedCount}</td>
                      <td>{seed.yieldName}</td>
                      <td className="numeric-cell">{seed.yieldCount}</td>
                      <td className="numeric-cell expected-yield-cell">{seed.getExpectedYield()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedSeed && (
          <div className="seed-details">
            <h3>Seed Details</h3>
            <div className="detail-item">
              <label>ID:</label>
              <span>{selectedSeed.id}</span>
            </div>
            <div className="detail-item">
              <label>Seed Name:</label>
              <span>{selectedSeed.seedName}</span>
            </div>
            <div className="detail-item">
              <label>Yield Name:</label>
              <span>{selectedSeed.yieldName}</span>
            </div>
            <div className="detail-item">
              <label>Seed Type:</label>
              <span>{selectedSeed.seedType}</span>
            </div>
            <div className="detail-item">
              <label>Required Farming Level:</label>
              <span>{selectedSeed.requiredFarmingLevel}</span>
            </div>
            <div className="detail-item">
              <label>Seed Count:</label>
              <span>{selectedSeed.seedCount}</span>
            </div>
            <div className="detail-item">
              <label>Yield Count:</label>
              <span>{selectedSeed.yieldCount}</span>
            </div>
            <div className="detail-item">
              <label>Average Yield per Seed:</label>
              <span>{selectedSeed.averageYieldPerSeed}</span>
            </div>
            <div className="detail-item highlight">
              <label>Expected Total Yield:</label>
              <span>{selectedSeed.getExpectedYield()}</span>
            </div>
            
            <div className="summary-section">
              <h4>Summary</h4>
              <pre>{JSON.stringify(selectedSeed.getSummary(), null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmingInventory;
