'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Boxes, 
  Sparkles, 
  ArrowLeftRight, 
  ShoppingCart, 
  Truck, 
  Database, 
  FileText, 
  ShieldCheck,
  Building2,
  MessageSquare
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Executive KPIs', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Inventory & FIFO Batches', href: '/inventory', icon: Boxes },
  { label: 'AI Semantic Search (pgvector)', href: '/semantic-search', icon: Sparkles, badge: 'Vector DB' },
  { label: 'Review Sentiment Analytics', href: '/reviews', icon: MessageSquare, badge: 'NoSQL' },
  { label: 'Inter-Warehouse Transfers', href: '/transfers', icon: ArrowLeftRight, badge: 'ACID' },
  { label: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
  { label: 'Suppliers Scorecard', href: '/suppliers', icon: Truck },
  { label: 'DBMS Viva Evaluator', href: '/dbms-evaluator', icon: Database, badge: 'Level 3', highlight: true },
  { label: 'ER Diagram & Relational Schema', href: '/er-diagram', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-30">
      {/* Brand Logo & Title */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Boxes className="w-6 h-6" />
        </div>
        <div>
          <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
            SmartInventory
            <span className="text-[10px] uppercase font-semibold tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
              Predictor
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Automated Restock & DBMS L3</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Operations & Inventory
        </div>
        {NAV_ITEMS.slice(0, 6).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          DBMS Evaluation & Schema
        </div>
        {NAV_ITEMS.slice(6).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                item.highlight && !isActive
                  ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-500 text-slate-950 font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Database Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            PostgreSQL 18
          </span>
          <span className="text-[11px] text-slate-500 font-mono">pgvector: ON</span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ACID Concurrency: Enabled</span>
        </div>
      </div>
    </aside>
  );
}
