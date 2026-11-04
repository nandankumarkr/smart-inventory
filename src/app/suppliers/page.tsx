'use client';

import React from 'react';
import { MOCK_SUPPLIERS } from '@/lib/mock-data';
import { 
  Truck, 
  Star, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function SuppliersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>SQL View: vw_supplier_scorecard</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Suppliers & SLA Scorecards</h1>
          <p className="text-xs text-slate-500 mt-1">Vendor performance tracking, lead-time reliability, and cumulative procurement volume</p>
        </div>
      </div>

      {/* Supplier Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_SUPPLIERS.map((s) => (
          <div key={s.supplier_id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {s.supplier_code}
                  </span>
                  {s.is_preferred && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                      Preferred Vendor
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{s.company_name}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.address}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 font-extrabold text-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{s.rating.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-slate-400">Quality Score</div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Lead Time</span>
                <span className="font-extrabold text-slate-800 mt-0.5 block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  {s.lead_time_days} days
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Payment Terms</span>
                <span className="font-extrabold text-slate-800 mt-0.5 block">{s.payment_terms}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">SLA On-Time</span>
                <span className="font-extrabold text-emerald-600 mt-0.5 block">
                  {s.rating > 4.5 ? '98.5%' : '84.0%'}
                </span>
              </div>
            </div>

            {/* Contact Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px]">{s.email}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{s.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
