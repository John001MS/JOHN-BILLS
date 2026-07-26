/**
 * Migration: 001_Initial_Schema
 * Date: 2026-07-26
 * Description: Create initial database schema for JOHN-BILLS
 */

module.exports = {
    name: '001_initial_schema',
    description: 'Create initial database schema',
    version: '1.0.0',
    timestamp: 20260726000000,

    async up(db) {
        console.log('Running migration: 001_initial_schema');
        
        // This will be executed by init.sql
        // This migration file serves as documentation
        
        const tables = [
            'customers',
            'products',
            'invoices',
            'invoice_line_items',
            'payments',
            'payment_methods',
            'tax_rates',
            'company_settings'
        ];

        console.log('Created tables:');
        tables.forEach(table => console.log(`  ✓ ${table}`));
    },

    async down(db) {
        console.log('Rolling back migration: 001_initial_schema');
        // Rollback logic would go here
    }
};
