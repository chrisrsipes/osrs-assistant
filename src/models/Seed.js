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
     * @param {number} seedData.seedCount - Number of seeds in inventory (required, default = 0)
     * @param {number} seedData.yieldCount - Number of yields in inventory (required, default = 0)
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
        this.seedCount = seedData.seedCount !== undefined ? seedData.seedCount : 0;
        this.yieldCount = seedData.yieldCount !== undefined ? seedData.yieldCount : 0;
        this.averageYieldPerSeed = seedData.averageYieldPerSeed !== undefined ? seedData.averageYieldPerSeed : 1;

        // Validate numeric fields
        this._validateNumericField('requiredFarmingLevel', this.requiredFarmingLevel);
        this._validateNumericField('seedCount', this.seedCount);
        this._validateNumericField('yieldCount', this.yieldCount);
        this._validateNumericField('averageYieldPerSeed', this.averageYieldPerSeed);
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
     * Updates the seed count
     * @param {number} newCount - New seed count
     */
    setSeedCount(newCount) {
        this._validateNumericField('seedCount', newCount);
        this.seedCount = newCount;
    }

    /**
     * Updates the yield count
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
