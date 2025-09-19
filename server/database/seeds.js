// SQLite Database Implementation
// This module now uses SQLite for persistent storage

const sqliteDatabase = require('./sqliteDatabase');

// Database operations - now using SQLite
const seedDatabase = {
  // Get all seeds with current counts
  getAll: async () => {
    try {
      return await sqliteDatabase.getAll();
    } catch (error) {
      console.error('Error getting all seeds:', error);
      throw error;
    }
  },

  // Get seed by ID with current counts
  getById: async (id) => {
    try {
      return await sqliteDatabase.getById(id);
    } catch (error) {
      console.error('Error getting seed by ID:', error);
      throw error;
    }
  },

  // Create new seed
  create: async (seedData) => {
    try {
      return await sqliteDatabase.create(seedData);
    } catch (error) {
      console.error('Error creating seed:', error);
      throw error;
    }
  },

  // Update seed by ID (only non-count fields)
  update: async (id, updateData) => {
    try {
      return await sqliteDatabase.update(id, updateData);
    } catch (error) {
      console.error('Error updating seed:', error);
      throw error;
    }
  },

  // Delete seed by ID
  delete: async (id) => {
    try {
      return await sqliteDatabase.delete(id);
    } catch (error) {
      console.error('Error deleting seed:', error);
      throw error;
    }
  },

  // Add change record
  addChangeRecord: async (changeRecordData) => {
    try {
      return await sqliteDatabase.addChangeRecord(changeRecordData);
    } catch (error) {
      console.error('Error adding change record:', error);
      throw error;
    }
  },

  // Get change records for a seed
  getChangeRecords: async (seedId) => {
    try {
      return await sqliteDatabase.getChangeRecords(seedId);
    } catch (error) {
      console.error('Error getting change records:', error);
      throw error;
    }
  },

  // Get all change records
  getAllChangeRecords: async () => {
    try {
      return await sqliteDatabase.getAllChangeRecords();
    } catch (error) {
      console.error('Error getting all change records:', error);
      throw error;
    }
  },

  // Reset to initial data
  reset: async () => {
    try {
      await sqliteDatabase.reset();
      // Re-run migration to repopulate with initial data
      const DatabaseMigrator = require('./migrate');
      const migrator = new DatabaseMigrator();
      await migrator.init();
      await migrator.seedSeeds();
      await migrator.seedChangeRecords();
      await migrator.close();
      return await sqliteDatabase.getAll();
    } catch (error) {
      console.error('Error resetting database:', error);
      throw error;
    }
  }
};

module.exports = seedDatabase;