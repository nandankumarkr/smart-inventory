export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'AUDITOR';

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  is_active: boolean;
  created_at: string;
}

export interface Warehouse {
  warehouse_id: string;
  warehouse_code: string;
  name: string;
  address: string;
  city: string;
  country: string;
  capacity_sqft: number;
  current_occupancy_pct: number;
  manager_id?: string;
  manager_name?: string;
  is_active: boolean;
}

export interface ProductCategory {
  category_id: string;
  category_code: string;
  name: string;
  description?: string;
  parent_category_id?: string;
}

export interface Product {
  product_id: string;
  sku: string;
  name: string;
  description: string;
  category_id: string;
  category_name?: string;
  unit_of_measure: string;
  cost_price: number;
  unit_price: number;
  reorder_level: number;
  target_stock_level: number;
  is_perishable: boolean;
  shelf_life_days?: number;
  total_on_hand?: number;
  stock_status?: 'OUT_OF_STOCK' | 'CRITICAL_LOW' | 'WARNING_LOW' | 'OPTIMAL';
}

export interface InventoryBatch {
  batch_id: string;
  batch_number: string;
  product_id: string;
  product_name?: string;
  sku?: string;
  warehouse_id: string;
  warehouse_name?: string;
  initial_quantity: number;
  current_quantity: number;
  unit_cost: number;
  manufacturing_date?: string;
  expiry_date?: string;
  received_at: string;
  days_until_expiry?: number;
  risk_tier?: 'EXPIRED' | 'CRITICAL_UNDER_15_DAYS' | 'WARNING_UNDER_30_DAYS' | 'UPCOMING_UNDER_60_DAYS' | 'SAFE';
}

export interface InventoryTransaction {
  transaction_id: string;
  transaction_ref: string;
  transaction_type: 'PO_RECEIPT' | 'SALE_FULFILLMENT' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'ADJUSTMENT_ADD' | 'ADJUSTMENT_SUB' | 'SCRAP_EXPIRED';
  product_id: string;
  product_name?: string;
  sku?: string;
  warehouse_id: string;
  warehouse_name?: string;
  batch_id?: string;
  batch_number?: string;
  quantity_change: number;
  balance_after: number;
  performed_by: string;
  performed_by_name?: string;
  notes?: string;
  created_at: string;
}

export interface Supplier {
  supplier_id: string;
  supplier_code: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  lead_time_days: number;
  payment_terms: string;
  is_preferred: boolean;
  is_blacklisted: boolean;
}

export interface PurchaseOrder {
  po_id: string;
  po_number: string;
  supplier_id: string;
  supplier_name?: string;
  destination_warehouse_id: string;
  warehouse_name?: string;
  status: 'DRAFT' | 'ISSUED' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED';
  total_amount: number;
  created_by: string;
  creator_name?: string;
  order_date: string;
  expected_delivery_date: string;
  actual_delivery_date?: string;
  notes?: string;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  po_item_id: string;
  po_id: string;
  product_id: string;
  product_name?: string;
  sku?: string;
  ordered_quantity: number;
  received_quantity: number;
  unit_cost: number;
  line_total: number;
}

export interface StockTransfer {
  transfer_id: string;
  transfer_number: string;
  source_warehouse_id: string;
  source_warehouse_name?: string;
  target_warehouse_id: string;
  target_warehouse_name?: string;
  status: 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  requested_by: string;
  requester_name?: string;
  approved_by?: string;
  approver_name?: string;
  tracking_reference?: string;
  created_at: string;
  completed_at?: string;
  items?: StockTransferItem[];
}

export interface StockTransferItem {
  transfer_item_id: string;
  transfer_id: string;
  product_id: string;
  product_name?: string;
  sku?: string;
  source_batch_id: string;
  source_batch_number?: string;
  quantity: number;
}

export interface LowStockAlert {
  product_id: string;
  sku: string;
  product_name: string;
  category_name: string;
  reorder_level: number;
  target_stock_level: number;
  total_on_hand: number;
  stock_status: 'OUT_OF_STOCK' | 'CRITICAL_LOW' | 'WARNING_LOW' | 'OPTIMAL';
  suggested_reorder_qty: number;
  cost_price: number;
  estimated_replenishment_cost: number;
}

export interface InventoryValuation {
  warehouse_id: string;
  warehouse_code: string;
  warehouse_name: string;
  category_name: string;
  distinct_sku_count: number;
  active_batch_count: number;
  total_units_in_stock: number;
  total_valuation_at_cost: number;
  total_potential_revenue: number;
  unrealized_gross_profit: number;
  projected_markup_percentage: number;
}

export interface SupplierScorecard {
  supplier_id: string;
  supplier_code: string;
  company_name: string;
  rating: number;
  agreed_lead_time_days: number;
  total_orders_placed: number;
  orders_completed: number;
  cumulative_spend: number;
  avg_actual_lead_time_days: number;
  on_time_delivery_rate_pct: number;
  quantity_fulfillment_rate_pct: number;
}
