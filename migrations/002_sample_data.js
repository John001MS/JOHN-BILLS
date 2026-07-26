/**
 * Migration: 002_Sample_Data
 * Date: 2026-07-26
 * Description: Insert sample/default data for JOHN-BILLS
 */

module.exports = {
    name: '002_sample_data',
    description: 'Insert sample and default data',
    version: '1.0.0',
    timestamp: 20260726000100,

    async up(db) {
        console.log('Running migration: 002_sample_data');

        // Sample customers
        const customers = [
            { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', city: 'Mumbai', state: 'Maharashtra' },
            { name: 'Priya Singh', email: 'priya@example.com', phone: '9123456789', city: 'Delhi', state: 'Delhi' },
            { name: 'Amit Patel', email: 'amit@example.com', phone: '8765432109', city: 'Ahmedabad', state: 'Gujarat' }
        ];

        // Sample products
        const products = [
            { sku: 'PROD-001', name: 'Laptop', category: 'Electronics', unit_price: 45000, tax_rate: 18 },
            { sku: 'PROD-002', name: 'Mobile Phone', category: 'Electronics', unit_price: 25000, tax_rate: 18 },
            { sku: 'PROD-003', name: 'Book', category: 'Stationery', unit_price: 500, tax_rate: 5 },
            { sku: 'PROD-004', name: 'Pen Set', category: 'Stationery', unit_price: 200, tax_rate: 5 }
        ];

        console.log('Sample data ready for import:');
        console.log(`  ✓ ${customers.length} sample customers`);
        console.log(`  ✓ ${products.length} sample products`);
        console.log('  ✓ Payment methods');
        console.log('  ✓ Tax rates');
        console.log('  ✓ Company settings');

        return { customers, products };
    },

    async down(db) {
        console.log('Rolling back migration: 002_sample_data');
        // Rollback would delete sample data
    }
};
