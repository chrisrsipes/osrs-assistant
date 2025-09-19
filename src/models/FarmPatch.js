class FarmPatch {
  constructor(patchData) {
    // Validate required fields
    if (!patchData.location || typeof patchData.location !== 'string') {
      throw new Error('location is required and must be a string');
    }
    if (!patchData.patchType || typeof patchData.patchType !== 'string') {
      throw new Error('patchType is required and must be a string');
    }
    if (!patchData.patchDiscriminator || typeof patchData.patchDiscriminator !== 'string') {
      throw new Error('patchDiscriminator is required and must be a string');
    }

    this.id = patchData.id || null;
    this.location = patchData.location;
    this.patchType = patchData.patchType;
    this.patchDiscriminator = patchData.patchDiscriminator;
    this.notes = patchData.notes || '';
    this.automaticallyProtected = patchData.automaticallyProtected !== undefined ? patchData.automaticallyProtected : false;
  }

  // Validation methods
  _validateStringField(fieldName, value, allowEmpty = true) {
    if (value === null || value === undefined) {
      if (allowEmpty) return;
      throw new Error(`${fieldName} cannot be null or undefined`);
    }
    if (typeof value !== 'string') {
      throw new Error(`${fieldName} must be a string`);
    }
    if (!allowEmpty && value.trim() === '') {
      throw new Error(`${fieldName} cannot be empty`);
    }
  }

  _validateBooleanField(fieldName, value) {
    if (typeof value !== 'boolean') {
      throw new Error(`${fieldName} must be a boolean`);
    }
  }

  // Getters
  getId() {
    return this.id;
  }

  getLocation() {
    return this.location;
  }

  getPatchType() {
    return this.patchType;
  }

  getPatchDiscriminator() {
    return this.patchDiscriminator;
  }

  getNotes() {
    return this.notes;
  }

  isAutomaticallyProtected() {
    return this.automaticallyProtected;
  }

  // Setters with validation
  setLocation(newLocation) {
    this._validateStringField('location', newLocation, false);
    this.location = newLocation;
  }

  setPatchType(newPatchType) {
    this._validateStringField('patchType', newPatchType, false);
    this.patchType = newPatchType;
  }

  setPatchDiscriminator(newDiscriminator) {
    this._validateStringField('patchDiscriminator', newDiscriminator, false);
    this.patchDiscriminator = newDiscriminator;
  }

  setNotes(newNotes) {
    this._validateStringField('notes', newNotes, true);
    this.notes = newNotes;
  }

  setAutomaticallyProtected(newValue) {
    this._validateBooleanField('automaticallyProtected', newValue);
    this.automaticallyProtected = newValue;
  }

  // Utility methods
  getDisplayName() {
    if (this.patchDiscriminator && this.patchDiscriminator !== '') {
      return `${this.location} ${this.patchType} (${this.patchDiscriminator})`;
    }
    return `${this.location} ${this.patchType}`;
  }

  getShortDisplayName() {
    if (this.patchDiscriminator && this.patchDiscriminator !== '') {
      return `${this.location} (${this.patchDiscriminator})`;
    }
    return this.location;
  }

  // Serialization methods
  toJSON() {
    return {
      id: this.id,
      location: this.location,
      patchType: this.patchType,
      patchDiscriminator: this.patchDiscriminator,
      notes: this.notes,
      automaticallyProtected: this.automaticallyProtected
    };
  }

  static fromJSON(jsonData) {
    return new FarmPatch(jsonData);
  }

  // Validation for patch type
  static isValidPatchType(patchType) {
    const validTypes = [
      'Allotment',
      'Flower',
      'Herb',
      'Tree',
      'Fruit Tree',
      'Bush',
      'Spirit Tree',
      'Cactus',
      'Mushroom',
      'Belladonna',
      'Evil Turnip',
      'Hops',
      'Calquat',
      'Crystal',
      'Anima',
      'Redwood'
    ];
    return validTypes.includes(patchType);
  }

  // Validation for patch discriminator
  static isValidPatchDiscriminator(discriminator) {
    const validDiscriminators = [
      'north',
      'south',
      'east',
      'west',
      'upper',
      'lower',
      'left',
      'right',
      '1',
      '2',
      '3',
      '4'
    ];
    return validDiscriminators.includes(discriminator.toLowerCase());
  }

  // Validate the entire patch
  validate() {
    if (!FarmPatch.isValidPatchType(this.patchType)) {
      throw new Error(`Invalid patch type: ${this.patchType}`);
    }
    if (!FarmPatch.isValidPatchDiscriminator(this.patchDiscriminator)) {
      throw new Error(`Invalid patch discriminator: ${this.patchDiscriminator}`);
    }
    return true;
  }
}

export default FarmPatch;
