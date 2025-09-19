/**
 * Seed class for inventory management system
 * Represents a type of seed with its yield information
 */
class Seed {
    /**
     * Constructor for Seed class
     * @param {Object} seedData - Object containing seed properties
     * @param {number} seedData.id - Unique identifier for the seed
     * @param {string} seedData.seedName - Name of the seed (required)
     * @param {string} seedData.yieldName - Name of the yield/produce (required)
     * @param {string} seedData.seedType - Type/category of the seed (required)
     * @param {number} seedData.requiredFarmingLevel - Required farming level to plant (required)
     * Note: seedCount and yieldCount are now calculated from change records
     * @param {number} seedData.averageYieldPerSeed - Average yield per seed planted (required, default = 1)
     */
    constructor(seedData) {
        // Validate required fields
        if (!seedData.seedName || typeof seedData.seedName !== 'string') {
            throw new Error('seedName is required and must be a string');
        }
        
        if (!seedData.yieldName || typeof seedData.yieldName !== 'string') {
            throw new Error('yieldName is required and must be a string');
        }

        if (!seedData.seedType || typeof seedData.seedType !== 'string') {
            throw new Error('seedType is required and must be a string');
        }

        // Set properties with defaults
        this.id = seedData.id || null;
        this.seedName = seedData.seedName;
        this.yieldName = seedData.yieldName;
        this.seedType = seedData.seedType;
        this.requiredFarmingLevel = seedData.requiredFarmingLevel !== undefined ? seedData.requiredFarmingLevel : 1;
        this.averageYieldPerSeed = seedData.averageYieldPerSeed !== undefined ? seedData.averageYieldPerSeed : 1;
        
        // These are now calculated from change records, not stored directly
        this.seedCount = seedData.seedCount !== undefined ? seedData.seedCount : 0;
        this.yieldCount = seedData.yieldCount !== undefined ? seedData.yieldCount : 0;

        // Validate numeric fields
        this._validateNumericField('requiredFarmingLevel', this.requiredFarmingLevel);
        this._validateNumericField('averageYieldPerSeed', this.averageYieldPerSeed);
        
        // Validate count fields if provided (for backward compatibility)
        if (seedData.seedCount !== undefined) {
            this._validateNumericField('seedCount', this.seedCount);
        }
        if (seedData.yieldCount !== undefined) {
            this._validateNumericField('yieldCount', this.yieldCount);
        }
    }

    /**
     * Validates that a field is a valid number
     * @param {string} fieldName - Name of the field being validated
     * @param {any} value - Value to validate
     * @throws {Error} If value is not a valid number
     */
    _validateNumericField(fieldName, value) {
        if (typeof value !== 'number' || isNaN(value) || value < 0) {
            throw new Error(`${fieldName} must be a valid non-negative number`);
        }
    }

    /**
     * Updates the seed count (for display purposes only)
     * Note: In the new architecture, counts are calculated from change records
     * @param {number} newCount - New seed count
     */
    setSeedCount(newCount) {
        this._validateNumericField('seedCount', newCount);
        this.seedCount = newCount;
    }

    /**
     * Updates the yield count (for display purposes only)
     * Note: In the new architecture, counts are calculated from change records
     * @param {number} newCount - New yield count
     */
    setYieldCount(newCount) {
        this._validateNumericField('yieldCount', newCount);
        this.yieldCount = newCount;
    }

    /**
     * Updates the average yield per seed
     * @param {number} newAverage - New average yield per seed
     */
    setAverageYieldPerSeed(newAverage) {
        this._validateNumericField('averageYieldPerSeed', newAverage);
        this.averageYieldPerSeed = newAverage;
    }

    /**
     * Updates the required farming level
     * @param {number} newLevel - New required farming level
     */
    setRequiredFarmingLevel(newLevel) {
        this._validateNumericField('requiredFarmingLevel', newLevel);
        this.requiredFarmingLevel = newLevel;
    }

    /**
     * Calculates expected total yield based on current seed count
     * @returns {number} Expected total yield
     */
    getExpectedYield() {
        return Math.floor(this.seedCount * this.averageYieldPerSeed);
    }

    /**
     * Gets a summary of the seed inventory
     * @returns {Object} Summary object with key information
     */
    getSummary() {
        return {
            id: this.id,
            seedName: this.seedName,
            yieldName: this.yieldName,
            seedType: this.seedType,
            requiredFarmingLevel: this.requiredFarmingLevel,
            seedCount: this.seedCount,
            yieldCount: this.yieldCount,
            averageYieldPerSeed: this.averageYieldPerSeed,
            expectedYield: this.getExpectedYield()
        };
    }

    /**
     * Converts the seed to a JSON-serializable object
     * @returns {Object} JSON representation of the seed
     */
    toJSON() {
        return {
            id: this.id,
            seedName: this.seedName,
            yieldName: this.yieldName,
            seedType: this.seedType,
            requiredFarmingLevel: this.requiredFarmingLevel,
            seedCount: this.seedCount,
            yieldCount: this.yieldCount,
            averageYieldPerSeed: this.averageYieldPerSeed
        };
    }

    /**
     * Creates a Seed instance from JSON data
     * @param {Object} jsonData - JSON data to create seed from
     * @returns {Seed} New Seed instance
     */
    static fromJSON(jsonData) {
        return new Seed(jsonData);
    }
}

export default Seed;
