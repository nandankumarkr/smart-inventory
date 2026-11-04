'use client';

import React, { useState } from 'react';
import { 
  MOCK_PRODUCTS, 
  MOCK_WAREHOUSES, 
  MOCK_TRANSACTIONS, 
  MOCK_PURCHASE_ORDERS 
} from '@/lib/mock-data';
import { 
  DollarSign, 
  AlertTriangle, 
  Building2, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const [filterWarehouse, setFilterWarehouse] = useState<string>('ALL');

  // Compute live KPIs
  const totalValuationCost = MOCK_PRODUCTS.reduce((acc, p) => acc + (p.cost_price * (p.total_on_hand || 0)), 0);
  const totalValuationRetail = MOCK_PRODUCTS.reduce((acc, p) => acc + (p.unit_price * (p.total_on_hand || 0)), 0);
  const lowStockCount = MOCK_PRODUCTS.filter(p => p.stock_status === 'CRITICAL_LOW' || p.stock_status === 'OUT_OF_STOCK').length;
  const pendingOrders = MOCK_PURCHASE_ORDERS.filter(po => po.status === 'ISSUED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Inventory Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">Live real-time aggregation across 3 regional distribution hubs</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={filterWarehouse}
            onChange={(e) => setFilterWarehouse(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Facilities (Bangalore, Mumbai, Delhi)</option>
            <option value="b0000000-0000-0000-0000-000000000001">Bangalore Central Hub</option>
            <option value="b0000000-0000-0000-0000-000000000002">Mumbai Port Fulfillment</option>
            <option value="b0000000-0000-0000-0000-000000000003">Delhi NCR Cold Hub</option>
          </select>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Asset Valuation */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Stock Value</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              ₹{(totalValuationCost / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <span className="text-emerald-600 font-bold">₹{(totalValuationRetail / 100000).toFixed(2)}L</span>
              <span>potential retail value</span>
            </div>
          </div>
        </div>

        {/* Card 2: Low Stock Alerts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deficit / Stockout Alerts</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-600">{lowStockCount} SKUs</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Below configured reorder safety levels
            </div>
          </div>
        </div>

        {/* Card 3: Facilities Occupancy */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Warehouses</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">3 Hubs</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Avg. Volume Occupancy: <span className="font-bold text-indigo-600">64.3%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Inbound Purchase Orders */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Procurement</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-600">{pendingOrders} Active PO</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Expected value: <span className="font-bold text-slate-700">₹1.70 Lakhs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Low Stock Table & Warehouse Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts (Backed by vw_low_stock_alerts) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Low-Stock & Reorder Deficit Tally</span>
                <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                  SQL View: vw_low_stock_alerts
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Automated safety inventory reorder suggestions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">SKU & Item Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Physical Stock</th>
                  <th className="py-2.5 px-3 text-right">Safety Threshold</th>
                  <th className="py-2.5 px-3 text-right">Suggested PO</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_PRODUCTS.slice(4, 8).map((product) => {
                  const suggested = Math.max(0, product.target_stock_level - (product.total_on_hand || 0));
                  return (
                    <tr key={product.product_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{product.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{product.sku}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{product.category_name}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-800">
                        {product.total_on_hand} {product.unit_of_measure}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 font-medium">
                        {product.reorder_level} units
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600">
                        +{suggested}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          product.stock_status === 'OUT_OF_STOCK'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {product.stock_status?.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Warehouse Occupancy Capacity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Facility Capacity</span>
              <span className="text-[10px] font-mono text-slate-500">Trigger: Occupancy</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time square footage utilization</p>
          </div>

          <div className="space-y-4">
            {MOCK_WAREHOUSES.map((wh) => (
              <div key={wh.warehouse_id} className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-800">{wh.name}</div>
                  <div className="font-bold text-slate-900">{wh.current_occupancy_pct}%</div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      wh.current_occupancy_pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${wh.current_occupancy_pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Capacity: {wh.capacity_sqft.toLocaleString()} sqft</span>
                  <span className="font-medium text-slate-600">{wh.city}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice */}
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>PostgreSQL Row Triggers:</strong> Dynamic capacity calculations update automatically on batch inserts, deletions, or transfers.
            </p>
          </div>
        </div>
      </div>

      {/* Double-Entry Transaction Ledger Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Immutable Inventory Audit Ledger</span>
              <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                Table: inventory_transactions
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Append-only audit trail guaranteeing non-repudiation</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Transaction Ref</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">SKU & Product</th>
                <th className="py-2.5 px-3">Warehouse</th>
                <th className="py-2.5 px-3 text-right">Quantity Delta</th>
                <th className="py-2.5 px-3 text-right">Balance After</th>
                <th className="py-2.5 px-3">Performed By</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MOCK_TRANSACTIONS.map((tx) => (
                <tr key={tx.transaction_id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{tx.transaction_ref}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.quantity_change > 0 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{tx.product_name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{tx.sku}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{tx.warehouse_name}</td>
                  <td className={`py-3 px-3 text-right font-bold ${
                    tx.quantity_change > 0 ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {tx.quantity_change > 0 ? `+${tx.quantity_change}` : tx.quantity_change}
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                    {tx.balance_after}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{tx.performed_by_name}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px] italic">{tx.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
