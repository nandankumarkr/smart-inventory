-- ============================================================================
-- SMART INVENTORY MANAGEMENT SYSTEM (SIMS)
-- DBMS Experiential Learning - Level 3 Project
-- Course: Database Management Systems (PES University)
-- File: 01_schema_ddl.sql
-- Description: Core Data Definition Language (DDL) Script
-- Demonstrates: CREATE, ALTER, DROP, PK, FK, Constraints, Data Types
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Vector database extension for embeddings

-- 2. Clean Drop (Safe Re-execution demonstration)
DROP TABLE IF EXISTS warehouse_telemetry CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS stock_transfer_items CASCADE;
DROP TABLE IF EXISTS stock_transfers CASCADE;
DROP TABLE IF EXISTS inventory_transactions CASCADE;
DROP TABLE IF EXISTS inventory_batches CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS product_embeddings CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS po_status CASCADE;
DROP TYPE IF EXISTS transfer_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;

-- 3. Custom Enumerated Types (Domain constraints)
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'STAFF', 'AUDITOR');
CREATE TYPE po_status AS ENUM ('DRAFT', 'ISSUED', 'PARTIAL', 'RECEIVED', 'CANCELLED');
CREATE TYPE transfer_status AS ENUM ('PENDING', 'APPROVED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED');
CREATE TYPE transaction_type AS ENUM (
    'PO_RECEIPT', 
    'SALE_FULFILLMENT', 
    'TRANSFER_OUT', 
    'TRANSFER_IN', 
    'ADJUSTMENT_ADD', 
    'ADJUSTMENT_SUB', 
    'SCRAP_EXPIRED'
);

-- 4. User Accounts & RBAC
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL DEFAULT 'STAFF',
    department VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 5. Warehouses & Physical Locations
CREATE TABLE warehouses (
    warehouse_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    capacity_sqft NUMERIC(10, 2) NOT NULL,
    current_occupancy_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    manager_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_capacity_positive CHECK (capacity_sqft > 0),
    CONSTRAINT chk_occupancy_valid CHECK (current_occupancy_pct >= 0 AND current_occupancy_pct <= 100)
);

-- 6. Product Categories (Hierarchical self-referencing relationship)
CREATE TABLE product_categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES product_categories(category_id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Suppliers
CREATE TABLE suppliers (
    supplier_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code VARCHAR(30) NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    lead_time_days INT NOT NULL DEFAULT 7,
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    is_preferred BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rating_range CHECK (rating >= 1.00 AND rating <= 5.00),
    CONSTRAINT chk_lead_time_positive CHECK (lead_time_days > 0)
);

-- 8. Products Catalog
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES product_categories(category_id) ON DELETE RESTRICT,
    unit_of_measure VARCHAR(20) NOT NULL DEFAULT 'units',
    cost_price NUMERIC(12, 2) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    reorder_level INT NOT NULL DEFAULT 10,
    target_stock_level INT NOT NULL DEFAULT 50,
    is_perishable BOOLEAN NOT NULL DEFAULT FALSE,
    shelf_life_days INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_cost_price_positive CHECK (cost_price >= 0),
    CONSTRAINT chk_unit_price_positive CHECK (unit_price >= 0),
    CONSTRAINT chk_price_margin CHECK (unit_price >= cost_price),
    CONSTRAINT chk_reorder_levels CHECK (target_stock_level >= reorder_level),
    CONSTRAINT chk_shelf_life CHECK (is_perishable = FALSE OR (shelf_life_days IS NOT NULL AND shelf_life_days > 0))
);

-- 9. Product Vector Embeddings (Option 2: Vector Database integration with pgvector)
CREATE TABLE product_embeddings (
    embedding_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL UNIQUE REFERENCES products(product_id) ON DELETE CASCADE,
    embedding_text TEXT NOT NULL,
    embedding vector(384) NOT NULL, -- 384-dimensional dense vector (all-MiniLM-L6-v2)
    model_name VARCHAR(100) NOT NULL DEFAULT 'sentence-transformers/all-MiniLM-L6-v2',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Purchase Orders (Procurement)
CREATE TABLE purchase_orders (
    po_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id) ON DELETE RESTRICT,
    destination_warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id) ON DELETE RESTRICT,
    status po_status NOT NULL DEFAULT 'DRAFT',
    total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    created_by UUID NOT NULL REFERENCES users(user_id),
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery_date DATE NOT NULL,
    actual_delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_delivery_date CHECK (expected_delivery_date >= order_date)
);

-- 11. Purchase Order Line Items
CREATE TABLE purchase_order_items (
    po_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(po_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    ordered_quantity INT NOT NULL,
    received_quantity INT NOT NULL DEFAULT 0,
    unit_cost NUMERIC(12, 2) NOT NULL,
    line_total NUMERIC(14, 2) GENERATED ALWAYS AS (ordered_quantity * unit_cost) STORED,
    CONSTRAINT uq_po_product UNIQUE (po_id, product_id),
    CONSTRAINT chk_ordered_qty_pos CHECK (ordered_quantity > 0),
    CONSTRAINT chk_received_qty_valid CHECK (received_quantity >= 0 AND received_quantity <= ordered_quantity)
);

-- 12. Inventory Batches (FIFO and Expiration Tracking)
CREATE TABLE inventory_batches (
    batch_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number VARCHAR(60) NOT NULL,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id) ON DELETE RESTRICT,
    po_item_id UUID REFERENCES purchase_order_items(po_item_id) ON DELETE SET NULL,
    initial_quantity INT NOT NULL,
    current_quantity INT NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL,
    manufacturing_date DATE,
    expiry_date DATE,
    received_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_batch_warehouse UNIQUE (batch_number, product_id, warehouse_id),
    CONSTRAINT chk_batch_initial_qty CHECK (initial_quantity > 0),
    CONSTRAINT chk_batch_current_qty CHECK (current_quantity >= 0 AND current_quantity <= initial_quantity),
    CONSTRAINT chk_batch_dates CHECK (expiry_date IS NULL OR manufacturing_date IS NULL OR expiry_date > manufacturing_date)
);

-- 13. Inventory Transaction Ledger (Double-Entry Immutable Audit Log)
CREATE TABLE inventory_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_ref VARCHAR(80) NOT NULL,
    transaction_type transaction_type NOT NULL,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES inventory_batches(batch_id) ON DELETE RESTRICT,
    quantity_change INT NOT NULL, -- Positive for inbound, negative for outbound
    balance_after INT NOT NULL,
    performed_by UUID NOT NULL REFERENCES users(user_id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_qty_change_nonzero CHECK (quantity_change <> 0),
    CONSTRAINT chk_balance_nonnegative CHECK (balance_after >= 0)
);

-- 14. Inter-Warehouse Stock Transfers
CREATE TABLE stock_transfers (
    transfer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_number VARCHAR(50) NOT NULL UNIQUE,
    source_warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id) ON DELETE RESTRICT,
    target_warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id) ON DELETE RESTRICT,
    status transfer_status NOT NULL DEFAULT 'PENDING',
    requested_by UUID NOT NULL REFERENCES users(user_id),
    approved_by UUID REFERENCES users(user_id),
    tracking_reference VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    CONSTRAINT chk_different_warehouses CHECK (source_warehouse_id <> target_warehouse_id)
);

CREATE TABLE stock_transfer_items (
    transfer_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_id UUID NOT NULL REFERENCES stock_transfers(transfer_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    source_batch_id UUID NOT NULL REFERENCES inventory_batches(batch_id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    CONSTRAINT chk_transfer_qty CHECK (quantity > 0)
);

-- 15. System Audit Logs (Change Data Capture / Security)
CREATE TABLE audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES users(user_id),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. Warehouse Telemetry (NoSQL JSONB Component: IoT Environmental Monitoring)
-- Satisfies NoSQL/Semi-Structured Data paradigm requirement for cold storage & warehouse conditions
CREATE TABLE warehouse_telemetry (
    telemetry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id) ON DELETE CASCADE,
    zone_code VARCHAR(30) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sensor_payload JSONB NOT NULL, -- e.g., {"temp_c": 4.2, "humidity_pct": 55.0, "vibration_g": 0.02, "door_open_sec": 0}
    device_id VARCHAR(80) NOT NULL
);

-- 17. Demonstration of ALTER statement (adding operational constraint & audit column)
ALTER TABLE suppliers 
    ADD COLUMN is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE products 
    ADD CONSTRAINT chk_sku_uppercase CHECK (sku = UPPER(sku));

COMMENT ON TABLE products IS 'Master catalog of all managed inventory SKUs with threshold settings';
COMMENT ON TABLE inventory_batches IS 'Physical FIFO batches tracking expiration and unit costs across facilities';
COMMENT ON TABLE inventory_transactions IS 'Append-only double entry ledger of every stock movement';
COMMENT ON TABLE product_embeddings IS 'Vector similarity store for semantic catalog search powered by pgvector';
COMMENT ON TABLE warehouse_telemetry IS 'Semi-structured NoSQL JSONB store for IoT sensory and environmental metrics';
