#!/usr/bin/env node

/**
 * Database Migration and Seeding Script
 * This script creates the SQLite database, runs migrations, and seeds initial data
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database configuration
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'osrs_skilling_assistant.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const SEEDS_DATA_PATH = path.join(__dirname, '..', '..', 'data', 'initial_seeds_data.json');
const CHANGE_RECORDS_DATA_PATH = path.join(__dirname, '..', '..', 'data', 'initial_change_records_data.json');
const FARM_PATCHES_DATA_PATH = path.join(__dirname, '..', '..', 'data', 'initial_farm_patches_data.json');
const FARM_RUNS_DATA_PATH = path.join(__dirname, '..', '..', 'data', 'initial_farm_runs_data.json');
const FARM_RUN_STEPS_DATA_PATH = path.join(__dirname, '..', '..', 'data', 'initial_farm_run_steps_data.json');

class DatabaseMigrator {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize database connection
   */
  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('❌ Error opening database:', err.message);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          resolve();
        }
      });
    });
  }

  /**
   * Run database migrations
   */
  async migrate() {
    return new Promise((resolve, reject) => {
      console.log('🔄 Running database migrations...');
      
      const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
      
      this.db.exec(schema, (err) => {
        if (err) {
          console.error('❌ Error running migrations:', err.message);
          reject(err);
        } else {
          console.log('✅ Database migrations completed');
          resolve();
        }
      });
    });
  }

  /**
   * Seed initial seeds data
   */
  async seedSeeds() {
    return new Promise((resolve, reject) => {
      console.log('🌱 Seeding initial seeds data...');
      
      // Clear existing seeds data first
      this.db.run('DELETE FROM seeds', (err) => {
        if (err) {
          console.error('❌ Error clearing seeds:', err.message);
          reject(err);
          return;
        }
        
        const seedsData = JSON.parse(fs.readFileSync(SEEDS_DATA_PATH, 'utf8'));
        
        const stmt = this.db.prepare(`
          INSERT INTO seeds (id, seed_name, yield_name, seed_type, required_farming_level, average_yield_per_seed)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        let completed = 0;
        const total = seedsData.length;

        seedsData.forEach((seed, index) => {
          stmt.run([
            seed.id,
            seed.seedName,
            seed.yieldName,
            seed.seedType,
            seed.requiredFarmingLevel,
            seed.averageYieldPerSeed
          ], (err) => {
            if (err) {
              console.error(`❌ Error inserting seed ${seed.seedName}:`, err.message);
              reject(err);
              return;
            }
            
            completed++;
            if (completed === total) {
              stmt.finalize();
              console.log(`✅ Seeded ${total} seeds`);
              resolve();
            }
          });
        });
      });
    });
  }

  /**
   * Seed initial change records data
   */
  async seedChangeRecords() {
    return new Promise((resolve, reject) => {
      console.log('📊 Seeding initial change records data...');
      
      const changeRecordsData = JSON.parse(fs.readFileSync(CHANGE_RECORDS_DATA_PATH, 'utf8'));
      
      // First, get all seeds to map names to IDs
      this.db.all('SELECT id, seed_name FROM seeds', (err, seeds) => {
        if (err) {
          console.error('❌ Error fetching seeds:', err.message);
          reject(err);
          return;
        }

        const seedMap = {};
        seeds.forEach(seed => {
          seedMap[seed.seed_name] = seed.id;
        });

        const stmt = this.db.prepare(`
          INSERT INTO seed_change_records (seed_id, change_type, seed_count_change, yield_count_change, created_date, notes)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        let completed = 0;
        const total = changeRecordsData.length;

        changeRecordsData.forEach((record, index) => {
          const seedId = seedMap[record.seedName];
          if (!seedId) {
            console.error(`❌ Seed not found: ${record.seedName}`);
            reject(new Error(`Seed not found: ${record.seedName}`));
            return;
          }

          stmt.run([
            seedId,
            'reconciliation',
            record.seedCount,
            record.yieldCount,
            new Date('2024-01-01T00:00:00.000Z').toISOString(),
            'Initial inventory reconciliation'
          ], (err) => {
            if (err) {
              console.error(`❌ Error inserting change record for ${record.seedName}:`, err.message);
              reject(err);
              return;
            }
            
            completed++;
            if (completed === total) {
              stmt.finalize();
              console.log(`✅ Seeded ${total} change records`);
              resolve();
            }
          });
        });
      });
    });
  }

  /**
   * Seed initial farm patches data
   */
  async seedFarmPatches() {
    return new Promise((resolve, reject) => {
      console.log('🌱 Seeding initial farm patches data...');
      
      // Clear existing farm patches data first
      this.db.run('DELETE FROM farm_patches', (err) => {
        if (err) {
          console.error('❌ Error clearing farm patches:', err.message);
          reject(err);
          return;
        }
        
        const farmPatchesData = JSON.parse(fs.readFileSync(FARM_PATCHES_DATA_PATH, 'utf8'));
        
        const stmt = this.db.prepare(`
          INSERT INTO farm_patches (id, location, patch_type, patch_discriminator, notes, automatically_protected)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        let completed = 0;
        const total = farmPatchesData.length;

        farmPatchesData.forEach((patch, index) => {
          stmt.run([
            patch.id,
            patch.location,
            patch.patchType,
            patch.patchDiscriminator,
            patch.notes || '',
            patch.automaticallyProtected ? 1 : 0
          ], (err) => {
            if (err) {
              console.error(`❌ Error inserting farm patch ${patch.location} ${patch.patchType}:`, err.message);
              reject(err);
              return;
            }
            
            completed++;
            if (completed === total) {
              stmt.finalize();
              console.log(`✅ Seeded ${total} farm patches`);
              resolve();
            }
          });
        });
      });
    });
  }

  /**
   * Seed initial farm runs data
   */
  async seedFarmRuns() {
    return new Promise((resolve, reject) => {
      console.log('🏃 Seeding initial farm runs data...');
      
      // Clear existing farm runs data first
      this.db.run('DELETE FROM farm_runs', (err) => {
        if (err) {
          console.error('❌ Error clearing farm runs:', err.message);
          reject(err);
          return;
        }
        
        const farmRunsData = JSON.parse(fs.readFileSync(FARM_RUNS_DATA_PATH, 'utf8'));
        
        const stmt = this.db.prepare(`
          INSERT INTO farm_runs (id, start, end, tags)
          VALUES (?, ?, ?, ?)
        `);

        let completed = 0;
        const total = farmRunsData.length;

        farmRunsData.forEach((farmRun, index) => {
          stmt.run([
            farmRun.id,
            farmRun.start,
            farmRun.end,
            JSON.stringify(farmRun.tags)
          ], (err) => {
            if (err) {
              console.error(`❌ Error inserting farm run ${farmRun.id}:`, err.message);
              reject(err);
              return;
            }
            
            completed++;
            if (completed === total) {
              stmt.finalize();
              console.log(`✅ Seeded ${total} farm runs`);
              resolve();
            }
          });
        });
      });
    });
  }

  /**
   * Seed initial farm run steps data
   */
  async seedFarmRunSteps() {
    return new Promise((resolve, reject) => {
      console.log('👣 Seeding initial farm run steps data...');
      
      // Clear existing farm run steps data first
      this.db.run('DELETE FROM farm_run_steps', (err) => {
        if (err) {
          console.error('❌ Error clearing farm run steps:', err.message);
          reject(err);
          return;
        }
        
        const farmRunStepsData = JSON.parse(fs.readFileSync(FARM_RUN_STEPS_DATA_PATH, 'utf8'));
        
        const stmt = this.db.prepare(`
          INSERT INTO farm_run_steps (id, farm_run_id, start, end, patch_id, seed_change_record_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        let completed = 0;
        const total = farmRunStepsData.length;

        farmRunStepsData.forEach((step, index) => {
          stmt.run([
            step.id,
            step.farmRunId,
            step.start,
            step.end,
            step.patchId,
            step.seedChangeRecordId
          ], (err) => {
            if (err) {
              console.error(`❌ Error inserting farm run step ${step.id}:`, err.message);
              reject(err);
              return;
            }
            
            completed++;
            if (completed === total) {
              stmt.finalize();
              console.log(`✅ Seeded ${total} farm run steps`);
              resolve();
            }
          });
        });
      });
    });
  }

  /**
   * Verify database state
   */
  async verify() {
    return new Promise((resolve, reject) => {
      console.log('🔍 Verifying database state...');
      
      this.db.get('SELECT COUNT(*) as count FROM seeds', (err, result) => {
        if (err) {
          console.error('❌ Error verifying seeds:', err.message);
          reject(err);
          return;
        }
        
        console.log(`📊 Seeds in database: ${result.count}`);
        
        this.db.get('SELECT COUNT(*) as count FROM seed_change_records', (err, result) => {
          if (err) {
            console.error('❌ Error verifying change records:', err.message);
            reject(err);
            return;
          }
          
          console.log(`📊 Change records in database: ${result.count}`);
          
          this.db.get('SELECT COUNT(*) as count FROM farm_patches', (err, result) => {
            if (err) {
              console.error('❌ Error verifying farm patches:', err.message);
              reject(err);
              return;
            }
            
            console.log(`📊 Farm patches in database: ${result.count}`);
            
            this.db.get('SELECT COUNT(*) as count FROM farm_runs', (err, result) => {
              if (err) {
                console.error('❌ Error verifying farm runs:', err.message);
                reject(err);
                return;
              }
              
              console.log(`📊 Farm runs in database: ${result.count}`);
              
              this.db.get('SELECT COUNT(*) as count FROM farm_run_steps', (err, result) => {
                if (err) {
                  console.error('❌ Error verifying farm run steps:', err.message);
                  reject(err);
                  return;
                }
                
                console.log(`📊 Farm run steps in database: ${result.count}`);
                resolve();
              });
            });
          });
        });
      });
    });
  }

  /**
   * Close database connection
   */
  async close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message);
          } else {
            console.log('✅ Database connection closed');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Run complete migration and seeding process
   */
  async run() {
    try {
      await this.init();
      await this.migrate();
      await this.seedSeeds();
      await this.seedChangeRecords();
      await this.seedFarmPatches();
      await this.seedFarmRuns();
      await this.seedFarmRunSteps();
      await this.verify();
      console.log('🎉 Database migration and seeding completed successfully!');
    } catch (error) {
      console.error('💥 Migration failed:', error.message);
      process.exit(1);
    } finally {
      await this.close();
    }
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  const migrator = new DatabaseMigrator();
  migrator.run();
}

module.exports = DatabaseMigrator;
