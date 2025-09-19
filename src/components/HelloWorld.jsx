import React, { useState, useEffect } from 'react';
import Seed from '../models/Seed';

function HelloWorld() {
  const [seeds, setSeeds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);

  useEffect(() => {
    // Create some example seeds to demonstrate the Seed class
    const exampleSeeds = [
      new Seed({
        id: 1,
        seedName: "Tomato Seeds",
        yieldName: "Tomatoes",
        seedCount: 50,
        yieldCount: 0,
        averageYieldPerSeed: 3.2
      }),
      new Seed({
        id: 2,
        seedName: "Carrot Seeds",
        yieldName: "Carrots",
        seedCount: 25,
        yieldCount: 12,
        averageYieldPerSeed: 2.8
      }),
      new Seed({
        id: 3,
        seedName: "Lettuce Seeds",
        yieldName: "Lettuce",
        seedCount: 100,
        yieldCount: 0,
        averageYieldPerSeed: 1.5
      })
    ];
    
    setSeeds(exampleSeeds);
  }, []);

  const handleSeedSelect = (seed) => {
    setSelectedSeed(seed);
  };

  return (
    <div className="hello-world">
      <h2>Seed Inventory Management System</h2>
      <p>Welcome to the OSRS Skilling Assistant application.</p>
      <p>This demonstrates the Seed class for inventory management.</p>
      
      <div className="seeds-container">
        <div className="seeds-list">
          <h3>Available Seeds</h3>
          {seeds.map(seed => (
            <div 
              key={seed.id} 
              className={`seed-item ${selectedSeed?.id === seed.id ? 'selected' : ''}`}
              onClick={() => handleSeedSelect(seed)}
            >
              <div className="seed-info">
                <strong>{seed.seedName}</strong>
                <span className="seed-count">{seed.seedCount} seeds</span>
              </div>
              <div className="yield-info">
                <span>{seed.yieldName}: {seed.yieldCount}</span>
                <span className="expected-yield">
                  Expected: {seed.getExpectedYield()}
                </span>
              </div>
            </div>
          ))}
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

export default HelloWorld;
