'use client';

import React, { useState } from 'react';
import { MOCK_TRANSFERS, MOCK_WAREHOUSES, MOCK_BATCHES } from '@/lib/mock-data';
import { StockTransfer } from '@/lib/types';
import { 
  ArrowLeftRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Building2, 
  Boxes,
  Lock
} from 'lucide-react';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<StockTransfer[]>(MOCK_TRANSFERS);
  const [sourceWh, setSourceWh] = useState(MOCK_WAREHOUSES[0].warehouse_id);
  const [targetWh, setTargetWh] = useState(MOCK_WAREHOUSES[1].warehouse_id);
  const [selectedBatch, setSelectedBatch] = useState(MOCK_BATCHES[0].batch_id);
  const [quantity, setQuantity] = useState(50);
  const [isExecuting, setIsExecuting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const availableBatches = MOCK_BATCHES.filter(b => b.warehouse_id === sourceWh && b.current_quantity > 0);

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceWh === targetWh) {
      alert("Source and Destination warehouses must be distinct! (Enforced by CHECK constraint chk_different_warehouses)");
      return;
    }

    const batch = MOCK_BATCHES.find(b => b.batch_id === selectedBatch);
    if (!batch || batch.current_quantity < quantity) {
      alert(`Insufficient stock in selected batch! Available: ${batch?.current_quantity || 0}, Requested: ${quantity}`);
      return;
    }

    setIsExecuting(true);

    // Simulate stored procedure execution delay
    setTimeout(() => {
      const sourceWhName = MOCK_WAREHOUSES.find(w => w.warehouse_id === sourceWh)?.name;
      const targetWhName = MOCK_WAREHOUSES.find(w => w.warehouse_id === targetWh)?.name;

      const newTransfer: StockTransfer = {
        transfer_id: `trf-${Date.now()}`,
        transfer_number: `TRF-2026-${String(transfers.length + 1).padStart(3, '0')}`,
        source_warehouse_id: sourceWh,
        source_warehouse_name: sourceWhName,
        target_warehouse_id: targetWh,
        target_warehouse_name: targetWhName,
        status: 'COMPLETED',
        requested_by: 'staff-01',
        requester_name: 'Nandan Kumar',
        approved_by: 'mgr-01',
        approver_name: 'Priya Venkatesh',
        tracking_reference: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        items: [
          {
            transfer_item_id: `ti-${Date.now()}`,
            transfer_id: `trf-${Date.now()}`,
            product_id: batch.product_id,
            product_name: batch.product_name,
            sku: batch.sku,
            source_batch_id: batch.batch_id,
            source_batch_number: batch.batch_number,
            quantity: quantity
          }
        ]
      };

      setTransfers([newTransfer, ...transfers]);
      setIsExecuting(false);
      setSuccessMsg(`ACID Transaction Committed: Transfer ${newTransfer.transfer_number} processed with row-level locks!`);
      setTimeout(() => setSuccessMsg(null), 5000);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Stored Procedure: sp_execute_stock_transfer</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inter-Warehouse Stock Transfers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ACID transactional stock relocation with row-level locking (SELECT ... FOR UPDATE)
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form & Procedure Explainer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Action Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
              <span>Initiate Stock Relocation</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-500">Atomic 2-Phase Commit</span>
          </div>

          <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Facility</label>
                <select
                  value={sourceWh}
                  onChange={(e) => setSourceWh(e.target.value)}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {MOCK_WAREHOUSES.map(w => (
                    <option key={w.warehouse_id} value={w.warehouse_id}>{w.name} ({w.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Facility</label>
                <select
                  value={targetWh}
                  onChange={(e) => setTargetWh(e.target.value)}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {MOCK_WAREHOUSES.map(w => (
                    <option key={w.warehouse_id} value={w.warehouse_id}>{w.name} ({w.city})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Active Batch to Pick</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {availableBatches.map(b => (
                    <option key={b.batch_id} value={b.batch_id}>
                      {b.batch_number} - {b.sku} (Available: {b.current_quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity to Transfer</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isExecuting}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isExecuting ? 'Executing sp_execute_stock_transfer...' : 'Execute Atomic Stock Transfer'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ACID Procedure Architecture Note */}
        <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-sm space-y-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>ACID Guarantees Verified</span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            The stored procedure enforces the 4 ACID tenets:
          </p>

          <ul className="space-y-2 text-slate-400">
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-400">A:</span>
              <span><strong>Atomicity:</strong> If credit to destination fails, source deduction and ledger inserts roll back entirely.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-400">C:</span>
              <span><strong>Consistency:</strong> CHECK constraints ensure source stock cannot drop below 0.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-400">I:</span>
              <span><strong>Isolation:</strong> Row-level lock (`SELECT ... FOR UPDATE`) prevents concurrent double-spending.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-400">D:</span>
              <span><strong>Durability:</strong> Changes are permanently logged into PostgreSQL WAL and transaction ledger.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Stock Transfers History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Transfer Manifest Records (stock_transfers)
          </h3>
          <span className="text-xs text-slate-500 font-medium">{transfers.length} Total Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Transfer Number</th>
                <th className="py-2.5 px-4">Source Facility</th>
                <th className="py-2.5 px-4">Destination Facility</th>
                <th className="py-2.5 px-4">Item & Batch</th>
                <th className="py-2.5 px-4 text-right">Units</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4">Authorized By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transfers.map((trf) => (
                <tr key={trf.transfer_id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{trf.transfer_number}</td>
                  <td className="py-3 px-4 text-slate-700">{trf.source_warehouse_name}</td>
                  <td className="py-3 px-4 text-slate-700">{trf.target_warehouse_name}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{trf.items?.[0]?.product_name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{trf.items?.[0]?.source_batch_number}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-emerald-600">
                    {trf.items?.[0]?.quantity}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      trf.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {trf.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{trf.approver_name || trf.requester_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
