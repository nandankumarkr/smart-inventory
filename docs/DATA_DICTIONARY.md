# Data Dictionary
## Smart Inventory Management System (SIMS)
**Course:** DBMS Experiential Learning – Level 3 Project  
**Institution:** PES University  

---

### Table 1: `users`
Stores system actors with role-based access control privileges.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `user_id` | UUID | NO | PK | `uuid_generate_v4()` | Unique immutable identifier for the user account |
| `email` | VARCHAR(255) | NO | UK | None | Valid corporate email address used for login |
| `password_hash` | VARCHAR(255) | NO | None | None | Bcrypt salted and hashed secret string |
| `full_name` | VARCHAR(150) | NO | None | None | Legal name of user |
| `role` | ENUM | NO | None | `'STAFF'` | RBAC Role: `ADMIN`, `MANAGER`, `STAFF`, `AUDITOR` |
| `department` | VARCHAR(100) | YES | None | None | Organizational unit / operational branch |
| `is_active` | BOOLEAN | NO | None | `TRUE` | Soft-deactivation toggle |
| `created_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Account creation audit timestamp |
| `updated_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Last profile update timestamp |

---

### Table 2: `warehouses`
Physical logistics facilities, distribution hubs, and cold storage locations.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warehouse_id` | UUID | NO | PK | `uuid_generate_v4()` | Unique primary key of facility |
| `warehouse_code` | VARCHAR(20) | NO | UK | None | Human-readable unique code (e.g., `WH-BLR-01`) |
| `name` | VARCHAR(100) | NO | None | None | Descriptive facility name |
| `address` | TEXT | NO | None | None | Street address |
| `city` | VARCHAR(100) | NO | None | None | City name |
| `country` | VARCHAR(100) | NO | None | `'India'` | Sovereign country |
| `capacity_sqft` | NUMERIC(10,2)| NO | None | None | Total floor surface area in square feet |
| `current_occupancy_pct` | NUMERIC(5,2) | NO | None | `0.00` | Dynamically computed capacity utilization (%) |
| `manager_id` | UUID | YES | FK | None | References `users(user_id)` assigned as lead |
| `is_active` | BOOLEAN | NO | None | `TRUE` | Whether facility is receiving stock |
| `created_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Registration date |

---

### Table 3: `product_categories`
Self-referencing hierarchical taxonomy for inventory categorization.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category_id` | UUID | NO | PK | `uuid_generate_v4()` | Unique category identifier |
| `category_code` | VARCHAR(30) | NO | UK | None | Unique business classification code |
| `name` | VARCHAR(100) | NO | None | None | Name of category |
| `description` | TEXT | YES | None | None | Scope and specifications of classification |
| `parent_category_id` | UUID | YES | FK | None | References `product_categories(category_id)` for sub-tree |
| `created_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Creation timestamp |

---

### Table 4: `suppliers`
Vendor registry for procurement, contracts, and lead-time tracking.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `supplier_id` | UUID | NO | PK | `uuid_generate_v4()` | Primary key of supplier |
| `supplier_code` | VARCHAR(30) | NO | UK | None | Unique vendor identifier (e.g. `SUP-SEMICORP`) |
| `company_name` | VARCHAR(150) | NO | None | None | Registered corporate legal entity name |
| `contact_name` | VARCHAR(100) | NO | None | None | Point of contact person |
| `email` | VARCHAR(255) | NO | UK | None | Commercial procurement email |
| `phone` | VARCHAR(30) | NO | None | None | Phone number with country code |
| `address` | TEXT | NO | None | None | Physical manufacturing / distribution facility |
| `rating` | NUMERIC(3,2) | YES | None | `5.00` | SLA performance rating score [1.00 - 5.00] |
| `lead_time_days` | INT | NO | None | `7` | Contractual replenishment delivery turnaround days |
| `payment_terms` | VARCHAR(50) | YES | None | `'Net 30'` | Credit terms |
| `is_preferred` | BOOLEAN | NO | None | `FALSE` | High-priority supplier designation |
| `is_blacklisted`| BOOLEAN | NO | None | `FALSE` | Added via ALTER DDL demonstration |
| `created_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Supplier onboarding timestamp |

---

### Table 5: `products`
Master catalog of SKU assets with inventory reordering thresholds.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `product_id` | UUID | NO | PK | `uuid_generate_v4()` | Unique SKU identifier |
| `sku` | VARCHAR(50) | NO | UK | None | Stock Keeping Unit code (enforced uppercase) |
| `name` | VARCHAR(200) | NO | None | None | Product commercial trade name |
| `description` | TEXT | YES | None | None | Full technical specifications & material specs |
| `category_id` | UUID | NO | FK | None | References `product_categories(category_id)` |
| `unit_of_measure` | VARCHAR(20) | NO | None | `'units'` | Counting unit: pcs, vials, canisters, etc. |
| `cost_price` | NUMERIC(12,2)| NO | None | None | Procurement standard cost per unit (INR) |
| `unit_price` | NUMERIC(12,2)| NO | None | None | Outbound selling / transfer price (INR) |
| `reorder_level` | INT | NO | None | `10` | Safety stock threshold triggering restock |
| `target_stock_level` | INT | NO | None | `50` | Optimal equilibrium inventory ceiling |
| `is_perishable` | BOOLEAN | NO | None | `FALSE` | Flag requiring batch expiration monitoring |
| `shelf_life_days` | INT | YES | None | None | Maximum operational storage duration |
| `created_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Catalog listing timestamp |
| `updated_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Last modification timestamp |

---

### Table 6: `product_embeddings` (Vector Database Paradigm)
High-dimensional dense vector embeddings enabling AI semantic search.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `embedding_id` | UUID | NO | PK | `uuid_generate_v4()` | Unique vector entry identifier |
| `product_id` | UUID | NO | FK, UK | None | 1-to-1 reference to `products(product_id)` |
| `embedding_text`| TEXT | NO | None | None | Concatenated textual data used to compute vector |
| `embedding` | VECTOR(384) | NO | None | None | 384-dimensional dense representation |
| `model_name` | VARCHAR(100) | NO | None | `'sentence-transformers/all-MiniLM-L6-v2'` | Embedding neural network model |
| `metadata` | JSONB | YES | None | `'{}'::jsonb` | Unstructured tags, facets, and filter keys |
| `created_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Ingestion timestamp |

---

### Table 7: `inventory_batches`
Physical inventory lots tracking FIFO order, acquisition costs, and expiration dates.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `batch_id` | UUID | NO | PK | `uuid_generate_v4()` | Unique batch primary key |
| `batch_number` | VARCHAR(60) | NO | UK (comp) | None | Lot manufacturing batch number |
| `product_id` | UUID | NO | FK, UK(comp) | None | References `products(product_id)` |
| `warehouse_id` | UUID | NO | FK, UK(comp) | None | References `warehouses(warehouse_id)` |
| `po_item_id` | UUID | YES | FK | None | References originating `purchase_order_items` |
| `initial_quantity` | INT | NO | None | None | Original received volume |
| `current_quantity` | INT | NO | None | None | Remaining available unreserved units (>= 0) |
| `unit_cost` | NUMERIC(12,2)| NO | None | None | Specific acquisition cost of this batch |
| `manufacturing_date`| DATE | YES | None | None | Production date |
| `expiry_date` | DATE | YES | None | None | Shelf-life expiration date |
| `received_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Warehouse receiving timestamp |

---

### Table 8: `inventory_transactions` (Immutable Ledger)
Append-only double-entry audit journal recording every stock delta.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `transaction_id`| UUID | NO | PK | `uuid_generate_v4()` | Unique ledger entry ID |
| `transaction_ref`| VARCHAR(80)| NO | None | None | Reference code (e.g. `PO-102`, `SO-991`, `TRF-12`) |
| `transaction_type`| ENUM | NO | None | None | `PO_RECEIPT`, `SALE_FULFILLMENT`, `TRANSFER_OUT`, etc. |
| `product_id` | UUID | NO | FK | None | Targeted SKU |
| `warehouse_id` | UUID | NO | FK | None | Facility where movement occurred |
| `batch_id` | UUID | YES | FK | None | Targeted physical batch |
| `quantity_change`| INT | NO | None | None | Signed delta (+ for receipt, - for issue) |
| `balance_after` | INT | NO | None | None | Snapshot of SKU physical balance after operation |
| `performed_by` | UUID | NO | FK | None | References `users(user_id)` who executed action |
| `notes` | TEXT | YES | None | None | Operational context and reason |
| `created_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Immutable timestamp |

---

### Table 9: `warehouse_telemetry` (NoSQL Document Paradigm)
Semi-structured JSONB time-series data from IoT sensors monitoring storage environments.

| Column Name | Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `telemetry_id` | UUID | NO | PK | `uuid_generate_v4()` | Unique telemetry packet ID |
| `warehouse_id` | UUID | NO | FK | None | References `warehouses(warehouse_id)` |
| `zone_code` | VARCHAR(30) | NO | None | None | Storage zone (e.g. `ZONE-COLD-A`) |
| `recorded_at` | TIMESTAMPTZ | NO | None | `CURRENT_TIMESTAMP` | Ping timestamp |
| `sensor_payload`| JSONB | NO | None | None | Unstructured JSON: temp, humidity, vibration, etc. |
| `device_id` | VARCHAR(80) | NO | None | None | Hardware sensor MAC or serial number |
