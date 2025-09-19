/**
 * SQLite Database Implementation
 * Replaces the in-memory database with persistent SQLite storage
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database configuration
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'osrs_skilling_assistant.db');

class SQLiteDatabase {
  constructor() {
    this.db = null;
    this.isConnected = false;
  }

  /**
   * Initialize database connection
   */
  async init() {
    if (this.isConnected) return;

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('❌ Error opening database:', err.message);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          this.isConnected = true;
          resolve();
        }
      });
    });
  }

  /**
   * Ensure database connection is established
   */
  async ensureConnection() {
    if (!this.isConnected) {
      await this.init();
    }
  }

  /**
   * Get all seeds with current counts calculated from change records
   */
  async getAll() {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          s.id,
          s.seed_name as seedName,
          s.yield_name as yieldName,
          s.seed_type as seedType,
          s.required_farming_level as requiredFarmingLevel,
          s.average_yield_per_seed as averageYieldPerSeed,
          COALESCE(seed_counts.current_seed_count, 0) as seedCount,
          COALESCE(seed_counts.current_yield_count, 0) as yieldCount
        FROM seeds s
        LEFT JOIN (
          SELECT 
            seed_id,
            SUM(CASE 
              WHEN change_type = 'reconciliation' THEN seed_count_change
              WHEN change_type = 'increment' THEN seed_count_change
              ELSE 0
            END) as current_seed_count,
            SUM(CASE 
              WHEN change_type = 'reconciliation' THEN yield_count_change
              WHEN change_type = 'increment' THEN yield_count_change
              ELSE 0
            END) as current_yield_count
          FROM seed_change_records
          GROUP BY seed_id
        ) seed_counts ON s.id = seed_counts.seed_id
        ORDER BY s.id
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          console.error('Error fetching seeds:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Get seed by ID with current counts
   */
  async getById(id) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          s.id,
          s.seed_name as seedName,
          s.yield_name as yieldName,
          s.seed_type as seedType,
          s.required_farming_level as requiredFarmingLevel,
          s.average_yield_per_seed as averageYieldPerSeed,
          COALESCE(seed_counts.current_seed_count, 0) as seedCount,
          COALESCE(seed_counts.current_yield_count, 0) as yieldCount
        FROM seeds s
        LEFT JOIN (
          SELECT 
            seed_id,
            SUM(CASE 
              WHEN change_type = 'reconciliation' THEN seed_count_change
              WHEN change_type = 'increment' THEN seed_count_change
              ELSE 0
            END) as current_seed_count,
            SUM(CASE 
              WHEN change_type = 'reconciliation' THEN yield_count_change
              WHEN change_type = 'increment' THEN yield_count_change
              ELSE 0
            END) as current_yield_count
          FROM seed_change_records
          WHERE seed_id = ?
          GROUP BY seed_id
        ) seed_counts ON s.id = seed_counts.seed_id
        WHERE s.id = ?
      `;

      this.db.get(query, [id, id], (err, row) => {
        if (err) {
          console.error('Error fetching seed:', err.message);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  /**
   * Create new seed
   */
  async create(seedData) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO seeds (seed_name, yield_name, seed_type, required_farming_level, average_yield_per_seed)
        VALUES (?, ?, ?, ?, ?)
      `;

      this.db.run(query, [
        seedData.seedName,
        seedData.yieldName,
        seedData.seedType,
        seedData.requiredFarmingLevel,
        seedData.averageYieldPerSeed || 1
      ], function(err) {
        if (err) {
          console.error('Error creating seed:', err.message);
          reject(err);
        } else {
          // Create initial reconciliation record if counts are provided
          if (seedData.seedCount !== undefined || seedData.yieldCount !== undefined) {
            const changeQuery = `
              INSERT INTO seed_change_records (seed_id, change_type, seed_count_change, yield_count_change, created_date, notes)
              VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            this.db.run(changeQuery, [
              this.lastID,
              'reconciliation',
              seedData.seedCount || 0,
              seedData.yieldCount || 0,
              new Date().toISOString(),
              'Initial seed creation'
            ], (err) => {
              if (err) {
                console.error('Error creating initial change record:', err.message);
                reject(err);
              } else {
                resolve({ id: this.lastID, ...seedData });
              }
            });
          } else {
            resolve({ id: this.lastID, ...seedData });
          }
        }
      });
    });
  }

  /**
   * Update seed (only non-count fields)
   */
  async update(id, updateData) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const allowedFields = ['seedName', 'yieldName', 'seedType', 'requiredFarmingLevel', 'averageYieldPerSeed'];
      const updates = [];
      const values = [];

      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          updates.push(`${dbField} = ?`);
          values.push(updateData[key]);
        }
      });

      if (updates.length === 0) {
        // No valid fields to update, just return current seed
        this.getById(id).then(resolve).catch(reject);
        return;
      }

      values.push(id);
      const query = `UPDATE seeds SET ${updates.join(', ')} WHERE id = ?`;

      this.db.run(query, values, function(err) {
        if (err) {
          console.error('Error updating seed:', err.message);
          reject(err);
        } else if (this.changes === 0) {
          resolve(null); // No rows updated
        } else {
          // Return updated seed
          this.getById(id).then(resolve).catch(reject);
        }
      }.bind(this));
    });
  }

  /**
   * Delete seed by ID
   */
  async delete(id) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      // First get the seed to return it
      this.getById(id).then(seed => {
        if (!seed) {
          resolve(null);
          return;
        }

        // Delete the seed (change records will be deleted by CASCADE)
        const query = 'DELETE FROM seeds WHERE id = ?';
        this.db.run(query, [id], function(err) {
          if (err) {
            console.error('Error deleting seed:', err.message);
            reject(err);
          } else {
            resolve(seed);
          }
        });
      }).catch(reject);
    });
  }

  /**
   * Add change record
   */
  async addChangeRecord(changeRecordData) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO seed_change_records (seed_id, change_type, seed_count_change, yield_count_change, created_date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      this.db.run(query, [
        changeRecordData.seedId,
        changeRecordData.changeType,
        changeRecordData.seedCountChange,
        changeRecordData.yieldCountChange,
        changeRecordData.createdDate || new Date().toISOString(),
        changeRecordData.notes || ''
      ], function(err) {
        if (err) {
          console.error('Error adding change record:', err.message);
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            ...changeRecordData
          });
        }
      });
    });
  }

  /**
   * Get change records for a specific seed
   */
  async getChangeRecords(seedId) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          id,
          seed_id as seedId,
          change_type as changeType,
          seed_count_change as seedCountChange,
          yield_count_change as yieldCountChange,
          created_date as createdDate,
          notes
        FROM seed_change_records
        WHERE seed_id = ?
        ORDER BY created_date DESC
      `;

      this.db.all(query, [seedId], (err, rows) => {
        if (err) {
          console.error('Error fetching change records:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Get all change records
   */
  async getAllChangeRecords() {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          id,
          seed_id as seedId,
          change_type as changeType,
          seed_count_change as seedCountChange,
          yield_count_change as yieldCountChange,
          created_date as createdDate,
          notes
        FROM seed_change_records
        ORDER BY created_date DESC
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          console.error('Error fetching all change records:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Reset database to initial state
   */
  async reset() {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      // Clear all data
      this.db.exec(`
        DELETE FROM seed_change_records;
        DELETE FROM seeds;
      `, (err) => {
        if (err) {
          console.error('Error resetting database:', err.message);
          reject(err);
        } else {
          console.log('Database reset completed');
          resolve([]);
        }
      });
    });
  }

  // ==================== FARM RUN METHODS ====================

  /**
   * Get all farm runs with their steps
   */
  async getAllFarmRunsWithSteps() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          fr.id,
          fr.start,
          fr.end,
          fr.tags,
          fr.created_at,
          fr.updated_at,
          frs.id as step_id,
          frs.start as step_start,
          frs.end as step_end,
          frs.patch_id,
          frs.seed_change_record_id,
          frs.created_at as step_created_at,
          frs.updated_at as step_updated_at
        FROM farm_runs fr
        LEFT JOIN farm_run_steps frs ON fr.id = frs.farm_run_id
        ORDER BY fr.start DESC, frs.id ASC
      `;

      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        // Group steps by farm run
        const farmRunsMap = new Map();
        
        rows.forEach(row => {
          const farmRunId = row.id;
          
          if (!farmRunsMap.has(farmRunId)) {
            farmRunsMap.set(farmRunId, {
              id: row.id,
              start: row.start,
              end: row.end,
              tags: JSON.parse(row.tags || '[]'),
              createdAt: row.created_at,
              updatedAt: row.updated_at,
              steps: []
            });
          }

          if (row.step_id) {
            farmRunsMap.get(farmRunId).steps.push({
              id: row.step_id,
              farmRunId: row.id,
              start: row.step_start,
              end: row.step_end,
              patchId: row.patch_id,
              seedChangeRecordId: row.seed_change_record_id,
              createdAt: row.step_created_at,
              updatedAt: row.step_updated_at
            });
          }
        });

        const farmRuns = Array.from(farmRunsMap.values());
        resolve(farmRuns);
      });
    });
  }

  /**
   * Get a specific farm run with its steps
   */
  async getFarmRunWithSteps(farmRunId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          fr.id,
          fr.start,
          fr.end,
          fr.tags,
          fr.created_at,
          fr.updated_at,
          frs.id as step_id,
          frs.start as step_start,
          frs.end as step_end,
          frs.patch_id,
          frs.seed_change_record_id,
          frs.created_at as step_created_at,
          frs.updated_at as step_updated_at
        FROM farm_runs fr
        LEFT JOIN farm_run_steps frs ON fr.id = frs.farm_run_id
        WHERE fr.id = ?
        ORDER BY frs.id ASC
      `;

      this.db.all(query, [farmRunId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        if (rows.length === 0) {
          resolve(null);
          return;
        }

        const farmRun = {
          id: rows[0].id,
          start: rows[0].start,
          end: rows[0].end,
          tags: JSON.parse(rows[0].tags || '[]'),
          createdAt: rows[0].created_at,
          updatedAt: rows[0].updated_at,
          steps: []
        };

        rows.forEach(row => {
          if (row.step_id) {
            farmRun.steps.push({
              id: row.step_id,
              farmRunId: row.id,
              start: row.step_start,
              end: row.step_end,
              patchId: row.patch_id,
              seedChangeRecordId: row.seed_change_record_id,
              createdAt: row.step_created_at,
              updatedAt: row.step_updated_at
            });
          }
        });

        resolve(farmRun);
      });
    });
  }

  /**
   * Create a new farm run
   */
  async createFarmRun(farmRunData) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO farm_runs (start, end, tags)
        VALUES (?, ?, ?)
      `;

      this.db.run(query, [
        farmRunData.start,
        farmRunData.end,
        JSON.stringify(farmRunData.tags || [])
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }

        const newFarmRun = {
          id: this.lastID,
          start: farmRunData.start,
          end: farmRunData.end,
          tags: farmRunData.tags || [],
          steps: []
        };

        resolve(newFarmRun);
      });
    });
  }

  /**
   * Update a farm run
   */
  async updateFarmRun(farmRunId, updateData) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE farm_runs 
        SET start = ?, end = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      this.db.run(query, [
        updateData.start,
        updateData.end,
        JSON.stringify(updateData.tags || []),
        farmRunId
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }

        if (this.changes === 0) {
          resolve(null);
          return;
        }

        // Return updated farm run
        this.getFarmRunWithSteps(farmRunId)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  /**
   * Delete a farm run
   */
  async deleteFarmRun(farmRunId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM farm_runs WHERE id = ?';

      this.db.run(query, [farmRunId], function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes > 0);
      });
    });
  }

  /**
   * Get farm run steps for a specific farm run
   */
  async getFarmRunSteps(farmRunId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM farm_run_steps 
        WHERE farm_run_id = ? 
        ORDER BY id ASC
      `;

      this.db.all(query, [farmRunId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      });
    });
  }

  /**
   * Create a new farm run step
   */
  async createFarmRunStep(stepData) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO farm_run_steps (farm_run_id, start, end, patch_id, seed_change_record_id)
        VALUES (?, ?, ?, ?, ?)
      `;

      this.db.run(query, [
        stepData.farmRunId,
        stepData.start,
        stepData.end,
        stepData.patchId,
        stepData.seedChangeRecordId
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }

        const newStep = {
          id: this.lastID,
          farmRunId: stepData.farmRunId,
          start: stepData.start,
          end: stepData.end,
          patchId: stepData.patchId,
          seedChangeRecordId: stepData.seedChangeRecordId
        };

        resolve(newStep);
      });
    });
  }

  /**
   * Close database connection
   */
  async close() {
    return new Promise((resolve) => {
      if (this.db && this.isConnected) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('Database connection closed');
          }
          this.isConnected = false;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

// Create singleton instance
const sqliteDatabase = new SQLiteDatabase();

module.exports = sqliteDatabase;
