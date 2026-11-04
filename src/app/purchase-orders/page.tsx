'use client';

import React, { useState } from 'react';
import { MOCK_PURCHASE_ORDERS, MOCK_SUPPLIERS, MOCK_WAREHOUSES, MOCK_PRODUCTS } from '@/lib/mock-data';
import { PurchaseOrder } from '@/lib/types';
import { 
  ShoppingCart, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Truck, 
  DollarSign,
  PackageCheck,
  Building2
} from 'lucide-react';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [supplierId, setSupplierId] = useState(MOCK_SUPPLIERS[0].supplier_id);
  const [warehouseId, setWarehouseId] = useState(MOCK_WAREHOUSES[0].warehouse_id);
  const [productId, setProductId] = useState(MOCK_PRODUCTS[0].product_id);
  const [quantity, setQuantity] = useState(100);
  const [deliveryDate, setDeliveryDate] = useState('2026-03-01');
  const [notification, setNotification] = useState<string | null>(null);

  const handleReceiveOrder = (poId: string) => {
    const updated = orders.map(po => {
      if (po.po_id === poId) {
        return {
          ...po,
          status: 'RECEIVED' as const,
          actual_delivery_date: new Date().toISOString().split('T')[0]
        };
      }
      return po;
    });
    setOrders(updated);
    setNotification(`PO marked as RECEIVED! Inbound inventory batches created & logged into stock ledger.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const product = MOCK_PRODUCTS.find(p => p.product_id === productId);
    const supplier = MOCK_SUPPLIERS.find(s => s.supplier_id === supplierId);
    const warehouse = MOCK_WAREHOUSES.find(w => w.warehouse_id === warehouseId);

    const cost = (product?.cost_price || 100) * quantity;
    const newPo: PurchaseOrder = {
      po_id: `po-${Date.now()}`,
      po_number: `PO-2026-${String(orders.length + 1).padStart(3, '0')}`,
      supplier_id: supplierId,
      supplier_name: supplier?.company_name,
      destination_warehouse_id: warehouseId,
      warehouse_name: warehouse?.name,
      status: 'ISSUED',
      total_amount: cost,
      created_by: 'mgr-01',
      creator_name: 'Priya Venkatesh',
      order_date: new Date().toISOString().split('T')[0],
      expected_delivery_date: deliveryDate,
      notes: `Restock order for ${product?.sku}`
    };

    setOrders([newPo, ...orders]);
    setShowCreateModal(false);
    setNotification(`Purchase Order ${newPo.po_number} successfully issued!`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase Orders & Procurement</h1>
          <p className="text-xs text-slate-500 mt-1">Lifecycle management from issuance to batch receiving and quality intake</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Purchase Order</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Vendor / Supplier</th>
                <th className="py-3 px-4">Destination Facility</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Expected Delivery</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.map((po) => (
                <tr key={po.po_id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{po.po_number}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{po.supplier_name}</div>
                    <div className="text-[11px] text-slate-500">{po.notes}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{po.warehouse_name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{po.order_date}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{po.expected_delivery_date}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                    ₹{po.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      po.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' :
                      po.status === 'ISSUED' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {po.status === 'ISSUED' ? (
                      <button
                        onClick={() => handleReceiveOrder(po.po_id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Receive Batches</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold">Fulfilled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create PO Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Issue Purchase Order</h3>
            
            <form onSubmit={handleCreatePo} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Preferred Supplier</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                >
                  {MOCK_SUPPLIERS.map(s => (
                    <option key={s.supplier_id} value={s.supplier_id}>
                      {s.company_name} (Lead Time: {s.lead_time_days} days, Rating: {s.rating}★)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Facility</label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                >
                  {MOCK_WAREHOUSES.map(w => (
                    <option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product SKU</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                  >
                    {MOCK_PRODUCTS.map(p => (
                      <option key={p.product_id} value={p.product_id}>{p.sku} - {p.name.substring(0, 20)}...</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                >
                  Issue Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
