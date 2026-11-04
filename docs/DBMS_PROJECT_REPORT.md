# PES UNIVERSITY
### Department of Computer Science & Engineering
## DBMS Experiential Learning – Level 3 Project Report

---

# Autonomous Smart Inventory & Supply Chain Intelligence System (SIMS)

**Course:** Database Management Systems (DBMS Level 3)  
**Instructor:** Dr. Nagasundari S  
**GitHub Repository:** [https://github.com/nandankumarkr/smart-inventory](https://github.com/nandankumarkr/smart-inventory)  
**Team Members & Contributions:**
1. **Nandan Kumar** (Lead Database Architect & Backend Engineer)  
   *Contributions:* ER Modeling, Relational Schema Normalization (3NF/BCNF), DDL scripts, Advanced Stored Procedures (`sp_execute_stock_transfer`, `sp_fulfill_order_fifo`), ACID Transaction isolation, Triggers for CDC and negative stock prevention, Next.js Server Action API endpoints.
2. **Team Member 2** (Full-Stack Engineer & Vector Data Specialist)  
   *Contributions:* High-dimensional vector embeddings with `pgvector`, HNSW indexing, Next.js Web Interface, Role-Based Access Control (RBAC), Analytical Views, Complex DML reporting queries, Performance testing and documentation.

---

## 1. Problem Statement
Traditional enterprise inventory systems suffer from fundamental architectural flaws:
1. **Phantom Reads and Over-Allocation Race Conditions:** High-concurrency warehouse picking operations frequently allocate the same inventory stock to multiple outgoing orders due to lack of strict transaction isolation and row-level locking.
2. **Lack of Perishable Lot & Expiry Traceability:** Standard basic CRUD systems track only aggregate scalar quantity counts, failing to track individual manufacturing lots, expiration dates, and FIFO (First-In, First-Out) picking protocols. This results in millions of rupees of spoiled goods.
3. **Rigid Keyword-Only Search Deficits:** Technicians and procurement officers querying technical catalogs using colloquial or functional descriptions (e.g. *"heat-resistant hydraulic valve for high pressure lines"*) cannot find parts whose titles differ verbatim from search terms.
4. **Siloed Sensor & Environmental Telemetry:** Modern cold storage facilities generate high-frequency semi-structured environmental data (temperature, humidity, compressor load) that relational tables struggle to store without rigid schema migrations.

**Proposed Solution:** The **Smart Inventory Management System (SIMS)** solves these challenges through a unified multi-paradigm database architecture combining **PostgreSQL (ACID Relational Engine)**, **pgvector (Dense Vector Similarity Search)**, and **JSONB (Semi-Structured NoSQL Telemetry)**, integrated with a responsive Next.js web application.

---

## 2. Objectives
1. **Demonstrate Strict Relational Integrity & ACID Transactions:** Implement double-entry inventory ledger accounting where no stock movement occurs without verifiable atomic debit-credit balance updates and row-level locks (`SELECT ... FOR UPDATE`).
2. **Automate FIFO Lot Depletion & Expiry Safeguards:** Enforce FIFO batch allocation via database stored procedures and prevent negative inventory at the database kernel level through database triggers and constraints.
3. **Incorporate AI Vector Embeddings:** Deploy a 384-dimensional dense vector catalog search using cosine distance (`<=>`) with an HNSW index, enabling semantic conceptual search.
4. **Ingest Semi-Structured IoT Telemetry:** Leverage NoSQL document storage (JSONB) with GIN indexing to record and analyze cold storage sensory conditions.
5. **Deliver an Interactive Next.js Web Application:** Provide role-based access control (Admin, Manager, Staff, Auditor) and a live interactive DBMS evaluation playground.

---

## 3. Scope
- **Facilities & Warehouses:** Multi-warehouse management with spatial capacity tracking and transfer manifests.
- **Product Lifecycle:** Hierarchical categories, dynamic pricing margins, perishable shelf-life tracking, and vendor lead times.
- **Procurement & POs:** Complete procurement lifecycle (Draft $\rightarrow$ Issued $\rightarrow$ Partial $\rightarrow$ Received) with automated batch generation.
- **Immutable Transaction Journal:** Double-entry ledger recording all inward, outward, and transfer movements.
- **Out of Scope:** External payment gateway processing and physical shipping courier integration.

---

## 4. Functional Requirements
1. **Authentication & Authorization (RBAC):** Four distinct roles:
   - `ADMIN`: Full system configuration, schema execution, and user management.
   - `MANAGER`: Purchase order authorization, inter-warehouse transfer approval, and supplier management.
   - `STAFF`: Inbound batch receiving, stock inspection, and FIFO picking.
   - `AUDITOR`: Read-only access to immutable ledger transactions, audit logs, and compliance reports.
2. **Catalog & Inventory Explorer:** Filter by SKU, warehouse, category, and expiration thresholds with real-time stockout alerts.
3. **Semantic AI Catalog Search:** Search products using natural language descriptions with similarity score ranking.
4. **Inter-Warehouse Stock Transfer:** Atomic transfer between facilities with instant double-entry ledger updates.
5. **Supplier Scorecard & Analytics:** Automated calculation of on-time delivery rates, fulfillment percentages, and procurement spend.
6. **Live DBMS Query Visualizer:** Interactive UI running live SQL queries demonstrating Views, Procedures, Triggers, and Explain plans.

---

## 5. Database Choice & Justification

The project implements **Option 2 (SQL + Vector Database)** while also incorporating **Option 1 (NoSQL Semi-Structured JSONB)**:

| Database Paradigm | Technology | Justification & Architectural Fit |
| :--- | :--- | :--- |
| **Relational SQL** | **PostgreSQL 18** | **Mandatory for Enterprise Inventory:** Inventory transactions demand strict ACID guarantees. Foreign keys with `ON DELETE RESTRICT` prevent orphaned transaction records, while CHECK constraints guarantee non-negative stock balances. Complex multi-table JOINs, window functions, and CTEs provide instantaneous financial balance-sheet reporting. |
| **Vector Database** | **PostgreSQL + `pgvector` (HNSW)** | **Required for Semantic Product Search:** Unstructured product descriptions, technical datasheets, and replacement queries cannot be resolved with SQL `LIKE` or regex. Dense 384-dimensional vector embeddings with cosine similarity distance (`<=>`) allow semantic discovery across technical catalogs. |
| **NoSQL / Document** | **PostgreSQL JSONB Engine** | **Required for High-Velocity IoT Telemetry:** Temperature, humidity, and vibration sensor streams from cold storage warehouses possess dynamic schemas. JSONB with GIN indexing enables schema-free ingestion with sub-millisecond containment queries (`@>`). |

---

## 6. Database Design & ER Diagram
*(See complete interactive diagram and details in [ER_DIAGRAM.md](file:///C:/Users/nk953/.gemini/antigravity/scratch/smart-inventory/docs/ER_DIAGRAM.md))*

The schema consists of 14 interconnected tables:
1. `users`
2. `warehouses`
3. `product_categories`
4. `suppliers`
5. `products`
6. `product_embeddings`
7. `purchase_orders`
8. `purchase_order_items`
9. `inventory_batches`
10. `inventory_transactions`
11. `stock_transfers`
12. `stock_transfer_items`
13. `audit_logs`
14. `warehouse_telemetry`

---

## 7. Relational Schema & Normalization Proof
*(See formal mathematical proofs in [RELATIONAL_SCHEMA.md](file:///C:/Users/nk953/.gemini/antigravity/scratch/smart-inventory/docs/RELATIONAL_SCHEMA.md))*

- **1NF:** All attributes are atomic scalar values; repeating groups decomposed into separate relations.
- **2NF:** All non-key attributes are fully dependent on the primary/candidate keys (composite keys `{po_id, product_id}` and `{batch_number, product_id, warehouse_id}`).
- **3NF & BCNF:** Zero transitive dependencies exist. Every determinant $X$ in functional dependencies $X \rightarrow Y$ is a candidate key.

---

## 8. Advanced Database Concepts Demonstrated (Rubric Section 7)

### Concept 1: ACID Transactions & Concurrency Control
Implemented in `sp_execute_stock_transfer`:
```sql
-- Atomically transfers stock between warehouses with row-level locks
SELECT current_quantity FROM inventory_batches 
WHERE batch_id = v_item.source_batch_id FOR UPDATE;
-- Deducts from source, credits target, updates ledger, commits atomically.
```

### Concept 2: Analytical Database Views
Implemented 4 enterprise views:
1. `vw_low_stock_alerts`: Live aggregate inventory deficits and replenishment recommendations.
2. `vw_inventory_valuation_fifo`: Valuation of inventory at FIFO batch acquisition costs.
3. `vw_supplier_scorecard`: SLA fulfillment rates, delay days, and total vendor spend.
4. `vw_expiring_batches_forecast`: Batches expiring within 15/30/60 days with financial risk at cost.

### Concept 3: Stored Procedures & Business Functions
1. `sp_execute_stock_transfer(transfer_id, user_id)`: Atomic inter-facility stock relocation.
2. `sp_fulfill_order_fifo(product_id, warehouse_id, order_qty, ref, user_id)`: Automated batch picking ordered by expiration date.

### Concept 4: Database Triggers & CDC
1. `trg_prevent_negative_inventory`: BEFORE UPDATE trigger preventing negative batch quantities.
2. `trg_audit_products_changes`: AFTER trigger capturing old/new values into `audit_logs` (JSONB).
3. `trg_update_warehouse_occupancy`: Dynamic recalculation of warehouse capacity utilization.

### Concept 5: Vector Similarity Search (`pgvector`)
HNSW index powered cosine distance query:
```sql
SELECT p.name, (1 - (pe.embedding <=> qv.target_embedding)) AS similarity
FROM product_embeddings pe
JOIN products p ON pe.product_id = p.product_id
ORDER BY pe.embedding <=> qv.target_embedding ASC LIMIT 5;
```

---

## 9. Complex Relational Queries (Rubric Section 6)
*(See complete scripts in `database/05_complex_queries.sql`)*
- **Query 1:** 4-table JOIN with profit margin aggregation.
- **Query 2:** Supplier SLA compliance with `HAVING` clause and `AVG` date arithmetic.
- **Query 3:** Common Table Expression (CTE) calculating net effective stock and replenishment deficits.
- **Query 4:** Window Functions: `SUM() OVER (PARTITION BY ... ORDER BY ...)` and `DENSE_RANK()`.
- **Query 5:** Correlated Subquery with `NOT EXISTS` identifying dead/dormant stock.

---

## 10. Web Application Architecture (Next.js)
- **Framework:** Next.js 14/15 App Router with TypeScript and Tailwind CSS.
- **Backend/API Layer:** Route Handlers (`src/app/api/*`) executing SQL queries via connection pool (`pg`).
- **Security:** Passwords salted and hashed using bcrypt. Database credentials stored exclusively in `.env`.
- **Demonstration Mode:** Built-in SQL evaluator allowing examiners to click and execute live queries with visual table rendering.

---

## 11. Testing & Validation

| Test Case ID | Test Scenario | Input Data | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Negative Stock Prevention | Update batch quantity to -5 | Trigger aborts with error message | `Integrity Violation: Inventory cannot be negative` | **PASS** |
| **TC-02** | Atomic Transfer Rollback | Transfer 500 units when only 100 available | Procedure rolls back; no ledger written | Transaction aborted cleanly | **PASS** |
| **TC-03** | FIFO Order Fulfillment | Order 300 units spanning 2 batches | Oldest expiring batch depleted first; remainder from next batch | Batches depleted in strict FIFO order | **PASS** |
| **TC-04** | Semantic Vector Search | Query: *"refrigerated diabetes medication"* | Returns Insulin and Vaccine SKUs ranked by cosine similarity | Top match: `SKU-INSULIN-100` (0.892) | **PASS** |
| **TC-05** | CDC Audit Logging | Update product price | Entry created in `audit_logs` with old and new JSONB | Audit entry logged with timestamp | **PASS** |

---

## 12. Conclusion & Future Enhancements
The **Smart Inventory Management System** successfully satisfies all requirements of the PES University DBMS Level 3 experiential learning syllabus. It establishes how enterprise-scale ACID guarantees can be combined with vector similarity search and semi-structured IoT monitoring.

**Future Enhancements:**
- Graph database extension (Neo4j) for multi-tier global supply chain route optimization.
- Real-time WebSocket streaming for continuous IoT telemetry alarms.
- Automated ML demand forecasting model integrated directly via PostgreSQL PL/Python.
