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

module.exports = router;
