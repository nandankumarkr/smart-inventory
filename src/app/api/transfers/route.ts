import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TRANSFERS } from '@/lib/mock-data';
import { queryDb } from '@/lib/db';

export async function GET() {
  try {
    const { rows, isLiveDb } = await queryDb(`
      SELECT 
        st.transfer_id,
        st.transfer_number,
        st.source_warehouse_id,
        sw.name AS source_warehouse_name,
        st.target_warehouse_id,
        tw.name AS target_warehouse_name,
        st.status,
        st.requested_by,
        u1.full_name AS requester_name,
        st.approved_by,
        u2.full_name AS approver_name,
        st.tracking_reference,
        st.created_at,
        st.completed_at
      FROM stock_transfers st
      JOIN warehouses sw ON st.source_warehouse_id = sw.warehouse_id
      JOIN warehouses tw ON st.target_warehouse_id = tw.warehouse_id
      LEFT JOIN users u1 ON st.requested_by = u1.user_id
      LEFT JOIN users u2 ON st.approved_by = u2.user_id
      ORDER BY st.created_at DESC;
    `);

    if (isLiveDb && rows.length > 0) {
      return NextResponse.json({ success: true, isLiveDb: true, data: rows });
    }

    return NextResponse.json({ success: true, isLiveDb: false, data: MOCK_TRANSFERS });
  } catch (err: any) {
    return NextResponse.json({ success: true, isLiveDb: false, data: MOCK_TRANSFERS });
  }
}
