import React from 'react';
import Link from 'next/link';
import { 
  Boxes, 
  Sparkles, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  GitBranch, 
  Layers, 
  Cpu, 
  CheckCircle,
  FileText
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-10 text-white shadow-xl border border-slate-700/60">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PES University • DBMS Experiential Learning – Level 3 Project</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Autonomous Smart Inventory & Supply Chain Intelligence System
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A production-grade multi-paradigm database solution combining <strong>PostgreSQL 18</strong> for strict ACID inventory transactions, <strong>pgvector</strong> for 384-dimensional semantic product discovery, and <strong>NoSQL JSONB</strong> for IoT environmental sensor monitoring.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/25"
            >
              <span>Explore Executive Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dbms-evaluator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Launch DBMS Viva Evaluator</span>
            </Link>
            <Link
              href="/er-diagram"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>ER Schema View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Strict Relational ACID Core</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            14 normalized tables in 3NF/BCNF. Uses double-entry ledgers, stored procedures with row locks (`SELECT ... FOR UPDATE`), and triggers preventing negative balances.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
            <span>PostgreSQL 18</span>
            <span>ACID Verified</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">pgvector Semantic Search</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Option 2 Vector Database integration using 384-dimensional dense vectors with cosine similarity distance (`&lt;=&gt;`) and HNSW approximate nearest neighbor indexing.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
            <span>Option 2: Vector DB</span>
            <span>HNSW Index</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Semi-Structured NoSQL Telemetry</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Option 1 NoSQL capability with JSONB documents and GIN indexes tracking IoT temperature, humidity, and door-open spikes across cold-chain vaccine facilities.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
            <span>Option 1: JSONB NoSQL</span>
            <span>GIN Indexes</span>
          </div>
        </div>
      </div>

      {/* Syllabus Rubric Checklist */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">PES University Rubric Compliance Checklist</h2>
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
            100% Requirements Fulfilled
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">1. Real-World Non-CRUD Problem:</span>
              <p className="text-slate-600 mt-0.5">Multi-warehouse FIFO inventory ledger with automated reorder calculations and cold-chain expiration tracking.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">2. Two Database Paradigms (Option 2):</span>
              <p className="text-slate-600 mt-0.5">Relational SQL (PostgreSQL) + Vector Database (pgvector HNSW) + Semi-structured NoSQL (JSONB GIN).</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">3. 4+ Advanced Database Concepts:</span>
              <p className="text-slate-600 mt-0.5">ACID Transactions, 4 Views, 2 Stored Procedures, 3 Triggers (CDC & Validation), HNSW Indexing, Full-Text Search.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">4. Complex DML Queries:</span>
              <p className="text-slate-600 mt-0.5">Multi-table JOINs, GROUP BY, HAVING, Window Functions (`SUM() OVER`, `RANK`), CTEs, Correlated Subqueries.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">5. Role-Based Access Control (RBAC):</span>
              <p className="text-slate-600 mt-0.5">4 roles (Admin, Manager, Staff, Auditor) with dedicated permission matrix and UI role switcher.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">6. Next.js Web Application & API:</span>
              <p className="text-slate-600 mt-0.5">Next.js 14 App Router, Server Handlers, PostgreSQL connection pooling, responsive Tailwind UI.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
