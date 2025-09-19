const express = require('express');
const seedDatabase = require('../database/seeds');

const router = express.Router();

// Validation middleware
const validateSeed = (req, res, next) => {
  const { seedName, yieldName, seedType, requiredFarmingLevel } = req.body;
  
  if (!seedName || typeof seedName !== 'string') {
    return res.status(400).json({ error: 'seedName is required and must be a string' });
  }
  
  if (!yieldName || typeof yieldName !== 'string') {
    return res.status(400).json({ error: 'yieldName is required and must be a string' });
  }
  
  if (!seedType || typeof seedType !== 'string') {
    return res.status(400).json({ error: 'seedType is required and must be a string' });
  }
  
  if (requiredFarmingLevel === undefined || typeof requiredFarmingLevel !== 'number' || requiredFarmingLevel < 0) {
    return res.status(400).json({ error: 'requiredFarmingLevel is required and must be a non-negative number' });
  }
  
  next();
};

// GET /api/seeds - Get all seeds
router.get('/', (req, res) => {
  try {
    const seeds = seedDatabase.getAll();
    res.json({
      success: true,
      data: seeds,
      count: seeds.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve seeds',
      message: error.message 
    });
  }
});

// GET /api/seeds/:id - Get seed by ID
router.get('/:id', (req, res) => {
  try {
    const seed = seedDatabase.getById(req.params.id);
    if (!seed) {
      return res.status(404).json({ 
        success: false, 
        error: 'Seed not found' 
      });
    }
    
    res.json({
      success: true,
      data: seed
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve seed',
      message: error.message 
    });
  }
});

// POST /api/seeds - Create new seed
router.post('/', validateSeed, (req, res) => {
  try {
    const newSeed = seedDatabase.create(req.body);
    res.status(201).json({
      success: true,
      data: newSeed,
      message: 'Seed created successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create seed',
      message: error.message 
    });
  }
});

// PUT /api/seeds/:id - Update seed by ID
router.put('/:id', (req, res) => {
  try {
    const updatedSeed = seedDatabase.update(req.params.id, req.body);
    if (!updatedSeed) {
      return res.status(404).json({ 
        success: false, 
        error: 'Seed not found' 
      });
    }
    
    res.json({
      success: true,
      data: updatedSeed,
      message: 'Seed updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update seed',
      message: error.message 
    });
  }
});

// PATCH /api/seeds/:id - Partial update seed by ID
router.patch('/:id', (req, res) => {
  try {
    const updatedSeed = seedDatabase.update(req.params.id, req.body);
    if (!updatedSeed) {
      return res.status(404).json({ 
        success: false, 
        error: 'Seed not found' 
      });
    }
    
    res.json({
      success: true,
      data: updatedSeed,
      message: 'Seed updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update seed',
      message: error.message 
    });
  }
});

// DELETE /api/seeds/:id - Delete seed by ID
router.delete('/:id', (req, res) => {
  try {
    const deletedSeed = seedDatabase.delete(req.params.id);
    if (!deletedSeed) {
      return res.status(404).json({ 
        success: false, 
        error: 'Seed not found' 
      });
    }
    
    res.json({
      success: true,
      data: deletedSeed,
      message: 'Seed deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete seed',
      message: error.message 
    });
  }
});

// POST /api/seeds/reset - Reset to initial data (for development)
router.post('/reset', (req, res) => {
  try {
    const seeds = seedDatabase.reset();
    res.json({
      success: true,
      data: seeds,
      message: 'Database reset to initial data'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reset database',
      message: error.message 
    });
  }
});

// Validation middleware for change records
const validateChangeRecord = (req, res, next) => {
  const { seedId, changeType, seedCountChange, yieldCountChange } = req.body;
  
  if (!seedId || typeof seedId !== 'number') {
    return res.status(400).json({ error: 'seedId is required and must be a number' });
  }
  
  if (!changeType || !['reconciliation', 'increment'].includes(changeType)) {
    return res.status(400).json({ error: 'changeType is required and must be "reconciliation" or "increment"' });
  }
  
  if (seedCountChange === undefined || typeof seedCountChange !== 'number') {
    return res.status(400).json({ error: 'seedCountChange is required and must be a number' });
  }
  
  if (yieldCountChange === undefined || typeof yieldCountChange !== 'number') {
    return res.status(400).json({ error: 'yieldCountChange is required and must be a number' });
  }
  
  next();
};

// GET /api/seeds/:id/changes - Get change records for a specific seed
router.get('/:id/changes', (req, res) => {
  try {
    const changeRecords = seedDatabase.getChangeRecords(req.params.id);
    res.json({
      success: true,
      data: changeRecords,
      count: changeRecords.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve change records',
      message: error.message 
    });
  }
});

// GET /api/seeds/changes/all - Get all change records
router.get('/changes/all', (req, res) => {
  try {
    const changeRecords = seedDatabase.getAllChangeRecords();
    res.json({
      success: true,
      data: changeRecords,
      count: changeRecords.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve change records',
      message: error.message 
    });
  }
});

// POST /api/seeds/:id/reconcile - Create reconciliation change record
router.post('/:id/reconcile', validateChangeRecord, (req, res) => {
  try {
    const seedId = parseInt(req.params.id);
    const { seedCountChange, yieldCountChange, notes } = req.body;
    
    // Verify seed exists
    const seed = seedDatabase.getById(seedId);
    if (!seed) {
      return res.status(404).json({ 
        success: false, 
        error: 'Seed not found' 
      });
    }
    
    const changeRecord = seedDatabase.addChangeRecord({
      seedId,
      changeType: 'reconciliation',
      seedCountChange,
      yieldCountChange,
      notes: notes || 'Inventory reconciliation'
    });
    
    // Get updated seed with new counts
    const updatedSeed = seedDatabase.getById(seedId);
    
    res.status(201).json({
      success: true,
      data: {
        changeRecord,
        updatedSeed
      },
      message: 'Reconciliation recorded successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to record reconciliation',
      message: error.message 
    });
  }
});

// POST /api/seeds/:id/increment - Create increment change record
router.post('/:id/increment', validateChangeRecord, (req, res) => {
  try {
    const seedId = parseInt(req.params.id);
    const { seedCountChange, yieldCountChange, notes } = req.body;
    
    // Verify seed exists
    const seed = seedDatabase.getById(seedId);
    if (!seed) {
      return res.status(404).json({ 
        success: false, 
        error: 'Seed not found' 
      });
    }
    
    const changeRecord = seedDatabase.addChangeRecord({
      seedId,
      changeType: 'increment',
      seedCountChange,
      yieldCountChange,
      notes: notes || 'Inventory increment'
    });
    
    // Get updated seed with new counts
    const updatedSeed = seedDatabase.getById(seedId);
    
    res.status(201).json({
      success: true,
      data: {
        changeRecord,
        updatedSeed
      },
      message: 'Increment recorded successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to record increment',
      message: error.message 
    });
  }
});

module.exports = router;
