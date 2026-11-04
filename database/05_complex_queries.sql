-- ============================================================================
-- SMART INVENTORY MANAGEMENT SYSTEM (SIMS)
-- DBMS Experiential Learning - Level 3 Project
-- File: 05_complex_queries.sql
-- Description: Complex DML Queries Demonstrating Advanced Relational Algebra
-- Demonstrates: JOINs, GROUP BY, HAVING, ORDER BY, Aggregates, Subqueries, CTEs, Window Functions
-- ============================================================================

-- ============================================================================
-- QUERY 1: Multi-Table JOIN with Aggregations and Profitability Breakdown
-- Joins: products, product_categories, inventory_batches, warehouses
-- Demonstrates: INNER JOIN, LEFT JOIN, SUM(), ROUND(), GROUP BY, ORDER BY
-- ============================================================================
SELECT 
    w.name AS warehouse_name,
    c.name AS category_name,
    COUNT(DISTINCT p.product_id) AS distinct_products,
    COUNT(b.batch_id) AS total_batches,
    COALESCE(SUM(b.current_quantity), 0) AS total_units_in_stock,
    ROUND(COALESCE(SUM(b.current_quantity * b.unit_cost), 0), 2) AS total_asset_value_cost,
    ROUND(COALESCE(SUM(b.current_quantity * p.unit_price), 0), 2) AS potential_retail_value,
    ROUND(COALESCE(SUM(b.current_quantity * (p.unit_price - b.unit_cost)), 0), 2) AS unrealized_profit_margin
FROM warehouses w
CROSS JOIN product_categories c
LEFT JOIN products p ON p.category_id = c.category_id
LEFT JOIN inventory_batches b ON b.product_id = p.product_id 
                             AND b.warehouse_id = w.warehouse_id 
                             AND b.current_quantity > 0
GROUP BY w.warehouse_id, w.name, c.category_id, c.name
ORDER BY w.name ASC, total_asset_value_cost DESC;


-- ============================================================================
-- QUERY 2: Supplier SLA & Delayed Delivery Flagging
-- Demonstrates: GROUP BY, HAVING clause, Aggregate filtering, CASE expressions
-- Problem: Filter suppliers with at least 1 order whose actual delivery delay 
--          exceeds contracted lead time or with fulfillment under 95%.
-- ============================================================================
SELECT 
    s.supplier_code,
    s.company_name,
    s.lead_time_days AS contracted_lead_time_days,
    COUNT(po.po_id) AS total_orders,
    ROUND(AVG(po.actual_delivery_date - po.order_date), 1) AS avg_actual_fulfillment_days,
    ROUND(
        (SUM(poi.received_quantity)::NUMERIC / NULLIF(SUM(poi.ordered_quantity), 0)::NUMERIC) * 100, 
        2
    ) AS overall_fulfillment_pct,
    SUM(po.total_amount) AS total_spend
FROM suppliers s
JOIN purchase_orders po ON s.supplier_id = po.supplier_id
JOIN purchase_order_items poi ON po.po_id = poi.po_id
WHERE po.status = 'RECEIVED'
GROUP BY s.supplier_id, s.supplier_code, s.company_name, s.lead_time_days
HAVING (
    AVG(po.actual_delivery_date - po.order_date) > s.lead_time_days 
    OR (SUM(poi.received_quantity)::NUMERIC / NULLIF(SUM(poi.ordered_quantity), 0)::NUMERIC) < 0.95
)
ORDER BY avg_actual_fulfillment_days DESC;


-- ============================================================================
-- QUERY 3: CTE-Powered Automated Reorder Replenishment Engine
-- Demonstrates: Common Table Expression (WITH), Subqueries, Mathematical functions
-- Problem: Calculate net global stock, identify deficit vs target stock, 
--          and generate exact purchase order draft costs with preferred vendor.
-- ============================================================================
WITH CurrentInventorySummary AS (
    SELECT 
        p.product_id,
        p.sku,
        p.name AS product_name,
        p.category_id,
        p.cost_price,
        p.reorder_level,
        p.target_stock_level,
        COALESCE(SUM(b.current_quantity), 0) AS total_physical_stock
    FROM products p
    LEFT JOIN inventory_batches b ON p.product_id = b.product_id AND b.current_quantity > 0
    GROUP BY p.product_id, p.sku, p.name, p.category_id, p.cost_price, p.reorder_level, p.target_stock_level
),
PendingInboundOrders AS (
    SELECT 
        poi.product_id,
        COALESCE(SUM(poi.ordered_quantity - poi.received_quantity), 0) AS incoming_stock
    FROM purchase_order_items poi
    JOIN purchase_orders po ON poi.po_id = po.po_id
    WHERE po.status IN ('ISSUED', 'PARTIAL')
    GROUP BY poi.product_id
)
SELECT 
    cis.sku,
    cis.product_name,
    cat.name AS category_name,
    cis.total_physical_stock,
    COALESCE(pio.incoming_stock, 0) AS pending_inbound_stock,
    (cis.total_physical_stock + COALESCE(pio.incoming_stock, 0)) AS effective_available_stock,
    cis.reorder_level,
    cis.target_stock_level,
    CASE 
        WHEN (cis.total_physical_stock + COALESCE(pio.incoming_stock, 0)) < cis.reorder_level
        THEN (cis.target_stock_level - (cis.total_physical_stock + COALESCE(pio.incoming_stock, 0)))
        ELSE 0 
    END AS units_to_order,
    ROUND(
        CASE 
            WHEN (cis.total_physical_stock + COALESCE(pio.incoming_stock, 0)) < cis.reorder_level
            THEN (cis.target_stock_level - (cis.total_physical_stock + COALESCE(pio.incoming_stock, 0))) * cis.cost_price
            ELSE 0 
        END, 2
    ) AS estimated_po_cost_inr
FROM CurrentInventorySummary cis
JOIN product_categories cat ON cis.category_id = cat.category_id
LEFT JOIN PendingInboundOrders pio ON cis.product_id = pio.product_id
WHERE (cis.total_physical_stock + COALESCE(pio.incoming_stock, 0)) <= cis.reorder_level
ORDER BY units_to_order DESC;


-- ============================================================================
-- QUERY 4: Advanced Window Functions: Running Ledger Balances & Turn Rank
-- Demonstrates: ROW_NUMBER(), SUM() OVER (PARTITION BY ... ORDER BY ...), RANK()
-- Problem: Calculate a live continuous running stock tally over time per product
-- ============================================================================
SELECT 
    t.transaction_id,
    t.created_at,
    p.sku,
    p.name AS product_name,
    w.warehouse_code,
    t.transaction_type,
    t.quantity_change,
    SUM(t.quantity_change) OVER (
        PARTITION BY t.product_id, t.warehouse_id 
        ORDER BY t.created_at ASC 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS continuous_running_balance,
    t.balance_after AS recorded_ledger_balance,
    DENSE_RANK() OVER (
        PARTITION BY t.warehouse_id 
        ORDER BY ABS(t.quantity_change) DESC
    ) AS transaction_magnitude_rank
FROM inventory_transactions t
JOIN products p ON t.product_id = p.product_id
JOIN warehouses w ON t.warehouse_id = w.warehouse_id
ORDER BY p.sku, t.created_at ASC;


-- ============================================================================
-- QUERY 5: Dormant / Dead Stock Identification via Anti-Join Subquery
-- Demonstrates: NOT EXISTS, Correlated Subquery, INTERVAL date filtering
-- Problem: Find active inventory batches that have experienced ZERO sales 
--          or outbound movements in the last 60 days (holding costs risk).
-- ============================================================================
SELECT 
    p.sku,
    p.name AS product_name,
    w.name AS warehouse_location,
    b.batch_number,
    b.current_quantity,
    b.unit_cost,
    ROUND(b.current_quantity * b.unit_cost, 2) AS tied_up_capital,
    b.received_at
FROM inventory_batches b
JOIN products p ON b.product_id = p.product_id
JOIN warehouses w ON b.warehouse_id = w.warehouse_id
WHERE b.current_quantity > 0
  AND NOT EXISTS (
      SELECT 1 
      FROM inventory_transactions t
      WHERE t.batch_id = b.batch_id
        AND t.transaction_type IN ('SALE_FULFILLMENT', 'TRANSFER_OUT')
        AND t.created_at >= (CURRENT_DATE - INTERVAL '60 days')
  )
ORDER BY tied_up_capital DESC;
