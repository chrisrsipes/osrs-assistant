const sqliteDatabase = require('./sqliteDatabase');

class FarmPatchDatabase {
  constructor() {
    // Ensure database is initialized
    this.init();
  }

  async init() {
    if (!sqliteDatabase.isConnected) {
      await sqliteDatabase.init();
    }
  }
  // Get all farm patches
  async getAll() {
    await this.init();
    const query = `
      SELECT 
        id,
        location,
        patch_type as patchType,
        patch_discriminator as patchDiscriminator,
        notes,
        automatically_protected as automaticallyProtected,
        created_at as createdAt,
        updated_at as updatedAt
      FROM farm_patches 
      ORDER BY location, patch_type, patch_discriminator
    `;
    
    return new Promise((resolve, reject) => {
      sqliteDatabase.db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get farm patch by ID
  async getById(id) {
    await this.init();
    const query = `
      SELECT 
        id,
        location,
        patch_type as patchType,
        patch_discriminator as patchDiscriminator,
        notes,
        automatically_protected as automaticallyProtected,
        created_at as createdAt,
        updated_at as updatedAt
      FROM farm_patches 
      WHERE id = ?
    `;
    
    return new Promise((resolve, reject) => {
      sqliteDatabase.db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error(`Farm patch with id ${id} not found`));
        } else {
          resolve(row);
        }
      });
    });
  }

  // Create new farm patch
  async create(patchData) {
    await this.init();
    const query = `
      INSERT INTO farm_patches (
        location, 
        patch_type, 
        patch_discriminator, 
        notes, 
        automatically_protected
      ) VALUES (?, ?, ?, ?, ?)
    `;
    
    const params = [
      patchData.location,
      patchData.patchType,
      patchData.patchDiscriminator,
      patchData.notes || '',
      patchData.automaticallyProtected ? 1 : 0
    ];
    
    return new Promise((resolve, reject) => {
      sqliteDatabase.db.run(query, params, function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            reject(new Error('A farm patch with this location, type, and discriminator already exists'));
          } else {
            reject(err);
          }
        } else {
          resolve({ id: this.lastID, ...patchData });
        }
      });
    });
  }

  // Update farm patch
  async update(id, patchData) {
    await this.init();
    const query = `
      UPDATE farm_patches 
      SET 
        location = ?,
        patch_type = ?,
        patch_discriminator = ?,
        notes = ?,
        automatically_protected = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const params = [
      patchData.location,
      patchData.patchType,
      patchData.patchDiscriminator,
      patchData.notes || '',
      patchData.automaticallyProtected ? 1 : 0,
      id
    ];
    
    return new Promise((resolve, reject) => {
      sqliteDatabase.db.run(query, params, function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            reject(new Error('A farm patch with this location, type, and discriminator already exists'));
          } else {
            reject(err);
          }
        } else if (this.changes === 0) {
          reject(new Error(`Farm patch with id ${id} not found`));
        } else {
          resolve({ id, ...patchData });
        }
      });
    });
  }

  // Delete farm patch
  async delete(id) {
    await this.init();
    const query = 'DELETE FROM farm_patches WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      sqliteDatabase.db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error(`Farm patch with id ${id} not found`));
        } else {
          resolve({ id, deleted: true });
        }
      });
    });
  }

  // Get farm patches by location
  async getByLocation(location) {
    await this.init();
    const query = `
      SELECT 
        id,
        location,
        patch_type as patchType,
        patch_discriminator as patchDiscriminator,
        notes,
        automatically_protected as automaticallyProtected,
        created_at as createdAt,
        updated_at as updatedAt
      FROM farm_patches 
      WHERE location = ?
      ORDER BY patch_type, patch_discriminator
    `;
    
    return new Promise((resolve, reject) => {
      sqliteDatabase.db.all(query, [location], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get farm patches by patch type
  async getByPatchType(patchType) {
    await this.init();
    const query = `
      SELECT 
        id,
        location,
        patch_type as patchType,
        patch_discriminator as patchDiscriminator,
        notes,
        automatically_protected as automaticallyProtected,
        created_at as createdAt,
        updated_at as updatedAt
      FROM farm_patches 
      WHERE patch_type = ?
      ORDER BY location, patch_discriminator
    `;
    
    return new Promise((resolve, reject) => {
      sqliteDatabase.db.all(query, [patchType], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Search farm patches
  async search(searchTerm) {
    await this.init();
    const query = `
      SELECT 
        id,
        location,
        patch_type as patchType,
        patch_discriminator as patchDiscriminator,
        notes,
        automatically_protected as automaticallyProtected,
        created_at as createdAt,
        updated_at as updatedAt
      FROM farm_patches 
      WHERE 
        location LIKE ? OR 
        patch_type LIKE ? OR 
        patch_discriminator LIKE ? OR 
        notes LIKE ?
      ORDER BY location, patch_type, patch_discriminator
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const params = [searchPattern, searchPattern, searchPattern, searchPattern];
    
    return new Promise((resolve, reject) => {
      sqliteDatabase.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get unique locations
  async getUniqueLocations() {
    await this.init();
    const query = 'SELECT DISTINCT location FROM farm_patches ORDER BY location';
    
    return new Promise((resolve, reject) => {
      sqliteDatabase.db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => row.location));
        }
      });
    });
  }

  // Get unique patch types
  async getUniquePatchTypes() {
    await this.init();
    const query = 'SELECT DISTINCT patch_type FROM farm_patches ORDER BY patch_type';
    
    return new Promise((resolve, reject) => {
      sqliteDatabase.db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => row.patch_type));
        }
      });
    });
  }
}

module.exports = new FarmPatchDatabase();
