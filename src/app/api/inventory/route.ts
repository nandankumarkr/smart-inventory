import { NextResponse } from 'next/server';
import { queryDb } from '@/lib/db';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export async function GET() {
  try {
    const { rows, isLiveDb } = await queryDb(`
      SELECT 
        p.product_id,
        p.sku,
        p.name,
        p.description,
        c.name AS category_name,
        p.unit_of_measure,
        p.cost_price,
        p.unit_price,
        p.reorder_level,
        p.target_stock_level,
        p.is_perishable,
        p.shelf_life_days,
        COALESCE(SUM(b.current_quantity), 0) AS total_on_hand,
        CASE 
          WHEN COALESCE(SUM(b.current_quantity), 0) = 0 THEN 'OUT_OF_STOCK'
          WHEN COALESCE(SUM(b.current_quantity), 0) <= p.reorder_level THEN 'CRITICAL_LOW'
          WHEN COALESCE(SUM(b.current_quantity), 0) <= (p.reorder_level * 1.25) THEN 'WARNING_LOW'
          ELSE 'OPTIMAL'
        END AS stock_status
      FROM products p
      JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN inventory_batches b ON p.product_id = b.product_id AND b.current_quantity > 0
      GROUP BY p.product_id, p.sku, p.name, p.description, c.name, p.unit_of_measure, p.cost_price, p.unit_price, p.reorder_level, p.target_stock_level, p.is_perishable, p.shelf_life_days
      ORDER BY p.name ASC;
    `);

    if (isLiveDb && rows.length > 0) {
      return NextResponse.json({ success: true, isLiveDb: true, data: rows });
    }

    return NextResponse.json({ success: true, isLiveDb: false, data: MOCK_PRODUCTS });
  } catch (err: any) {
    return NextResponse.json({ success: true, isLiveDb: false, data: MOCK_PRODUCTS, fallbackReason: err.message });
  }
}
