# Database Setup Guide - JOHN-BILLS

## Quick Start

### 1. Install Dependencies
```bash
npm install sqlite3
```

### 2. Initialize Database
```bash
# Create and initialize the database
node database/init.js

# Output:
# ✓ Connected to SQLite database
# ✓ Database schema created successfully
# ✓ Database Tables:
#   - company_settings
#   - customers
#   - invoice_line_items
#   - invoices
#   - payment_methods
#   - payments
#   - products
#   - tax_rates
```

### 3. Verify Database
The database file will be created at: `database/john_bills.db`

---

## Database Files

| File | Purpose |
|------|---------|
| `init.sql` | Database schema definition (tables, indexes, defaults) |
| `init.js` | Node.js initialization script |
| `config.js` | Database configuration and connection helper |
| `john_bills.db` | SQLite database file (created on first run) |

---

## Directory Structure

```
database/
├── init.sql          # Schema definition
├── init.js           # Initialization script
├── config.js         # Configuration
└── john_bills.db     # Database file (created)

migrations/
├── 001_initial_schema.js
└── 002_sample_data.js

DATABASE_SCHEMA.md    # Full schema documentation
```

---

## Core Tables

### 1. **Customers** - Store customer information
- Name, email, phone, address
- GSTIN for Indian tax purposes
- Active/inactive status

### 2. **Products** - Product catalog
- SKU, name, description, category
- Unit price and tax rates
- Inventory tracking

### 3. **Invoices** - Master invoices
- Invoice number, customer reference
- Subtotal, tax, discount, total
- Status tracking (draft, issued, paid, etc.)

### 4. **Invoice Line Items** - Invoice details
- Product references or custom items
- Quantity, unit price, calculated totals
- Individual line-item taxes

### 5. **Payments** - Payment records
- Amount, date, method
- Reference numbers (cheque #, transaction ID)
- Links to customers and invoices

### 6. **Payment Methods** - Configuration
- Available payment options
- Cash, cheque, bank transfer, UPI, etc.

### 7. **Tax Rates** - Tax configuration
- Predefined GST slabs (India: 0%, 5%, 12%, 18%, 28%)
- Effective date ranges
- Active/inactive status

### 8. **Company Settings** - Application config
- Company details (name, GSTIN, address)
- Invoice numbering prefix
- Currency and financial year setup

---

## Key Features

✓ **Relational Design** - Proper foreign keys and constraints
✓ **Data Integrity** - Unique constraints on critical fields
✓ **Performance** - Indexed columns for fast queries
✓ **Transaction Support** - ACID compliance
✓ **Cascade Deletes** - Clean removal of related data
✓ **Default Data** - Payment methods and tax rates pre-loaded

---

## Common Operations

### Add a Customer
```javascript
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database/john_bills.db');

db.run(
    'INSERT INTO customers (name, email, phone, city) VALUES (?, ?, ?, ?)',
    ['John Doe', 'john@example.com', '9876543210', 'Mumbai'],
    function(err) {
        if (err) console.error(err);
        else console.log('Customer added with ID:', this.lastID);
    }
);
```

### Create an Invoice
```javascript
db.run(
    'INSERT INTO invoices (invoice_number, customer_id, invoice_date, total_amount, status) VALUES (?, ?, ?, ?, ?)',
    ['MS20260726001', 1, '2026-07-26', 5000, 'issued'],
    function(err) {
        if (err) console.error(err);
        else console.log('Invoice created with ID:', this.lastID);
    }
);
```

### Record a Payment
```javascript
db.run(
    'INSERT INTO payments (invoice_id, customer_id, amount, payment_date, payment_method) VALUES (?, ?, ?, ?, ?)',
    [1, 1, 5000, '2026-07-26', 'bank_transfer'],
    function(err) {
        if (err) console.error(err);
        else console.log('Payment recorded');
    }
);
```

---

## Database Maintenance

### Backup
```bash
copy database\john_bills.db database\john_bills.db.backup
```

### Reset (WARNING: Deletes all data)
```bash
node database/init.js reset
```

### Check Database Size
```bash
# Windows
dir /s database\john_bills.db

# Linux/macOS
ls -lh database/john_bills.db
```

---

## Troubleshooting

### Database file not found
**Solution:** Run `node database/init.js` to initialize

### "Cannot find module 'sqlite3'"
**Solution:** Run `npm install sqlite3`

### "UNIQUE constraint failed"
**Cause:** Duplicate entry in unique field
**Solution:** Check for duplicate values in email, phone, SKU, or invoice_number

### Foreign Key Errors
**Cause:** Referential integrity violation
**Solution:** Ensure related records exist (customer before invoice, etc.)

---

## Next Steps

1. ✅ Database initialized
2. ⏳ Connect frontend to database (update script.js)
3. ⏳ Create API endpoints for CRUD operations
4. ⏳ Add data validation
5. ⏳ Set up backup schedule
6. ⏳ Add reporting features

---

## Documentation

- Full schema details: See `DATABASE_SCHEMA.md`
- SQL queries reference: See `DATABASE_SCHEMA.md` (SQL Queries Reference section)
- Configuration options: See `database/config.js`
