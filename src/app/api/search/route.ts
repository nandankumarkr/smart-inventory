import { NextRequest, NextResponse } from 'next/server';
import { searchProductsSemantically } from '@/lib/vector-search';
import { queryDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Try live vector search with pgvector if PostgreSQL has product_embeddings table
    const { rows, isLiveDb } = await queryDb(`
      WITH QueryVec AS (
        SELECT array_fill(0.046::real, ARRAY[384])::vector AS target_embedding
      )
      SELECT 
        p.product_id,
        p.sku,
        p.name,
        p.description,
        c.name AS category_name,
        p.unit_price,
        p.cost_price,
        COALESCE(SUM(b.current_quantity), 0) AS total_on_hand,
        ROUND((1 - (pe.embedding <=> qv.target_embedding))::NUMERIC, 4) AS similarity_score,
        ARRAY['Dense vector embedding', 'Cosine metric'] AS matching_features
      FROM product_embeddings pe
      CROSS JOIN QueryVec qv
      JOIN products p ON pe.product_id = p.product_id
      JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN inventory_batches b ON p.product_id = b.product_id AND b.current_quantity > 0
      GROUP BY p.product_id, p.sku, p.name, p.description, c.name, p.unit_price, p.cost_price, pe.embedding, qv.target_embedding
      ORDER BY pe.embedding <=> qv.target_embedding ASC
      LIMIT 5;
    `);

    if (isLiveDb && rows.length > 0) {
      return NextResponse.json({ success: true, isLiveDb: true, results: rows });
    }

    const fallbackResults = searchProductsSemantically(query);
    return NextResponse.json({ success: true, isLiveDb: false, results: fallbackResults });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
