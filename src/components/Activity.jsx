import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './Activity.css';

function Activity() {
  const [changeRecords, setChangeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeds, setSeeds] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [changeRecordsResponse, seedsResponse] = await Promise.all([
        apiService.seeds.getAllChangeRecords(),
        apiService.seeds.getAll()
      ]);
      
      setChangeRecords(changeRecordsResponse.data || []);
      setSeeds(seedsResponse.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  const getSeedName = (seedId) => {
    const seed = seeds.find(s => s.id === seedId);
    return seed ? seed.seedName : `Seed ID: ${seedId}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getChangeTypeIcon = (changeType) => {
    return changeType === 'reconciliation' ? '🔄' : '➕';
  };

  const getChangeTypeLabel = (changeType) => {
    return changeType === 'reconciliation' ? 'Reconciliation' : 'Increment';
  };

  if (loading) {
    return (
      <div className="activity-container">
        <div className="activity-header">
          <h3>Activity Log</h3>
          <p>All farming inventory changes</p>
        </div>
        <div className="loading">Loading activity...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-container">
        <div className="activity-header">
          <h3>Activity Log</h3>
          <p>All farming inventory changes</p>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="activity-container">
      <div className="activity-header">
        <h3>Activity Log</h3>
        <p>All farming inventory changes</p>
        <div className="activity-stats">
          <span className="stat-item">
            <strong>{changeRecords.length}</strong> total changes
          </span>
          <span className="stat-item">
            <strong>{seeds.length}</strong> seed types
          </span>
        </div>
      </div>

      <div className="activity-list">
        {changeRecords.length === 0 ? (
          <div className="no-activity">
            <div className="no-activity-icon">📝</div>
            <h4>No Activity Yet</h4>
            <p>Start by updating your farming inventory to see activity here.</p>
          </div>
        ) : (
          changeRecords
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            .map((record) => (
              <div key={record.id} className="activity-item">
                <div className="activity-icon">
                  {getChangeTypeIcon(record.changeType)}
                </div>
                <div className="activity-content">
                  <div className="activity-header-item">
                    <h4>{getSeedName(record.seedId)}</h4>
                    <span className="change-type">
                      {getChangeTypeIcon(record.changeType)} {getChangeTypeLabel(record.changeType)}
                    </span>
                  </div>
                  <div className="activity-details">
                    <div className="change-details">
                      <span className="change-item">
                        <strong>Seeds:</strong> {record.seedCountChange > 0 ? '+' : ''}{record.seedCountChange}
                      </span>
                      <span className="change-item">
                        <strong>Yields:</strong> {record.yieldCountChange > 0 ? '+' : ''}{record.yieldCountChange}
                      </span>
                    </div>
                    {record.notes && (
                      <div className="activity-notes">
                        <strong>Notes:</strong> {record.notes}
                      </div>
                    )}
                    <div className="activity-date">
                      {formatDate(record.createdDate)}
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Activity;
