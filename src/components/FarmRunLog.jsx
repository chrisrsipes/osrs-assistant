import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './FarmRunLog.css';

function FarmRunLog() {
  const [selectedFarmRun, setSelectedFarmRun] = useState(null);
  const [farmRuns, setFarmRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load farm runs from API
  useEffect(() => {
    const loadFarmRuns = async () => {
      try {
        setLoading(true);
        const data = await apiService.farmRuns.getAll();
        setFarmRuns(data);
      } catch (error) {
        console.error('Error loading farm runs:', error);
        // Set empty array on error
        setFarmRuns([]);
      } finally {
        setLoading(false);
      }
    };

    loadFarmRuns();
  }, []);

  const handleFarmRunSelect = (farmRun) => {
    setSelectedFarmRun(farmRun);
  };

  const handleAddFarmRun = () => {
    // TODO: Implement add farm run functionality
    console.log('Add new farm run');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const diffMins = Math.round(diffMs / (1000 * 60));
    return `${diffMins} min`;
  };

  const getTotalYield = () => {
    // Calculate total yield from all farm run steps
    // This would need to be calculated from seed change records
    // For now, return a placeholder
    return farmRuns.reduce((total, run) => {
      return total + (run.steps?.length || 0) * 10; // Placeholder: 10 yield per step
    }, 0);
  };

  if (loading) {
    return (
      <div className="farm-run-log-container">
        <div className="loading-spinner">Loading farm runs...</div>
      </div>
    );
  }

  return (
    <div className="farm-run-log-container">
      {/* Summary Section - First Row, Full Width */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>Total Farm Runs</h3>
          <div className="summary-value">{farmRuns.length}</div>
        </div>
        <div className="summary-card">
          <h3>Total Steps</h3>
          <div className="summary-value">
            {farmRuns.reduce((total, run) => total + (run.steps?.length || 0), 0)}
          </div>
        </div>
        <div className="summary-card">
          <h3>Total Yield</h3>
          <div className="summary-value">{getTotalYield()}</div>
        </div>
        <div className="summary-card add-button-card">
          <button className="add-farm-run-button" onClick={handleAddFarmRun}>
            <span className="add-icon">+</span>
            <span>Add Farm Run</span>
          </button>
        </div>
      </div>

      {/* Main Content - Second Row, Two Columns */}
      <div className="main-content">
        {/* Farm Runs Table - Left Column */}
        <div className="farm-runs-table-container">
          <h3>Farm Runs</h3>
          <div className="table-container">
            <table className="farm-runs-table">
              <thead>
                <tr>
                  <th>Start Time</th>
                  <th>Duration</th>
                  <th>Steps</th>
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {farmRuns.map((farmRun) => (
                  <tr
                    key={farmRun.id}
                    className={`farm-run-row ${selectedFarmRun?.id === farmRun.id ? 'selected' : ''}`}
                    onClick={() => handleFarmRunSelect(farmRun)}
                  >
                    <td>{formatDate(farmRun.start)}</td>
                    <td>{calculateDuration(farmRun.start, farmRun.end)}</td>
                    <td>{farmRun.steps?.length || 0}</td>
                    <td>
                      <div className="tags-container">
                        {farmRun.tags?.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Farm Run Details - Right Column */}
        <div className="farm-run-details-container">
          <h3>Farm Run Details</h3>
          {selectedFarmRun ? (
            <div className="farm-run-details">
              <div className="detail-section">
                <h4>Run Information</h4>
                <div className="detail-item">
                  <span className="detail-label">Start:</span>
                  <span className="detail-value">{formatDate(selectedFarmRun.start)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">End:</span>
                  <span className="detail-value">{formatDate(selectedFarmRun.end)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{calculateDuration(selectedFarmRun.start, selectedFarmRun.end)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tags:</span>
                  <div className="tags-container">
                    {selectedFarmRun.tags?.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Steps ({selectedFarmRun.steps?.length || 0})</h4>
                {selectedFarmRun.steps && selectedFarmRun.steps.length > 0 ? (
                  <div className="steps-list">
                    {selectedFarmRun.steps.map((step) => (
                      <div key={step.id} className="step-item">
                        <div className="step-header">
                          <span className="step-id">Step {step.id}</span>
                          <span className="step-duration">
                            {calculateDuration(step.start, step.end)}
                          </span>
                        </div>
                        <div className="step-details">
                          <div className="step-detail">
                            <span className="step-label">Patch ID:</span>
                            <span className="step-value">{step.patchId}</span>
                          </div>
                          <div className="step-detail">
                            <span className="step-label">Change Record ID:</span>
                            <span className="step-value">{step.seedChangeRecordId || 'N/A'}</span>
                          </div>
                          <div className="step-detail">
                            <span className="step-label">Start:</span>
                            <span className="step-value">{formatDate(step.start)}</span>
                          </div>
                          <div className="step-detail">
                            <span className="step-label">End:</span>
                            <span className="step-value">{formatDate(step.end)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-steps">No steps recorded for this farm run.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a farm run to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FarmRunLog;
