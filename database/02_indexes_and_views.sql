-- ============================================================================
-- SMART INVENTORY MANAGEMENT SYSTEM (SIMS)
-- DBMS Experiential Learning - Level 3 Project
-- File: 02_indexes_and_views.sql
-- Description: Performance Indexing Strategy & Analytical Database Views
-- Demonstrates: B-Tree, Composite, GIN Full-Text, HNSW Vector Indexes & Views
-- ============================================================================

-- ============================================================================
-- SECTION A: PERFORMANCE INDEXING STRATEGY
-- ============================================================================

-- 1. Foreign Key Performance Indexes (Eliminating sequential table scans on JOINs)
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_warehouse ON purchase_orders(destination_warehouse_id);
CREATE INDEX idx_po_items_po ON purchase_order_items(po_id);
CREATE INDEX idx_po_items_product ON purchase_order_items(product_id);
CREATE INDEX idx_batches_product ON inventory_batches(product_id);
CREATE INDEX idx_batches_warehouse ON inventory_batches(warehouse_id);
CREATE INDEX idx_transactions_product ON inventory_transactions(product_id);
CREATE INDEX idx_transactions_warehouse ON inventory_transactions(warehouse_id);
CREATE INDEX idx_transfers_source ON stock_transfers(source_warehouse_id);
CREATE INDEX idx_transfers_target ON stock_transfers(target_warehouse_id);

-- 2. Composite Indexes for High-Velocity Inventory Querying
-- Essential for FIFO picking: filters product and warehouse, orders by earliest expiration
CREATE INDEX idx_batches_fifo_lookup 
    ON inventory_batches(product_id, warehouse_id, expiry_date ASC, current_quantity)
    WHERE current_quantity > 0;

-- Composite index on transactions for time-series stock reconciliation per SKU
CREATE INDEX idx_transactions_sku_time 
    ON inventory_transactions(product_id, created_at DESC);

-- 3. Full-Text Search Index (GIN Index for keyword catalog search)
CREATE INDEX idx_products_fts 
    ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- 4. Vector Database Index (HNSW - Hierarchical Navigable Small World for pgvector)
-- Provides fast sub-millisecond approximate nearest neighbor (ANN) search using cosine distance
CREATE INDEX idx_product_embeddings_hnsw 
    ON product_embeddings USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- 5. NoSQL Document GIN Index on IoT Telemetry JSONB
CREATE INDEX idx_telemetry_payload_gin 
    ON warehouse_telemetry USING gin(sensor_payload);

CREATE INDEX idx_telemetry_warehouse_time 
    ON warehouse_telemetry(warehouse_id, recorded_at DESC);


-- ============================================================================
-- SECTION B: ADVANCED DATABASE VIEWS (DML SELECT & Aggregation)
-- ============================================================================

-- VIEW 1: Live Low-Stock & Reorder Alerts
-- Aggregates current physical stock across all warehouses and computes reorder deficit
CREATE OR REPLACE VIEW vw_low_stock_alerts AS
SELECT 
    p.product_id,
    p.sku,
    p.name AS product_name,
    c.name AS category_name,
    p.reorder_level,
    p.target_stock_level,
    COALESCE(SUM(b.current_quantity), 0) AS total_on_hand,
    CASE 
        WHEN COALESCE(SUM(b.current_quantity), 0) = 0 THEN 'OUT_OF_STOCK'
        WHEN COALESCE(SUM(b.current_quantity), 0) <= p.reorder_level THEN 'CRITICAL_LOW'
        WHEN COALESCE(SUM(b.current_quantity), 0) <= (p.reorder_level * 1.25) THEN 'WARNING_LOW'
        ELSE 'OPTIMAL'
    END AS stock_status,
    GREATEST(0, p.target_stock_level - COALESCE(SUM(b.current_quantity), 0)) AS suggested_reorder_qty,
    p.cost_price,
    ROUND(GREATEST(0, p.target_stock_level - COALESCE(SUM(b.current_quantity), 0)) * p.cost_price, 2) AS estimated_replenishment_cost
FROM products p
JOIN product_categories c ON p.category_id = c.category_id
LEFT JOIN inventory_batches b ON p.product_id = b.product_id AND b.current_quantity > 0
GROUP BY p.product_id, p.sku, p.name, c.name, p.reorder_level, p.target_stock_level, p.cost_price;

COMMENT ON VIEW vw_low_stock_alerts IS 'Live computed inventory deficits and recommended PO quantities';


-- VIEW 2: Real-time FIFO Inventory Valuation
-- Computes the true financial asset value of inventory based on actual batch costs
CREATE OR REPLACE VIEW vw_inventory_valuation_fifo AS
SELECT 
    w.warehouse_id,
    w.warehouse_code,
    w.name AS warehouse_name,
    c.name AS category_name,
    COUNT(DISTINCT b.product_id) AS distinct_sku_count,
    COUNT(b.batch_id) AS active_batch_count,
    SUM(b.current_quantity) AS total_units_in_stock,
    ROUND(SUM(b.current_quantity * b.unit_cost), 2) AS total_valuation_at_cost,
    ROUND(SUM(b.current_quantity * p.unit_price), 2) AS total_potential_revenue,
    ROUND(SUM(b.current_quantity * (p.unit_price - b.unit_cost)), 2) AS unrealized_gross_profit,
    ROUND(
        CASE 
            WHEN SUM(b.current_quantity * b.unit_cost) > 0 
            THEN ((SUM(b.current_quantity * (p.unit_price - b.unit_cost))) / SUM(b.current_quantity * b.unit_cost)) * 100
            ELSE 0 
        END, 2
    ) AS projected_markup_percentage
FROM warehouses w
JOIN inventory_batches b ON w.warehouse_id = b.warehouse_id
JOIN products p ON b.product_id = p.product_id
JOIN product_categories c ON p.category_id = c.category_id
WHERE b.current_quantity > 0
GROUP BY w.warehouse_id, w.warehouse_code, w.name, c.name;

COMMENT ON VIEW vw_inventory_valuation_fifo IS 'Financial balance sheet valuation of active stock per facility and category';


-- VIEW 3: Comprehensive Supplier Performance Scorecard
-- Multi-table JOIN and aggregate metrics tracking on-time fulfillment, reliability, and volume
CREATE OR REPLACE VIEW vw_supplier_scorecard AS
SELECT 
    s.supplier_id,
    s.supplier_code,
    s.company_name,
    s.rating,
    s.lead_time_days AS agreed_lead_time_days,
    COUNT(po.po_id) AS total_orders_placed,
    COUNT(CASE WHEN po.status = 'RECEIVED' THEN 1 END) AS orders_completed,
    COUNT(CASE WHEN po.status = 'CANCELLED' THEN 1 END) AS orders_cancelled,
    COALESCE(SUM(po.total_amount), 0.00) AS cumulative_spend,
    ROUND(AVG(
        CASE 
            WHEN po.actual_delivery_date IS NOT NULL 
            THEN (po.actual_delivery_date - po.order_date)
            ELSE NULL 
        END
    ), 1) AS avg_actual_lead_time_days,
    ROUND(
        (COUNT(CASE WHEN po.actual_delivery_date <= po.expected_delivery_date THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(CASE WHEN po.status = 'RECEIVED' THEN 1 END), 0)::NUMERIC) * 100, 
        2
    ) AS on_time_delivery_rate_pct,
    ROUND(
        (SUM(poi.received_quantity)::NUMERIC / NULLIF(SUM(poi.ordered_quantity), 0)::NUMERIC) * 100,
        2
    ) AS quantity_fulfillment_rate_pct
FROM suppliers s
LEFT JOIN purchase_orders po ON s.supplier_id = po.supplier_id
LEFT JOIN purchase_order_items poi ON po.po_id = poi.po_id
GROUP BY s.supplier_id, s.supplier_code, s.company_name, s.rating, s.lead_time_days;

COMMENT ON VIEW vw_supplier_scorecard IS 'Supplier SLA scorecard combining delivery reliability, fulfillment and spend';


-- VIEW 4: Expiration Risk Analysis (Perishability & Scrap Forecast)
-- Identifies batches approaching expiry or already expired, calculating financial write-off exposure
CREATE OR REPLACE VIEW vw_expiring_batches_forecast AS
SELECT 
    b.batch_id,
    b.batch_number,
    p.sku,
    p.name AS product_name,
    w.name AS warehouse_name,
    b.current_quantity,
    b.unit_cost,
    ROUND(b.current_quantity * b.unit_cost, 2) AS capital_at_risk,
    b.expiry_date,
    (b.expiry_date - CURRENT_DATE) AS days_until_expiry,
    CASE 
        WHEN b.expiry_date < CURRENT_DATE THEN 'EXPIRED'
        WHEN (b.expiry_date - CURRENT_DATE) <= 15 THEN 'CRITICAL_UNDER_15_DAYS'
        WHEN (b.expiry_date - CURRENT_DATE) <= 30 THEN 'WARNING_UNDER_30_DAYS'
        WHEN (b.expiry_date - CURRENT_DATE) <= 60 THEN 'UPCOMING_UNDER_60_DAYS'
        ELSE 'SAFE'
    END AS risk_tier
FROM inventory_batches b
JOIN products p ON b.product_id = p.product_id
JOIN warehouses w ON b.warehouse_id = w.warehouse_id
WHERE p.is_perishable = TRUE 
  AND b.current_quantity > 0
  AND b.expiry_date IS NOT NULL
ORDER BY b.expiry_date ASC;

COMMENT ON VIEW vw_expiring_batches_forecast IS 'Risk management view for perishables expiring within operational horizons';


-- VIEW 5: Daily Revenue Summaries (Proposal Requirement: "database views for daily revenue summaries")
-- Aggregates outbound client dispatches, gross revenue, cost of goods sold (COGS), and net profits per day
CREATE OR REPLACE VIEW vw_daily_revenue_summary AS
SELECT 
    so.order_date,
    COUNT(DISTINCT so.order_id) AS total_orders_fulfilled,
    COUNT(soi.order_item_id) AS line_items_dispatched,
    SUM(soi.quantity) AS total_units_sold,
    ROUND(SUM(soi.line_total), 2) AS gross_sales_revenue,
    ROUND(SUM(soi.quantity * soi.unit_cost), 2) AS total_cogs,
    ROUND(SUM(soi.line_total - (soi.quantity * soi.unit_cost)), 2) AS net_operating_profit,
    ROUND(
        (SUM(soi.line_total - (soi.quantity * soi.unit_cost)) / NULLIF(SUM(soi.line_total), 0)) * 100, 
        2
    ) AS gross_profit_margin_pct
FROM sales_orders so
JOIN sales_order_items soi ON so.order_id = soi.order_id
GROUP BY so.order_date
ORDER BY so.order_date DESC;

COMMENT ON VIEW vw_daily_revenue_summary IS 'Daily sales, cost basis, gross revenue, and profit margin analysis';


-- VIEW 6: Automated Daily Burn Rates & Restock Predictor (Proposal Requirement: "automatically calculates daily burn rates")
-- Calculates continuous 7-day outbound consumption velocity and predicts days until complete stockout
CREATE OR REPLACE VIEW vw_daily_burn_rate_and_restock_predictor AS
WITH StockLevels AS (
    SELECT 
        p.product_id,
        p.sku,
        p.name AS product_name,
        p.reorder_level,
        p.target_stock_level,
        p.cost_price,
        COALESCE(SUM(b.current_quantity), 0) AS total_on_hand
    FROM products p
    LEFT JOIN inventory_batches b ON p.product_id = b.product_id AND b.current_quantity > 0
    GROUP BY p.product_id, p.sku, p.name, p.reorder_level, p.target_stock_level, p.cost_price
),
ConsumptionVelocity AS (
    -- Tracks negative inventory movements (sales and outbound dispatches) over last 14 days
    SELECT 
        product_id,
        ROUND(COALESCE(ABS(SUM(quantity_change)), 0)::NUMERIC / 14.0, 2) AS daily_burn_rate
    FROM inventory_transactions
    WHERE transaction_type IN ('SALE_FULFILLMENT', 'TRANSFER_OUT', 'ADJUSTMENT_SUB')
      AND created_at >= (CURRENT_DATE - INTERVAL '14 days')
    GROUP BY product_id
)
SELECT 
    sl.product_id,
    sl.sku,
    sl.product_name,
    sl.total_on_hand,
    COALESCE(cv.daily_burn_rate, 2.50) AS daily_burn_rate_units,
    ROUND(
        sl.total_on_hand / NULLIF(COALESCE(cv.daily_burn_rate, 2.50), 0), 
        1
    ) AS days_until_stockout,
    (CURRENT_DATE + (ROUND(sl.total_on_hand / NULLIF(COALESCE(cv.daily_burn_rate, 2.50), 0), 0)::INT * INTERVAL '1 day'))::DATE AS predicted_stockout_date,
    sl.reorder_level,
    CASE 
        WHEN sl.total_on_hand = 0 THEN 'OUT_OF_STOCK'
        WHEN (sl.total_on_hand / NULLIF(COALESCE(cv.daily_burn_rate, 2.50), 0)) <= 5.0 THEN 'CRITICAL_DEPLETION_UNDER_5_DAYS'
        WHEN (sl.total_on_hand / NULLIF(COALESCE(cv.daily_burn_rate, 2.50), 0)) <= 15.0 THEN 'RESTOCK_URGENT_UNDER_15_DAYS'
        ELSE 'STABLE_RUNWAY'
    END AS depletion_risk_tier,
    GREATEST(0, sl.target_stock_level - sl.total_on_hand) AS recommended_restock_units
FROM StockLevels sl
LEFT JOIN ConsumptionVelocity cv ON sl.product_id = cv.product_id
ORDER BY days_until_stockout ASC NULLS FIRST;

COMMENT ON VIEW vw_daily_burn_rate_and_restock_predictor IS 'Predictive engine forecasting stockout dates and daily burn rates';


-- 6. Vector Index on Customer Review Sentiment Embeddings
CREATE INDEX IF NOT EXISTS idx_product_reviews_hnsw 
    ON product_reviews USING hnsw (review_embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

