import React, { useState, useEffect } from 'react';
import FarmPatch from '../models/FarmPatch';
import apiService from '../services/api';
import './Locations.css';

function Locations() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationPatches, setLocationPatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await apiService.farmPatches.getUniqueLocations();
      setLocations(response.data || []);
      
      // Select first location by default
      if (response.data && response.data.length > 0) {
        handleLocationSelect(response.data[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (location) => {
    try {
      setSelectedLocation(location);
      const response = await apiService.farmPatches.getByLocation(location);
      const patches = (response.data || []).map(patch => new FarmPatch(patch));
      setLocationPatches(patches);
    } catch (err) {
      setError(err.message || 'Failed to load location patches');
    }
  };

  const groupPatchesByType = (patches) => {
    const grouped = {};
    patches.forEach(patch => {
      if (!grouped[patch.patchType]) {
        grouped[patch.patchType] = [];
      }
      grouped[patch.patchType].push(patch);
    });
    return grouped;
  };

  const getPatchTypeIcon = (patchType) => {
    const icons = {
      'Allotment': '🌾',
      'Flower': '🌸',
      'Herb': '🌿',
      'Tree': '🌳',
      'Fruit Tree': '🍎',
      'Bush': '🫐',
      'Spirit Tree': '🌲',
      'Cactus': '🌵',
      'Mushroom': '🍄',
      'Belladonna': '🌺',
      'Evil Turnip': '🥕',
      'Hops': '🍺',
      'Calquat': '🍊',
      'Crystal': '💎',
      'Anima': '✨',
      'Redwood': '🌲'
    };
    return icons[patchType] || '🌱';
  };

  const getProtectionIcon = (isProtected) => {
    return isProtected ? '🛡️' : '🔓';
  };

  if (loading) {
    return (
      <div className="locations-container">
        <div className="locations-header">
          <h3>Farming Locations</h3>
          <p>Select a location to view its farm patches</p>
        </div>
        <div className="loading">Loading locations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="locations-container">
        <div className="locations-header">
          <h3>Farming Locations</h3>
          <p>Select a location to view its farm patches</p>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const groupedPatches = groupPatchesByType(locationPatches);

  return (
    <div className="locations-container">
      <div className="locations-header">
        <h3>Farming Locations</h3>
        <p>Select a location to view its farm patches</p>
      </div>

      <div className="locations-layout">
        {/* Left Column - Location List */}
        <div className="locations-list">
          <h4>Locations ({locations.length})</h4>
          <div className="location-items">
            {locations.map((location, index) => (
              <div
                key={index}
                className={`location-item ${selectedLocation === location ? 'active' : ''}`}
                onClick={() => handleLocationSelect(location)}
              >
                <span className="location-name">{location}</span>
                <span className="location-arrow">→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Location Details */}
        <div className="location-details">
          {selectedLocation ? (
            <div className="location-info">
              <div className="location-header">
                <h4>{selectedLocation}</h4>
                <span className="patch-count">
                  {locationPatches.length} patch{locationPatches.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {locationPatches.length === 0 ? (
                <div className="no-patches">
                  <div className="no-patches-icon">🌱</div>
                  <p>No patches found for this location</p>
                </div>
              ) : (
                <div className="patches-by-type">
                  {Object.entries(groupedPatches).map(([patchType, patches]) => (
                    <div key={patchType} className="patch-type-group">
                      <div className="patch-type-header">
                        <span className="patch-type-icon">
                          {getPatchTypeIcon(patchType)}
                        </span>
                        <span className="patch-type-name">{patchType}</span>
                        <span className="patch-type-count">
                          {patches.length} patch{patches.length !== 1 ? 'es' : ''}
                        </span>
                      </div>
                      
                      <div className="patch-list">
                        {patches.map((patch, index) => (
                          <div key={index} className="patch-item">
                            <div className="patch-main">
                              <span className="patch-discriminator">
                                {patch.patchDiscriminator}
                              </span>
                              <span className="patch-protection">
                                {getProtectionIcon(patch.automaticallyProtected)}
                              </span>
                            </div>
                            {patch.notes && (
                              <div className="patch-notes">
                                {patch.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">📍</div>
              <h4>Select a Location</h4>
              <p>Choose a location from the list to view its farm patches</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Locations;
