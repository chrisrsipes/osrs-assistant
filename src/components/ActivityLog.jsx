import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './ActivityLog.css';

const ActivityLog = ({ seedId, seedName }) => {
  const [changeRecords, setChangeRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (seedId) {
      loadChangeRecords();
    }
  }, [seedId]);

  const loadChangeRecords = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.seeds.getChangeRecords(seedId);
      setChangeRecords(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load activity log');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatChange = (record) => {
    const seedChange = record.seedCountChange;
    const yieldChange = record.yieldCountChange;
    
    if (record.changeType === 'reconciliation') {
      return `Set to ${seedChange} seeds, ${yieldChange} yields`;
    } else {
      const seedText = seedChange > 0 ? `+${seedChange}` : seedChange.toString();
      const yieldText = yieldChange > 0 ? `+${yieldChange}` : yieldChange.toString();
      return `Seeds: ${seedText}, Yields: ${yieldText}`;
    }
  };

  const getChangeIcon = (record) => {
    if (record.changeType === 'reconciliation') {
      return '🔄';
    } else if (record.seedCountChange > 0 || record.yieldCountChange > 0) {
      return '📈';
    } else {
      return '📉';
    }
  };

  if (isLoading) {
    return (
      <div className="activity-log">
        <h3>Activity Log for {seedName}</h3>
        <div className="loading">Loading activity log...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-log">
        <h3>Activity Log for {seedName}</h3>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="activity-log">
      <div className="activity-header">
        <h3>Activity Log for {seedName}</h3>
        <button onClick={loadChangeRecords} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      {changeRecords.length === 0 ? (
        <div className="no-activity">
          No activity recorded yet. Changes will appear here when you update the inventory.
        </div>
      ) : (
        <div className="activity-list">
          {changeRecords.map((record) => (
            <div key={record.id} className="activity-item">
              <div className="activity-icon">
                {getChangeIcon(record)}
              </div>
              <div className="activity-content">
                <div className="activity-change">
                  <span className="change-type">
                    {record.changeType === 'reconciliation' ? 'Reconciliation' : 'Inventory Change'}
                  </span>
                  <span className="change-details">
                    {formatChange(record)}
                  </span>
                </div>
                <div className="activity-meta">
                  <span className="activity-date">
                    {formatDate(record.createdDate)}
                  </span>
                  {record.notes && (
                    <span className="activity-notes">
                      "{record.notes}"
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
