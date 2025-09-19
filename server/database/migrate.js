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
      
      const seedsData = JSON.parse(fs.readFileSync(SEEDS_DATA_PATH, 'utf8'));
      
      const stmt = this.db.prepare(`
        INSERT INTO seeds (seed_name, yield_name, seed_type, required_farming_level, average_yield_per_seed)
        VALUES (?, ?, ?, ?, ?)
      `);

      let completed = 0;
      const total = seedsData.length;

      seedsData.forEach((seed, index) => {
        stmt.run([
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
          resolve();
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
