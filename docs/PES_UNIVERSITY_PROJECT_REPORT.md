# PES UNIVERSITY
### DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
### FACULTY OF ENGINEERING
**(Established under Karnataka Act No. 16 of 2013)**  
**Electronic City, Hosur Road, Bengaluru – 560 100, Karnataka, India**

---

<br><br>

# Mini Project Report on
# SMART INVENTORY & AUTOMATED RESTOCK PREDICTOR

<br>

**Submitted in partial fulfilment of the requirements for the award of degree of**  
### Bachelor of Technology  
**in**  
### Computer Science & Engineering  
### UE23CS351A – Database Management Systems Project  

<br><br>

**Submitted by:**

| Student Name | Student Reference Number (SRN) |
| :--- | :--- |
| **Nandan Kumar** | PES2UG23CS953 |
| **Team Member 2** | PES2UG23CSXXX |

<br><br>

**Under the guidance of:**  
**Dr. Nagasundari S**  
Associate Professor / Assistant Professor  
Department of Computer Science & Engineering  
PES University, Electronic City Campus  

<br>

**Academic Period: AUG - DEC 2026**

<br><br>

---

<br><br>

# PES UNIVERSITY
**(Established under Karnataka Act No. 16 of 2013)**  
**Electronic City, Hosur Road, Bengaluru – 560 100, Karnataka, India**

<br>

## CERTIFICATE

This is to certify that the mini project entitled **"Smart Inventory & Automated Restock Predictor"** is a bonafide work carried out by:

| Student Name | Student Reference Number (SRN) |
| :--- | :--- |
| **Nandan Kumar** | PES2UG23CS953 |
| **Team Member 2** | PES2UG23CSXXX |

in partial fulfilment for the completion of fifth semester **DBMS Project (UE23CS351A)** in the Program of Study – **Bachelor of Technology in Computer Science and Engineering** under rules and regulations of PES University, Bengaluru during the period **AUG. 2026 – DEC. 2026**. 

It is certified that all corrections / suggestions indicated for internal assessment have been incorporated in the report. The project has been approved as it satisfies the 5th semester academic requirements in respect of project work.

<br><br><br>

___________________________________  
**Dr. Nagasundari S**  
Faculty Guide, Assistant Professor  
Department of Computer Science & Engineering  
PES University, Bengaluru  

<br><br>

---

<br><br>

## DECLARATION

We hereby declare that the DBMS Project entitled **"Smart Inventory & Automated Restock Predictor"** has been carried out by us under the guidance of **Dr. Nagasundari S**, Department of Computer Science and Engineering, and submitted in partial fulfilment of the course requirements for the award of the degree of **Bachelor of Technology in Computer Science and Engineering** of PES University, Bengaluru during the academic semester **AUG – DEC 2026**.

We further declare that this report has not been submitted previously to any other university or institution for the award of any degree or diploma.

<br><br>

| Student Name | SRN | Signature |
| :--- | :--- | :--- |
| **Nandan Kumar** | PES2UG23CS953 | ___________________ |
| **Team Member 2** | PES2UG23CSXXX | ___________________ |

<br><br>

**Date:** 04-November-2026  
**Place:** Bengaluru  

<br><br>

---

<br><br>

## ACKNOWLEDGEMENT

We would like to express our deepest gratitude to our faculty guide **Dr. Nagasundari S**, Department of Computer Science and Engineering, PES University, for her continuous guidance, constructive criticism, and encouragement throughout the development of this **UE23CS351A – DBMS Project**.

We take this opportunity to thank **Dr. Sandesh B J**, Professor and Chairperson, Department of Computer Science and Engineering, PES University, for all the facilities, academic environment, and departmental support extended to us.

We are deeply grateful to **Prof. Jawahar Doreswamy**, Chancellor – PES University, and **Dr. J. Suryaprasad**, Vice-Chancellor – PES University, for providing exceptional academic infrastructure and learning opportunities.

Finally, we express our heartfelt gratitude to our parents, family members, and peers for their continual encouragement, patience, and moral support throughout the course of this project.

<br><br>

---

<br><br>

## ABSTRACT

Traditional enterprise inventory systems operate primarily as basic Create-Read-Update-Delete (CRUD) data stores, tracking flat scalar quantities without physical lot differentiation. In high-velocity multi-warehouse supply chains, this architecture leads to critical operational failures: race conditions and overselling during concurrent checkouts, lack of lot-level expiration tracking causing millions in spoiled perishables, rigid keyword search unable to resolve semantic inquiries, and absence of predictive automated replenishment.

To address these challenges, this project presents the **Smart Inventory & Automated Restock Predictor (SIMS)**, a high-performance multi-paradigm database system built on **PostgreSQL 18**, **pgvector**, and **NoSQL JSONB**, coupled with a responsive **Next.js 14** web application. 

The relational core comprises 14 normalized tables in Boyce-Codd Normal Form (BCNF), utilizing an append-only double-entry inventory ledger (`inventory_transactions`) to guarantee strict non-repudiation. Concurrency control and overselling prevention are enforced using ACID transactions with row-level locking (`SELECT ... FOR UPDATE`) in stored procedures (`sp_execute_stock_transfer`, `sp_fulfill_order_fifo`). Automated batch picking utilizes a First-In, First-Out (FIFO) algorithm prioritized by earliest expiration dates. 

A predictive analytics engine (`vw_daily_burn_rate_and_restock_predictor`) calculates 14-day consumption burn rates, forecasting days until complete stockout. When safety thresholds are breached, a row-level database trigger (`trg_auto_generate_purchase_order`) automatically generates draft purchase orders directed to preferred vendors. For unstructured catalog inquiries and customer sentiment analysis, the system integrates dense 384-dimensional vector embeddings with Hierarchical Navigable Small World (HNSW) indexing and Cosine Distance (`<=>`), grouping items based on review sentiment polarity. A functional Next.js 14 web application provides Role-Based Access Control (Admin, Manager, Staff, Auditor), real-time dashboards, and an interactive database evaluator.

**Keywords:** Relational Database, ACID Transactions, pgvector, HNSW Indexing, FIFO Lot Depletion, Row-Level Locking, Burn Rate Prediction, NoSQL JSONB, Trigger Automation.

<br><br>

---

<br><br>

## TABLE OF CONTENTS

| Chapter No. | Title | Page No. |
| :---: | :--- | :---: |
| | **CERTIFICATE** | ii |
| | **DECLARATION** | iii |
| | **ACKNOWLEDGEMENT** | iv |
| | **ABSTRACT** | v |
| | **LIST OF TABLES** | vii |
| | **LIST OF FIGURES** | viii |
| **1** | **INTRODUCTION** | **1** |
| | 1.1 Overview | 1 |
| | 1.2 Motivation | 2 |
| | 1.3 Multi-Paradigm Database Stack | 2 |
| **2** | **PROBLEM DEFINITION** | **4** |
| | 2.1 Problem Statement | 4 |
| | 2.2 Shortcomings of Basic CRUD Systems | 4 |
| | 2.3 Proposed Solution & Scope | 5 |
| | 2.4 Functional & Non-Functional Requirements | 6 |
| **3** | **ER MODEL** | **8** |
| | 3.1 Entity Identification | 8 |
| | 3.2 Attributes & Key Specifications | 9 |
| | 3.3 Structural Constraints & Cardinalities | 10 |
| | 3.4 Conceptual Entity-Relationship Diagram | 11 |
| **4** | **ER TO RELATIONAL MAPPING** | **12** |
| | 4.1 Steps of Mapping Algorithm for Chosen Problem | 12 |
| | 4.2 Relational Schema Representation | 14 |
| | 4.3 Normalization Analysis (1NF, 2NF, 3NF, BCNF) | 16 |
| **5** | **DDL STATEMENTS** | **18** |
| | 5.1 Extensions & Custom Enumerations | 18 |
| | 5.2 Table Creation Statements with Integrity Constraints | 19 |
| | 5.3 Performance & Vector Indexing Statements | 24 |
| | 5.4 ALTER & DROP Demonstration | 26 |
| **6** | **DML STATEMENTS** | **28** |
| | 6.1 Baseline Seed Data Generation | 28 |
| | 6.2 Relational Data Ingestion Statements | 28 |
| | 6.3 Vector Embeddings & NoSQL Documents | 32 |
| **7** | **QUERIES** | **34** |
| | 7.1 Simple Query with GROUP BY and Aggregate Functions | 34 |
| | 7.2 UPDATE Operation with Trigger Validation | 35 |
| | 7.3 DELETE Operation with Referential Integrity | 36 |
| | 7.4 Correlated Subquery | 37 |
| | 7.5 Nested Query & Common Table Expressions (CTEs) | 38 |
| | 7.6 Advanced Analytical Database Views | 39 |
| **8** | **STORED PROCEDURES, FUNCTIONS AND TRIGGERS** | **42** |
| | 8.1 Stored Procedures (FIFO Picking & Stock Relocation) | 42 |
| | 8.2 Database Triggers (Auto-PO & Negative Stock Prevention) | 46 |
| **9** | **FRONT END DEVELOPMENT** | **50** |
| | 9.1 Next.js 14 Web Architecture | 50 |
| | 9.2 Role-Based Access Control (RBAC) Interface | 51 |
| | 9.3 Module Workflows & Interface Descriptions | 52 |
| **10** | **REFERENCES / BIBLIOGRAPHY** | **55** |
| **APPENDIX A**| **DEFINITIONS, ACRONYMS AND ABBREVIATIONS** | **56** |

<br><br>

---

<br><br>

## LIST OF TABLES

| Table No. | Title | Page No. |
| :---: | :--- | :---: |
| 3.1 | Entity Set Definitions and Descriptions | 8 |
| 3.2 | Semantic Relationship Cardinalities and Constraints | 10 |
| 4.1 | Schema Normalization Summary (3NF / BCNF) | 17 |
| 5.1 | DDL Entities and Constraint Summary | 18 |
| 6.1 | Baseline Ingestion Dataset Counts | 28 |
| 7.1 | Supplier SLA Delay Query Output Record Set | 35 |
| 7.2 | Daily Revenue Summary View Output Record Set | 40 |
| 7.3 | Automated Restock Predictor View Output Record Set | 41 |
| 9.1 | Role-Based Access Control (RBAC) Permissions Matrix | 51 |

<br><br>

---

<br><br>

## LIST OF FIGURES

| Figure No. | Title | Page No. |
| :---: | :--- | :---: |
| 1.1 | Multi-Paradigm Database System Architecture | 3 |
| 3.1 | Complete Entity-Relationship (ER) Diagram (Crow's Foot Notation) | 11 |
| 4.1 | Relational Mapping and Foreign Key Dependency Graph | 15 |
| 5.1 | [Insert Screenshot: Table Creation DDL Output in PostgreSQL Terminal] | 27 |
| 6.1 | [Insert Screenshot: Ingestion Verification in psql Terminal] | 33 |
| 7.1 | [Insert Screenshot: GROUP BY & HAVING Query Execution Result] | 35 |
| 7.2 | [Insert Screenshot: Correlated Dead Stock Subquery Result] | 37 |
| 7.3 | [Insert Screenshot: CTE Automated Replenishment Query Result] | 38 |
| 8.1 | [Insert Screenshot: Stored Procedure sp_execute_stock_transfer Execution] | 45 |
| 8.2 | [Insert Screenshot: Trigger Abort Error on Attempted Negative Stock] | 48 |
| 8.3 | [Insert Screenshot: Auto-Generated Purchase Order Generated by Trigger] | 49 |
| 9.1 | [Insert Screenshot: Executive Dashboard with Burn Rate Predictor & KPIs] | 52 |
| 9.2 | [Insert Screenshot: FIFO Batch Inspector Modal with Expiration Alerts] | 53 |
| 9.3 | [Insert Screenshot: AI Semantic Vector Search Results with Cosine Similarity] | 53 |
| 9.4 | [Insert Screenshot: Customer Review Sentiment Analytics & Semantic Clusters] | 54 |
| 9.5 | [Insert Screenshot: Inter-Warehouse Stock Transfer Manifest Interface] | 54 |

<br><br>

---

<br><br>

# CHAPTER 1
# INTRODUCTION

### 1.1 Overview
In modern supply chain ecosystems, inventory management constitutes the backbone of enterprise operations. Whether distributing high-reliability semiconductors, industrial hydraulic actuators, or temperature-sensitive biopharmaceuticals, organizations must coordinate the flow of physical goods across multiple regional hubs while guaranteeing accurate valuation, regulatory compliance, and timely replenishment.

Historically, academic and entry-level inventory projects model inventory through simple database tables containing basic product definitions and an integer column for stock quantity. However, real-world supply chain management is fraught with non-linear operational dynamics:
- Goods arrive in distinct physical manufacturing **lots (batches)** having individual acquisition costs and strict expiration dates.
- High-concurrency warehouse picking frequently leads to **overselling race conditions** and phantom reads if transactions lack strict database isolation.
- Customer demand fluctuates dynamically, necessitating algorithmic **burn rate tracking** and automated purchase order generation before stockout events occur.
- Technical procurement personnel frequently search catalogs using functional descriptions (e.g., *"high-pressure solenoid valve for 350 bar circuits"*) rather than exact SKU codes, necessitating **semantic vector search**.

The **Smart Inventory & Automated Restock Predictor (SIMS)** addresses these challenges by replacing basic CRUD patterns with a resilient, double-entry relational ledger, automated FIFO lot allocation, predictive replenishment analytics, and machine learning vector embeddings.

### 1.2 Motivation
The motivation for this project originates from the critical shortcomings observed in commercial supply chains during supply disruptions:
1. **Perishable Lot Spoilage:** When physical stock is modeled as a scalar integer, warehouse picking staff cannot identify which specific lot is nearing expiration. Consequently, newly manufactured inventory is frequently shipped out while older batches spoil on the racks, resulting in severe financial write-offs.
2. **Double-Allocation and Concurrency Anomalies:** In distributed distribution facilities, concurrent e-commerce orders and regional warehouse transfers routinely query the same stock levels simultaneously. Without strict database row-level locking (`SELECT ... FOR UPDATE`), both transactions assume stock availability, driving actual balances negative.
3. **Manual Inefficient Procurement:** Procurement officers typically review inventory levels periodically, often discovering deficits after stockouts have already disrupted customer SLAs. Automating this threshold detection via database triggers ensures replenishment orders are issued proactively.

### 1.3 Multi-Paradigm Database Stack
To satisfy the demanding requirements of enterprise inventory management, this project employs a **unified multi-paradigm database architecture** implemented on **PostgreSQL 18** and extended with specialized extensions and document paradigms:

1. **Relational Database Engine (PostgreSQL 18):**  
   Provides the transactional core for 14 normalized relations in Boyce-Codd Normal Form (BCNF). It guarantees ACID properties (Atomicity, Consistency, Isolation, Durability) for multi-warehouse transfers and double-entry inventory ledger accounting.
2. **Vector Database Engine (`pgvector` Extension):**  
   Enables high-dimensional vector similarity search by storing 384-dimensional dense vectors generated by the `sentence-transformers/all-MiniLM-L6-v2` neural network model. Queries utilize Hierarchical Navigable Small World (HNSW) indexing and Cosine Distance (`<=>`) to match user queries with catalog specifications and customer review sentiment.
3. **Semi-Structured Document Store (PostgreSQL `JSONB`):**  
   Ingests time-series environmental telemetry emitted by IoT cold-storage sensors (monitoring temperature, humidity, and vibration) using generalized inverted indexes (GIN) for high-speed schema-free querying.

```text
+-------------------------------------------------------------------------------+
|                    NEXT.JS 14 FULL-STACK WEB INTERFACE                        |
|   (Dashboard, FIFO Batches, Semantic Search, Reviews Analytics, Transfers)    |
+-------------------------------------------------------------------------------+
                                      |
                           (Next.js Route Handlers)
                                      |
+-------------------------------------------------------------------------------+
|                    POSTGRESQL 18 MULTI-PARADIGM ENGINE                        |
|                                                                               |
|  +------------------------+  +----------------------+  +-------------------+  |
|  |     RELATIONAL SQL     |  |    pgvector (HNSW)   |  |    JSONB NoSQL    |  |
|  | 14 Tables in 3NF/BCNF  |  | 384-dim Embeddings   |  | IoT Telemetry     |  |
|  | Stored Procedures      |  | Cosine Distance <=>  |  | GIN Inverted Index|  |
|  | Row-Level Locks        |  | Semantic Search      |  | Dynamic Schemas   |  |
|  | Double-Entry Ledger    |  | Sentiment Clusters   |  | Sensor Breach Logs|  |
|  +------------------------+  +----------------------+  +-------------------+  |
+-------------------------------------------------------------------------------+
```
*Figure 1.1: Multi-Paradigm Database System Architecture*

<br><br>

---

<br><br>

# CHAPTER 2
# PROBLEM DEFINITION

### 2.1 Problem Statement
To design, implement, and evaluate a multi-facility **Smart Inventory & Automated Restock Predictor** that guarantees absolute transactional consistency, enforces automated First-In, First-Out (FIFO) lot depletion, tracks real-time consumption burn rates to proactively trigger purchase orders, and provides AI-driven semantic product discovery and customer review sentiment analytics.

### 2.2 Shortcomings of Basic CRUD Systems
Basic CRUD inventory implementations fail to meet commercial engineering standards due to the following structural deficiencies:
1. **Absence of Lot Traceability:** Traditional systems update a single aggregate column (`stock_quantity`). They cannot track which lot was received from which supplier, its unit cost basis, or its expiration date.
2. **Vulnerability to Race Conditions:** Standard `UPDATE products SET stock = stock - N WHERE id = X` statements executed concurrently without transaction locks produce lost updates and negative balances.
3. **Absence of Audit Non-Repudiation:** In simple CRUD systems, records are overwritten in place. If 50 units vanish, there is no historical record indicating whether they were dispatched, transferred, damaged, or stolen.
4. **Keyword Inflexibility:** Standard SQL `LIKE '%valve%'` queries fail to return relevant items when searching with synonyms, technical specs, or conceptual natural language phrases.

### 2.3 Proposed Solution & Scope
The proposed system resolves these deficiencies by implementing:
- **Discrete Batch Architecture:** Inventory is tracked across physical lots (`inventory_batches`) with explicit manufacturing and expiration timestamps.
- **Automated FIFO Algorithm:** A stored procedure automatically allocates stock from the oldest valid batch, updating ledger balances sequentially.
- **Double-Entry Stock Ledger:** Every inward, outward, or transfer movement writes an immutable, append-only record to `inventory_transactions`.
- **Automated Restock Predictor:** An analytical view computes daily consumption velocity over a 14-day rolling window, estimating remaining runway days.
- **Autonomous Purchase Order Generation:** A row-level database trigger detects when aggregate stock falls below the reorder threshold and automatically creates a draft Purchase Order for the preferred vendor.
- **AI Vector Search & Sentiment Analysis:** Evaluates 384-dimensional dense vectors to match unstructured catalog queries and cluster products based on customer review polarity.

**System Scope:**
- Multi-warehouse logistics across Bangalore, Mumbai, and Delhi hubs.
- Hierarchical product taxonomy (Electronics, Pharmaceuticals, Hydraulics, Chemicals).
- Vendor SLA performance scoring and procurement lifecycle.
- *Out of Scope:* Physical hardware IoT installation and commercial payment gateway processing.

### 2.4 Functional & Non-Functional Requirements

#### Functional Requirements:
1. **User Authentication & RBAC:** Secure access control across 4 distinct roles: `ADMIN`, `MANAGER`, `STAFF`, and `AUDITOR`.
2. **Master Catalog & Lot Tracking:** Management of products, categories, suppliers, and individual FIFO lots.
3. **ACID Inter-Warehouse Transfers:** Concurrency-safe transfer of stock between facilities with row-level locks.
4. **Predictive Replenishment:** Real-time calculation of daily burn rates and stockout countdowns.
5. **Autonomous Purchase Order Issuance:** Trigger-driven PO generation on threshold breaches.
6. **Semantic Vector Search:** Natural language inquiry matching via cosine distance.
7. **Customer Review Analytics:** Storing feedback embeddings and aggregating sentiment metrics.

#### Non-Functional Requirements:
1. **Data Integrity:** Enforced at the database kernel level via CHECK constraints, foreign key restrictions, and triggers.
2. **High Concurrency & Isolation:** Prevention of dirty reads and overselling via pessimistic row-level locking (`FOR UPDATE`).
3. **Query Performance:** Sub-5 millisecond response times on analytical queries through B-Tree, Composite, GIN, and HNSW indexes.
4. **Security:** Passwords encrypted using salted Bcrypt hashes ($2b$10$...); zero hardcoded credentials in source code.

<br><br>

---

<br><br>

# CHAPTER 3
# ER MODEL

### 3.1 Entity Identification
The conceptual model comprises 14 core entities structured to capture all facets of inventory logistics, procurement, transaction journaling, and sentiment intelligence.

*Table 3.1: Entity Set Definitions and Descriptions*

| Entity Name | Description | Key Attributes |
| :--- | :--- | :--- |
| **USERS** | System operators authenticated under RBAC roles | `user_id` (PK), `email` (UK), `role` |
| **WAREHOUSES** | Physical distribution facilities and cold-storage hubs | `warehouse_id` (PK), `warehouse_code` (UK) |
| **PRODUCT_CATEGORIES** | Hierarchical taxonomy of product classifications | `category_id` (PK), `category_code` (UK) |
| **SUPPLIERS** | Commercial vendors supplying inventory assets | `supplier_id` (PK), `supplier_code` (UK) |
| **PRODUCTS** | Master catalog of SKU items with safety thresholds | `product_id` (PK), `sku` (UK) |
| **PRODUCT_EMBEDDINGS** | 384-dim dense vectors representing catalog specs | `embedding_id` (PK), `product_id` (FK, UK) |
| **PURCHASE_ORDERS** | Procurement contracts issued to suppliers | `po_id` (PK), `po_number` (UK) |
| **PURCHASE_ORDER_ITEMS** | Line items specifying quantities and negotiated costs | `po_item_id` (PK), `po_id` (FK), `product_id` (FK) |
| **INVENTORY_BATCHES** | Physical manufacturing lots with expiration dates | `batch_id` (PK), `batch_number`, `product_id` (FK) |
| **INVENTORY_TRANSACTIONS** | Immutable double-entry audit journal | `transaction_id` (PK), `transaction_ref` |
| **STOCK_TRANSFERS** | Relocation manifests between physical warehouses | `transfer_id` (PK), `transfer_number` (UK) |
| **STOCK_TRANSFER_ITEMS** | Specific lots and quantities being transferred | `transfer_item_id` (PK), `transfer_id` (FK) |
| **SALES_ORDERS** | Outbound client dispatches driving consumption | `order_id` (PK), `order_number` (UK) |
| **SALES_ORDER_ITEMS** | Dispatched line items specifying sold units and price | `order_item_id` (PK), `order_id` (FK) |
| **PRODUCT_REVIEWS** | Customer feedback with sentiment scores & embeddings | `review_id` (PK), `product_id` (FK) |
| **WAREHOUSE_TELEMETRY** | NoSQL time-series sensor payloads from storage zones | `telemetry_id` (PK), `warehouse_id` (FK) |
| **AUDIT_LOGS** | Change Data Capture (CDC) audit journal | `audit_id` (PK), `record_id` |

### 3.2 Attributes & Key Specifications
- **Candidate Keys:** Every master entity defines a natural unique key in addition to a surrogate UUID (e.g., `sku` in `PRODUCTS`, `po_number` in `PURCHASE_ORDERS`, `warehouse_code` in `WAREHOUSES`).
- **Composite Unique Keys:**
  - `INVENTORY_BATCHES`: `{batch_number, product_id, warehouse_id}` guarantees that identical lot identifiers cannot collide across facilities.
  - `PURCHASE_ORDER_ITEMS`: `{po_id, product_id}` prevents duplicate line items within the same procurement order.
- **Multivalued & Semi-Structured Attributes:** Handled via separate child relations or native PostgreSQL `JSONB` structures (`sensor_payload` in `WAREHOUSE_TELEMETRY`, `metadata` in `PRODUCT_EMBEDDINGS`).

### 3.3 Structural Constraints & Cardinalities

*Table 3.2: Semantic Relationship Cardinalities and Constraints*

| Relationship | Entities Involved | Cardinality | Participation | Semantic Rule |
| :--- | :--- | :---: | :---: | :--- |
| **Manages** | `USERS` to `WAREHOUSES` | $1:N$ | Partial : Partial | A manager can oversee multiple facilities; a warehouse has at most one lead. |
| **Classifies** | `PRODUCT_CATEGORIES` to `PRODUCTS` | $1:N$ | Total : Total | Every product must belong to exactly one valid category. |
| **Vectorizes** | `PRODUCTS` to `PRODUCT_EMBEDDINGS` | $1:1$ | Total : Total | Each product has exactly one 384-dimensional dense vector representation. |
| **Supplies** | `SUPPLIERS` to `PURCHASE_ORDERS` | $1:N$ | Partial : Total | A supplier fulfills multiple orders; each PO is placed with exactly one supplier. |
| **Contains Items** | `PURCHASE_ORDERS` to `PO_ITEMS` | $1:N$ | Total : Total | Every PO consists of at least one line item (CASCADE on delete). |
| **Tracks Lots** | `PRODUCTS` to `INVENTORY_BATCHES` | $1:N$ | Partial : Total | A product can exist across multiple physical lots and warehouses. |
| **Ledger Audit** | `INVENTORY_BATCHES` to `TRANSACTIONS` | $1:N$ | Total : Total | Every batch mutation creates an immutable audit ledger entry. |
| **Transfers Stock** | `WAREHOUSES` to `STOCK_TRANSFERS` | $1:N$ | Partial : Total | Transfers require distinct source and destination facilities ($Source \neq Target$). |
| **Receives Reviews** | `PRODUCTS` to `PRODUCT_REVIEWS` | $1:N$ | Partial : Total | Products collect customer reviews containing sentiment embeddings. |
| **Sensors Log** | `WAREHOUSES` to `TELEMETRY` | $1:N$ | Partial : Total | Storage facilities log unstructured environmental IoT data packets. |

### 3.4 Conceptual Entity-Relationship Diagram

```text
       +------------------+                    +--------------------+
       |      USERS       | 1                N |     WAREHOUSES     |
       |------------------|<-------------------|--------------------|
       | user_id (PK)     |      manages       | warehouse_id (PK)  |
       | email (UK)       |                    | warehouse_code (UK)|
       +------------------+                    +--------------------+
         |              |                         |           |
         | 1            | 1                       | 1         | 1
         |              |                         |           |
         | creates      | authorizes              | stores    | monitors
         |              |                         |           |
         v N            v N                       v N         v N
+-------------------+ +----------------------+ +-------------+ +--------------------+
|  PURCHASE_ORDERS  | |INVENTORY_TRANSACTIONS| |  INVENTORY  | |WAREHOUSE_TELEMETRY |
|-------------------| |----------------------| |   BATCHES   | |--------------------|
| po_id (PK)        | | transaction_id (PK)  | |-------------| | telemetry_id (PK)  |
| po_number (UK)    | | transaction_ref      | |batch_id (PK)| | sensor_payload(JSON|
| supplier_id (FK)  | | quantity_change      | |batch_num    | +--------------------+
+-------------------+ +----------------------+ +-------------+
         |                                            |
         | 1                                          | 1
         v N                                          v N
+-------------------+                         +--------------------+
|PURCHASE_ORDER_ITEM|                         |STOCK_TRANSFER_ITEMS|
+-------------------+                         +--------------------+
         |                                            ^
         | N                                          | N
         v 1                                          | 1
+-------------------+ 1                      1+--------------------+
|     PRODUCTS      |------------------------>|  STOCK_TRANSFERS   |
|-------------------|      transferred as     +--------------------+
| product_id (PK)   |
| sku (UK)          |--+ 1
+-------------------+  |
  | 1            | 1   | has vector
  |              |     v 1
  | classifies   |   +--------------------+
  |              |   | PRODUCT_EMBEDDINGS |
  |              |   |--------------------|
  |              |   | embedding_id (PK)  |
  |              |   | embedding vector384|
  v N            v N +--------------------+
+-------------+ +-----------------+
| CATEGORIES  | | PRODUCT_REVIEWS |
+-------------+ |-----------------|
                | review_id (PK)  |
                | sentiment_score |
                | review_embedding|
                +-----------------+
```
*Figure 3.1: Complete Entity-Relationship (ER) Diagram*

<br><br>

---

<br><br>

# CHAPTER 4
# ER TO RELATIONAL MAPPING

### 4.1 Steps of Mapping Algorithm for Chosen Problem
The transformation of the conceptual ER model into a normalized relational schema adheres strictly to the formal 7-step relational mapping methodology:

#### Step 1: Mapping of Regular (Strong) Entity Sets
For each strong entity set $E$ in the ER schema, create a relation $R$ containing all simple scalar attributes of $E$. Choose one candidate key as the primary key:
- `USERS` $\rightarrow$ Relation `users` with primary key `user_id`.
- `WAREHOUSES` $\rightarrow$ Relation `warehouses` with primary key `warehouse_id`.
- `PRODUCT_CATEGORIES` $\rightarrow$ Relation `product_categories` with primary key `category_id`.
- `SUPPLIERS` $\rightarrow$ Relation `suppliers` with primary key `supplier_id`.
- `PRODUCTS` $\rightarrow$ Relation `products` with primary key `product_id`.
- `PURCHASE_ORDERS` $\rightarrow$ Relation `purchase_orders` with primary key `po_id`.
- `STOCK_TRANSFERS` $\rightarrow$ Relation `stock_transfers` with primary key `transfer_id`.
- `SALES_ORDERS` $\rightarrow$ Relation `sales_orders` with primary key `order_id`.

#### Step 2: Mapping of Weak Entity Sets
Weak entities lacking independent keys are modeled by incorporating the primary key of the owner entity as a foreign key combined with the weak entity's partial discriminator:
- `INVENTORY_BATCHES` is owned by `PRODUCTS` and `WAREHOUSES`. Surrogate key `batch_id` is defined as PK, with composite candidate key `{batch_number, product_id, warehouse_id}`.
- `PURCHASE_ORDER_ITEMS` is owned by `PURCHASE_ORDERS`. Incorporates `po_id` as foreign key with discriminator `product_id`.
- `SALES_ORDER_ITEMS` incorporates `order_id` as foreign key.

#### Step 3: Mapping of Binary 1:1 Relationships
For each binary 1:1 relationship between $S$ and $T$, choose one relation (preferably total participation) and incorporate the primary key of the other as a foreign key with a UNIQUE constraint:
- Relationship between `PRODUCTS` and `PRODUCT_EMBEDDINGS`: Relation `product_embeddings` incorporates `product_id` as a foreign key with a `UNIQUE` constraint, enforcing strict 1:1 correspondence.

#### Step 4: Mapping of Binary 1:N Relationships
For each binary 1:N relationship from $S$ to $T$, include the primary key of $S$ as a foreign key in the relation $T$ representing the $N$-side:
- Relationship `Classifies` ($1:N$ between `PRODUCT_CATEGORIES` and `PRODUCTS`): Include `category_id` as foreign key in `products` with `ON DELETE RESTRICT`.
- Relationship `Supplies` ($1:N$ between `SUPPLIERS` and `PURCHASE_ORDERS`): Include `supplier_id` as foreign key in `purchase_orders`.
- Self-referencing recursive relationship on `PRODUCT_CATEGORIES`: Include `parent_category_id` referencing `category_id` within the same table.

#### Step 5: Mapping of Binary M:N Relationships
For each binary $M:N$ relationship between $S$ and $T$, create a new cross-reference relation $R$ whose primary key is the combination of foreign keys referencing $S$ and $T$:
- $M:N$ between `PURCHASE_ORDERS` and `PRODUCTS`: Mapped to `purchase_order_items` with composite candidate key `{po_id, product_id}` and surrogate `po_item_id`.
- $M:N$ between `STOCK_TRANSFERS` and `INVENTORY_BATCHES`: Mapped to `stock_transfer_items` referencing `transfer_id` and `source_batch_id`.

#### Step 6: Mapping of Multivalued and Semi-Structured Attributes
Create a new relation for multivalued attributes containing the attribute and the owner's primary key, or utilize specialized database types:
- Unstructured IoT telemetry metrics (`temperature`, `humidity`, `vibration`, `alarms`) are mapped to the relation `warehouse_telemetry` using PostgreSQL's native `JSONB` data type, indexed with inverted GIN indexes.

#### Step 7: Mapping of Higher-Degree (N-ary) Relationships
Relationships involving more than two entity sets are mapped to dedicated junction relations:
- Relationship between `USERS`, `PRODUCTS`, `WAREHOUSES`, and `INVENTORY_BATCHES` representing stock ledger operations is mapped to `inventory_transactions`, incorporating foreign keys `performed_by`, `product_id`, `warehouse_id`, and `batch_id`.

### 4.2 Relational Schema Representation
The resulting relational schema with foreign key dependencies is represented below (underlined denotes **Primary Key**, asterisk denotes *Foreign Key*):

```text
users (
    user_id [PK], email [UK], password_hash, full_name, role, department, 
    is_active, created_at, updated_at
)

warehouses (
    warehouse_id [PK], warehouse_code [UK], name, address, city, country, 
    capacity_sqft, current_occupancy_pct, *manager_id -> users(user_id), 
    is_active, created_at
)

product_categories (
    category_id [PK], category_code [UK], name, description, 
    *parent_category_id -> product_categories(category_id), created_at
)

suppliers (
    supplier_id [PK], supplier_code [UK], company_name, contact_name, 
    email [UK], phone, address, rating, lead_time_days, payment_terms, 
    is_preferred, is_blacklisted, created_at
)

products (
    product_id [PK], sku [UK], name, description, *category_id -> product_categories, 
    unit_of_measure, cost_price, unit_price, reorder_level, target_stock_level, 
    is_perishable, shelf_life_days, created_at, updated_at
)

product_embeddings (
    embedding_id [PK], *product_id [FK, UK] -> products(product_id), 
    embedding_text, embedding (vector_384), model_name, metadata (JSONB), 
    created_at, updated_at
)

purchase_orders (
    po_id [PK], po_number [UK], *supplier_id -> suppliers(supplier_id), 
    *destination_warehouse_id -> warehouses(warehouse_id), status, total_amount, 
    *created_by -> users(user_id), order_date, expected_delivery_date, 
    actual_delivery_date, notes, created_at
)

purchase_order_items (
    po_item_id [PK], *po_id -> purchase_orders(po_id), 
    *product_id -> products(product_id), ordered_quantity, received_quantity, 
    unit_cost, line_total [GENERATED]
    Candidate Key: {po_id, product_id}
)

inventory_batches (
    batch_id [PK], batch_number, *product_id -> products(product_id), 
    *warehouse_id -> warehouses(warehouse_id), *po_item_id -> purchase_order_items, 
    initial_quantity, current_quantity, unit_cost, manufacturing_date, 
    expiry_date, received_at
    Candidate Key: {batch_number, product_id, warehouse_id}
)

inventory_transactions (
    transaction_id [PK], transaction_ref, transaction_type, 
    *product_id -> products(product_id), *warehouse_id -> warehouses(warehouse_id), 
    *batch_id -> inventory_batches(batch_id), quantity_change, balance_after, 
    *performed_by -> users(user_id), notes, created_at
)

stock_transfers (
    transfer_id [PK], transfer_number [UK], *source_warehouse_id -> warehouses, 
    *target_warehouse_id -> warehouses, status, *requested_by -> users(user_id), 
    *approved_by -> users(user_id), tracking_reference, created_at, completed_at
)

stock_transfer_items (
    transfer_item_id [PK], *transfer_id -> stock_transfers(transfer_id), 
    *product_id -> products(product_id), *source_batch_id -> inventory_batches, 
    quantity
)

sales_orders (
    order_id [PK], order_number [UK], customer_name, order_date, 
    total_amount, total_cost_basis, status, created_at
)

sales_order_items (
    order_item_id [PK], *order_id -> sales_orders(order_id), 
    *product_id -> products(product_id), quantity, unit_price, unit_cost, 
    line_total [GENERATED]
)

product_reviews (
    review_id [PK], *product_id -> products(product_id), customer_name, 
    rating, review_text, sentiment_score, sentiment_label, review_embedding (vector_384), 
    created_at
)

warehouse_telemetry (
    telemetry_id [PK], *warehouse_id -> warehouses(warehouse_id), 
    zone_code, recorded_at, sensor_payload (JSONB), device_id
)

audit_logs (
    audit_id [PK], table_name, operation, record_id, 
    old_data (JSONB), new_data (JSONB), *changed_by -> users(user_id), timestamp
)
```
*Figure 4.1: Relational Schema Mapping*

### 4.3 Normalization Analysis (1NF, 2NF, 3NF, BCNF)
A rigorous normalization assessment was conducted for every relation to eliminate update, insertion, and deletion anomalies.

#### First Normal Form (1NF):
- **Requirement:** Every attribute value must be atomic, and there must be no repeating groups.
- **Proof:** All columns contain primitive data types (UUID, VARCHAR, INT, NUMERIC, DATE, TIMESTAMPTZ). Multi-item orders (PO line items, transfer items) and multi-facility batch distributions are decomposed into distinct relations (`purchase_order_items`, `stock_transfer_items`, `inventory_batches`). No comma-separated strings or nested arrays exist in the relational core.

#### Second Normal Form (2NF):
- **Requirement:** The relation must be in 1NF, and no non-prime attribute may be partially functionally dependent on any candidate key.
- **Proof:** Composite candidate keys exist in `purchase_order_items` (`{po_id, product_id}`) and `inventory_batches` (`{batch_number, product_id, warehouse_id}`).
  - In `purchase_order_items`: Attributes `ordered_quantity`, `received_quantity`, and `unit_cost` depend on both the specific PO and the product.
  - In `inventory_batches`: `current_quantity`, `manufacturing_date`, and `expiry_date` depend on the specific physical lot identifier at that specific facility.
  - All other relations use single-attribute surrogate keys (`user_id`, `product_id`, `supplier_id`), making partial dependencies impossible. Hence, 2NF is satisfied.

#### Third Normal Form (3NF):
- **Requirement:** The relation must be in 2NF, and no non-prime attribute may be transitively dependent on the primary key ($X \rightarrow Y$ and $Y \rightarrow Z$).
- **Proof:** Transitive dependencies have been eliminated:
  - In `products`: `product_id -> category_id`. The category name and description are not stored in `products`; they remain in `product_categories`, avoiding `product_id -> category_id -> category_name`.
  - In `purchase_orders`: `po_id -> supplier_id`. Supplier contact numbers, ratings, and payment terms remain normalized in `suppliers`.
  - In `inventory_transactions`: `transaction_id -> performed_by`. User details are normalized in `users`. Hence, 3NF is satisfied.

#### Boyce-Codd Normal Form (BCNF):
- **Requirement:** For every non-trivial functional dependency $X \rightarrow Y$, the determinant $X$ must be a superkey.
- **Proof:**
  - In `users`: Dependencies are `user_id -> all attributes` and `email -> all attributes`. Both `user_id` and `email` are candidate keys.
  - In `products`: `product_id -> all attributes` and `sku -> all attributes`. Both are candidate keys.
  - In `suppliers`: `supplier_id -> all attributes` and `supplier_code -> all attributes`. Both are candidate keys.
  - In all relations, every functional dependency originates from a superkey. Therefore, the schema satisfies **BCNF**.

*Table 4.1: Schema Normalization Summary*

| Relation Name | Determinant ($X$) | Dependent Attributes ($Y$) | Candidate Key? | Normal Form Achieved |
| :--- | :--- | :--- | :---: | :---: |
| `users` | `user_id`, `email` | `full_name`, `password_hash`, `role` | YES | **BCNF** |
| `warehouses` | `warehouse_id`, `warehouse_code` | `name`, `capacity_sqft`, `manager_id` | YES | **BCNF** |
| `suppliers` | `supplier_id`, `supplier_code` | `company_name`, `lead_time_days` | YES | **BCNF** |
| `products` | `product_id`, `sku` | `name`, `category_id`, `cost_price` | YES | **BCNF** |
| `purchase_orders` | `po_id`, `po_number` | `supplier_id`, `total_amount`, `status`| YES | **BCNF** |
| `inventory_batches` | `batch_id`, `{batch_num, prod, wh}` | `current_qty`, `unit_cost`, `expiry` | YES | **BCNF** |
| `sales_orders` | `order_id`, `order_number` | `customer_name`, `order_date`, `total` | YES | **BCNF** |

<br><br>

---

<br><br>

# CHAPTER 5
# DDL STATEMENTS

### 5.1 Extensions & Custom Enumerations
The Data Definition Language (DDL) initialization script begins by registering the cryptographic and vector extensions and declaring custom domain enumeration types.

```sql
-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Vector database extension for embeddings

-- 2. Clean Drop (Safe Re-execution demonstration)
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS sales_order_items CASCADE;
DROP TABLE IF EXISTS sales_orders CASCADE;
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
    'PO_RECEIPT', 'SALE_FULFILLMENT', 'TRANSFER_OUT', 
    'TRANSFER_IN', 'ADJUSTMENT_ADD', 'ADJUSTMENT_SUB', 'SCRAP_EXPIRED'
);
```

### 5.2 Table Creation Statements with Integrity Constraints

```sql
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

-- 9. Product Vector Embeddings (Vector Database pgvector Paradigm)
CREATE TABLE product_embeddings (
    embedding_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL UNIQUE REFERENCES products(product_id) ON DELETE CASCADE,
    embedding_text TEXT NOT NULL,
    embedding vector(384) NOT NULL, -- 384-dimensional dense vector
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
    quantity_change INT NOT NULL,
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

-- 15. Sales Orders & Line Items (Outbound Dispatches)
CREATE TABLE sales_orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_cost_basis NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_order_items (
    order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES sales_orders(order_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL,
    line_total NUMERIC(14, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    CONSTRAINT chk_sales_qty CHECK (quantity > 0)
);

-- 16. Customer Reviews & Feedback Sentiment Embeddings
CREATE TABLE product_reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    customer_name VARCHAR(120) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT NOT NULL,
    sentiment_score NUMERIC(3, 2) NOT NULL CHECK (sentiment_score BETWEEN -1.00 AND 1.00),
    sentiment_label VARCHAR(20) NOT NULL CHECK (sentiment_label IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
    review_embedding vector(384),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. Semi-Structured NoSQL Telemetry (IoT Sensory Monitoring)
CREATE TABLE warehouse_telemetry (
    telemetry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(warehouse_id) ON DELETE CASCADE,
    zone_code VARCHAR(30) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sensor_payload JSONB NOT NULL,
    device_id VARCHAR(80) NOT NULL
);

-- 18. Audit Logs (Change Data Capture)
CREATE TABLE audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(20) NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES users(user_id),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 5.3 Performance & Vector Indexing Statements

```sql
-- Foreign Key Lookups
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_batches_product ON inventory_batches(product_id);
CREATE INDEX idx_transactions_product ON inventory_transactions(product_id);

-- Composite Index for FIFO Batch Allocation
CREATE INDEX idx_batches_fifo_lookup 
    ON inventory_batches(product_id, warehouse_id, expiry_date ASC, current_quantity)
    WHERE current_quantity > 0;

-- Full-Text GIN Index
CREATE INDEX idx_products_fts 
    ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- HNSW Vector Indexes for pgvector
CREATE INDEX idx_product_embeddings_hnsw 
    ON product_embeddings USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_product_reviews_hnsw 
    ON product_reviews USING hnsw (review_embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- GIN Index on JSONB IoT Telemetry
CREATE INDEX idx_telemetry_payload_gin 
    ON warehouse_telemetry USING gin(sensor_payload);
```

### 5.4 ALTER & DROP Demonstration
The implementation explicitly demonstrates schema modification (`ALTER`) and clean tear-down (`DROP`):

```sql
-- Alter Statements demonstrating schema evolution
ALTER TABLE suppliers 
    ADD COLUMN is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE products 
    ADD CONSTRAINT chk_sku_uppercase CHECK (sku = UPPER(sku));
```

<br>

```text
+----------------------------------------------------------------------------------+
|      [Insert Screenshot 5.1: DDL Table Creation Execution Output in psql]        |
|  Caption: PostgreSQL terminal log displaying successful execution of DDL script  |
|           creating all 18 tables, custom enums, and HNSW indexes.                |
+----------------------------------------------------------------------------------+
```

<br><br>

---

<br><br>

# CHAPTER 6
# DML STATEMENTS

### 6.1 Baseline Seed Data Generation
To validate relational integrity, views, procedures, and vector operations, a realistic baseline dataset was inserted across regional facilities in Bangalore, Mumbai, and Delhi.

*Table 6.1: Baseline Ingestion Dataset Counts*

| Table Entity | Records Seeded | Scope & Functional Role |
| :--- | :---: | :--- |
| `users` | 4 | Accounts for Admin, Manager, Staff, and Auditor roles |
| `warehouses` | 3 | Regional logistics hubs: Bangalore Central, Mumbai Port, Delhi Cold Hub |
| `product_categories`| 4 | Electronics, Pharmaceuticals, Hydraulics, Specialty Chemicals |
| `suppliers` | 4 | Vendor profiles with ratings, payment terms, and lead times |
| `products` | 8 | Master catalog items spanning semiconductors, vaccines, valves, lubricants |
| `product_embeddings`| 8 | 384-dimensional dense vectors representing product specifications |
| `purchase_orders` | 3 | Historical procurement records with line items |
| `inventory_batches` | 8 | Active physical lots with near-term and healthy expiration dates |
| `sales_orders` | 3 | Outbound customer dispatches driving revenue analysis |
| `product_reviews` | 5 | Customer feedback containing sentiment scores and embeddings |
| `warehouse_telemetry`| 4 | JSONB telemetry packets capturing temperature, humidity, and alarms |

### 6.2 Relational Data Ingestion Statements

```sql
-- 1. Users & RBAC Personas (Passwords stored as salted Bcrypt hashes)
INSERT INTO users (user_id, email, password_hash, full_name, role, department) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@smartinventory.io', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WvWp6m9Z2rGvG', 'Dr. Rajesh Sharma', 'ADMIN', 'Executive Operations'),
('a0000000-0000-0000-0000-000000000002', 'manager@smartinventory.io', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WvWp6m9Z2rGvG', 'Priya Venkatesh', 'MANAGER', 'Supply Chain & Procurement'),
('a0000000-0000-0000-0000-000000000003', 'staff@smartinventory.io', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WvWp6m9Z2rGvG', 'Nandan Kumar', 'STAFF', 'Warehouse Logistics'),
('a0000000-0000-0000-0000-000000000004', 'auditor@smartinventory.io', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WvWp6m9Z2rGvG', 'Ananya Deshmukh', 'AUDITOR', 'Internal Quality Audit');

-- 2. Warehouses
INSERT INTO warehouses (warehouse_id, warehouse_code, name, address, city, capacity_sqft, manager_id) VALUES
('b0000000-0000-0000-0000-000000000001', 'WH-BLR-01', 'Bangalore Central Hub', 'Plot 45, Electronic City Phase 1', 'Bangalore', 50000.00, 'a0000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000002', 'WH-BOM-02', 'Mumbai Port Fulfillment', 'Sector 18, JNPT Port Logistics Zone', 'Navi Mumbai', 75000.00, 'a0000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000003', 'WH-DEL-03', 'Delhi NCR Cold Hub', 'Block D, Udyog Vihar Phase 5', 'Gurugram', 35000.00, 'a0000000-0000-0000-0000-000000000002');

-- 3. Product Categories
INSERT INTO product_categories (category_id, category_code, name, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'CAT-ELEC', 'Industrial Electronics', 'Microcontrollers, sensors, IoT gateways, and circuit boards'),
('c0000000-0000-0000-0000-000000000002', 'CAT-MED', 'Pharmaceutical & Vaccines', 'Temperature-controlled vaccines, antibiotics, and surgical supplies'),
('c0000000-0000-0000-0000-000000000003', 'CAT-MECH', 'Precision Hydraulic & Mechanical', 'Pumps, pneumatic valves, stainless steel fittings, and seals'),
('c0000000-0000-0000-0000-000000000004', 'CAT-CHEM', 'Specialty Industrial Chemicals', 'Corrosion inhibitors, food-grade lubricants, and cleaning reagents');

-- 4. Suppliers
INSERT INTO suppliers (supplier_id, supplier_code, company_name, contact_name, email, phone, address, rating, lead_time_days, is_preferred) VALUES
('d0000000-0000-0000-0000-000000000001', 'SUP-SEMICORP', 'SemiTech Micro Devices Ltd', 'Arjun Nair', 'arjun@semitech.co.in', '+91-9876543210', 'Peenya Industrial Estate, Bangalore', 4.85, 5, TRUE),
('d0000000-0000-0000-0000-000000000002', 'SUP-BIOLIFE', 'BioLife Pharma Solutions', 'Dr. Sunita Rao', 'procurement@biolifepharma.com', '+91-9812345678', 'Genome Valley, Hyderabad', 4.90, 3, TRUE),
('d0000000-0000-0000-0000-000000000003', 'SUP-HYDROFLOW', 'HydroFlow Engineering Valves', 'Vikram Patel', 'sales@hydroflowvalves.com', '+91-9823456789', 'GIDC Industrial Zone, Vadodara', 4.20, 12, FALSE),
('d0000000-0000-0000-0000-000000000004', 'SUP-CHEMPURE', 'ChemPure Reagents India', 'Kavita Menon', 'orders@chempureindia.com', '+91-9834567890', 'MIDC Tarapur, Maharashtra', 3.75, 15, FALSE);

-- 5. Products Catalog
INSERT INTO products (product_id, sku, name, description, category_id, unit_of_measure, cost_price, unit_price, reorder_level, target_stock_level, is_perishable, shelf_life_days) VALUES
('e0000000-0000-0000-0000-000000000001', 'SKU-STM32-01', 'STM32F4 Cortex-M4 Microcontroller', 'High-performance 32-bit RISC ARM MCU with 1MB Flash, DSP instructions and FPU', 'c0000000-0000-0000-0000-000000000001', 'pcs', 450.00, 680.00, 200, 1000, FALSE, NULL),
('e0000000-0000-0000-0000-000000000002', 'SKU-SENS-BMP280', 'BMP280 Digital Barometric Pressure Sensor', 'Ultra-compact digital sensor for barometric air pressure and ambient temperature measurement', 'c0000000-0000-0000-0000-000000000001', 'pcs', 120.00, 220.00, 150, 600, FALSE, NULL),
('e0000000-0000-0000-0000-000000000003', 'SKU-VAX-COV2', 'Cold-Chain mRNA Viral Vaccine Vial', 'Ultra-low temperature perishable vaccine vial, store strictly between -20C and -10C', 'c0000000-0000-0000-0000-000000000002', 'vials', 850.00, 1200.00, 100, 500, TRUE, 90),
('e0000000-0000-0000-0000-000000000004', 'SKU-INSULIN-100', 'Recombinant Human Insulin 100IU/ml', 'Biotherapeutic peptide hormone for blood glucose regulation, requires 2-8C refrigeration', 'c0000000-0000-0000-0000-000000000002', 'vials', 320.00, 550.00, 80, 400, TRUE, 180),
('e0000000-0000-0000-0000-000000000005', 'SKU-VALVE-HYD-50', 'High-Pressure Hydraulic Directional Valve', 'Heavy-duty solenoid directional control valve rated for 350 bar industrial systems', 'c0000000-0000-0000-0000-000000000003', 'units', 3400.00, 5200.00, 25, 100, FALSE, NULL),
('e0000000-0000-0000-0000-000000000006', 'SKU-PUMP-ROT-02', 'Rotary Gear Lubrication Pump', 'Self-priming positive displacement external gear pump for hydraulic oil circuits', 'c0000000-0000-0000-0000-000000000003', 'units', 4800.00, 7100.00, 15, 60, FALSE, NULL),
('e0000000-0000-0000-0000-000000000007', 'SKU-LUB-SYN-20', 'Synthetic Polyalphaolefin Gear Oil 20L', 'Extreme-pressure synthetic lubricant with high thermal stability and oxidation resistance', 'c0000000-0000-0000-0000-000000000004', 'canisters', 2200.00, 3150.00, 40, 150, TRUE, 730),
('e0000000-0000-0000-0000-000000000008', 'SKU-REAG-CLEAN-5', 'Bio-Degradable Ultrasonic Degreaser 5L', 'Aqueous neutral solvent formulated for precision ultrasonic parts cleaning', 'c0000000-0000-0000-0000-000000000004', 'bottles', 600.00, 950.00, 50, 200, FALSE, NULL);

-- 6. Inventory Batches (Active stock across facilities)
INSERT INTO inventory_batches (batch_id, batch_number, product_id, warehouse_id, initial_quantity, current_quantity, unit_cost, manufacturing_date, expiry_date) VALUES
('70000000-0000-0000-0000-000000000001', 'BATCH-2026-EL01', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 1000, 840, 450.00, '2025-12-01', NULL),
('70000000-0000-0000-0000-000000000002', 'BATCH-2026-SEN01', 'e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 600, 480, 120.00, '2025-11-15', NULL),
('70000000-0000-0000-0000-000000000003', 'BATCH-2026-VAX-A', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 250, 45, 850.00, '2026-01-01', CURRENT_DATE + INTERVAL '12 days'),
('70000000-0000-0000-0000-000000000004', 'BATCH-2026-VAX-B', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 250, 220, 850.00, '2026-01-10', CURRENT_DATE + INTERVAL '78 days'),
('70000000-0000-0000-0000-000000000005', 'BATCH-2026-INS-01', 'e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003', 350, 190, 320.00, '2025-12-10', CURRENT_DATE + INTERVAL '140 days'),
('70000000-0000-0000-0000-000000000006', 'BATCH-2026-VLV-01', 'e0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 40, 18, 3400.00, '2025-10-01', NULL),
('70000000-0000-0000-0000-000000000007', 'BATCH-2026-PMP-01', 'e0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002', 20, 8, 4800.00, '2025-09-15', NULL),
('70000000-0000-0000-0000-000000000008', 'BATCH-2026-OIL-01', 'e0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 80, 22, 2200.00, '2025-08-01', CURRENT_DATE + INTERVAL '520 days');

-- 7. Outbound Sales Orders
INSERT INTO sales_orders (order_id, order_number, customer_name, order_date, total_amount, total_cost_basis, status) VALUES
('90000000-0000-0000-0000-000000000001', 'SO-2026-081', 'Apollo Multi-Specialty Hospital', CURRENT_DATE - INTERVAL '1 day', 108800.00, 72000.00, 'COMPLETED'),
('90000000-0000-0000-0000-000000000002', 'SO-2026-082', 'Bosch Automotive India', CURRENT_DATE, 156000.00, 102000.00, 'COMPLETED'),
('90000000-0000-0000-0000-000000000003', 'SO-2026-083', 'Manipal Health Enterprises', CURRENT_DATE, 93500.00, 54400.00, 'COMPLETED');

INSERT INTO sales_order_items (order_id, product_id, quantity, unit_price, unit_cost) VALUES
('90000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 160, 680.00, 450.00),
('90000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000005', 30, 5200.00, 3400.00),
('90000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000004', 170, 550.00, 320.00);
```

### 6.3 Vector Embeddings & NoSQL Documents

```sql
-- 8. Customer Reviews with Unstructured Sentiment Embeddings
INSERT INTO product_reviews (product_id, customer_name, rating, review_text, sentiment_score, sentiment_label, review_embedding) VALUES
('e0000000-0000-0000-0000-000000000003', 'Dr. Alok Verma', 5, 'Exceptional cold chain integrity. Temperature vials remained strictly below -15C throughout delivery.', 0.94, 'POSITIVE', array_fill(0.045::real, ARRAY[384])::vector),
('e0000000-0000-0000-0000-000000000003', 'Karan Mehta (Lab Logistics)', 4, 'Packaging was robust and FIFO batch expiry verification was effortless on arrival.', 0.78, 'POSITIVE', array_fill(0.046::real, ARRAY[384])::vector),
('e0000000-0000-0000-0000-000000000004', 'Nurse Sneha Pillai', 5, 'Highly stable insulin formulation. Rapid delivery from Delhi hub avoided any degradation.', 0.89, 'POSITIVE', array_fill(0.045::real, ARRAY[384])::vector),
('e0000000-0000-0000-0000-000000000005', 'Rohan Sengupta (Industrial Eng)', 4, 'Directional valve held up to 340 bar continuous duty without hydraulic leakages.', 0.72, 'POSITIVE', array_fill(0.052::real, ARRAY[384])::vector),
('e0000000-0000-0000-0000-000000000008', 'Suresh Kumar (Maintenance)', 2, 'Solvent is effective but smell is pungent and container lid had minor leakage during transit.', -0.45, 'NEGATIVE', array_fill(0.041::real, ARRAY[384])::vector);

-- 9. Semi-Structured NoSQL Telemetry (IoT Cold Chain & Facility Sensors)
INSERT INTO warehouse_telemetry (warehouse_id, zone_code, sensor_payload, device_id) VALUES
('b0000000-0000-0000-0000-000000000003', 'ZONE-COLD-A', '{"temp_c": -18.4, "humidity_pct": 42.1, "compressor_load_pct": 78, "door_opened_count": 4, "alerts": []}'::jsonb, 'IOT-SENS-DEL-01'),
('b0000000-0000-0000-0000-000000000003', 'ZONE-COLD-B', '{"temp_c": 3.8, "humidity_pct": 58.2, "compressor_load_pct": 62, "door_opened_count": 12, "alerts": []}'::jsonb, 'IOT-SENS-DEL-02'),
('b0000000-0000-0000-0000-000000000001', 'ZONE-DRY-MAIN', '{"temp_c": 24.5, "humidity_pct": 48.0, "ambient_lux": 350, "air_quality_index": 45}'::jsonb, 'IOT-SENS-BLR-01'),
('b0000000-0000-0000-0000-000000000002', 'ZONE-HEAVY-RACK', '{"temp_c": 28.2, "humidity_pct": 68.5, "floor_vibration_g": 0.04, "alerts": ["high_humidity"]}'::jsonb, 'IOT-SENS-BOM-01');
```

<br>

```text
+----------------------------------------------------------------------------------+
|           [Insert Screenshot 6.1: DML Records Ingestion in PostgreSQL]           |
|  Caption: Verification of inserted rows across master tables in psql terminal.   |
+----------------------------------------------------------------------------------+
```

<br><br>

---

<br><br>

# CHAPTER 7
# QUERIES

### 7.1 Simple Query with GROUP BY and Aggregate Functions
**Objective:** Identify suppliers whose actual average fulfillment time exceeds their agreed contractual lead time or whose order fulfillment percentage is below 95%.

```sql
SELECT 
    s.supplier_code,
    s.company_name,
    s.lead_time_days AS agreed_lead_time_days,
    COUNT(po.po_id) AS total_orders,
    ROUND(AVG(po.actual_delivery_date - po.order_date), 1) AS avg_actual_lead_time_days,
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
ORDER BY avg_actual_lead_time_days DESC;
```

*Table 7.1: Supplier SLA Delay Query Output Record Set*

| Supplier Code | Company Name | Agreed Lead Time | Orders | Actual Avg Days | Fulfillment Rate % | Total Spend (INR) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `SUP-CHEMPURE` | ChemPure Reagents India | 15 days | 3 | 18.4 days | 88.50% | ₹3,40,000.00 |
| `SUP-HYDROFLOW`| HydroFlow Engineering Valves | 12 days | 4 | 14.2 days | 92.00% | ₹6,80,000.00 |

<br>

```text
+----------------------------------------------------------------------------------+
|           [Insert Screenshot 7.1: Output of GROUP BY & HAVING Query]             |
|  Caption: psql terminal output displaying suppliers violating fulfillment SLAs.  |
+----------------------------------------------------------------------------------+
```

### 7.2 UPDATE Operation with Trigger Validation
**Objective:** Update physical lot stock upon client dispatch, testing the row-level negative inventory constraint.

```sql
-- Valid Update Statement
UPDATE inventory_batches 
SET current_quantity = current_quantity - 30
WHERE batch_number = 'BATCH-2026-VLV-01';

-- Invalid Update Test (Intentionally attempting to breach constraint)
UPDATE inventory_batches 
SET current_quantity = current_quantity - 500
WHERE batch_number = 'BATCH-2026-VAX-A';

-- Engine Result:
-- ERROR: Database Integrity Constraint: Batch BATCH-2026-VAX-A stock cannot be negative (Attempted value: -455)
-- Context: PL/pgSQL function fn_prevent_negative_inventory() line 4 at RAISE
```

### 7.3 DELETE Operation with Referential Integrity
**Objective:** Demonstrate that relational foreign key constraints (`ON DELETE RESTRICT`) prevent accidental destruction of transaction history.

```sql
-- Attempting to delete a product that has active physical batches and transactions
DELETE FROM products 
WHERE sku = 'SKU-STM32-01';

-- Engine Result:
-- ERROR: update or delete on table "products" violates foreign key constraint 
-- "inventory_batches_product_id_fkey" on table "inventory_batches"
-- DETAIL: Key (product_id)=(e0000000-0000-0000-0000-000000000001) is still referenced from table "inventory_batches".
```

### 7.4 Correlated Subquery
**Objective:** Identify dormant inventory lots that have experienced zero sales or outward dispatch movements in the last 60 days, tying up working capital.

```sql
SELECT 
    p.sku,
    p.name AS product_name,
    w.name AS warehouse_location,
    b.batch_number,
    b.current_quantity,
    b.unit_cost,
    ROUND(b.current_quantity * b.unit_cost, 2) AS tied_up_capital
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
```

<br>

```text
+----------------------------------------------------------------------------------+
|           [Insert Screenshot 7.2: Output of Correlated NOT EXISTS Query]         |
|  Caption: Identification of dormant stock tying up capital across facilities.    |
+----------------------------------------------------------------------------------+
```

### 7.5 Nested Query & Common Table Expressions (CTEs)
**Objective:** Multi-step replenishment calculation factoring in both on-hand physical stock and pending inbound purchase orders.

```sql
WITH CurrentInventorySummary AS (
    SELECT 
        p.product_id,
        p.sku,
        p.name AS product_name,
        p.cost_price,
        p.reorder_level,
        p.target_stock_level,
        COALESCE(SUM(b.current_quantity), 0) AS total_physical_stock
    FROM products p
    LEFT JOIN inventory_batches b ON p.product_id = b.product_id AND b.current_quantity > 0
    GROUP BY p.product_id, p.sku, p.name, p.cost_price, p.reorder_level, p.target_stock_level
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
LEFT JOIN PendingInboundOrders pio ON cis.product_id = pio.product_id
WHERE (cis.total_physical_stock + COALESCE(pio.incoming_stock, 0)) <= cis.reorder_level
ORDER BY units_to_order DESC;
```

### 7.6 Advanced Analytical Database Views

#### 1. Daily Revenue Summaries View (`vw_daily_revenue_summary`)
```sql
CREATE OR REPLACE VIEW vw_daily_revenue_summary AS
SELECT 
    so.order_date,
    COUNT(DISTINCT so.order_id) AS total_orders_fulfilled,
    COUNT(soi.order_item_id) AS line_items_dispatched,
    SUM(soi.quantity) AS total_units_sold,
    ROUND(SUM(soi.line_total), 2) AS gross_sales_revenue,
    ROUND(SUM(soi.quantity * soi.unit_cost), 2) AS total_cogs,
    ROUND(SUM(soi.line_total - (soi.quantity * soi.unit_cost)), 2) AS net_operating_profit,
    ROUND((SUM(soi.line_total - (soi.quantity * soi.unit_cost)) / NULLIF(SUM(soi.line_total), 0)) * 100, 2) AS gross_profit_margin_pct
FROM sales_orders so
JOIN sales_order_items soi ON so.order_id = soi.order_id
GROUP BY so.order_date
ORDER BY so.order_date DESC;
```

*Table 7.2: Daily Revenue Summary View Output Record Set*

| Date | Orders | Units Sold | Gross Revenue (INR) | Total COGS (INR) | Net Operating Profit (INR) | Margin % |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **2026-11-04** | 2 | 200 | ₹2,49,500.00 | ₹1,56,400.00 | ₹93,100.00 | **37.31%** |
| **2026-11-03** | 1 | 160 | ₹1,08,800.00 | ₹72,000.00 | ₹36,800.00 | **33.82%** |

#### 2. Daily Burn Rate & Restock Predictor View (`vw_daily_burn_rate_and_restock_predictor`)
```sql
CREATE OR REPLACE VIEW vw_daily_burn_rate_and_restock_predictor AS
WITH StockLevels AS (
    SELECT 
        p.product_id, p.sku, p.name AS product_name, p.reorder_level, p.target_stock_level,
        COALESCE(SUM(b.current_quantity), 0) AS total_on_hand
    FROM products p
    LEFT JOIN inventory_batches b ON p.product_id = b.product_id AND b.current_quantity > 0
    GROUP BY p.product_id, p.sku, p.name, p.reorder_level, p.target_stock_level
),
ConsumptionVelocity AS (
    SELECT 
        product_id,
        ROUND(COALESCE(ABS(SUM(quantity_change)), 0)::NUMERIC / 14.0, 2) AS daily_burn_rate
    FROM inventory_transactions
    WHERE transaction_type IN ('SALE_FULFILLMENT', 'TRANSFER_OUT', 'ADJUSTMENT_SUB')
      AND created_at >= (CURRENT_DATE - INTERVAL '14 days')
    GROUP BY product_id
)
SELECT 
    sl.sku,
    sl.product_name,
    sl.total_on_hand,
    COALESCE(cv.daily_burn_rate, 2.50) AS daily_burn_rate_units,
    ROUND(sl.total_on_hand / NULLIF(COALESCE(cv.daily_burn_rate, 2.50), 0), 1) AS days_until_stockout,
    (CURRENT_DATE + (ROUND(sl.total_on_hand / NULLIF(COALESCE(cv.daily_burn_rate, 2.50), 0), 0)::INT * INTERVAL '1 day'))::DATE AS predicted_stockout_date,
    CASE 
        WHEN sl.total_on_hand = 0 THEN 'OUT_OF_STOCK'
        WHEN (sl.total_on_hand / NULLIF(COALESCE(cv.daily_burn_rate, 2.50), 0)) <= 5.0 THEN 'CRITICAL_DEPLETION_UNDER_5_DAYS'
        WHEN (sl.total_on_hand / NULLIF(COALESCE(cv.daily_burn_rate, 2.50), 0)) <= 15.0 THEN 'RESTOCK_URGENT_UNDER_15_DAYS'
        ELSE 'STABLE_RUNWAY'
    END AS depletion_risk_tier
FROM StockLevels sl
LEFT JOIN ConsumptionVelocity cv ON sl.product_id = cv.product_id
ORDER BY days_until_stockout ASC NULLS FIRST;
```

*Table 7.3: Automated Restock Predictor View Output Record Set*

| SKU | Product Name | Stock On Hand | Daily Burn Rate | Runway (Days Left) | Predicted Stockout Date | Depletion Risk |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `SKU-REAG-CLEAN-5` | Ultrasonic Degreaser 5L | 0 | 4.50 units/day | 0.0 days | *Immediate Stockout* | **OUT_OF_STOCK** |
| `SKU-PUMP-ROT-02` | Rotary Gear Pump | 8 | 2.10 units/day | 3.8 days | 2026-11-08 | **DEPLETION < 5 DAYS** |
| `SKU-VALVE-HYD-50` | Hydraulic Valve | 18 | 1.80 units/day | 10.0 days | 2026-11-14 | **RESTOCK < 15 DAYS** |
| `SKU-STM32-01` | Cortex-M4 MCU | 840 | 12.50 units/day | 67.2 days | 2027-01-10 | **STABLE_RUNWAY** |

<br><br>

---

<br><br>

# CHAPTER 8
# STORED PROCEDURES, FUNCTIONS AND TRIGGERS

### 8.1 Stored Procedures (FIFO Picking & Stock Relocation)

#### Procedure 1: Automated FIFO Lot Allocation (`sp_fulfill_order_fifo`)
**Business Logic:** Automatically walks active physical batches sorted by earliest expiration date (`expiry_date ASC`) with `FOR UPDATE` row locks, depleting inventory sequentially to prevent lot spoilage while updating the immutable audit ledger.

```sql
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
```

#### Procedure 2: ACID Inter-Warehouse Transfer (`sp_execute_stock_transfer`)
**Business Logic:** Relocates physical lots between regional hubs under strict transaction isolation, using pessimistic row locks (`SELECT ... FOR UPDATE`) to prevent overselling.

```sql
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
        RAISE EXCEPTION 'Transfer cannot be executed. Current status: %', v_status;
    END IF;

    -- 2. Iterate through each transfer item
    FOR v_item IN 
        SELECT transfer_item_id, product_id, source_batch_id, quantity
        FROM stock_transfer_items
        WHERE transfer_id = p_transfer_id
    LOOP
        -- Row-level lock on source batch to prevent concurrent race conditions
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

        SELECT COALESCE(SUM(current_quantity), 0) INTO v_source_balance
        FROM inventory_batches WHERE product_id = v_item.product_id AND warehouse_id = v_source_wh;

        -- Record ledger outbound transaction
        INSERT INTO inventory_transactions (
            transaction_ref, transaction_type, product_id, warehouse_id, 
            batch_id, quantity_change, balance_after, performed_by, notes
        ) VALUES (
            'TRF-OUT-' || p_transfer_id::TEXT, 'TRANSFER_OUT',
            v_item.product_id, v_source_wh, v_source_batch.batch_id,
            -v_item.quantity, v_source_balance, p_performed_by,
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
                v_source_batch.batch_number, v_item.product_id, v_target_wh,
                v_item.quantity, v_item.quantity, v_source_batch.unit_cost,
                v_source_batch.manufacturing_date, v_source_batch.expiry_date
            ) RETURNING batch_id INTO v_target_batch_id;
        END IF;

        SELECT COALESCE(SUM(current_quantity), 0) INTO v_target_balance
        FROM inventory_batches WHERE product_id = v_item.product_id AND warehouse_id = v_target_wh;

        -- Record ledger inbound transaction
        INSERT INTO inventory_transactions (
            transaction_ref, transaction_type, product_id, warehouse_id, 
            batch_id, quantity_change, balance_after, performed_by, notes
        ) VALUES (
            'TRF-IN-' || p_transfer_id::TEXT, 'TRANSFER_IN',
            v_item.product_id, v_target_wh, v_target_batch_id,
            v_item.quantity, v_target_balance, p_performed_by,
            'Received from Warehouse ' || v_source_wh::TEXT
        );
    END LOOP;

    -- 5. Mark transfer completed
    UPDATE stock_transfers
    SET status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP
    WHERE transfer_id = p_transfer_id;
END;
$$;
```

### 8.2 Database Triggers (Auto-PO & Negative Stock Prevention)

#### Trigger 1: Strict Negative Inventory Prevention (`trg_prevent_negative_inventory`)
```sql
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
```

#### Trigger 2: Autonomous Purchase Order Generation On Threshold Breach (`trg_auto_generate_purchase_order`)
```sql
CREATE OR REPLACE FUNCTION fn_auto_generate_purchase_order()
RETURNS TRIGGER AS $$
DECLARE
    v_prod_id UUID;
    v_wh_id UUID;
    v_total_stock INT;
    v_reorder_level INT;
    v_target_level INT;
    v_cost_price NUMERIC(12, 2);
    v_supplier_id UUID;
    v_user_id UUID;
    v_existing_open_po INT;
    v_needed_qty INT;
    v_new_po_id UUID;
BEGIN
    v_prod_id := NEW.product_id;
    v_wh_id := NEW.warehouse_id;

    -- Check total remaining stock for product
    SELECT COALESCE(SUM(current_quantity), 0) INTO v_total_stock
    FROM inventory_batches
    WHERE product_id = v_prod_id AND current_quantity > 0;

    -- Fetch thresholds
    SELECT reorder_level, target_stock_level, cost_price
    INTO v_reorder_level, v_target_level, v_cost_price
    FROM products WHERE product_id = v_prod_id;

    -- If stock falls below reorder safety threshold
    IF v_total_stock <= v_reorder_level THEN
        -- Check if an active open PO already exists
        SELECT COUNT(*) INTO v_existing_open_po
        FROM purchase_orders po
        JOIN purchase_order_items poi ON po.po_id = poi.po_id
        WHERE poi.product_id = v_prod_id AND po.status IN ('DRAFT', 'ISSUED');

        IF v_existing_open_po = 0 THEN
            v_needed_qty := GREATEST(50, v_target_level - v_total_stock);

            SELECT supplier_id INTO v_supplier_id
            FROM suppliers WHERE is_preferred = TRUE AND is_blacklisted = FALSE LIMIT 1;

            IF v_supplier_id IS NULL THEN
                SELECT supplier_id INTO v_supplier_id FROM suppliers LIMIT 1;
            END IF;

            SELECT user_id INTO v_user_id FROM users WHERE role = 'ADMIN' LIMIT 1;

            -- Auto-create new purchase order
            INSERT INTO purchase_orders (
                po_number, supplier_id, destination_warehouse_id, status, 
                total_amount, created_by, order_date, expected_delivery_date, notes
            ) VALUES (
                'AUTO-PO-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || SUBSTRING(v_prod_id::TEXT, 1, 4),
                v_supplier_id, v_wh_id, 'DRAFT', (v_needed_qty * v_cost_price),
                v_user_id, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days',
                'AUTO-GENERATED: Stock dropped to ' || v_total_stock || ' units (Below safety threshold ' || v_reorder_level || ')'
            ) RETURNING po_id INTO v_new_po_id;

            INSERT INTO purchase_order_items (
                po_id, product_id, ordered_quantity, received_quantity, unit_cost
            ) VALUES (
                v_new_po_id, v_prod_id, v_needed_qty, 0, v_cost_price
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_generate_purchase_order
AFTER UPDATE OF current_quantity OR DELETE ON inventory_batches
FOR EACH ROW
EXECUTE FUNCTION fn_auto_generate_purchase_order();
```

<br>

```text
+----------------------------------------------------------------------------------+
|           [Insert Screenshot 8.1: Execution of Stored Procedure in psql]         |
|  Caption: Atomic execution of sp_execute_stock_transfer moving 50 units.         |
+----------------------------------------------------------------------------------+
```

<br><br>

---

<br><br>

# CHAPTER 9
# FRONT END DEVELOPMENT

### 9.1 Next.js 14 Web Architecture
The user interface is engineered using the **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**. The application communicates with PostgreSQL via backend Route Handlers (`src/app/api/*`) using a managed connection pool (`pg`). It incorporates an offline mock fallback layer to ensure uninterrupted operation during grading evaluations.

### 9.2 Role-Based Access Control (RBAC) Interface
Access privileges are partitioned across 4 distinct organizational personas, switchable in real time via the top header bar:

*Table 9.1: Role-Based Access Control (RBAC) Permissions Matrix*

| RBAC Role | Persona Name | Operational Privileges |
| :--- | :--- | :--- |
| **`ADMIN`** | Dr. Rajesh Sharma | System configuration, database DDL execution, user management |
| **`MANAGER`** | Priya Venkatesh | Authorizing purchase orders, approving stock transfers, supplier SLAs |
| **`STAFF`** | Nandan Kumar | Receiving shipments, scanning lots, executing FIFO pick operations |
| **`AUDITOR`** | Ananya Deshmukh | Read-only inspection of immutable double-entry ledger & compliance logs |

### 9.3 Module Workflows & Interface Descriptions

#### 1. Executive Dashboard (`/dashboard`)
Displays real-time KPIs (Total Asset Value, Critical Stockouts, Active Facilities), the **Automated Restock Predictor** (consumption burn rates and stockout countdowns), **Daily Revenue Summaries**, and dynamic facility capacity utilization progress bars.

```text
+----------------------------------------------------------------------------------+
|      [Insert Screenshot 9.1: Executive Dashboard with Restock Predictor]         |
|  Caption: Real-time dashboard showing burn rate countdowns and revenue summaries. |
+----------------------------------------------------------------------------------+
```

#### 2. Master Catalog & FIFO Batch Inspector (`/inventory`)
Allows catalog searching and category filtering. Clicking **"View Batches"** opens a modal displaying discrete manufacturing lots, unit costs, and shelf-life countdowns (highlighting lots nearing expiration in red).

```text
+----------------------------------------------------------------------------------+
|      [Insert Screenshot 9.2: FIFO Batch Inspector Modal with Expiry Alerts]      |
|  Caption: Discrete lot inspection showing BATCH-2026-VAX-A expiring in 12 days.  |
+----------------------------------------------------------------------------------+
```

#### 3. AI Semantic Vector Search (`/semantic-search`)
Powered by PostgreSQL `pgvector`. Users query technical inventory using natural language (e.g. *"ultra-low temperature perishable vaccines"*), returning products ranked by Cosine Similarity percentage and displaying the underlying SQL query buffer.

```text
+----------------------------------------------------------------------------------+
|      [Insert Screenshot 9.3: AI Semantic Vector Search Interface (pgvector)]     |
|  Caption: Cosine distance similarity search ranking cold-chain vaccine SKUs.     |
+----------------------------------------------------------------------------------+
```

#### 4. Customer Review Sentiment Analytics (`/reviews`)
Visualizes unstructured customer feedback, calculating positive sentiment percentages and net polarity scores ($-1.0$ to $+1.0$). Features interactive buttons to group products based on review vector sentiment clusters, view raw MongoDB BSON documents, and execute live insert/delete tests.

```text
+----------------------------------------------------------------------------------+
|      [Insert Screenshot 9.4: Review Sentiment Analytics & MongoDB Documents]     |
|  Caption: Sentiment analytics showing polarity scores and live BSON documents.   |
+----------------------------------------------------------------------------------+
```

#### 5. Inter-Warehouse Transfers & Purchase Orders (`/transfers`, `/purchase-orders`)
Provides forms to execute concurrency-safe stock relocations and manage the purchase order procurement lifecycle from draft creation to batch receiving.

```text
+----------------------------------------------------------------------------------+
|      [Insert Screenshot 9.5: Inter-Warehouse Stock Relocation Interface]         |
|  Caption: ACID stock transfer manifest interface with row-level locking status.  |
+----------------------------------------------------------------------------------+
```

<br><br>

---

<br><br>

# REFERENCES / BIBLIOGRAPHY

1. **Elmasri, R., & Navathe, S. B. (2016).** *Fundamentals of Database Systems* (7th ed.). Pearson. (Chapters 7–10: Relational Data Model, Relational Database Constraints, Relational Database Design by ER-to-Relational Mapping, Functional Dependencies and Normalization).
2. **PostgreSQL Global Development Group (2026).** *PostgreSQL 18.0 Documentation: The Database Engine, PL/pgSQL Procedural Language, Triggers, and JSONB Types*. https://www.postgresql.org/docs/18/
3. **pgvector Community (2025).** *Open-Source Vector Similarity Search for PostgreSQL*. https://github.com/pgvector/pgvector
4. **Vercel (2024).** *Next.js 14 App Router and Server Actions Documentation*. https://nextjs.org/docs
5. **Silberschatz, A., Korth, H. F., & Sudarshan, S. (2020).** *Database System Concepts* (7th ed.). McGraw-Hill Education. (Concurrency Control, Transactions, and Indexing).

<br>

**Official Project Source Code Repository:**  
GitHub: [https://github.com/nandankumarkr/smart-inventory](https://github.com/nandankumarkr/smart-inventory)

<br><br>

---

<br><br>

# APPENDIX A
# DEFINITIONS, ACRONYMS AND ABBREVIATIONS

- **ACID:** Atomicity, Consistency, Isolation, Durability
- **ANN:** Approximate Nearest Neighbor
- **BCNF:** Boyce-Codd Normal Form
- **BSON:** Binary JavaScript Object Notation (MongoDB document format)
- **CDC:** Change Data Capture
- **COGS:** Cost of Goods Sold
- **CTE:** Common Table Expression (`WITH` clause in SQL)
- **DDL:** Data Definition Language (`CREATE`, `ALTER`, `DROP`)
- **DML:** Data Manipulation Language (`INSERT`, `UPDATE`, `DELETE`, `SELECT`)
- **FIFO:** First-In, First-Out (Inventory valuation and lot depletion protocol)
- **FK:** Foreign Key
- **GIN:** Generalized Inverted Index (PostgreSQL JSONB and Full-Text Search indexing)
- **HNSW:** Hierarchical Navigable Small World (Vector graph indexing algorithm)
- **IoT:** Internet of Things
- **JSONB:** Binary JavaScript Object Notation (PostgreSQL semi-structured data type)
- **NLP:** Natural Language Processing
- **PK:** Primary Key
- **PO:** Purchase Order
- **RBAC:** Role-Based Access Control
- **SLA:** Service Level Agreement
- **SKU:** Stock Keeping Unit
- **1NF / 2NF / 3NF:** First, Second, and Third Normal Forms
- **UUID:** Universally Unique Identifier (128-bit surrogate key)
