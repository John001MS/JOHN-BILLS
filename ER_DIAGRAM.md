# JOHN-BILLS Entity Relationship Diagram

## Database Schema Visualization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       JOHN-BILLS DATABASE SCHEMA                             │
└─────────────────────────────────────────────────────────────────────────────┘

                           ┌──────────────────────┐
                           │   COMPANY_SETTINGS   │
                           │  (App Configuration) │
                           │─────────────────────│
                           │ id (PK)              │
                           │ company_name         │
                           │ gstin                │
                           │ address              │
                           │ invoice_prefix       │
                           │ currency             │
                           │ financial_year_start │
                           │ created_at           │
                           └──────────────────────┘


    ┌──────────────────┐                      ┌──────────────────┐
    │   CUSTOMERS      │                      │     PRODUCTS     │
    │  (Store Clients) │                      │   (Inventory)    │
    │──────────────────│                      │──────────────────│
    │ id (PK)          │                      │ id (PK)          │
    │ name             │                      │ sku (UNIQUE)     │
    │ email (UNIQUE)   │                      │ name             │
    │ phone (UNIQUE)   │                      │ description      │
    │ address          │                      │ category         │
    │ city             │◄─────────┐           │ unit_price       │
    │ gstin            │          │           │ tax_rate         │
    │ is_active        │          │           │ stock_quantity   │
    │ created_at       │          │           │ is_active        │
    └──────────────────┘          │           │ created_at       │
           ▲ 1                     │           └──────────────────┘
           │                       │                   ▲ 0..1
           │ (Has Many)            │ (References)      │
           │                       │                   │
           │ Many                  │                   │
           │                       │                   │
    ┌──────────────────┐           │       ┌──────────────────────────────┐
    │     INVOICES     │           │       │  INVOICE_LINE_ITEMS          │
    │  (Billing Docs)  │           │       │  (Line Details)              │
    │──────────────────│           │       │──────────────────────────────│
    │ id (PK)          │           │       │ id (PK)                      │
    │ invoice_number   │           │       │ invoice_id (FK)      ────────┤─┐
    │ customer_id (FK) ├──────────┘       │ product_id (FK)      ────────┤─┤
    │ invoice_date     │                  │ item_name                    │ │
    │ due_date         │                  │ quantity                     │ │
    │ subtotal         │                  │ unit_price                   │ │
    │ tax_amount       │                  │ tax_rate                     │ │
    │ discount_amount  │                  │ line_total                   │ │
    │ total_amount     │                  │ created_at                   │ │
    │ status           │                  └──────────────────────────────┘ │
    │ created_at       │                                                    │
    └──────────────────┘                                                    │
           ▲ 1                                                              │
           │                                                               │
           │ (Referenced by)                                              │
           │ Many                                                         │
           │                                                              │
    ┌──────────────────┐          ┌────────────────────┐                  │
    │     PAYMENTS     │          │  PAYMENT_METHODS   │                  │
    │  (Transactions)  │          │ (Configuration)    │                  │
    │──────────────────│          │────────────────────│                  │
    │ id (PK)          │          │ id (PK)            │                  │
    │ invoice_id (FK)  ├──────────→ name               │                  │
    │ customer_id (FK) │ (Many-1) │ description        │                  │
    │ amount           │          │ is_active          │                  │
    │ payment_date     │          │ created_at         │                  │
    │ payment_method   │          │                    │                  │
    │ reference_number │          │ Values:            │                  │
    │ created_at       │          │ - cash             │                  │
    └──────────────────┘          │ - cheque           │                  │
           ▲ Many                 │ - bank_transfer    │                  │
           │                      │ - credit_card      │                  │
           │ (References)         │ - upi              │                  │
           │                      │ - wallet           │                  │
           │ Many                 │ - other            │                  │
           │                      └────────────────────┘                  │
    ┌──────────────────┐                                                  │
    │    TAX_RATES     │◄─────────────────────────────────────────────────┘
    │  (Configuration) │
    │──────────────────│
    │ id (PK)          │
    │ tax_name         │
    │ tax_code (UNIQUE)│
    │ tax_percentage   │
    │ is_active        │
    │ effective_from   │
    │ effective_to     │
    │ created_at       │
    └──────────────────┘

    Default Tax Rates (India):
    • GST 0% (0)
    • GST 5% (5)
    • GST 12% (12)
    • GST 18% (18)
    • GST 28% (28)
```

---

## Relationship Legend

| Symbol | Meaning |
|--------|---------|
| `───────→` | One-to-Many Relationship |
| `◄───────` | Many-to-One Relationship |
| `(PK)` | Primary Key |
| `(FK)` | Foreign Key |
| `(UNIQUE)` | Unique Constraint |
| `0..1` | Zero or One |
| `1` | Exactly One |
| `Many` | Many Records |

---

## Key Relationships

### 1. CUSTOMERS ↔ INVOICES
- **Type:** One-to-Many
- **Relationship:** One customer can have many invoices
- **Constraint:** Foreign key customer_id in invoices table
- **Cascade:** Delete customer → orphaned invoices

### 2. INVOICES ↔ INVOICE_LINE_ITEMS
- **Type:** One-to-Many
- **Relationship:** One invoice has many line items
- **Constraint:** Foreign key invoice_id in line_items
- **Cascade:** Delete invoice → DELETE line items

### 3. INVOICES ↔ PAYMENTS
- **Type:** One-to-Many
- **Relationship:** One invoice can have multiple payments (partial payments)
- **Constraint:** Foreign key invoice_id in payments
- **Cascade:** Delete invoice → orphaned payments

### 4. CUSTOMERS ↔ PAYMENTS
- **Type:** One-to-Many
- **Relationship:** One customer can have many payments
- **Constraint:** Foreign key customer_id in payments
- **Usage:** Track total payments by customer

### 5. PRODUCTS ↔ INVOICE_LINE_ITEMS
- **Type:** One-to-Many (Optional)
- **Relationship:** Product may appear in many line items
- **Constraint:** Foreign key product_id in line_items (nullable)
- **Usage:** Track which products are sold

### 6. PAYMENT_METHODS ↔ PAYMENTS
- **Type:** One-to-Many
- **Relationship:** Payment method used by many payments
- **Constraint:** payment_method in payments matches name in payment_methods
- **Flexibility:** Can add new payment methods without schema changes

### 7. TAX_RATES ↔ PRODUCTS
- **Type:** One-to-Many
- **Relationship:** Tax rate can apply to many products
- **Constraint:** tax_rate field (numeric, not FK for flexibility)
- **Usage:** Quick tax lookup by percentage

### 8. TAX_RATES ↔ INVOICE_LINE_ITEMS
- **Type:** One-to-Many
- **Relationship:** Tax rate stored per line item
- **Constraint:** tax_rate field (denormalized for invoice accuracy)
- **Purpose:** Preserve tax rates at time of invoicing

---

## Data Flow Examples

### Creating an Invoice

```
1. CUSTOMERS
   Create new customer: John Doe
   
2. PRODUCTS
   Select items to invoice:
   - Laptop (SKU: PROD-001, Price: 45000)
   - Mobile Phone (SKU: PROD-002, Price: 25000)
   
3. INVOICES
   Create invoice MS20260726001
   - customer_id = 1 (John Doe)
   - invoice_date = 2026-07-26
   - total_amount = 70000
   - status = 'draft'
   
4. INVOICE_LINE_ITEMS
   Add line items:
   - product_id = 1, qty = 1, line_total = 45000
   - product_id = 2, qty = 1, line_total = 25000
   
5. INVOICES (UPDATE)
   Calculate totals:
   - subtotal = 70000
   - tax_amount = 12600 (18% GST)
   - total_amount = 82600
   - status = 'issued'
```

### Recording Payment

```
1. PAYMENTS
   Create payment:
   - invoice_id = 1 (MS20260726001)
   - customer_id = 1 (John Doe)
   - amount = 82600
   - payment_date = 2026-07-26
   - payment_method = 'bank_transfer'
   - reference_number = 'NEFT001234'
   
2. INVOICES (UPDATE)
   Update invoice status based on total payments:
   - status = 'paid'
```

### Payment Reconciliation Query

```
SELECT 
    i.invoice_number,
    i.total_amount,
    SUM(p.amount) as paid_amount,
    i.total_amount - SUM(p.amount) as outstanding
FROM invoices i
LEFT JOIN payments p ON i.id = p.invoice_id
GROUP BY i.id
HAVING outstanding > 0;
```

---

## Index Strategy

### Indexed Columns (Performance Optimized)

```
invoices
├── idx_invoices_customer_id    (Quick customer lookup)
├── idx_invoices_status         (Filter by status)
└── idx_invoices_invoice_date   (Date range queries)

payments
├── idx_payments_invoice_id     (Find payments by invoice)
├── idx_payments_customer_id    (Customer payment history)
└── idx_payments_payment_date   (Date range queries)

customers
├── idx_customers_email         (Unique customer check)
└── idx_customers_phone         (Unique customer check)

products
└── idx_products_sku            (Quick product lookup)

invoice_line_items
└── idx_invoice_line_items_invoice_id (Quick line item fetch)
```

---

## Constraints & Validations

### Primary Keys
- All tables have integer auto-increment PK

### Unique Constraints
- customers: email + phone combination
- products: sku
- invoices: invoice_number
- tax_rates: tax_code
- payment_methods: name

### Foreign Key Constraints
- invoices.customer_id → customers.id
- invoice_line_items.invoice_id → invoices.id (CASCADE DELETE)
- invoice_line_items.product_id → products.id
- payments.invoice_id → invoices.id
- payments.customer_id → customers.id

### Check Constraints
- invoices.status IN ('draft','issued','paid','partially_paid','overdue','cancelled')
- payments.payment_method IN ('cash','cheque','bank_transfer','credit_card','upi','wallet','other')

---

## Normalization Level: 3NF

✓ **1NF (First Normal Form):** All columns contain atomic values  
✓ **2NF (Second Normal Form):** All non-key columns depend on entire primary key  
✓ **3NF (Third Normal Form):** No transitive dependencies  

**Exception:** Tax rate is denormalized in invoice_line_items to preserve the tax rate at the time of invoicing (good for historical accuracy).

---

## Future Extension Points

```
FUTURE:
┌──────────────────┐
│  USER_ACCOUNTS   │ ← User management & authentication
└──────────────────┘
       ↓
┌──────────────────┐
│    AUDIT_LOG     │ ← Track all changes for compliance
└──────────────────┘
       ↓
┌──────────────────┐
│ REPORT_TEMPLATES │ ← Custom report generation
└──────────────────┘
       ↓
┌──────────────────┐
│  REMINDERS       │ ← Payment reminders/follow-ups
└──────────────────┘
```

---

**Schema Version:** 1.0.0  
**Created:** 2026-07-26  
**Database:** SQLite  
**Status:** Production Ready ✅
