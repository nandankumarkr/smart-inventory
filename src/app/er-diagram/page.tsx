'use client';

import React from 'react';
import { Database, FileText, CheckCircle2, ShieldCheck, Layers, GitBranch } from 'lucide-react';

const ENTITIES = [
  { name: 'users', pk: 'user_id', count: '4 rows', desc: 'System operators with RBAC roles (Admin, Manager, Staff, Auditor)' },
  { name: 'warehouses', pk: 'warehouse_id', count: '3 rows', desc: 'Regional logistics facilities with capacity square footage tracking' },
  { name: 'product_categories', pk: 'category_id', count: '4 rows', desc: 'Hierarchical self-referencing taxonomy of inventory assets' },
  { name: 'suppliers', pk: 'supplier_id', count: '4 rows', desc: 'Vendor procurement directory with ratings and contractual lead times' },
  { name: 'products', pk: 'product_id', count: '8 rows', desc: 'Master SKU asset catalog with price margins & reorder thresholds' },
  { name: 'product_embeddings', pk: 'embedding_id', count: '8 rows', desc: 'pgvector dense 384-dim vectors for cosine similarity AI search' },
  { name: 'purchase_orders', pk: 'po_id', count: '3 rows', desc: 'Procurement orders tracking issuance, delivery, and supplier SLAs' },
  { name: 'purchase_order_items', pk: 'po_item_id', count: '3 rows', desc: 'Line items linking purchase orders to SKUs and acquisition costs' },
  { name: 'inventory_batches', pk: 'batch_id', count: '8 rows', desc: 'Physical lot tracking with expiration dates and FIFO receipt ordering' },
  { name: 'inventory_transactions', pk: 'transaction_id', count: '2 rows', desc: 'Append-only double entry ledger recording every inventory delta' },
  { name: 'stock_transfers', pk: 'transfer_id', count: '1 row', desc: 'Inter-warehouse relocation manifests executed via ACID transactions' },
  { name: 'stock_transfer_items', pk: 'transfer_item_id', count: '1 row', desc: 'Quantity of specific lots moved between physical facilities' },
  { name: 'warehouse_telemetry', pk: 'telemetry_id', count: '4 rows', desc: 'Semi-structured NoSQL JSONB documents for IoT cold-chain telemetry' },
  { name: 'audit_logs', pk: 'audit_id', count: 'Auto', desc: 'Change Data Capture (CDC) table storing DML before/after snapshots' }
];

export default function ErDiagramPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          <span>Syllabus Section 4: Database Design & Relational Schema</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Database Architecture & Relational Schema</h1>
        <p className="text-xs text-slate-500 mt-1">
          14 normalized relations in 3NF / BCNF supporting multi-paradigm SQL, pgvector & JSONB
        </p>
      </div>

      {/* Normalization Proof Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>1NF: Atomicity</span>
          </div>
          <p className="text-xs text-slate-600">
            All attributes are atomic scalar values. Repeating groups decomposed into separate relations.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>2NF: No Partial FK</span>
          </div>
          <p className="text-xs text-slate-600">
            Non-prime attributes depend strictly on full candidate keys in composite tables.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>3NF: No Transitivity</span>
          </div>
          <p className="text-xs text-slate-600">
            Zero transitive dependencies exist. No non-key attribute determines another non-key attribute.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>BCNF Conformance</span>
          </div>
          <p className="text-xs text-slate-600">
            For every non-trivial functional dependency X &rarr; Y, determinant X is a superkey.
          </p>
        </div>
      </div>

      {/* Table Entities Overview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Implemented Database Entities ({ENTITIES.length} Relations)
          </h2>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            PostgreSQL 18 Dialect
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Entity / Table Name</th>
                <th className="py-2.5 px-4">Primary Key</th>
                <th className="py-2.5 px-4">Baseline Rows</th>
                <th className="py-2.5 px-4">Description & Functional Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {ENTITIES.map((ent, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{ent.name}</td>
                  <td className="py-3 px-4 font-mono text-emerald-700">{ent.pk}</td>
                  <td className="py-3 px-4 text-slate-600">{ent.count}</td>
                  <td className="py-3 px-4 text-slate-600">{ent.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
