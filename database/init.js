/**
 * JOHN-BILLS Database Initialization Script
 * Creates and initializes SQLite database with billing schema
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'john_bills.db');
const SCHEMA_PATH = path.join(__dirname, 'init.sql');

/**
 * Initialize the database
 */
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        // Connect to database (creates if doesn't exist)
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
                return;
            }
            console.log('✓ Connected to SQLite database');

            // Read schema file
            fs.readFile(SCHEMA_PATH, 'utf8', (err, sql) => {
                if (err) {
                    console.error('Error reading schema file:', err.message);
                    db.close();
                    reject(err);
                    return;
                }

                // Execute schema
                db.exec(sql, (err) => {
                    if (err) {
                        console.error('Error executing schema:', err.message);
                        db.close();
                        reject(err);
                        return;
                    }
                    console.log('✓ Database schema created successfully');

                    // Verify tables
                    db.all(
                        `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`,
                        (err, tables) => {
                            if (err) {
                                console.error('Error fetching tables:', err.message);
                                db.close();
                                reject(err);
                                return;
                            }

                            console.log('\n✓ Database Tables:');
                            tables.forEach(table => {
                                console.log(`  - ${table.name}`);
                            });

                            db.close((err) => {
                                if (err) {
                                    console.error('Error closing database:', err.message);
                                    reject(err);
                                    return;
                                }
                                console.log('\n✓ Database initialization complete!');
                                console.log(`📁 Database file: ${DB_PATH}`);
                                resolve();
                            });
                        }
                    );
                });
            });
        });
    });
}

/**
 * Reset database (drop all tables and reinitialize)
 */
function resetDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
                return;
            }

            // Get all tables
            db.all(
                `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
                (err, tables) => {
                    if (err) {
                        console.error('Error fetching tables:', err.message);
                        db.close();
                        reject(err);
                        return;
                    }

                    // Drop all tables
                    let dropCount = 0;
                    tables.forEach(table => {
                        db.run(`DROP TABLE IF EXISTS ${table.name}`, (err) => {
                            if (err) console.error(`Error dropping table ${table.name}:`, err.message);
                            else console.log(`✓ Dropped table: ${table.name}`);
                            
                            dropCount++;
                            if (dropCount === tables.length) {
                                // Reinitialize after dropping all tables
                                fs.readFile(SCHEMA_PATH, 'utf8', (err, sql) => {
                                    if (err) {
                                        console.error('Error reading schema file:', err.message);
                                        db.close();
                                        reject(err);
                                        return;
                                    }

                                    db.exec(sql, (err) => {
                                        if (err) {
                                            console.error('Error executing schema:', err.message);
                                            db.close();
                                            reject(err);
                                            return;
                                        }
                                        console.log('✓ Database reset and reinitialized successfully');
                                        db.close();
                                        resolve();
                                    });
                                });
                            }
                        });
                    });
                }
            );
        });
    });
}

// Main execution
const args = process.argv.slice(2);
const command = args[0] || 'init';

if (command === 'reset') {
    console.log('Resetting database...\n');
    resetDatabase()
        .catch(err => {
            console.error('Failed to reset database:', err);
            process.exit(1);
        });
} else {
    console.log('Initializing JOHN-BILLS database...\n');
    initializeDatabase()
        .catch(err => {
            console.error('Failed to initialize database:', err);
            process.exit(1);
        });
}
