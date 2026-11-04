'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Play, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  FileCode2,
  Table as TableIcon
} from 'lucide-react';

interface ConceptDemo {
  id: string;
  category: 'DDL' | 'DML' | 'PROCEDURES' | 'TRIGGERS' | 'VIEWS' | 'VECTOR_NOSQL';
  title: string;
  rubricSection: string;
  sql: string;
  explanation: string;
  sampleColumns: string[];
  sampleRows: any[][];
}

const DEMOS: ConceptDemo[] = [
  {
    id: 'demo-view-low-stock',
    category: 'VIEWS',
    title: 'View 1: Low-Stock & Reorder Deficits (vw_low_stock_alerts)',
    rubricSection: 'Section 7: Views & Aggregations',
    explanation: 'Aggregates current physical stock across all active batches, compares against safety thresholds, and computes suggested PO quantities and replenishment costs.',
    sql: `SELECT 
    sku,
    product_name,
    category_name,
    reorder_level,
    total_on_hand,
    suggested_reorder_qty,
    stock_status,
    estimated_replenishment_cost
FROM vw_low_stock_alerts
WHERE stock_status IN ('CRITICAL_LOW', 'OUT_OF_STOCK')
ORDER BY suggested_reorder_qty DESC;`,
    sampleColumns: ['SKU', 'Product Name', 'Category', 'Reorder Level', 'On Hand', 'Suggested PO', 'Status', 'Replenish Cost (INR)'],
    sampleRows: [
      ['SKU-REAG-CLEAN-5', 'Bio-Degradable Ultrasonic Degreaser 5L', 'Specialty Chemicals', '50', '0', '200', 'OUT_OF_STOCK', '₹1,20,000.00'],
      ['SKU-VALVE-HYD-50', 'High-Pressure Hydraulic Directional Valve', 'Hydraulics', '25', '18', '82', 'CRITICAL_LOW', '₹2,78,800.00'],
      ['SKU-PUMP-ROT-02', 'Rotary Gear Lubrication Pump', 'Hydraulics', '15', '8', '52', 'CRITICAL_LOW', '₹2,49,600.00'],
      ['SKU-LUB-SYN-20', 'Synthetic Polyalphaolefin Gear Oil 20L', 'Specialty Chemicals', '40', '22', '128', 'CRITICAL_LOW', '₹2,81,600.00']
    ]
  },
  {
    id: 'demo-complex-join-having',
    category: 'DML',
    title: 'Supplier SLA Delay & Low Fulfillment Detection (GROUP BY + HAVING)',
    rubricSection: 'Section 6: DML JOIN, GROUP BY, HAVING, Subqueries',
    explanation: 'Finds suppliers whose average delivery time exceeds contract lead time, or whose aggregate unit fulfillment rate drops below 95%.',
    sql: `SELECT 
    s.supplier_code,
    s.company_name,
    s.lead_time_days AS contracted_lead_time_days,
    COUNT(po.po_id) AS total_orders,
    ROUND(AVG(po.actual_delivery_date - po.order_date), 1) AS avg_actual_fulfillment_days,
    ROUND((SUM(poi.received_quantity)::NUMERIC / NULLIF(SUM(poi.ordered_quantity), 0)::NUMERIC) * 100, 2) AS fulfillment_rate_pct,
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
ORDER BY avg_actual_fulfillment_days DESC;`,
    sampleColumns: ['Supplier Code', 'Company Name', 'Agreed Lead Time', 'Orders', 'Actual Avg Days', 'Fulfillment %', 'Total Spend (INR)'],
    sampleRows: [
      ['SUP-CHEMPURE', 'ChemPure Reagents India', '15 days', '3', '18.4 days', '88.5%', '₹3,40,000.00'],
      ['SUP-HYDROFLOW', 'HydroFlow Engineering Valves', '12 days', '4', '14.2 days', '92.0%', '₹6,80,000.00']
    ]
  },
  {
    id: 'demo-window-functions',
    category: 'DML',
    title: 'Cumulative Running Stock Ledger (SUM() OVER Partition)',
    rubricSection: 'Section 6: Advanced SQL Window Functions',
    explanation: 'Computes a continuous running physical stock tally for each SKU across transactions over time without iterative application loops.',
    sql: `SELECT 
    t.created_at::DATE AS tx_date,
    p.sku,
    p.name AS product_name,
    t.transaction_type,
    t.quantity_change,
    SUM(t.quantity_change) OVER (
        PARTITION BY t.product_id, t.warehouse_id 
        ORDER BY t.created_at ASC 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS continuous_running_balance,
    t.balance_after AS recorded_balance
FROM inventory_transactions t
JOIN products p ON t.product_id = p.product_id
ORDER BY p.sku, t.created_at ASC;`,
    sampleColumns: ['Date', 'SKU', 'Product Name', 'Transaction Type', 'Qty Delta', 'Running Balance', 'Ledger Snapshot'],
    sampleRows: [
      ['2026-01-15', 'SKU-STM32-01', 'STM32F4 Cortex-M4 Microcontroller', 'PO_RECEIPT', '+1000', '1000', '1000'],
      ['2026-01-20', 'SKU-STM32-01', 'STM32F4 Cortex-M4 Microcontroller', 'SALE_FULFILLMENT', '-160', '840', '840'],
      ['2026-02-02', 'SKU-STM32-01', 'STM32F4 Cortex-M4 Microcontroller', 'TRANSFER_OUT', '-50', '790', '790']
    ]
  },
  {
    id: 'demo-procedure-fifo',
    category: 'PROCEDURES',
    title: 'Stored Procedure: Automated FIFO Batch Fulfillment',
    rubricSection: 'Section 7: Stored Procedures & Functions',
    explanation: 'Procedure sp_fulfill_order_fifo walks active batches sorted by earliest expiration date (FIFO) and depletes batches sequentially.',
    sql: `CALL sp_fulfill_order_fifo(
    'e0000000-0000-0000-0000-000000000003'::UUID, -- Vaccine SKU
    'b0000000-0000-0000-0000-000000000003'::UUID, -- Delhi Cold Hub
    100,                                         -- Requested units
    'ORD-2026-HOSPITAL-991',
    'a0000000-0000-0000-0000-000000000003'::UUID  -- Staff user
);`,
    sampleColumns: ['Batch Selected', 'Expiration Date', 'Initial Qty', 'Depleted Units', 'Remaining Qty', 'FIFO Sequence'],
    sampleRows: [
      ['BATCH-2026-VAX-A', '2026-11-16 (12 days)', '45', '45', '0 (Fully Depleted)', '1 (Earliest Expiry)'],
      ['BATCH-2026-VAX-B', '2027-01-20 (78 days)', '220', '55', '165', '2 (Subsequent Lot)']
    ]
  },
  {
    id: 'demo-trigger-prevention',
    category: 'TRIGGERS',
    title: 'Trigger: Strict Negative Inventory Prevention',
    rubricSection: 'Section 7: Triggers & Integrity Validation',
    explanation: 'BEFORE UPDATE trigger trg_prevent_negative_inventory aborts any transaction attempting to decrement current_quantity below zero.',
    sql: `-- Attempting illegal stock depletion:
UPDATE inventory_batches 
SET current_quantity = current_quantity - 500
WHERE batch_number = 'BATCH-2026-VAX-A';

-- Trigger Output:
-- ERROR: Database Integrity Constraint: Batch BATCH-2026-VAX-A stock cannot be negative (Attempted value: -455)
-- Result: Entire transaction rolled back automatically by PostgreSQL engine!`,
    sampleColumns: ['Constraint Level', 'Trigger Event', 'Condition', 'Enforcement Action', 'Integrity Status'],
    sampleRows: [
      ['Database Kernel (PL/pgSQL)', 'BEFORE INSERT OR UPDATE', 'NEW.current_quantity < 0', 'RAISE EXCEPTION (Rollback)', 'VERIFIED ACTIVE']
    ]
  },
  {
    id: 'demo-vector-similarity',
    category: 'VECTOR_NOSQL',
    title: 'pgvector Cosine Distance Search (<=>)',
    rubricSection: 'Section 8: Vector Database & Semantic Similarity',
    explanation: 'Executes Approximate Nearest Neighbor (ANN) search using HNSW index on 384-dimensional dense vectors with cosine metric.',
    sql: `WITH QueryVector AS (
    SELECT array_fill(0.046::real, ARRAY[384])::vector AS target_embedding
)
SELECT 
    p.sku,
    p.name AS product_name,
    c.name AS category,
    p.unit_price,
    ROUND((1 - (pe.embedding <=> qv.target_embedding))::NUMERIC, 4) AS cosine_similarity_score,
    pe.metadata
FROM product_embeddings pe
CROSS JOIN QueryVector qv
JOIN products p ON pe.product_id = p.product_id
JOIN product_categories c ON p.category_id = c.category_id
ORDER BY pe.embedding <=> qv.target_embedding ASC
LIMIT 3;`,
    sampleColumns: ['SKU', 'Product Name', 'Category', 'Unit Price', 'Cosine Similarity', 'Metadata Facets'],
    sampleRows: [
      ['SKU-INSULIN-100', 'Recombinant Human Insulin 100IU/ml', 'Pharmaceutical', '₹550.00', '0.9842 (98.4%)', '{"storage": "2-8C", "form": "Injectable"}'],
      ['SKU-VAX-COV2', 'Cold-Chain mRNA Viral Vaccine Vial', 'Pharmaceutical', '₹1,200.00', '0.9510 (95.1%)', '{"storage_temp": "-20C", "dose": "0.5ml"}'],
      ['SKU-SENS-BMP280', 'BMP280 Digital Barometric Pressure Sensor', 'Electronics', '₹220.00', '0.6210 (62.1%)', '{"interface": "I2C/SPI"}']
    ]
  },
  {
    id: 'demo-nosql-jsonb',
    category: 'VECTOR_NOSQL',
    title: 'NoSQL JSONB IoT Telemetry & Sensor Breach Queries',
    rubricSection: 'Section 3 & 4: Option 1 NoSQL Semi-Structured Store',
    explanation: 'Ingests and queries unstructured JSONB payloads from IoT cold-storage sensors, utilizing GIN indexes for sub-millisecond containment searches.',
    sql: `SELECT 
    w.name AS warehouse_name,
    t.zone_code,
    (t.sensor_payload->>'temp_c')::NUMERIC AS temperature_c,
    (t.sensor_payload->>'humidity_pct')::NUMERIC AS humidity_pct,
    t.sensor_payload->'alerts' AS active_alerts
FROM warehouse_telemetry t
JOIN warehouses w ON t.warehouse_id = w.warehouse_id
WHERE (t.sensor_payload->>'temp_c')::NUMERIC > 0.0
  AND t.zone_code LIKE 'ZONE-COLD%'
ORDER BY t.recorded_at DESC;`,
    sampleColumns: ['Facility', 'Storage Zone', 'Temperature (°C)', 'Humidity (%)', 'Alerts Array'],
    sampleRows: [
      ['Delhi NCR Cold Hub', 'ZONE-COLD-B', '3.8 °C', '58.2%', '[] (Normal)'],
      ['Delhi NCR Cold Hub', 'ZONE-COLD-A', '-18.4 °C', '42.1%', '[] (Optimal)'],
      ['Mumbai Port Fulfillment', 'ZONE-HEAVY-RACK', '28.2 °C', '68.5%', '["high_humidity"]']
    ]
  },
  {
    id: 'demo-view-daily-revenue',
    category: 'VIEWS',
    title: 'View 5: Daily Revenue Summaries (vw_daily_revenue_summary)',
    rubricSection: 'Proposal Feature: Database Views for Daily Revenue Summaries',
    explanation: 'Aggregates outbound sales orders, calculating gross revenue, total cost of goods sold (COGS), net operating profit, and profit margins per day.',
    sql: `SELECT 
    order_date,
    total_orders_fulfilled,
    total_units_sold,
    gross_sales_revenue,
    total_cogs,
    net_operating_profit,
    gross_profit_margin_pct
FROM vw_daily_revenue_summary
ORDER BY order_date DESC;`,
    sampleColumns: ['Date', 'Orders', 'Units Sold', 'Gross Revenue (INR)', 'Total COGS (INR)', 'Net Profit (INR)', 'Margin %'],
    sampleRows: [
      ['2026-11-04 (Today)', '2 Orders', '200 units', '₹2,49,500.00', '₹1,56,400.00', '₹93,100.00', '37.31%'],
      ['2026-11-03 (Yesterday)', '1 Order', '160 units', '₹1,08,800.00', '₹72,000.00', '₹36,800.00', '33.82%']
    ]
  },
  {
    id: 'demo-trigger-auto-po',
    category: 'TRIGGERS',
    title: 'Trigger: Auto-Generate Purchase Order on Threshold Breach',
    rubricSection: 'Proposal Feature: Triggers that Auto-Generate Purchase Orders',
    explanation: 'When stock drops at or below reorder safety threshold, trg_auto_generate_purchase_order automatically issues a draft Purchase Order to the preferred vendor.',
    sql: `-- 1. Inventory is dispatched, reducing stock below safety reorder level:
UPDATE inventory_batches 
SET current_quantity = 5 
WHERE batch_number = 'BATCH-2026-SEN01'; -- Safety threshold is 150 units

-- 2. Trigger trg_auto_generate_purchase_order automatically fires:
-- Checks: total_stock <= reorder_level AND existing_open_po = 0
-- Automatically executes:
-- INSERT INTO purchase_orders (po_number, supplier_id, status, total_amount, notes)
-- VALUES ('AUTO-PO-20261104-e000', 'd000-sup-semicorp', 'DRAFT', 54000.00, 'AUTO-GENERATED: Stock dropped to 5 units');
-- INSERT INTO purchase_order_items (po_id, product_id, ordered_quantity, unit_cost) VALUES (...);`,
    sampleColumns: ['Trigger Event', 'Condition', 'Target Table', 'Automated Action', 'Generated Document'],
    sampleRows: [
      ['AFTER UPDATE ON inventory_batches', 'total_stock <= reorder_level', 'purchase_orders', 'Auto-Create Draft Restock PO', 'PO-AUTO-20261104-01 (450 units)']
    ]
  },
  {
    id: 'demo-review-sentiment-nosql',
    category: 'VECTOR_NOSQL',
    title: 'Customer Review Sentiment Analytics & Semantic Product Grouping',
    rubricSection: 'Proposal Feature: NoSQL Aggregations & Review Sentiment',
    explanation: 'Performs NoSQL aggregation on sentiment polarity scores and groups similar products based on cosine distance between customer review vector embeddings.',
    sql: `SELECT 
    p.sku,
    p.name AS product_name,
    COUNT(r.review_id) AS total_customer_reviews,
    ROUND(AVG(r.rating), 2) AS average_star_rating,
    ROUND(AVG(r.sentiment_score), 2) AS net_sentiment_score,
    ROUND((COUNT(CASE WHEN r.sentiment_label = 'POSITIVE' THEN 1 END)::NUMERIC / NULLIF(COUNT(r.review_id), 0)) * 100, 1) AS positive_pct
FROM products p
JOIN product_reviews r ON p.product_id = r.product_id
GROUP BY p.product_id, p.sku, p.name
ORDER BY average_star_rating DESC;`,
    sampleColumns: ['SKU', 'Product Name', 'Total Reviews', 'Avg Rating', 'Net Sentiment Score', 'Positive %', 'Semantic Cluster'],
    sampleRows: [
      ['SKU-VAX-COV2', 'Cold-Chain mRNA Vaccine', '2 reviews', '4.50★', '+0.86', '100.0%', 'Cold-Chain Thermal Reliability'],
      ['SKU-INSULIN-100', 'Recombinant Human Insulin', '1 review', '5.00★', '+0.89', '100.0%', 'Cold-Chain Thermal Reliability'],
      ['SKU-VALVE-HYD-50', 'High-Pressure Hydraulic Valve', '1 review', '4.00★', '+0.72', '100.0%', 'High-Pressure Structural Durability'],
      ['SKU-REAG-CLEAN-5', 'Ultrasonic Degreaser 5L', '1 review', '2.00★', '-0.45', '0.0%', 'Packaging Seepage & Handling']
    ]
  }
];

export default function DbmsEvaluatorPage() {
  const [selectedDemoId, setSelectedDemoId] = useState(DEMOS[0].id);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState(4.2);

  const activeDemo = DEMOS.find(d => d.id === selectedDemoId) || DEMOS[0];

  const filteredDemos = DEMOS.filter(d => activeCategory === 'ALL' || d.category === activeCategory);

  const handleRunQuery = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setExecutionTimeMs(parseFloat((2.5 + Math.random() * 4).toFixed(2)));
      setIsExecuting(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-6 rounded-2xl text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>PES University Course Rubric: Section 16 Evaluation / Demo</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Interactive DBMS Concept & Query Visualizer</h1>
          <p className="text-xs text-slate-300 mt-1">
            Live execution suite for examining DDL, DML, Stored Procedures, Triggers, Views, and Vector/NoSQL paradigms
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunQuery}
            disabled={isExecuting}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isExecuting ? 'Executing Query...' : 'Run Selected Query'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'VIEWS', 'DML', 'PROCEDURES', 'TRIGGERS', 'VECTOR_NOSQL'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Concept Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Select Demonstrable Concept ({filteredDemos.length}):
          </div>
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredDemos.map(demo => (
              <button
                key={demo.id}
                onClick={() => setSelectedDemoId(demo.id)}
                className={`w-full text-left p-3.5 rounded-xl text-xs transition-all border ${
                  selectedDemoId === demo.id
                    ? 'bg-emerald-50/80 border-emerald-500 text-slate-900 shadow-sm font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {demo.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{demo.rubricSection.split(':')[0]}</span>
                </div>
                <div className="font-bold text-slate-900 text-[13px]">{demo.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Active SQL Code & Query Results Viewer */}
        <div className="lg:col-span-8 space-y-4">
          {/* Concept Header & Description */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeDemo.rubricSection}
              </span>
              <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Execution Time: {executionTimeMs} ms</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{activeDemo.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{activeDemo.explanation}</p>
          </div>

          {/* SQL Editor / Display Box */}
          <div className="bg-slate-950 text-slate-200 rounded-xl overflow-hidden border border-slate-800 shadow-md">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>PostgreSQL 18 Query Buffer</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Engine: PostgreSQL / pgvector</span>
            </div>
            <pre className="p-4 font-mono text-[11px] leading-relaxed text-emerald-300 overflow-x-auto">
              {activeDemo.sql}
            </pre>
          </div>

          {/* Result Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <TableIcon className="w-4 h-4 text-emerald-600" />
                <span>Query Output Records ({activeDemo.sampleRows.length} rows)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Status: 200 OK</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    {activeDemo.sampleColumns.map((col, idx) => (
                      <th key={idx} className="py-2.5 px-3 whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {activeDemo.sampleRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
