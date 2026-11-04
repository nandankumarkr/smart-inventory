-- ============================================================================
-- SMART INVENTORY MANAGEMENT SYSTEM (SIMS)
-- DBMS Experiential Learning - Level 3 Project
-- File: 06_vector_and_nosql.sql
-- Description: Multi-Paradigm Integration: Vector Database (pgvector) & NoSQL JSONB
-- Demonstrates: Semantic Vector Search, Cosine Similarity, HNSW index usage,
--               Semi-Structured JSONB queries, NoSQL Aggregation Pipelines
-- ============================================================================

-- ============================================================================
-- PARADIGM 1: VECTOR DATABASE & SEMANTIC SEARCH (Option 2 Requirement)
-- Model Used: sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
-- Metric: Cosine Distance (<=> operator), Cosine Similarity = 1 - (A <=> B)
-- ============================================================================

-- 1. Semantic Catalog Search Query
-- Finds top 3 products semantically most relevant to an unstructured prompt
-- Example prompt query embedding: [0.050, 0.049, ... 384 dimensions]
-- (For demonstration, using array_fill with a sample query vector)
WITH QueryVector AS (
    SELECT array_fill(0.046::real, ARRAY[384])::vector AS target_embedding
)
SELECT 
    p.sku,
    p.name AS product_name,
    c.name AS category,
    p.unit_price,
    ROUND((1 - (pe.embedding <=> qv.target_embedding))::NUMERIC, 4) AS cosine_similarity_score,
    pe.metadata,
    pe.embedding_text
FROM product_embeddings pe
CROSS JOIN QueryVector qv
JOIN products p ON pe.product_id = p.product_id
JOIN product_categories c ON p.category_id = c.category_id
ORDER BY pe.embedding <=> qv.target_embedding ASC
LIMIT 3;


-- 2. Hybrid Search (Full-Text Search + Semantic Vector Search with Reciprocal Rank Fusion)
-- Combines exact keyword matching with semantic conceptual relevance
WITH KeywordSearch AS (
    SELECT 
        p.product_id,
        ts_rank_cd(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')), to_tsquery('english', 'vaccine | sensor | pump')) AS fts_score
    FROM products p
    WHERE to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ to_tsquery('english', 'vaccine | sensor | pump')
),
VectorSearch AS (
    SELECT 
        pe.product_id,
        (1 - (pe.embedding <=> array_fill(0.048::real, ARRAY[384])::vector)) AS vector_similarity
    FROM product_embeddings pe
)
SELECT 
    p.sku,
    p.name,
    COALESCE(ks.fts_score, 0.0) AS keyword_rank,
    ROUND(vs.vector_similarity::NUMERIC, 4) AS semantic_similarity,
    ROUND((COALESCE(ks.fts_score, 0.0) * 0.4 + vs.vector_similarity * 0.6)::NUMERIC, 4) AS composite_relevance_score
FROM products p
LEFT JOIN KeywordSearch ks ON p.product_id = ks.product_id
JOIN VectorSearch vs ON p.product_id = vs.product_id
ORDER BY composite_relevance_score DESC
LIMIT 5;


-- ============================================================================
-- PARADIGM 2: NoSQL / DOCUMENT DATA STORE (Option 1 Requirement)
-- Using PostgreSQL JSONB NoSQL Engine with GIN Indexes for IoT Sensory Telemetry
-- ============================================================================

-- 1. NoSQL Containment & Index Query: Find zones with cold storage breach (temp > 0 C)
SELECT 
    t.telemetry_id,
    w.name AS warehouse_name,
    t.zone_code,
    t.recorded_at,
    (t.sensor_payload->>'temp_c')::NUMERIC AS temperature_celsius,
    (t.sensor_payload->>'humidity_pct')::NUMERIC AS humidity_percentage,
    t.sensor_payload->'alerts' AS active_alerts
FROM warehouse_telemetry t
JOIN warehouses w ON t.warehouse_id = w.warehouse_id
WHERE (t.sensor_payload->>'temp_c')::NUMERIC > 0.0
  AND t.zone_code LIKE 'ZONE-COLD%'
ORDER BY t.recorded_at DESC;


-- 2. NoSQL Aggregation: Calculate Average, Max, Min IoT conditions per facility
SELECT 
    w.name AS warehouse_name,
    t.zone_code,
    COUNT(*) AS telemetry_pings,
    ROUND(AVG((t.sensor_payload->>'temp_c')::NUMERIC), 2) AS avg_temperature_c,
    ROUND(MAX((t.sensor_payload->>'temp_c')::NUMERIC), 2) AS max_temperature_c,
    ROUND(MIN((t.sensor_payload->>'temp_c')::NUMERIC), 2) AS min_temperature_c,
    ROUND(AVG((t.sensor_payload->>'humidity_pct')::NUMERIC), 2) AS avg_humidity_pct,
    jsonb_agg(DISTINCT t.sensor_payload->'alerts') AS aggregated_system_alerts
FROM warehouse_telemetry t
JOIN warehouses w ON t.warehouse_id = w.warehouse_id
GROUP BY w.name, t.zone_code;
