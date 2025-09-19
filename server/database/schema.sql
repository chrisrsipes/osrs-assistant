-- SQLite Database Schema for OSRS Skilling Assistant
-- This file contains the table definitions for the application

-- Seeds table - stores seed information
CREATE TABLE IF NOT EXISTS seeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seed_name TEXT NOT NULL,
    yield_name TEXT NOT NULL,
    seed_type TEXT NOT NULL,
    required_farming_level INTEGER NOT NULL DEFAULT 1,
    average_yield_per_seed REAL NOT NULL DEFAULT 1.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed change records table - stores all inventory changes
CREATE TABLE IF NOT EXISTS seed_change_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seed_id INTEGER NOT NULL,
    change_type TEXT NOT NULL CHECK (change_type IN ('reconciliation', 'increment')),
    seed_count_change INTEGER NOT NULL,
    yield_count_change INTEGER NOT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT DEFAULT '',
    FOREIGN KEY (seed_id) REFERENCES seeds (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seeds_seed_type ON seeds(seed_type);
CREATE INDEX IF NOT EXISTS idx_seeds_farming_level ON seeds(required_farming_level);
CREATE INDEX IF NOT EXISTS idx_change_records_seed_id ON seed_change_records(seed_id);
CREATE INDEX IF NOT EXISTS idx_change_records_created_date ON seed_change_records(created_date);
CREATE INDEX IF NOT EXISTS idx_change_records_change_type ON seed_change_records(change_type);

-- Create trigger to update updated_at timestamp on seeds table
CREATE TRIGGER IF NOT EXISTS update_seeds_timestamp 
    AFTER UPDATE ON seeds
BEGIN
    UPDATE seeds SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
