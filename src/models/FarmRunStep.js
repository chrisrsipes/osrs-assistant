/**
 * FarmRunStep class for individual steps within a farm run
 * Represents a single step in a farming run session with timestamps and references
 */
class FarmRunStep {
  /**
   * Constructor for FarmRunStep class
   * @param {Object} farmRunStepData - Object containing farm run step properties
   * @param {number} farmRunStepData.id - Unique identifier for the farm run step
   * @param {number} farmRunStepData.farmRunId - ID of the parent farm run (required)
   * @param {Date|string} farmRunStepData.start - Start timestamp (optional)
   * @param {Date|string} farmRunStepData.end - End timestamp (optional)
   * @param {number} farmRunStepData.patchId - ID of the farm patch (required)
   * @param {number} farmRunStepData.seedChangeRecordId - ID of the seed change record (optional, 1:1 relationship)
   */
  constructor(farmRunStepData) {
    // Validate required fields
    if (!farmRunStepData.farmRunId || typeof farmRunStepData.farmRunId !== 'number') {
      throw new Error('farmRunId is required and must be a number');
    }
    if (!farmRunStepData.patchId || typeof farmRunStepData.patchId !== 'number') {
      throw new Error('patchId is required and must be a number');
    }

    // Set properties with defaults
    this.id = farmRunStepData.id || null;
    this.farmRunId = farmRunStepData.farmRunId;
    this.start = farmRunStepData.start || null;
    this.end = farmRunStepData.end || null;
    this.patchId = farmRunStepData.patchId;
    this.seedChangeRecordId = farmRunStepData.seedChangeRecordId || null;

    // Validate and convert timestamps
    this._validateAndConvertTimestamps();
    this._validateForeignKeys();
  }

  /**
   * Validates and converts timestamp fields to Date objects
   * @private
   */
  _validateAndConvertTimestamps() {
    if (this.start !== null) {
      if (typeof this.start === 'string') {
        this.start = new Date(this.start);
      }
      if (!(this.start instanceof Date) || isNaN(this.start.getTime())) {
        throw new Error('start must be a valid Date object or valid date string');
      }
    }

    if (this.end !== null) {
      if (typeof this.end === 'string') {
        this.end = new Date(this.end);
      }
      if (!(this.end instanceof Date) || isNaN(this.end.getTime())) {
        throw new Error('end must be a valid Date object or valid date string');
      }
    }

    // Validate that end is after start if both are provided
    if (this.start && this.end && this.end <= this.start) {
      throw new Error('end timestamp must be after start timestamp');
    }
  }

  /**
   * Validates foreign key fields
   * @private
   */
  _validateForeignKeys() {
    if (this.seedChangeRecordId !== null && typeof this.seedChangeRecordId !== 'number') {
      throw new Error('seedChangeRecordId must be a number or null');
    }
  }

  /**
   * Validates that a field is a valid Date or null
   * @param {string} fieldName - Name of the field being validated
   * @param {any} value - Value to validate
   * @throws {Error} If value is not a valid Date or null
   */
  _validateDateField(fieldName, value) {
    if (value !== null && !(value instanceof Date) && isNaN(new Date(value).getTime())) {
      throw new Error(`${fieldName} must be a valid Date object, valid date string, or null`);
    }
  }

  /**
   * Validates that a field is a valid number
   * @param {string} fieldName - Name of the field being validated
   * @param {any} value - Value to validate
   * @throws {Error} If value is not a valid number
   */
  _validateNumericField(fieldName, value) {
    if (typeof value !== 'number' || isNaN(value) || value <= 0) {
      throw new Error(`${fieldName} must be a valid positive number`);
    }
  }

  // Getters
  getId() {
    return this.id;
  }

  getFarmRunId() {
    return this.farmRunId;
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  getPatchId() {
    return this.patchId;
  }

  getSeedChangeRecordId() {
    return this.seedChangeRecordId;
  }

  // Setters with validation
  setFarmRunId(newFarmRunId) {
    this._validateNumericField('farmRunId', newFarmRunId);
    this.farmRunId = newFarmRunId;
  }

  setStart(newStart) {
    if (newStart !== null) {
      this._validateDateField('start', newStart);
      if (typeof newStart === 'string') {
        newStart = new Date(newStart);
      }
    }
    
    // Validate that end is after start if both are provided
    if (newStart && this.end && this.end <= newStart) {
      throw new Error('end timestamp must be after start timestamp');
    }
    
    this.start = newStart;
  }

  setEnd(newEnd) {
    if (newEnd !== null) {
      this._validateDateField('end', newEnd);
      if (typeof newEnd === 'string') {
        newEnd = new Date(newEnd);
      }
    }
    
    // Validate that end is after start if both are provided
    if (this.start && newEnd && newEnd <= this.start) {
      throw new Error('end timestamp must be after start timestamp');
    }
    
    this.end = newEnd;
  }

  setPatchId(newPatchId) {
    this._validateNumericField('patchId', newPatchId);
    this.patchId = newPatchId;
  }

  setSeedChangeRecordId(newSeedChangeRecordId) {
    if (newSeedChangeRecordId !== null) {
      this._validateNumericField('seedChangeRecordId', newSeedChangeRecordId);
    }
    this.seedChangeRecordId = newSeedChangeRecordId;
  }

  // Utility methods
  isActive() {
    return this.start !== null && this.end === null;
  }

  isCompleted() {
    return this.start !== null && this.end !== null;
  }

  getDuration() {
    if (!this.start || !this.end) {
      return null;
    }
    return this.end.getTime() - this.start.getTime();
  }

  getDurationInMinutes() {
    const duration = this.getDuration();
    return duration ? Math.round(duration / (1000 * 60)) : null;
  }

  getDurationInHours() {
    const duration = this.getDuration();
    return duration ? Math.round(duration / (1000 * 60 * 60) * 100) / 100 : null;
  }

  hasSeedChangeRecord() {
    return this.seedChangeRecordId !== null;
  }

  // Serialization methods
  toJSON() {
    return {
      id: this.id,
      farmRunId: this.farmRunId,
      start: this.start ? this.start.toISOString() : null,
      end: this.end ? this.end.toISOString() : null,
      patchId: this.patchId,
      seedChangeRecordId: this.seedChangeRecordId
    };
  }

  static fromJSON(jsonData) {
    return new FarmRunStep(jsonData);
  }

  // Validation for the entire farm run step
  validate() {
    this._validateAndConvertTimestamps();
    this._validateForeignKeys();
    return true;
  }
}

export default FarmRunStep;
