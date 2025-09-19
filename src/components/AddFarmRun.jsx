import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './AddFarmRun.css';

function AddFarmRun() {
  const navigate = useNavigate();
  const [farmRun, setFarmRun] = useState(null);
  const [farmRunSteps, setFarmRunSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [pauseTime, setPauseTime] = useState(0);
  const intervalRef = useRef(null);
  
  // Modal state
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [patches, setPatches] = useState([]);
  const [seeds, setSeeds] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPatch, setSelectedPatch] = useState('');
  const [selectedSeed, setSelectedSeed] = useState('');
  const [action, setAction] = useState('plant');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    loadInitialData();
    createFarmRun();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [patchesResponse, seedsResponse] = await Promise.all([
        apiService.farmPatches.getAll(),
        apiService.seeds.getAll()
      ]);
      
      setPatches(patchesResponse.data || []);
      setSeeds(seedsResponse.data || []);
      
      // Extract unique locations
      const uniqueLocations = [...new Set(patchesResponse.data?.map(patch => patch.location) || [])];
      setLocations(uniqueLocations);
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createFarmRun = async () => {
    try {
      const now = new Date().toISOString();
      const farmRunData = {
        start: now,
        tags: ['manual']
      };
      
      const response = await apiService.farmRuns.create(farmRunData);
      setFarmRun(response.data);
    } catch (err) {
      setError('Failed to create farm run');
      console.error('Error creating farm run:', err);
    }
  };

  const startStopwatch = () => {
    if (!isRunning && !isPaused) {
      // Starting fresh
      const now = Date.now();
      setStartTime(now);
      setIsRunning(true);
      setElapsedTime(0);
      setPauseTime(0);
    } else if (isPaused) {
      // Resuming from pause - continue from current elapsed time
      const now = Date.now();
      setStartTime(now - elapsedTime);
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const pauseStopwatch = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(true);
      // Don't update pauseTime here, keep the current elapsed time
    }
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setStartTime(null);
    setPauseTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setSelectedPatch('');
  };

  const handlePatchChange = (patchId) => {
    setSelectedPatch(patchId);
    // Auto-select location based on patch
    const patch = patches.find(p => p.id === parseInt(patchId));
    if (patch) {
      setSelectedLocation(patch.location);
    }
  };

  const handleAddStep = async () => {
    if (!selectedPatch || !selectedSeed || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Create seed change record first
      const seedChangeData = {
        seedId: parseInt(selectedSeed),
        changeType: action === 'plant' ? 'increment' : 'increment',
        seedCountChange: action === 'plant' ? -parseInt(amount) : 0,
        yieldCountChange: action === 'harvest' ? parseInt(amount) : 0,
        notes: `Farm run step: ${action} ${amount} ${seeds.find(s => s.id === parseInt(selectedSeed))?.seedName || 'seeds'}`
      };

      const changeRecordResponse = await apiService.seeds.createChangeRecord(seedChangeData);
      
      // Create farm run step
      const stepData = {
        farmRunId: farmRun.id,
        patchId: parseInt(selectedPatch),
        seedChangeRecordId: changeRecordResponse.data.id,
        start: new Date().toISOString()
      };

      const stepResponse = await apiService.farmRuns.createStep(farmRun.id, stepData);
      
      // Add to local state with additional data for display
      const stepWithData = {
        ...stepResponse.data,
        action,
        amount: parseInt(amount),
        seedId: parseInt(selectedSeed)
      };
      setFarmRunSteps(prev => [...prev, stepWithData]);
      
      // Reset form
      setSelectedLocation('');
      setSelectedPatch('');
      setSelectedSeed('');
      setAmount('');
      setShowAddStepModal(false);
      
    } catch (err) {
      setError('Failed to create farm run step');
      console.error('Error creating farm run step:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFarmRun = async () => {
    try {
      setLoading(true);
      
      const endTime = new Date().toISOString();
      const updateData = {
        end: endTime,
        tags: ['completed']
      };
      
      await apiService.farmRuns.update(farmRun.id, updateData);
      
      // Navigate back to farm run log
      navigate('/farming/farm-run-log');
      
    } catch (err) {
      setError('Failed to save farm run');
      console.error('Error saving farm run:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update elapsed time
  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        const newElapsedTime = Date.now() - startTime;
        setElapsedTime(newElapsedTime);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const getFilteredPatches = () => {
    if (selectedLocation) {
      return patches.filter(patch => patch.location === selectedLocation);
    }
    return patches;
  };

  if (loading && !farmRun) {
    return (
      <div className="add-farm-run-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-farm-run-page">
      <div className="add-farm-run-header">
        <h2>Add New Farm Run</h2>
        <p>Track your farming session with stopwatch and manage farm run steps</p>
      </div>

      {/* Stopwatch Section - 2 Components */}
      <div className="stopwatch-section">
        <div className="stopwatch-controls">
          <button 
            className={`stopwatch-button ${isRunning ? 'pause' : 'start'}`}
            onClick={isRunning ? pauseStopwatch : startStopwatch}
          >
            {isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          
          <button 
            className="stopwatch-button reset"
            onClick={resetStopwatch}
          >
            🔄 Reset
          </button>
        </div>
        
        <div className="stopwatch-display">
          <div className="time-display">
            {formatTime(elapsedTime)}
          </div>
        </div>
      </div>

      {/* Add Step Button */}
      <div className="add-step-section">
        <button 
          className="add-step-button"
          onClick={() => setShowAddStepModal(true)}
          disabled={!farmRun}
        >
          ➕ Add Farm Run Step
        </button>
      </div>

      {/* Farm Run Steps Table */}
      <div className="steps-table-section">
        <h3>Farm Run Steps</h3>
        <div className="steps-table-container">
          {farmRunSteps.length === 0 ? (
            <div className="no-steps">
              <p>No steps added yet. Click "Add Farm Run Step" to get started.</p>
            </div>
          ) : (
            <table className="steps-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Patch</th>
                  <th>Seed</th>
                  <th>Action</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {farmRunSteps.map((step, index) => {
                  const patch = patches.find(p => p.id === step.patchId);
                  const seed = seeds.find(s => s.id === step.seedId);
                  return (
                    <tr key={step.id || index}>
                      <td>{patch?.location || 'Unknown'}</td>
                      <td>{patch?.patchName || 'Unknown'}</td>
                      <td>{seed?.seedName || 'Unknown'}</td>
                      <td>{step.action || 'N/A'}</td>
                      <td>{step.amount || 'N/A'}</td>
                      <td>{step.start ? new Date(step.start).toLocaleTimeString() : 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="save-farm-run-button"
          onClick={handleSaveFarmRun}
          disabled={loading}
        >
          💾 Save Farm Run
        </button>
        
        <button 
          className="cancel-button"
          onClick={() => navigate('/farming/farm-run-log')}
        >
          ❌ Cancel
        </button>
      </div>

      {/* Add Step Modal */}
      {showAddStepModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Farm Run Step</h3>
              <button 
                className="close-button"
                onClick={() => setShowAddStepModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Location:</label>
                <select 
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Patch:</label>
                <select 
                  value={selectedPatch}
                  onChange={(e) => handlePatchChange(e.target.value)}
                >
                  <option value="">Select Patch</option>
                  {getFilteredPatches().map(patch => (
                    <option key={patch.id} value={patch.id}>{patch.patchName}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Seed:</label>
                <select 
                  value={selectedSeed}
                  onChange={(e) => setSelectedSeed(e.target.value)}
                >
                  <option value="">Select Seed</option>
                  {seeds.map(seed => (
                    <option key={seed.id} value={seed.id}>{seed.seedName}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Action:</label>
                <select 
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                >
                  <option value="plant">Plant</option>
                  <option value="harvest">Harvest</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Amount:</label>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="submit-button"
                onClick={handleAddStep}
                disabled={loading || !selectedPatch || !selectedSeed || !amount}
              >
                {loading ? 'Adding...' : 'Add Step'}
              </button>
              <button 
                className="cancel-button"
                onClick={() => setShowAddStepModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default AddFarmRun;
