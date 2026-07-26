/**
 * Database Configuration
 * Connection and operational settings for JOHN-BILLS
 */

const path = require('path');

module.exports = {
    // Database type
    type: 'sqlite',

    // Database file location
    database: path.join(__dirname, 'john_bills.db'),

    // Connection pooling
    pool: {
        min: 1,
        max: 5
    },

    // Timezone
    timezone: 'local',

    // Foreign keys support
    supportBigNumbers: true,
    bigNumberStrings: true,

    // Enable foreign key constraints
    acquireConnectionTimeout: 10000,

    // Statement timeout (in milliseconds)
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,

    // Query logging
    logging: false, // Set to console.log to enable query logging

    // Synchronization
    synchronize: false,
    migrationsRun: false,

    // Entities and migrations
    entities: [],
    migrations: [path.join(__dirname, '../migrations/*.ts')],
    cli: {
        migrationsDir: path.join(__dirname, '../migrations'),
    },
};

/**
 * Database connection helper
 */
class DatabaseConnection {
    constructor() {
        this.db = null;
    }

    /**
     * Connect to database
     */
    static connect() {
        return new Promise((resolve, reject) => {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(
                module.exports.database,
                (err) => {
                    if (err) {
                        console.error('Database connection error:', err);
                        reject(err);
                    } else {
                        // Enable foreign keys
                        db.run('PRAGMA foreign_keys = ON', (err) => {
                            if (err) reject(err);
                            else resolve(db);
                        });
                    }
                }
            );
        });
    }

    /**
     * Close database connection
     */
    static close(db) {
        return new Promise((resolve, reject) => {
            if (db) {
                db.close((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports.DatabaseConnection = DatabaseConnection;
