/**
 * FarmRun class for farming run session management
 * Represents a farming run session with start/end times and tags
 */
class FarmRun {
  /**
   * Constructor for FarmRun class
   * @param {Object} farmRunData - Object containing farm run properties
   * @param {number} farmRunData.id - Unique identifier for the farm run
   * @param {Date|string} farmRunData.start - Start timestamp (optional)
   * @param {Date|string} farmRunData.end - End timestamp (optional)
   * @param {Array<string>} farmRunData.tags - Array of tag strings (optional, default: [])
   */
  constructor(farmRunData) {
    // Set properties with defaults
    this.id = farmRunData.id || null;
    this.start = farmRunData.start || null;
    this.end = farmRunData.end || null;
    this.tags = farmRunData.tags || [];

    // Validate and convert timestamps
    this._validateAndConvertTimestamps();
    this._validateTags();
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
   * Validates the tags array
   * @private
   */
  _validateTags() {
    if (!Array.isArray(this.tags)) {
      throw new Error('tags must be an array');
    }
    
    for (let i = 0; i < this.tags.length; i++) {
      if (typeof this.tags[i] !== 'string') {
        throw new Error(`tags[${i}] must be a string`);
      }
      if (this.tags[i].trim() === '') {
        throw new Error(`tags[${i}] cannot be empty`);
      }
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

  // Getters
  getId() {
    return this.id;
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  getTags() {
    return [...this.tags]; // Return a copy to prevent external modification
  }

  // Setters with validation
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

  setTags(newTags) {
    if (!Array.isArray(newTags)) {
      throw new Error('tags must be an array');
    }
    
    // Validate each tag
    for (let i = 0; i < newTags.length; i++) {
      if (typeof newTags[i] !== 'string') {
        throw new Error(`tags[${i}] must be a string`);
      }
      if (newTags[i].trim() === '') {
        throw new Error(`tags[${i}] cannot be empty`);
      }
    }
    
    this.tags = [...newTags]; // Create a copy
  }

  // Tag management methods
  addTag(tag) {
    if (typeof tag !== 'string') {
      throw new Error('tag must be a string');
    }
    if (tag.trim() === '') {
      throw new Error('tag cannot be empty');
    }
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
  }

  hasTag(tag) {
    return this.tags.includes(tag);
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

  // Serialization methods
  toJSON() {
    return {
      id: this.id,
      start: this.start ? this.start.toISOString() : null,
      end: this.end ? this.end.toISOString() : null,
      tags: [...this.tags]
    };
  }

  static fromJSON(jsonData) {
    return new FarmRun(jsonData);
  }

  // Validation for the entire farm run
  validate() {
    this._validateAndConvertTimestamps();
    this._validateTags();
    return true;
  }
}

export default FarmRun;
