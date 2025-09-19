const express = require('express');
const router = express.Router();
const sqliteDatabase = require('../database/sqliteDatabase');

// Get all farm runs with their steps
router.get('/', async (req, res) => {
  try {
    const farmRuns = await sqliteDatabase.getAllFarmRunsWithSteps();
    res.json(farmRuns);
  } catch (error) {
    console.error('Error fetching farm runs:', error);
    res.status(500).json({ error: 'Failed to fetch farm runs' });
  }
});

// Get a specific farm run with its steps
router.get('/:id', async (req, res) => {
  try {
    const farmRunId = parseInt(req.params.id);
    if (isNaN(farmRunId)) {
      return res.status(400).json({ error: 'Invalid farm run ID' });
    }

    const farmRun = await sqliteDatabase.getFarmRunWithSteps(farmRunId);
    if (!farmRun) {
      return res.status(404).json({ error: 'Farm run not found' });
    }

    res.json(farmRun);
  } catch (error) {
    console.error('Error fetching farm run:', error);
    res.status(500).json({ error: 'Failed to fetch farm run' });
  }
});

// Create a new farm run
router.post('/', async (req, res) => {
  try {
    const { start, end, tags } = req.body;
    
    // Validate required fields
    if (!start) {
      return res.status(400).json({ error: 'Start time is required' });
    }

    const farmRunData = {
      start,
      end: end || null,
      tags: tags || []
    };

    const newFarmRun = await sqliteDatabase.createFarmRun(farmRunData);
    res.status(201).json(newFarmRun);
  } catch (error) {
    console.error('Error creating farm run:', error);
    res.status(500).json({ error: 'Failed to create farm run' });
  }
});

// Update a farm run
router.put('/:id', async (req, res) => {
  try {
    const farmRunId = parseInt(req.params.id);
    if (isNaN(farmRunId)) {
      return res.status(400).json({ error: 'Invalid farm run ID' });
    }

    const { start, end, tags } = req.body;
    const updateData = { start, end, tags };

    const updatedFarmRun = await sqliteDatabase.updateFarmRun(farmRunId, updateData);
    if (!updatedFarmRun) {
      return res.status(404).json({ error: 'Farm run not found' });
    }

    res.json(updatedFarmRun);
  } catch (error) {
    console.error('Error updating farm run:', error);
    res.status(500).json({ error: 'Failed to update farm run' });
  }
});

// Delete a farm run
router.delete('/:id', async (req, res) => {
  try {
    const farmRunId = parseInt(req.params.id);
    if (isNaN(farmRunId)) {
      return res.status(400).json({ error: 'Invalid farm run ID' });
    }

    const deleted = await sqliteDatabase.deleteFarmRun(farmRunId);
    if (!deleted) {
      return res.status(404).json({ error: 'Farm run not found' });
    }

    res.json({ message: 'Farm run deleted successfully' });
  } catch (error) {
    console.error('Error deleting farm run:', error);
    res.status(500).json({ error: 'Failed to delete farm run' });
  }
});

// Get farm run steps for a specific farm run
router.get('/:id/steps', async (req, res) => {
  try {
    const farmRunId = parseInt(req.params.id);
    if (isNaN(farmRunId)) {
      return res.status(400).json({ error: 'Invalid farm run ID' });
    }

    const steps = await sqliteDatabase.getFarmRunSteps(farmRunId);
    res.json(steps);
  } catch (error) {
    console.error('Error fetching farm run steps:', error);
    res.status(500).json({ error: 'Failed to fetch farm run steps' });
  }
});

// Create a new farm run step
router.post('/:id/steps', async (req, res) => {
  try {
    const farmRunId = parseInt(req.params.id);
    if (isNaN(farmRunId)) {
      return res.status(400).json({ error: 'Invalid farm run ID' });
    }

    const { start, end, patchId, seedChangeRecordId } = req.body;
    
    // Validate required fields
    if (!patchId) {
      return res.status(400).json({ error: 'Patch ID is required' });
    }

    const stepData = {
      farmRunId,
      start: start || null,
      end: end || null,
      patchId,
      seedChangeRecordId: seedChangeRecordId || null
    };

    const newStep = await sqliteDatabase.createFarmRunStep(stepData);
    res.status(201).json(newStep);
  } catch (error) {
    console.error('Error creating farm run step:', error);
    res.status(500).json({ error: 'Failed to create farm run step' });
  }
});

module.exports = router;
