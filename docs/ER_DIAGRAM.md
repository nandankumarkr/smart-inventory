# Entity-Relationship (ER) Diagram
## Smart Inventory Management System (SIMS)
**Course:** DBMS Experiential Learning – Level 3 Project  
**Institution:** PES University  

---

### 1. Conceptual ER Model (Mermaid Diagram)

```mermaid
erDiagram
    USERS ||--o{ WAREHOUSES : "manages"
    USERS ||--o{ PURCHASE_ORDERS : "creates"
    USERS ||--o{ STOCK_TRANSFERS : "requests / approves"
    USERS ||--o{ INVENTORY_TRANSACTIONS : "authorizes"
    USERS ||--o{ AUDIT_LOGS : "triggers"

    WAREHOUSES ||--o{ INVENTORY_BATCHES : "stores"
    WAREHOUSES ||--o{ PURCHASE_ORDERS : "receives"
    WAREHOUSES ||--o{ STOCK_TRANSFERS : "source / destination"
    WAREHOUSES ||--o{ WAREHOUSE_TELEMETRY : "monitored_by"

    PRODUCT_CATEGORIES ||--o{ PRODUCT_CATEGORIES : "sub-category_of"
    PRODUCT_CATEGORIES ||--o{ PRODUCTS : "classifies"

    SUPPLIERS ||--o{ PURCHASE_ORDERS : "supplies"

    PRODUCTS ||--|| PRODUCT_EMBEDDINGS : "has_vector"
    PRODUCTS ||--o{ PURCHASE_ORDER_ITEMS : "included_in"
    PRODUCTS ||--o{ INVENTORY_BATCHES : "tracked_as"
    PRODUCTS ||--o{ INVENTORY_TRANSACTIONS : "logged_in"
    PRODUCTS ||--o{ STOCK_TRANSFER_ITEMS : "transferred_as"

    PURCHASE_ORDERS ||--|{ PURCHASE_ORDER_ITEMS : "contains"
    PURCHASE_ORDER_ITEMS ||--o{ INVENTORY_BATCHES : "originates"

    INVENTORY_BATCHES ||--o{ INVENTORY_TRANSACTIONS : "modified_by"
    INVENTORY_BATCHES ||--o{ STOCK_TRANSFER_ITEMS : "picked_from"

    STOCK_TRANSFERS ||--|{ STOCK_TRANSFER_ITEMS : "consists_of"

    USERS {
        uuid user_id PK
        string email UK
        string password_hash
        string full_name
        enum role "ADMIN, MANAGER, STAFF, AUDITOR"
        string department
        boolean is_active
        timestamp created_at
    }

    WAREHOUSES {
        uuid warehouse_id PK
        string warehouse_code UK
        string name
        text address
        string city
        numeric capacity_sqft
        numeric current_occupancy_pct
        uuid manager_id FK
    }

    PRODUCT_CATEGORIES {
        uuid category_id PK
        string category_code UK
        string name
        text description
        uuid parent_category_id FK
    }

    SUPPLIERS {
        uuid supplier_id PK
        string supplier_code UK
        string company_name
        string contact_name
        string email UK
        string phone
        numeric rating
        int lead_time_days
        boolean is_preferred
    }

    PRODUCTS {
        uuid product_id PK
        string sku UK
        string name
        text description
        uuid category_id FK
        string unit_of_measure
        numeric cost_price
        numeric unit_price
        int reorder_level
        int target_stock_level
        boolean is_perishable
        int shelf_life_days
    }

    PRODUCT_EMBEDDINGS {
        uuid embedding_id PK
        uuid product_id FK, UK
        text embedding_text
        vector_384 embedding
        string model_name
        jsonb metadata
    }

    PURCHASE_ORDERS {
        uuid po_id PK
        string po_number UK
        uuid supplier_id FK
        uuid destination_warehouse_id FK
        enum status "DRAFT, ISSUED, PARTIAL, RECEIVED, CANCELLED"
        numeric total_amount
        uuid created_by FK
        date order_date
        date expected_delivery_date
        date actual_delivery_date
    }

    PURCHASE_ORDER_ITEMS {
        uuid po_item_id PK
        uuid po_id FK
        uuid product_id FK
        int ordered_quantity
        int received_quantity
        numeric unit_cost
        numeric line_total
    }

    INVENTORY_BATCHES {
        uuid batch_id PK
        string batch_number
        uuid product_id FK
        uuid warehouse_id FK
        uuid po_item_id FK
        int initial_quantity
        int current_quantity
        numeric unit_cost
        date manufacturing_date
        date expiry_date
        timestamp received_at
    }

    INVENTORY_TRANSACTIONS {
        uuid transaction_id PK
        string transaction_ref
        enum transaction_type "PO_RECEIPT, SALE_FULFILLMENT, TRANSFER..."
        uuid product_id FK
        uuid warehouse_id FK
        uuid batch_id FK
        int quantity_change
        int balance_after
        uuid performed_by FK
        timestamp created_at
    }

    STOCK_TRANSFERS {
        uuid transfer_id PK
        string transfer_number UK
        uuid source_warehouse_id FK
        uuid target_warehouse_id FK
        enum status "PENDING, APPROVED, IN_TRANSIT, COMPLETED"
        uuid requested_by FK
        uuid approved_by FK
        timestamp created_at
        timestamp completed_at
    }

    STOCK_TRANSFER_ITEMS {
        uuid transfer_item_id PK
        uuid transfer_id FK
        uuid product_id FK
        uuid source_batch_id FK
        int quantity
    }

    WAREHOUSE_TELEMETRY {
        uuid telemetry_id PK
        uuid warehouse_id FK
        string zone_code
        timestamp recorded_at
        jsonb sensor_payload
        string device_id
    }

    AUDIT_LOGS {
        bigserial audit_id PK
        string table_name
        string operation
        uuid record_id
        jsonb old_data
        jsonb new_data
        uuid changed_by FK
        timestamp timestamp
    }
```

---

### 2. Entity Identification & Semantic Cardinalities

| Relationship | Entities Involved | Cardinality | Semantic Business Rule |
| :--- | :--- | :--- | :--- |
| **Warehouse Management** | `USERS` to `WAREHOUSES` | `1 : N` (Optional) | A manager can oversee multiple warehouses; a warehouse has at most one designated manager. |
| **Category Hierarchy** | `PRODUCT_CATEGORIES` (Self) | `1 : N` (Optional) | A parent category can have multiple subcategories (e.g., Electronics -> Microcontrollers). |
| **Product Classification** | `PRODUCT_CATEGORIES` to `PRODUCTS` | `1 : N` (Mandatory) | Every product must strictly belong to exactly one product category. |
| **Product Semantic Embeddings** | `PRODUCTS` to `PRODUCT_EMBEDDINGS` | `1 : 1` (Mandatory) | Every product has exactly one dense vector embedding for cosine similarity search. |
| **Procurement Orders** | `SUPPLIERS` to `PURCHASE_ORDERS` | `1 : N` | A supplier supplies zero or many purchase orders. |
| **PO Line Items** | `PURCHASE_ORDERS` to `PURCHASE_ORDER_ITEMS` | `1 : N` (Mandatory) | A PO must have at least one line item. Cascade delete on PO removal. |
| **Batch Tracking** | `PRODUCTS` to `INVENTORY_BATCHES` | `1 : N` | A single product can exist in multiple distinct batches across different warehouses. |
| **Double-Entry Ledger** | `INVENTORY_BATCHES` to `INVENTORY_TRANSACTIONS` | `1 : N` | Every physical stock movement generates an immutable, non-deletable audit ledger entry. |
| **Inter-Warehouse Transfer** | `WAREHOUSES` to `STOCK_TRANSFERS` | `1 : N` | Each transfer has distinct source and target warehouses (`source <> target`). |
| **IoT Telemetry (NoSQL)** | `WAREHOUSES` to `WAREHOUSE_TELEMETRY` | `1 : N` | High-frequency IoT sensory payloads are stored as semi-structured JSONB documents. |
| **Change Data Capture** | `SYSTEM` to `AUDIT_LOGS` | `1 : N` | Row-level triggers intercept all DML mutations into an append-only compliance log. |
