// In-memory database for seed data
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

// In-memory storage
let seeds = [...initialSeedsData];
let nextId = Math.max(...initialSeedsData.map(s => s.id)) + 1;

// Database operations
const seedDatabase = {
  // Get all seeds
  getAll: () => {
    return seeds;
  },

  // Get seed by ID
  getById: (id) => {
    return seeds.find(seed => seed.id === parseInt(id));
  },

  // Create new seed
  create: (seedData) => {
    const newSeed = {
      id: nextId++,
      seedName: seedData.seedName,
      yieldName: seedData.yieldName,
      seedType: seedData.seedType,
      requiredFarmingLevel: seedData.requiredFarmingLevel,
      seedCount: seedData.seedCount || 0,
      yieldCount: seedData.yieldCount || 0,
      averageYieldPerSeed: seedData.averageYieldPerSeed || 1
    };
    seeds.push(newSeed);
    return newSeed;
  },

  // Update seed by ID
  update: (id, updateData) => {
    const index = seeds.findIndex(seed => seed.id === parseInt(id));
    if (index === -1) return null;
    
    seeds[index] = { ...seeds[index], ...updateData };
    return seeds[index];
  },

  // Delete seed by ID
  delete: (id) => {
    const index = seeds.findIndex(seed => seed.id === parseInt(id));
    if (index === -1) return null;
    
    return seeds.splice(index, 1)[0];
  },

  // Reset to initial data
  reset: () => {
    seeds = [...initialSeedsData];
    nextId = Math.max(...initialSeedsData.map(s => s.id)) + 1;
    return seeds;
  }
};

module.exports = seedDatabase;
