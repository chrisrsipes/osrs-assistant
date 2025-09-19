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
  const [selectedPatchType, setSelectedPatchType] = useState('');
  const [selectedPatchDiscriminator, setSelectedPatchDiscriminator] = useState('');
  const [selectedPatch, setSelectedPatch] = useState('');
  const [selectedSeed, setSelectedSeed] = useState('');
  const [action, setAction] = useState('plant');
  const [amount, setAmount] = useState('');
  const [stepStart, setStepStart] = useState('');
  const [stepEnd, setStepEnd] = useState('');
  const [stepNotes, setStepNotes] = useState('');

  const getCurrentDateTime = () => {
    const now = new Date();
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const initializePage = async () => {
      await loadInitialData();
      await createFarmRun();
      // Initialize step times with current time
      setStepStart(getCurrentDateTime());
      setStepEnd(getCurrentDateTime());
    };
    
    initializePage();
    
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
      console.log('Creating farm run...');
      const now = new Date().toISOString();
      const farmRunData = {
        start: now,
        tags: ['manual']
      };
      
      console.log('Farm run data:', farmRunData);
      const response = await apiService.farmRuns.create(farmRunData);
      console.log('Farm run created:', response);
      
      if (response && response.id) {
        setFarmRun(response);
        console.log('Farm run state set:', response);
      } else {
        console.error('Invalid farm run response:', response);
        setError('Invalid farm run response from server');
      }
    } catch (err) {
      setError('Failed to create farm run: ' + err.message);
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
    setSelectedPatchType('');
    setSelectedPatchDiscriminator('');
    setSelectedPatch('');
  };

  const handlePatchTypeChange = (patchType) => {
    setSelectedPatchType(patchType);
    setSelectedPatchDiscriminator('');
    setSelectedPatch('');
  };

  const handlePatchDiscriminatorChange = (discriminator) => {
    setSelectedPatchDiscriminator(discriminator);
    // Find the patch that matches location, type, and discriminator
    const patch = patches.find(p => 
      p.location === selectedLocation && 
      p.patchType === selectedPatchType && 
      p.patchDiscriminator === discriminator
    );
    if (patch) {
      setSelectedPatch(patch.id.toString());
    }
  };

  const resetStepForm = () => {
    setSelectedLocation('');
    setSelectedPatchType('');
    setSelectedPatchDiscriminator('');
    setSelectedPatch('');
    setSelectedSeed('');
    setAction('plant');
    setAmount('');
    setStepStart(getCurrentDateTime());
    setStepEnd(getCurrentDateTime());
    setStepNotes('');
  };

  const handleAddStep = async () => {
    if (!selectedLocation || !selectedPatchType || !selectedPatchDiscriminator || !selectedPatch || !selectedSeed || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (!farmRun || !farmRun.id) {
      setError('Farm run not created yet. Please wait and try again.');
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
        notes: stepNotes || `Farm run step: ${action} ${amount} ${seeds.find(s => s.id === parseInt(selectedSeed))?.seedName || 'seeds'}`
      };

      const changeRecordResponse = await apiService.seeds.createChangeRecord(seedChangeData);
      
      // Create farm run step with proper timestamps
      const stepData = {
        farmRunId: farmRun.id,
        patchId: parseInt(selectedPatch),
        seedChangeRecordId: changeRecordResponse.data.changeRecord.id,
        start: stepStart || new Date().toISOString(),
        end: stepEnd || null
      };

      const stepResponse = await apiService.farmRuns.createStep(farmRun.id, stepData);
      
      // Add to local state with additional data for display
      const stepWithData = {
        ...stepResponse,
        action,
        amount: parseInt(amount),
        seedId: parseInt(selectedSeed),
        notes: stepNotes
      };
      setFarmRunSteps(prev => [...prev, stepWithData]);
      
      // Reset form and close modal
      resetStepForm();
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
      
      if (!farmRun || !farmRun.id) {
        setError('Farm run not found. Cannot save.');
        return;
      }
      
      const endTime = new Date().toISOString();
      const updateData = {
        end: endTime,
        tags: ['completed']
      };
      
      console.log('Updating farm run with ID:', farmRun.id);
      console.log('Update data:', updateData);
      
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

  const getFilteredPatchTypes = () => {
    if (selectedLocation) {
      const locationPatches = patches.filter(patch => patch.location === selectedLocation);
      return [...new Set(locationPatches.map(patch => patch.patchType))];
    }
    return [];
  };

  const getFilteredPatchDiscriminators = () => {
    if (selectedLocation && selectedPatchType) {
      const typePatches = patches.filter(patch => 
        patch.location === selectedLocation && patch.patchType === selectedPatchType
      );
      return [...new Set(typePatches.map(patch => patch.patchDiscriminator))];
    }
    return [];
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
        {farmRun && farmRun.id && (
          <p style={{color: 'green', fontSize: '0.9rem'}}>
            ✅ Farm Run ID: {farmRun.id} - Ready to add steps
          </p>
        )}
        {(!farmRun || !farmRun.id) && (
          <p style={{color: 'orange', fontSize: '0.9rem'}}>
            ⏳ Creating farm run... {loading && '(Please wait)'}
          </p>
        )}
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
          onClick={() => {
            // Set fresh current times when opening modal
            const currentTime = getCurrentDateTime();
            setStepStart(currentTime);
            setStepEnd(currentTime);
            setShowAddStepModal(true);
          }}
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
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Notes</th>
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
                      <td>{step.start ? new Date(step.start).toLocaleString() : 'N/A'}</td>
                      <td>{step.end ? new Date(step.end).toLocaleString() : 'N/A'}</td>
                      <td>{step.notes || 'N/A'}</td>
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
          disabled={loading || !farmRun || !farmRun.id}
        >
          💾 Save Farm Run {!farmRun || !farmRun.id ? '(No Farm Run)' : ''}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Location: *</label>
                  <select 
                    value={selectedLocation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Patch Type: *</label>
                  <select 
                    value={selectedPatchType}
                    onChange={(e) => handlePatchTypeChange(e.target.value)}
                    disabled={!selectedLocation}
                    required
                  >
                    <option value="">Select Patch Type</option>
                    {getFilteredPatchTypes().map(patchType => (
                      <option key={patchType} value={patchType}>{patchType}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Patch Discriminator: *</label>
                  <select 
                    value={selectedPatchDiscriminator}
                    onChange={(e) => handlePatchDiscriminatorChange(e.target.value)}
                    disabled={!selectedLocation || !selectedPatchType}
                    required
                  >
                    <option value="">Select Patch Discriminator</option>
                    {getFilteredPatchDiscriminators().map(discriminator => (
                      <option key={discriminator} value={discriminator}>{discriminator}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Seed: *</label>
                  <select 
                    value={selectedSeed}
                    onChange={(e) => setSelectedSeed(e.target.value)}
                    required
                  >
                    <option value="">Select Seed</option>
                    {seeds.map(seed => (
                      <option key={seed.id} value={seed.id}>{seed.seedName}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Action: *</label>
                  <select 
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    required
                  >
                    <option value="plant">Plant</option>
                    <option value="harvest">Harvest</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Amount: *</label>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Start Time:</label>
                  <input 
                    type="datetime-local"
                    value={stepStart}
                    onChange={(e) => setStepStart(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>End Time:</label>
                  <input 
                    type="datetime-local"
                    value={stepEnd}
                    onChange={(e) => setStepEnd(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Notes:</label>
                  <input 
                    type="text"
                    value={stepNotes}
                    onChange={(e) => setStepNotes(e.target.value)}
                    placeholder="Optional notes"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="submit-button"
                onClick={handleAddStep}
                disabled={loading || !selectedLocation || !selectedPatchType || !selectedPatchDiscriminator || !selectedPatch || !selectedSeed || !amount}
              >
                {loading ? 'Adding...' : 'Save Step'}
              </button>
              <button 
                className="reset-button"
                onClick={resetStepForm}
                disabled={loading}
              >
                Reset
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
