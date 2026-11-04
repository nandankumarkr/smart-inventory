'use client';

import React, { useState } from 'react';
import { MOCK_PRODUCTS, MOCK_BATCHES, MOCK_CATEGORIES } from '@/lib/mock-data';
import { Product, InventoryBatch } from '@/lib/types';
import { 
  Boxes, 
  Search, 
  Filter, 
  Eye, 
  AlertCircle, 
  Clock, 
  Plus, 
  Calendar, 
  ShieldAlert,
  X,
  CheckCircle2
} from 'lucide-react';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProductForBatches, setSelectedProductForBatches] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeBatchesForSelected = selectedProductForBatches 
    ? MOCK_BATCHES.filter(b => b.product_id === selectedProductForBatches.product_id)
    : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Catalog & FIFO Batches</h1>
          <p className="text-xs text-slate-500 mt-1">Multi-facility inventory tracking with expiration dates & unit acquisition costs</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200">
            Strategy: FIFO Batch Depletion
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by SKU, product name, or specifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Categories</option>
            {MOCK_CATEGORIES.map(c => (
              <option key={c.category_id} value={c.category_id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">SKU & Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Standard Cost</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Physical Stock</th>
                <th className="py-3 px-4 text-center">Shelf Life</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.product_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">{p.sku}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{p.category_name}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">₹{p.cost_price.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">₹{p.unit_price.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="font-extrabold text-slate-900">{p.total_on_hand} {p.unit_of_measure}</div>
                    <div className="text-[10px] text-slate-400">Reorder at: {p.reorder_level}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {p.is_perishable ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>{p.shelf_life_days} days</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Non-perishable</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.stock_status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800' :
                      p.stock_status === 'OUT_OF_STOCK' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {p.stock_status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedProductForBatches(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Batches</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FIFO Batch Inspector Modal */}
      {selectedProductForBatches && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {selectedProductForBatches.sku}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{selectedProductForBatches.category_name}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedProductForBatches.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProductForBatches(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs bg-slate-100 p-3 rounded-lg font-medium text-slate-700">
                <span>FIFO Algorithm: Batches with earliest expiration or receipt are depleted first during fulfillment.</span>
                <span className="font-bold text-slate-900">{activeBatchesForSelected.length} Active Lots</span>
              </div>

              {activeBatchesForSelected.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No physical inventory batches currently on hand for this product.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Batch Number</th>
                      <th className="py-2.5 px-3">Warehouse Location</th>
                      <th className="py-2.5 px-3 text-right">Available Qty</th>
                      <th className="py-2.5 px-3 text-right">Batch Unit Cost</th>
                      <th className="py-2.5 px-3">Expiration Date</th>
                      <th className="py-2.5 px-3 text-center">Expiry Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {activeBatchesForSelected.map((b) => (
                      <tr key={b.batch_id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">{b.batch_number}</td>
                        <td className="py-3 px-3 text-slate-700">{b.warehouse_name}</td>
                        <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                          {b.current_quantity} <span className="text-[10px] text-slate-400 font-normal">/ {b.initial_quantity}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-700">₹{b.unit_cost.toFixed(2)}</td>
                        <td className="py-3 px-3 text-slate-600">
                          {b.expiry_date ? (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{b.expiry_date}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {b.risk_tier === 'CRITICAL_UNDER_15_DAYS' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              <ShieldAlert className="w-3 h-3 text-rose-600" />
                              <span>Expires in {b.days_until_expiry} days!</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Safe Stock</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedProductForBatches(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
