import React, { useState } from 'react';
import apiService from '../services/api';
import './InventoryChangeModal.css';

const InventoryChangeModal = ({ seed, isOpen, onClose, onSuccess }) => {
  const [changeType, setChangeType] = useState('increment');
  const [seedCountChange, setSeedCountChange] = useState('');
  const [yieldCountChange, setYieldCountChange] = useState('');
  const [seedCountSign, setSeedCountSign] = useState('-');
  const [yieldCountSign, setYieldCountSign] = useState('+');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !seed) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const seedCountValue = parseFloat(seedCountChange) || 0;
      const yieldCountValue = parseFloat(yieldCountChange) || 0;
      
      // Apply signs for increment changes
      let seedCount = seedCountValue;
      let yieldCount = yieldCountValue;
      
      if (changeType === 'increment') {
        seedCount = seedCountSign === '-' ? -seedCountValue : seedCountValue;
        yieldCount = yieldCountSign === '-' ? -yieldCountValue : yieldCountValue;
        
        // Check if increment would result in negative values
        const newSeedCount = seed.seedCount + seedCount;
        const newYieldCount = seed.yieldCount + yieldCount;
        
        if (newSeedCount < 0) {
          setError(`Cannot reduce seed count below 0. Current: ${seed.seedCount}, Change: ${seedCount}`);
          setIsLoading(false);
          return;
        }
        
        if (newYieldCount < 0) {
          setError(`Cannot reduce yield count below 0. Current: ${seed.yieldCount}, Change: ${yieldCount}`);
          setIsLoading(false);
          return;
        }
      } else {
        // For reconciliation, check that values are not negative
        if (seedCount < 0) {
          setError('Seed count cannot be negative');
          setIsLoading(false);
          return;
        }
        
        if (yieldCount < 0) {
          setError('Yield count cannot be negative');
          setIsLoading(false);
          return;
        }
      }

      if (changeType === 'reconciliation') {
        await apiService.seeds.reconcile(seed.id, seedCount, yieldCount, notes);
      } else {
        await apiService.seeds.increment(seed.id, seedCount, yieldCount, notes);
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to record change');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setChangeType('increment');
    setSeedCountChange('');
    setYieldCountChange('');
    setSeedCountSign('-');
    setYieldCountSign('+');
    setNotes('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update {seed.seedName} Inventory</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="change-form">
          <div className="form-group">
            <label htmlFor="changeType">Change Type</label>
            <select
              id="changeType"
              value={changeType}
              onChange={(e) => setChangeType(e.target.value)}
              required
            >
              <option value="increment">Increment (Add/Subtract)</option>
              <option value="reconciliation">Reconciliation (Set Absolute Values)</option>
            </select>
            <small className="help-text">
              {changeType === 'increment' 
                ? 'Enter positive numbers to add, negative to subtract'
                : 'Enter the exact current inventory counts'
              }
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="seedCountChange">
                {changeType === 'increment' ? 'Seed Count Change' : 'Seed Count'}
              </label>
              <div className="input-with-select">
                {changeType === 'increment' && (
                  <select
                    value={seedCountSign}
                    onChange={(e) => setSeedCountSign(e.target.value)}
                    className="sign-select"
                  >
                    <option value="+">+</option>
                    <option value="-">-</option>
                  </select>
                )}
                <input
                  type="number"
                  id="seedCountChange"
                  value={seedCountChange}
                  onChange={(e) => setSeedCountChange(e.target.value)}
                  placeholder={changeType === 'increment' ? 'e.g., 5' : 'e.g., 100'}
                  required
                  min="0"
                />
              </div>
              {changeType === 'increment' && seedCountChange && (
                <div className={`result-preview ${(seed.seedCount + (seedCountSign === '-' ? -parseFloat(seedCountChange) : parseFloat(seedCountChange))) < 0 ? 'negative' : ''}`}>
                  Current: {seed.seedCount} → New: {seed.seedCount + (seedCountSign === '-' ? -parseFloat(seedCountChange) : parseFloat(seedCountChange))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="yieldCountChange">
                {changeType === 'increment' ? 'Yield Count Change' : 'Yield Count'}
              </label>
              <div className="input-with-select">
                {changeType === 'increment' && (
                  <select
                    value={yieldCountSign}
                    onChange={(e) => setYieldCountSign(e.target.value)}
                    className="sign-select"
                  >
                    <option value="+">+</option>
                    <option value="-">-</option>
                  </select>
                )}
                <input
                  type="number"
                  id="yieldCountChange"
                  value={yieldCountChange}
                  onChange={(e) => setYieldCountChange(e.target.value)}
                  placeholder={changeType === 'increment' ? 'e.g., 42' : 'e.g., 500'}
                  required
                  min="0"
                />
              </div>
              {changeType === 'increment' && yieldCountChange && (
                <div className={`result-preview ${(seed.yieldCount + (yieldCountSign === '-' ? -parseFloat(yieldCountChange) : parseFloat(yieldCountChange))) < 0 ? 'negative' : ''}`}>
                  Current: {seed.yieldCount} → New: {seed.yieldCount + (yieldCountSign === '-' ? -parseFloat(yieldCountChange) : parseFloat(yieldCountChange))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Planted 5 seeds, harvested 42 yields"
              rows="3"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Recording...' : 'Record Change'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryChangeModal;
