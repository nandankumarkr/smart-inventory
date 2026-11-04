# Relational Schema & Normalization Analysis
## Smart Inventory Management System (SIMS)
**Course:** DBMS Experiential Learning – Level 3 Project  
**Institution:** PES University  

---

### 1. Relational Schema Representation

Notation:
- **`Primary Key (PK)`** is highlighted in bold and underlined.
- *`Foreign Key (FK)`* is marked in italics with arrow referencing source table.
- `[UK]` denotes unique candidate key.

```text
USERS (
    user_id [PK], 
    email [UK], 
    password_hash, 
    full_name, 
    role, 
    department, 
    is_active, 
    created_at, 
    updated_at
)

WAREHOUSES (
    warehouse_id [PK], 
    warehouse_code [UK], 
    name, 
    address, 
    city, 
    country, 
    capacity_sqft, 
    current_occupancy_pct, 
    manager_id [FK -> USERS.user_id], 
    is_active, 
    created_at
)

PRODUCT_CATEGORIES (
    category_id [PK], 
    category_code [UK], 
    name, 
    description, 
    parent_category_id [FK -> PRODUCT_CATEGORIES.category_id], 
    created_at
)

SUPPLIERS (
    supplier_id [PK], 
    supplier_code [UK], 
    company_name, 
    contact_name, 
    email [UK], 
    phone, 
    address, 
    rating, 
    lead_time_days, 
    payment_terms, 
    is_preferred, 
    is_blacklisted, 
    created_at
)

PRODUCTS (
    product_id [PK], 
    sku [UK], 
    name, 
    description, 
    category_id [FK -> PRODUCT_CATEGORIES.category_id], 
    unit_of_measure, 
    cost_price, 
    unit_price, 
    reorder_level, 
    target_stock_level, 
    is_perishable, 
    shelf_life_days, 
    created_at, 
    updated_at
)

PRODUCT_EMBEDDINGS (
    embedding_id [PK], 
    product_id [FK -> PRODUCTS.product_id, UK], 
    embedding_text, 
    embedding (vector_384), 
    model_name, 
    metadata (JSONB), 
    created_at, 
    updated_at
)

PURCHASE_ORDERS (
    po_id [PK], 
    po_number [UK], 
    supplier_id [FK -> SUPPLIERS.supplier_id], 
    destination_warehouse_id [FK -> WAREHOUSES.warehouse_id], 
    status, 
    total_amount, 
    created_by [FK -> USERS.user_id], 
    order_date, 
    expected_delivery_date, 
    actual_delivery_date, 
    notes, 
    created_at
)

PURCHASE_ORDER_ITEMS (
    po_item_id [PK], 
    po_id [FK -> PURCHASE_ORDERS.po_id], 
    product_id [FK -> PRODUCTS.product_id], 
    ordered_quantity, 
    received_quantity, 
    unit_cost, 
    line_total (GENERATED)
    [UK: (po_id, product_id)]
)

INVENTORY_BATCHES (
    batch_id [PK], 
    batch_number, 
    product_id [FK -> PRODUCTS.product_id], 
    warehouse_id [FK -> WAREHOUSES.warehouse_id], 
    po_item_id [FK -> PURCHASE_ORDER_ITEMS.po_item_id], 
    initial_quantity, 
    current_quantity, 
    unit_cost, 
    manufacturing_date, 
    expiry_date, 
    received_at
    [UK: (batch_number, product_id, warehouse_id)]
)

INVENTORY_TRANSACTIONS (
    transaction_id [PK], 
    transaction_ref, 
    transaction_type, 
    product_id [FK -> PRODUCTS.product_id], 
    warehouse_id [FK -> WAREHOUSES.warehouse_id], 
    batch_id [FK -> INVENTORY_BATCHES.batch_id], 
    quantity_change, 
    balance_after, 
    performed_by [FK -> USERS.user_id], 
    notes, 
    created_at
)

STOCK_TRANSFERS (
    transfer_id [PK], 
    transfer_number [UK], 
    source_warehouse_id [FK -> WAREHOUSES.warehouse_id], 
    target_warehouse_id [FK -> WAREHOUSES.warehouse_id], 
    status, 
    requested_by [FK -> USERS.user_id], 
    approved_by [FK -> USERS.user_id], 
    tracking_reference, 
    created_at, 
    completed_at
)

STOCK_TRANSFER_ITEMS (
    transfer_item_id [PK], 
    transfer_id [FK -> STOCK_TRANSFERS.transfer_id], 
    product_id [FK -> PRODUCTS.product_id], 
    source_batch_id [FK -> INVENTORY_BATCHES.batch_id], 
    quantity
)

WAREHOUSE_TELEMETRY (
    telemetry_id [PK], 
    warehouse_id [FK -> WAREHOUSES.warehouse_id], 
    zone_code, 
    recorded_at, 
    sensor_payload (JSONB), 
    device_id
)

AUDIT_LOGS (
    audit_id [PK], 
    table_name, 
    operation, 
    record_id, 
    old_data (JSONB), 
    new_data (JSONB), 
    changed_by [FK -> USERS.user_id], 
    timestamp
)
```

---

### 2. Normalization Verification (3NF & BCNF)

#### A. First Normal Form (1NF)
- **Atomicity**: Every column holds exclusively single, atomic scalar values (UUIDs, integers, numerics, timestamps).
- Multi-valued attributes (e.g. multiple line items in a purchase order or multiple warehouse batch splits) are decomposed into dedicated child relations (`PURCHASE_ORDER_ITEMS`, `INVENTORY_BATCHES`).
- Repeating groups are eliminated.

#### B. Second Normal Form (2NF)
- The relations are in 1NF.
- All non-prime attributes are fully functionally dependent on the entire candidate key:
  - In `PURCHASE_ORDER_ITEMS`, composite candidate key is `{po_id, product_id}`. `ordered_quantity`, `received_quantity`, and `unit_cost` depend strictly on both the specific PO and the specific product.
  - In `INVENTORY_BATCHES`, composite key `{batch_number, product_id, warehouse_id}` uniquely determines batch quantity and costs.
  - Surrogates (`po_item_id`, `batch_id`) serve as compact primary keys, avoiding partial dependencies.

#### C. Third Normal Form (3NF)
- The relations are in 2NF.
- **Elimination of Transitive Dependencies**:
  - `PRODUCTS`: Non-key attributes (`name`, `unit_price`, `cost_price`) depend directly on `product_id`. The category description is NOT stored in `PRODUCTS`; only `category_id` references `PRODUCT_CATEGORIES`, eliminating `product_id -> category_id -> category_description`.
  - `PURCHASE_ORDERS`: Only `supplier_id` is stored. Supplier contact details (`email`, `address`, `phone`) remain normalized in `SUPPLIERS`.
  - `INVENTORY_TRANSACTIONS`: Stores `performed_by` referencing `USERS`; user details are not duplicated.

#### D. Boyce-Codd Normal Form (BCNF)
- For every non-trivial functional dependency $X \rightarrow Y$, the determinant $X$ is a superkey of the respective table:
  - `USERS`: `user_id -> all attributes`, `email -> all attributes` (both are candidate keys).
  - `PRODUCTS`: `product_id -> all attributes`, `sku -> all attributes` (both are superkeys).
  - `WAREHOUSES`: `warehouse_id -> all attributes`, `warehouse_code -> all attributes`.
- Hence, the relational design satisfies **BCNF**.
