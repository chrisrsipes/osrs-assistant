const express = require('express');
const router = express.Router();
const farmPatchDatabase = require('../database/farmPatches');
const FarmPatch = require('../../src/models/FarmPatch');

// Get all farm patches
router.get('/', async (req, res) => {
  try {
    const patches = await farmPatchDatabase.getAll();
    res.json({
      success: true,
      data: patches,
      count: patches.length
    });
  } catch (error) {
    console.error('Error fetching farm patches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch farm patches',
      message: error.message
    });
  }
});

// Get farm patch by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid farm patch ID'
      });
    }

    const patch = await farmPatchDatabase.getById(id);
    res.json({
      success: true,
      data: patch
    });
  } catch (error) {
    console.error('Error fetching farm patch:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: 'Farm patch not found',
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch farm patch',
        message: error.message
      });
    }
  }
});

// Create new farm patch
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { location, patchType, patchDiscriminator, notes, automaticallyProtected } = req.body;
    
    if (!location || !patchType || !patchDiscriminator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'location, patchType, and patchDiscriminator are required'
      });
    }

    // Create FarmPatch instance for validation
    const patchData = {
      location,
      patchType,
      patchDiscriminator,
      notes: notes || '',
      automaticallyProtected: automaticallyProtected || false
    };

    const farmPatch = new FarmPatch(patchData);
    farmPatch.validate();

    const createdPatch = await farmPatchDatabase.create(patchData);
    res.status(201).json({
      success: true,
      data: createdPatch,
      message: 'Farm patch created successfully'
    });
  } catch (error) {
    console.error('Error creating farm patch:', error);
    if (error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        error: 'Farm patch already exists',
        message: error.message
      });
    } else if (error.message.includes('Invalid')) {
      res.status(400).json({
        success: false,
        error: 'Invalid farm patch data',
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create farm patch',
        message: error.message
      });
    }
  }
});

// Update farm patch
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid farm patch ID'
      });
    }

    const { location, patchType, patchDiscriminator, notes, automaticallyProtected } = req.body;
    
    if (!location || !patchType || !patchDiscriminator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'location, patchType, and patchDiscriminator are required'
      });
    }

    // Create FarmPatch instance for validation
    const patchData = {
      location,
      patchType,
      patchDiscriminator,
      notes: notes || '',
      automaticallyProtected: automaticallyProtected || false
    };

    const farmPatch = new FarmPatch(patchData);
    farmPatch.validate();

    const updatedPatch = await farmPatchDatabase.update(id, patchData);
    res.json({
      success: true,
      data: updatedPatch,
      message: 'Farm patch updated successfully'
    });
  } catch (error) {
    console.error('Error updating farm patch:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: 'Farm patch not found',
        message: error.message
      });
    } else if (error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        error: 'Farm patch already exists',
        message: error.message
      });
    } else if (error.message.includes('Invalid')) {
      res.status(400).json({
        success: false,
        error: 'Invalid farm patch data',
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to update farm patch',
        message: error.message
      });
    }
  }
});

// Delete farm patch
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid farm patch ID'
      });
    }

    await farmPatchDatabase.delete(id);
    res.json({
      success: true,
      message: 'Farm patch deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting farm patch:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: 'Farm patch not found',
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete farm patch',
        message: error.message
      });
    }
  }
});

// Get farm patches by location
router.get('/location/:location', async (req, res) => {
  try {
    const location = decodeURIComponent(req.params.location);
    const patches = await farmPatchDatabase.getByLocation(location);
    res.json({
      success: true,
      data: patches,
      count: patches.length
    });
  } catch (error) {
    console.error('Error fetching farm patches by location:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch farm patches by location',
      message: error.message
    });
  }
});

// Get farm patches by patch type
router.get('/type/:patchType', async (req, res) => {
  try {
    const patchType = decodeURIComponent(req.params.patchType);
    const patches = await farmPatchDatabase.getByPatchType(patchType);
    res.json({
      success: true,
      data: patches,
      count: patches.length
    });
  } catch (error) {
    console.error('Error fetching farm patches by type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch farm patches by type',
      message: error.message
    });
  }
});

// Search farm patches
router.get('/search/:term', async (req, res) => {
  try {
    const searchTerm = decodeURIComponent(req.params.term);
    const patches = await farmPatchDatabase.search(searchTerm);
    res.json({
      success: true,
      data: patches,
      count: patches.length
    });
  } catch (error) {
    console.error('Error searching farm patches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search farm patches',
      message: error.message
    });
  }
});

// Get unique locations
router.get('/meta/locations', async (req, res) => {
  try {
    const locations = await farmPatchDatabase.getUniqueLocations();
    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    console.error('Error fetching unique locations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unique locations',
      message: error.message
    });
  }
});

// Get unique patch types
router.get('/meta/patch-types', async (req, res) => {
  try {
    const patchTypes = await farmPatchDatabase.getUniquePatchTypes();
    res.json({
      success: true,
      data: patchTypes
    });
  } catch (error) {
    console.error('Error fetching unique patch types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unique patch types',
      message: error.message
    });
  }
});

module.exports = router;
