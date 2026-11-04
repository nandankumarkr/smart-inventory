-- ============================================================================
-- SMART INVENTORY MANAGEMENT SYSTEM (SIMS)
-- DBMS Experiential Learning - Level 3 Project
-- File: 03_triggers_and_procedures.sql
-- Description: Stored Procedures, Functions, Triggers, and ACID Transactions
-- Demonstrates: Stored Procedures, Triggers, ACID Transactions, Row Locking
-- ============================================================================

-- ============================================================================
-- SECTION A: STORED PROCEDURES & BUSINESS LOGIC FUNCTIONS
-- ============================================================================

-- PROCEDURE 1: Atomic Inter-Warehouse Stock Transfer (ACID Transaction)
-- Ensures atomicity: Stock is deducted from source and credited to destination
-- simultaneously using row-level locking (SELECT ... FOR UPDATE) to avoid race conditions.
CREATE OR REPLACE PROCEDURE sp_execute_stock_transfer(
    p_transfer_id UUID,
    p_performed_by UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_source_wh UUID;
    v_target_wh UUID;
    v_status transfer_status;
    v_item RECORD;
    v_source_batch RECORD;
    v_target_batch_id UUID;
    v_source_balance INT;
    v_target_balance INT;
BEGIN
    -- 1. Lock and validate transfer header
    SELECT source_warehouse_id, target_warehouse_id, status
    INTO v_source_wh, v_target_wh, v_status
    FROM stock_transfers
    WHERE transfer_id = p_transfer_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Stock transfer record % does not exist', p_transfer_id;
    END IF;

    IF v_status <> 'PENDING' AND v_status <> 'APPROVED' THEN
        RAISE EXCEPTION 'Transfer cannot be executed. Current status is: %', v_status;
    END IF;

    -- 2. Iterate through each transfer item
    FOR v_item IN 
        SELECT transfer_item_id, product_id, source_batch_id, quantity
        FROM stock_transfer_items
        WHERE transfer_id = p_transfer_id
    LOOP
        -- Row-level lock on source batch to prevent concurrent race condition over-depletion
        SELECT batch_id, batch_number, current_quantity, unit_cost, manufacturing_date, expiry_date
        INTO v_source_batch
        FROM inventory_batches
        WHERE batch_id = v_item.source_batch_id AND warehouse_id = v_source_wh
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Batch % not found at source warehouse', v_item.source_batch_id;
        END IF;

        IF v_source_batch.current_quantity < v_item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock in batch %. Available: %, Requested: %', 
                v_source_batch.batch_number, v_source_batch.current_quantity, v_item.quantity;
        END IF;

        -- 3. Deduct from source batch
        UPDATE inventory_batches
        SET current_quantity = current_quantity - v_item.quantity
        WHERE batch_id = v_source_batch.batch_id;

        -- Calculate source warehouse balance after
        SELECT COALESCE(SUM(current_quantity), 0) INTO v_source_balance
        FROM inventory_batches WHERE product_id = v_item.product_id AND warehouse_id = v_source_wh;

        -- Record ledger outbound transaction
        INSERT INTO inventory_transactions (
            transaction_ref, transaction_type, product_id, warehouse_id, 
            batch_id, quantity_change, balance_after, performed_by, notes
        ) VALUES (
            'TRF-OUT-' || p_transfer_id::TEXT,
            'TRANSFER_OUT',
            v_item.product_id,
            v_source_wh,
            v_source_batch.batch_id,
            -v_item.quantity,
            v_source_balance,
            p_performed_by,
            'Transfer to Warehouse ' || v_target_wh::TEXT
        );

        -- 4. Credit to target warehouse batch (create or update existing batch)
        SELECT batch_id INTO v_target_batch_id
        FROM inventory_batches
        WHERE batch_number = v_source_batch.batch_number 
          AND product_id = v_item.product_id 
          AND warehouse_id = v_target_wh
        FOR UPDATE;

        IF FOUND THEN
            UPDATE inventory_batches
            SET current_quantity = current_quantity + v_item.quantity
            WHERE batch_id = v_target_batch_id;
        ELSE
            INSERT INTO inventory_batches (
                batch_number, product_id, warehouse_id, initial_quantity, 
                current_quantity, unit_cost, manufacturing_date, expiry_date
            ) VALUES (
                v_source_batch.batch_number,
                v_item.product_id,
                v_target_wh,
                v_item.quantity,
                v_item.quantity,
                v_source_batch.unit_cost,
                v_source_batch.manufacturing_date,
                v_source_batch.expiry_date
            ) RETURNING batch_id INTO v_target_batch_id;
        END IF;

        -- Calculate target warehouse balance after
        SELECT COALESCE(SUM(current_quantity), 0) INTO v_target_balance
        FROM inventory_batches WHERE product_id = v_item.product_id AND warehouse_id = v_target_wh;

        -- Record ledger inbound transaction
        INSERT INTO inventory_transactions (
            transaction_ref, transaction_type, product_id, warehouse_id, 
            batch_id, quantity_change, balance_after, performed_by, notes
        ) VALUES (
            'TRF-IN-' || p_transfer_id::TEXT,
            'TRANSFER_IN',
            v_item.product_id,
            v_target_wh,
            v_target_batch_id,
            v_item.quantity,
            v_target_balance,
            p_performed_by,
            'Received from Warehouse ' || v_source_wh::TEXT
        );
    END LOOP;

    -- 5. Mark transfer completed
    UPDATE stock_transfers
    SET status = 'COMPLETED',
        completed_at = CURRENT_TIMESTAMP
    WHERE transfer_id = p_transfer_id;

END;
$$;


-- PROCEDURE 2: Automated First-In, First-Out (FIFO) Order Fulfillment
-- Automatically selects the oldest non-expired batches for fulfillment and records ledger entries
CREATE OR REPLACE PROCEDURE sp_fulfill_order_fifo(
    p_product_id UUID,
    p_warehouse_id UUID,
    p_order_qty INT,
    p_reference_code VARCHAR(80),
    p_performed_by UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_remaining_qty INT := p_order_qty;
    v_total_available INT;
    v_batch RECORD;
    v_deduct_qty INT;
    v_balance_after INT;
BEGIN
    IF p_order_qty <= 0 THEN
        RAISE EXCEPTION 'Order quantity must be positive. Received: %', p_order_qty;
    END IF;

    -- Verify total available stock at facility
    SELECT COALESCE(SUM(current_quantity), 0) INTO v_total_available
    FROM inventory_batches
    WHERE product_id = p_product_id 
      AND warehouse_id = p_warehouse_id
      AND current_quantity > 0
      AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE);

    IF v_total_available < p_order_qty THEN
        RAISE EXCEPTION 'Insufficient stock to fulfill FIFO order. Available: %, Requested: %', 
            v_total_available, p_order_qty;
    END IF;

    -- Iterate batches using FIFO (Earliest expiration first, then earliest receipt)
    FOR v_batch IN
        SELECT batch_id, batch_number, current_quantity
        FROM inventory_batches
        WHERE product_id = p_product_id 
          AND warehouse_id = p_warehouse_id
          AND current_quantity > 0
          AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
        ORDER BY expiry_date ASC NULLS LAST, received_at ASC
        FOR UPDATE
    LOOP
        EXIT WHEN v_remaining_qty <= 0;

        IF v_batch.current_quantity >= v_remaining_qty THEN
            v_deduct_qty := v_remaining_qty;
        ELSE
            v_deduct_qty := v_batch.current_quantity;
        END IF;

        -- Deduct from batch
        UPDATE inventory_batches
        SET current_quantity = current_quantity - v_deduct_qty
        WHERE batch_id = v_batch.batch_id;

        v_remaining_qty := v_remaining_qty - v_deduct_qty;

        -- Ledger logging
        SELECT COALESCE(SUM(current_quantity), 0) INTO v_balance_after
        FROM inventory_batches 
        WHERE product_id = p_product_id AND warehouse_id = p_warehouse_id;

        INSERT INTO inventory_transactions (
            transaction_ref, transaction_type, product_id, warehouse_id,
            batch_id, quantity_change, balance_after, performed_by, notes
        ) VALUES (
            p_reference_code,
            'SALE_FULFILLMENT',
            p_product_id,
            p_warehouse_id,
            v_batch.batch_id,
            -v_deduct_qty,
            v_balance_after,
            p_performed_by,
            'FIFO allocation from batch ' || v_batch.batch_number
        );
    END LOOP;
END;
$$;


-- ============================================================================
-- SECTION B: DATABASE TRIGGERS
-- ============================================================================

-- TRIGGER 1: Strict Negative Inventory Prevention
-- Guarantees at database engine level that no race condition or bad DML can produce negative stock
CREATE OR REPLACE FUNCTION fn_prevent_negative_inventory()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.current_quantity < 0 THEN
        RAISE EXCEPTION 'Database Integrity Constraint: Batch % stock cannot be negative (Attempted value: %)', 
            NEW.batch_number, NEW.current_quantity;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_negative_inventory
BEFORE INSERT OR UPDATE OF current_quantity ON inventory_batches
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_negative_inventory();


-- TRIGGER 2: Automatic Change Data Capture (CDC) Audit Logging
-- Logs all modifications made to products, suppliers, and purchase orders into audit_logs
CREATE OR REPLACE FUNCTION fn_audit_table_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_record_id UUID;
    v_user_id UUID;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_record_id := OLD.product_id;
        INSERT INTO audit_logs (table_name, operation, record_id, old_data, new_data, changed_by)
        VALUES (TG_TABLE_NAME, TG_OP, v_record_id, to_jsonb(OLD), NULL, NULL);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        v_record_id := NEW.product_id;
        INSERT INTO audit_logs (table_name, operation, record_id, old_data, new_data, changed_by)
        VALUES (TG_TABLE_NAME, TG_OP, v_record_id, to_jsonb(OLD), to_jsonb(NEW), NULL);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        v_record_id := NEW.product_id;
        INSERT INTO audit_logs (table_name, operation, record_id, old_data, new_data, changed_by)
        VALUES (TG_TABLE_NAME, TG_OP, v_record_id, NULL, to_jsonb(NEW), NULL);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_products_changes
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION fn_audit_table_changes();


-- TRIGGER 3: Dynamic Warehouse Occupancy Calculation
-- Updates the capacity percentage utilization of a warehouse whenever batches change
CREATE OR REPLACE FUNCTION fn_recalculate_warehouse_occupancy()
RETURNS TRIGGER AS $$
DECLARE
    v_wh_id UUID;
    v_total_units INT;
    v_capacity NUMERIC;
    v_pct NUMERIC;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_wh_id := OLD.warehouse_id;
    ELSE
        v_wh_id := NEW.warehouse_id;
    END IF;

    SELECT capacity_sqft INTO v_capacity FROM warehouses WHERE warehouse_id = v_wh_id;
    SELECT COALESCE(SUM(current_quantity), 0) INTO v_total_units FROM inventory_batches WHERE warehouse_id = v_wh_id;

    -- Assume 1 unit requires average 0.25 sqft volume
    v_pct := LEAST(100.0, ROUND(((v_total_units * 0.25) / NULLIF(v_capacity, 0)) * 100, 2));

    UPDATE warehouses 
    SET current_occupancy_pct = COALESCE(v_pct, 0.0)
    WHERE warehouse_id = v_wh_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_warehouse_occupancy
AFTER INSERT OR UPDATE OF current_quantity OR DELETE ON inventory_batches
FOR EACH ROW
EXECUTE FUNCTION fn_recalculate_warehouse_occupancy();
