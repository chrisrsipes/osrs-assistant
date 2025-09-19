// In-memory database for seed data and change records
// This will be replaced with a real database in production

const initialSeedsData = [
  {
    "id": 1,
    "seedName": "Spirit Seed",
    "yieldName": "Spirit Tree",
    "seedType": "Special",
    "requiredFarmingLevel": 83,
    "seedCount": 3,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 2,
    "seedName": "Celastrus Seed",
    "yieldName": "Celastrus Bark",
    "seedType": "Special",
    "requiredFarmingLevel": 85,
    "seedCount": 9,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 3,
    "seedName": "Magic Seed",
    "yieldName": "Magic Root",
    "seedType": "Tree",
    "requiredFarmingLevel": 75,
    "seedCount": 20,
    "yieldCount": 23,
    "averageYieldPerSeed": 1
  },
  {
    "id": 4,
    "seedName": "Yew Seed",
    "yieldName": "Yew Root",
    "seedType": "Tree",
    "requiredFarmingLevel": 60,
    "seedCount": 15,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 5,
    "seedName": "Watermelon Seed",
    "yieldName": "Watermelon",
    "seedType": "Allotment",
    "requiredFarmingLevel": 47,
    "seedCount": 183,
    "yieldCount": 4917,
    "averageYieldPerSeed": 1
  },
  {
    "id": 6,
    "seedName": "Snape Grass Seed",
    "yieldName": "Snape Grass",
    "seedType": "Allotment",
    "requiredFarmingLevel": 61,
    "seedCount": 505,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 7,
    "seedName": "Tarromin Seed",
    "yieldName": "Tarromin",
    "seedType": "Herb",
    "requiredFarmingLevel": 19,
    "seedCount": 0,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 8,
    "seedName": "Harralander Seed",
    "yieldName": "Harralander",
    "seedType": "Herb",
    "requiredFarmingLevel": 26,
    "seedCount": 33,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 9,
    "seedName": "Ranarr Seed",
    "yieldName": "Ranarr",
    "seedType": "Herb",
    "requiredFarmingLevel": 32,
    "seedCount": 2,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 10,
    "seedName": "Irit Seed",
    "yieldName": "Irit",
    "seedType": "Herb",
    "requiredFarmingLevel": 40,
    "seedCount": 360,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 11,
    "seedName": "Kwuarm Seed",
    "yieldName": "Kwuarm",
    "seedType": "Herb",
    "requiredFarmingLevel": 56,
    "seedCount": 0,
    "yieldCount": 416,
    "averageYieldPerSeed": 1
  },
  {
    "id": 12,
    "seedName": "Cadantine Seed",
    "yieldName": "Cadantine",
    "seedType": "Herb",
    "requiredFarmingLevel": 67,
    "seedCount": 10,
    "yieldCount": 1361,
    "averageYieldPerSeed": 1
  },
  {
    "id": 13,
    "seedName": "Snapdragon Seed",
    "yieldName": "Snapdragon",
    "seedType": "Herb",
    "requiredFarmingLevel": 62,
    "seedCount": 41,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 14,
    "seedName": "Lantadyme Seed",
    "yieldName": "Lantadyme",
    "seedType": "Herb",
    "requiredFarmingLevel": 73,
    "seedCount": 195,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 15,
    "seedName": "Dwarf Weed Seed",
    "yieldName": "Dwarf Weed",
    "seedType": "Herb",
    "requiredFarmingLevel": 79,
    "seedCount": 204,
    "yieldCount": 0,
    "averageYieldPerSeed": 1
  },
  {
    "id": 16,
    "seedName": "Torstol Seed",
    "yieldName": "Torstol",
    "seedType": "Herb",
    "requiredFarmingLevel": 85,
    "seedCount": 1,
    "yieldCount": 643,
    "averageYieldPerSeed": 1
  }
];

// Remove seedCount and yieldCount from initial data - these will be calculated from change records
const initialSeedsDataWithoutCounts = initialSeedsData.map(seed => ({
  id: seed.id,
  seedName: seed.seedName,
  yieldName: seed.yieldName,
  seedType: seed.seedType,
  requiredFarmingLevel: seed.requiredFarmingLevel,
  averageYieldPerSeed: seed.averageYieldPerSeed
}));

// Initial change records to establish baseline counts
const initialChangeRecords = initialSeedsData.map(seed => ({
  id: seed.id + 1000, // Offset to avoid conflicts with seed IDs
  seedId: seed.id,
  changeType: 'reconciliation',
  seedCountChange: seed.seedCount,
  yieldCountChange: seed.yieldCount,
  createdDate: new Date('2024-01-01T00:00:00.000Z'),
  notes: 'Initial inventory reconciliation'
}));

// In-memory storage
let seeds = [...initialSeedsDataWithoutCounts];
let changeRecords = [...initialChangeRecords];
let nextSeedId = Math.max(...initialSeedsData.map(s => s.id)) + 1;
let nextChangeRecordId = Math.max(...initialChangeRecords.map(c => c.id)) + 1;

// Helper function to calculate current seed and yield counts for a seed
const calculateCurrentCounts = (seedId) => {
  const seedChangeRecords = changeRecords
    .filter(record => record.seedId === seedId)
    .sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));

  let currentSeedCount = 0;
  let currentYieldCount = 0;

  for (const record of seedChangeRecords) {
    if (record.changeType === 'reconciliation') {
      // Reconciliation sets absolute values
      currentSeedCount = record.seedCountChange;
      currentYieldCount = record.yieldCountChange;
    } else if (record.changeType === 'increment') {
      // Increment adds/subtracts from current values
      currentSeedCount += record.seedCountChange;
      currentYieldCount += record.yieldCountChange;
    }
  }

  return { seedCount: currentSeedCount, yieldCount: currentYieldCount };
};

// Helper function to get seed with current counts
const getSeedWithCounts = (seed) => {
  const counts = calculateCurrentCounts(seed.id);
  return {
    ...seed,
    seedCount: counts.seedCount,
    yieldCount: counts.yieldCount
  };
};

// Database operations
const seedDatabase = {
  // Get all seeds with current counts
  getAll: () => {
    return seeds.map(seed => getSeedWithCounts(seed));
  },

  // Get seed by ID with current counts
  getById: (id) => {
    const seed = seeds.find(seed => seed.id === parseInt(id));
    return seed ? getSeedWithCounts(seed) : null;
  },

  // Create new seed
  create: (seedData) => {
    const newSeed = {
      id: nextSeedId++,
      seedName: seedData.seedName,
      yieldName: seedData.yieldName,
      seedType: seedData.seedType,
      requiredFarmingLevel: seedData.requiredFarmingLevel,
      averageYieldPerSeed: seedData.averageYieldPerSeed || 1
    };
    seeds.push(newSeed);
    
    // Create initial reconciliation record if counts are provided
    if (seedData.seedCount !== undefined || seedData.yieldCount !== undefined) {
      const reconciliationRecord = {
        id: nextChangeRecordId++,
        seedId: newSeed.id,
        changeType: 'reconciliation',
        seedCountChange: seedData.seedCount || 0,
        yieldCountChange: seedData.yieldCount || 0,
        createdDate: new Date(),
        notes: 'Initial seed creation'
      };
      changeRecords.push(reconciliationRecord);
    }
    
    return getSeedWithCounts(newSeed);
  },

  // Update seed by ID (only non-count fields)
  update: (id, updateData) => {
    const index = seeds.findIndex(seed => seed.id === parseInt(id));
    if (index === -1) return null;
    
    // Only update non-count fields
    const { seedCount, yieldCount, ...allowedUpdates } = updateData;
    seeds[index] = { ...seeds[index], ...allowedUpdates };
    return getSeedWithCounts(seeds[index]);
  },

  // Delete seed by ID
  delete: (id) => {
    const index = seeds.findIndex(seed => seed.id === parseInt(id));
    if (index === -1) return null;
    
    // Also remove all change records for this seed
    changeRecords = changeRecords.filter(record => record.seedId !== parseInt(id));
    
    return seeds.splice(index, 1)[0];
  },

  // Add change record
  addChangeRecord: (changeRecordData) => {
    const newChangeRecord = {
      id: nextChangeRecordId++,
      seedId: changeRecordData.seedId,
      changeType: changeRecordData.changeType,
      seedCountChange: changeRecordData.seedCountChange,
      yieldCountChange: changeRecordData.yieldCountChange,
      createdDate: changeRecordData.createdDate || new Date(),
      notes: changeRecordData.notes || ''
    };
    changeRecords.push(newChangeRecord);
    return newChangeRecord;
  },

  // Get change records for a seed
  getChangeRecords: (seedId) => {
    return changeRecords
      .filter(record => record.seedId === parseInt(seedId))
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)); // Most recent first
  },

  // Get all change records
  getAllChangeRecords: () => {
    return changeRecords.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  },

  // Reset to initial data
  reset: () => {
    seeds = [...initialSeedsDataWithoutCounts];
    changeRecords = [...initialChangeRecords];
    nextSeedId = Math.max(...initialSeedsData.map(s => s.id)) + 1;
    nextChangeRecordId = Math.max(...initialChangeRecords.map(c => c.id)) + 1;
    return seeds.map(seed => getSeedWithCounts(seed));
  }
};

module.exports = seedDatabase;
