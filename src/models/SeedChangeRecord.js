/**
 * SeedChangeRecord class for tracking inventory changes
 * Represents a change to seed inventory (reconciliation or increment)
 */
class SeedChangeRecord {
    /**
     * Constructor for SeedChangeRecord class
     * @param {Object} changeData - Object containing change record properties
     * @param {number} changeData.id - Unique identifier for the change record
     * @param {number} changeData.seedId - ID of the seed being changed (required)
     * @param {string} changeData.changeType - Type of change: 'reconciliation' or 'increment' (required)
     * @param {number} changeData.seedCountChange - Change in seed count (required)
     * @param {number} changeData.yieldCountChange - Change in yield count (required)
     * @param {Date} changeData.createdDate - Date when the change was made (required)
     * @param {string} changeData.notes - Optional notes about the change
     */
    constructor(changeData) {
        // Validate required fields
        if (!changeData.seedId || typeof changeData.seedId !== 'number') {
            throw new Error('seedId is required and must be a number');
        }
        
        if (!changeData.changeType || !['reconciliation', 'increment'].includes(changeData.changeType)) {
            throw new Error('changeType is required and must be "reconciliation" or "increment"');
        }

        if (changeData.seedCountChange === undefined || typeof changeData.seedCountChange !== 'number') {
            throw new Error('seedCountChange is required and must be a number');
        }

        if (changeData.yieldCountChange === undefined || typeof changeData.yieldCountChange !== 'number') {
            throw new Error('yieldCountChange is required and must be a number');
        }

        if (!changeData.createdDate || !(changeData.createdDate instanceof Date)) {
            throw new Error('createdDate is required and must be a Date object');
        }

        // Set properties
        this.id = changeData.id || null;
        this.seedId = changeData.seedId;
        this.changeType = changeData.changeType;
        this.seedCountChange = changeData.seedCountChange;
        this.yieldCountChange = changeData.yieldCountChange;
        this.createdDate = changeData.createdDate;
        this.notes = changeData.notes || '';

        // Validate numeric fields
        this._validateNumericField('seedCountChange', this.seedCountChange);
        this._validateNumericField('yieldCountChange', this.yieldCountChange);
    }

    /**
     * Validates that a field is a valid number
     * @param {string} fieldName - Name of the field being validated
     * @param {any} value - Value to validate
     * @throws {Error} If value is not a valid number
     */
    _validateNumericField(fieldName, value) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(`${fieldName} must be a valid number`);
        }
    }

    /**
     * Gets a summary of the change record
     * @returns {Object} Summary object with key information
     */
    getSummary() {
        return {
            id: this.id,
            seedId: this.seedId,
            changeType: this.changeType,
            seedCountChange: this.seedCountChange,
            yieldCountChange: this.yieldCountChange,
            createdDate: this.createdDate,
            notes: this.notes
        };
    }

    /**
     * Converts the change record to a JSON-serializable object
     * @returns {Object} JSON representation of the change record
     */
    toJSON() {
        return {
            id: this.id,
            seedId: this.seedId,
            changeType: this.changeType,
            seedCountChange: this.seedCountChange,
            yieldCountChange: this.yieldCountChange,
            createdDate: this.createdDate.toISOString(),
            notes: this.notes
        };
    }

    /**
     * Creates a SeedChangeRecord instance from JSON data
     * @param {Object} jsonData - JSON data to create change record from
     * @returns {SeedChangeRecord} New SeedChangeRecord instance
     */
    static fromJSON(jsonData) {
        const data = {
            ...jsonData,
            createdDate: new Date(jsonData.createdDate)
        };
        return new SeedChangeRecord(data);
    }

    /**
     * Creates a reconciliation change record
     * @param {number} seedId - ID of the seed
     * @param {number} newSeedCount - New absolute seed count
     * @param {number} newYieldCount - New absolute yield count
     * @param {string} notes - Optional notes
     * @returns {SeedChangeRecord} New reconciliation change record
     */
    static createReconciliation(seedId, newSeedCount, newYieldCount, notes = '') {
        return new SeedChangeRecord({
            seedId,
            changeType: 'reconciliation',
            seedCountChange: newSeedCount,
            yieldCountChange: newYieldCount,
            createdDate: new Date(),
            notes
        });
    }

    /**
     * Creates an increment change record
     * @param {number} seedId - ID of the seed
     * @param {number} seedCountChange - Change in seed count (can be negative)
     * @param {number} yieldCountChange - Change in yield count (can be negative)
     * @param {string} notes - Optional notes
     * @returns {SeedChangeRecord} New increment change record
     */
    static createIncrement(seedId, seedCountChange, yieldCountChange, notes = '') {
        return new SeedChangeRecord({
            seedId,
            changeType: 'increment',
            seedCountChange,
            yieldCountChange,
            createdDate: new Date(),
            notes
        });
    }
}

export default SeedChangeRecord;
