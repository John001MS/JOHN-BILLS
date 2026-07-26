# JOHN-BILLS Database Schema Documentation

## Overview
The JOHN-BILLS database is built on **SQLite** for lightweight, serverless operation. It manages all aspects of billing operations including customers, invoices, payments, and products.

## Database Selection: SQLite

### Why SQLite?
- ✓ **No server required** - Single file database
- ✓ **Easy deployment** - No installation/configuration
- ✓ **Perfect for billing** - ACID compliant with transactions
- ✓ **Portable** - Works on Windows, Linux, macOS
- ✓ **Simple backup** - Just copy the .db file
- ✓ **Good performance** - Sufficient for small to medium billing operations

### Requirements
```bash
npm install sqlite3
```

---

## Database Tables

### 1. **CUSTOMERS** 
Stores customer information for billing.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AI | Unique customer identifier |
| name | TEXT | NOT NULL | Customer full name |
| email | TEXT | UNIQUE | Email address |
| phone | TEXT | UNIQUE | Phone number |
| address | TEXT | - | Street address |
| city | TEXT | - | City name |
| state | TEXT | - | State/Province |
| postal_code | TEXT | - | Postal code |
| country | TEXT | DEFAULT 'India' | Country |
| gstin | TEXT | - | GST Identification Number |
| is_active | BOOLEAN | DEFAULT 1 | Active status flag |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update time |

**Indexes:** `email`, `phone`

---

### 2. **PRODUCTS**
Product/service catalog for billing.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AI | Unique product identifier |
| sku | TEXT | UNIQUE, NOT NULL | Stock Keeping Unit |
| name | TEXT | NOT NULL | Product name |
| description | TEXT | - | Product description |
| category | TEXT | - | Product category |
| unit_price | DECIMAL(10,2) | NOT NULL | Price per unit |
| tax_rate | DECIMAL(5,2) | DEFAULT 0 | Tax rate percentage |
| is_active | BOOLEAN | DEFAULT 1 | Active status flag |
| stock_quantity | INTEGER | DEFAULT 0 | Inventory count |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update time |

**Indexes:** `sku`

---

### 3. **INVOICES**
Master invoice records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AI | Unique invoice identifier |
| invoice_number | TEXT | UNIQUE, NOT NULL | Invoice reference number (e.g., MS20260726001) |
| customer_id | INTEGER | FK, NOT NULL | Reference to customers table |
| invoice_date | DATE | NOT NULL | Invoice creation date |
| due_date | DATE | - | Payment due date |
| subtotal | DECIMAL(12,2) | DEFAULT 0 | Total before tax |
| tax_amount | DECIMAL(12,2) | DEFAULT 0 | Total tax amount |
| discount_amount | DECIMAL(12,2) | DEFAULT 0 | Applied discount |
| total_amount | DECIMAL(12,2) | NOT NULL | Final invoice amount |
| status | TEXT | DEFAULT 'draft' | Invoice status (see below) |
| notes | TEXT | - | Additional notes |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update time |

**Status Values:**
- `draft` - Invoice in preparation
- `issued` - Sent to customer
- `paid` - Fully paid
- `partially_paid` - Partial payment received
- `overdue` - Payment past due date
- `cancelled` - Invoice cancelled

**Indexes:** `customer_id`, `status`, `invoice_date`
**Foreign Keys:** `customer_id` → customers(id)

---

### 4. **INVOICE_LINE_ITEMS**
Individual items within an invoice.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AI | Unique line item identifier |
| invoice_id | INTEGER | FK, NOT NULL | Reference to invoices |
| product_id | INTEGER | FK | Reference to products (nullable for custom items) |
| item_name | TEXT | NOT NULL | Item/product name |
| quantity | DECIMAL(10,2) | NOT NULL | Quantity sold |
| unit_price | DECIMAL(10,2) | NOT NULL | Price per unit |
| tax_rate | DECIMAL(5,2) | DEFAULT 0 | Tax rate for this item |
| line_total | DECIMAL(12,2) | NOT NULL | quantity × unit_price |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation time |

**Indexes:** `invoice_id`
**Foreign Keys:** 
- `invoice_id` → invoices(id) [CASCADE DELETE]
- `product_id` → products(id)

---

### 5. **PAYMENTS**
Payment records against invoices.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AI | Unique payment identifier |
| invoice_id | INTEGER | FK, NOT NULL | Reference to invoices |
| customer_id | INTEGER | FK, NOT NULL | Reference to customers |
| amount | DECIMAL(12,2) | NOT NULL | Payment amount |
| payment_date | DATE | NOT NULL | Date of payment |
| payment_method | TEXT | - | Method used (see payment_methods table) |
| reference_number | TEXT | - | Transaction reference/cheque number |
| notes | TEXT | - | Payment notes |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update time |

**Payment Methods:**
- `cash` - Cash payment
- `cheque` - Cheque payment
- `bank_transfer` - Bank/NEFT/RTGS
- `credit_card` - Credit card
- `upi` - UPI payment
- `wallet` - Digital wallet
- `other` - Other method

**Indexes:** `invoice_id`, `customer_id`, `payment_date`
**Foreign Keys:** 
- `invoice_id` → invoices(id)
- `customer_id` → customers(id)

---

### 6. **PAYMENT_METHODS**
Available payment method configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AI | Method identifier |
| name | TEXT | UNIQUE, NOT NULL | Method name |
| description | TEXT | - | Description |
| is_active | BOOLEAN | DEFAULT 1 | Active status |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation time |

**Default Values:**
- Cash
- Cheque
- Bank Transfer
- Credit Card
- UPI
- Digital Wallet
- Other

---

### 7. **TAX_RATES**
Tax configuration (e.g., GST slabs in India).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AI | Tax rate identifier |
| tax_name | TEXT | NOT NULL | Tax name (e.g., "GST 18%") |
| tax_code | TEXT | UNIQUE, NOT NULL | Tax code (e.g., "GST_18") |
| tax_percentage | DECIMAL(5,2) | NOT NULL | Tax rate percentage |
| is_active | BOOLEAN | DEFAULT 1 | Active status |
| effective_from | DATE | - | Effective date |
| effective_to | DATE | - | Expiration date |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update time |

**Default Tax Rates (Indian GST):**
- GST 0% - 0%
- GST 5% - 5%
- GST 12% - 12%
- GST 18% - 18%
- GST 28% - 28%

---

### 8. **COMPANY_SETTINGS**
Company and application configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Settings identifier (always 1) |
| company_name | TEXT | NOT NULL | Company legal name |
| gstin | TEXT | - | Company GST number |
| address | TEXT | - | Company address |
| city | TEXT | - | City |
| state | TEXT | - | State |
| postal_code | TEXT | - | Postal code |
| country | TEXT | DEFAULT 'India' | Country |
| phone | TEXT | - | Company phone |
| email | TEXT | - | Company email |
| website | TEXT | - | Company website |
| logo_path | TEXT | - | Path to company logo |
| invoice_prefix | TEXT | DEFAULT 'MS' | Invoice number prefix |
| financial_year_start_month | INTEGER | DEFAULT 4 | FY start month (1-12) |
| currency | TEXT | DEFAULT 'INR' | Currency code |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update time |

---

## Database Relationships

```
CUSTOMERS (1) -------- (Many) INVOICES
                             |
                             |
                             └---- (Many) INVOICE_LINE_ITEMS
                                         |
                                         └---- (0..1) PRODUCTS

CUSTOMERS (1) -------- (Many) PAYMENTS (Many) -------- (1) INVOICES

PAYMENT_METHODS ---- (Used by) PAYMENTS
TAX_RATES ---------- (Used by) INVOICE_LINE_ITEMS
COMPANY_SETTINGS --- (Application Configuration)
```

---

## Setup & Initialization

### 1. **Initial Setup**
```bash
npm install sqlite3

# Run initialization
node database/init.js
```

### 2. **Database Reset** (Caution: Deletes all data)
```bash
node database/init.js reset
```

### 3. **Verify Setup**
Check that `database/john_bills.db` exists.

---

## SQL Queries Reference

### Get Invoice Summary
```sql
SELECT 
    i.invoice_number,
    c.name,
    i.total_amount,
    i.status,
    i.invoice_date
FROM invoices i
JOIN customers c ON i.customer_id = c.id
ORDER BY i.created_at DESC;
```

### Get Unpaid/Overdue Invoices
```sql
SELECT 
    i.invoice_number,
    c.name,
    i.total_amount,
    SUM(p.amount) as paid_amount,
    i.total_amount - COALESCE(SUM(p.amount), 0) as outstanding
FROM invoices i
JOIN customers c ON i.customer_id = c.id
LEFT JOIN payments p ON i.id = p.invoice_id
WHERE i.status IN ('issued', 'overdue', 'partially_paid')
GROUP BY i.id
ORDER BY i.invoice_date DESC;
```

### Get Customer Payment History
```sql
SELECT 
    c.name,
    COUNT(i.id) as total_invoices,
    SUM(i.total_amount) as total_invoiced,
    SUM(p.amount) as total_paid
FROM customers c
LEFT JOIN invoices i ON c.id = i.customer_id
LEFT JOIN payments p ON i.id = p.invoice_id
GROUP BY c.id;
```

---

## Maintenance

### Backup Database
```bash
# Copy the database file
copy database\john_bills.db database\john_bills.db.backup
```

### Enable Foreign Key Constraints
The database automatically enables foreign key constraints on connection.

### Verify Database Integrity
```sql
PRAGMA integrity_check;
```

---

## Performance Considerations

✓ Indexes on frequently queried columns
✓ Cascade delete on line items for data consistency
✓ Unique constraints on invoice numbers and SKUs
✓ Proper foreign key relationships
✓ Optimized for typical billing operations

---

## Future Enhancements

- [ ] Add user authentication table
- [ ] Add invoice templates table
- [ ] Add expense/cost tracking tables
- [ ] Add report generation views
- [ ] Add audit logs table
- [ ] Add email templates table
- [ ] Add reminders/notifications system
