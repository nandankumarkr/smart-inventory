'use client';

import React, { useState } from 'react';
import { UserRole } from '@/lib/types';
import { Shield, Bell, CheckCircle2, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

const ROLES: { role: UserRole; name: string; desc: string; color: string }[] = [
  { role: 'ADMIN', name: 'Dr. Rajesh Sharma', desc: 'Full System Admin', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  { role: 'MANAGER', name: 'Priya Venkatesh', desc: 'Procurement & Logistics Mgr', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { role: 'STAFF', name: 'Nandan Kumar', desc: 'Warehouse Logistics Staff', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { role: 'AUDITOR', name: 'Ananya Deshmukh', desc: 'Compliance & Quality Auditor', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' }
];

export default function Header({ currentRole = 'ADMIN', onRoleChange }: HeaderProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (onRoleChange) onRoleChange(role);
  };

  const activeUser = ROLES.find(r => r.role === selectedRole) || ROLES[0];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search / Project Breadcrumb */}
      <div className="flex items-center space-x-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          DBMS Level 3 Project
        </span>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-slate-700">Autonomous Inventory Intelligence</span>
      </div>

      {/* Role Switcher & User Profile */}
      <div className="flex items-center space-x-5">
        {/* Role Selector Dropdown (Interactive RBAC showcase) */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-500">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>Active RBAC Role:</span>
          </div>
          <select 
            value={selectedRole}
            onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
            className="text-xs font-bold bg-white text-slate-800 border border-slate-300 rounded px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
          >
            <option value="ADMIN">ADMIN (Dr. Rajesh)</option>
            <option value="MANAGER">MANAGER (Priya V.)</option>
            <option value="STAFF">STAFF (Nandan K.)</option>
            <option value="AUDITOR">AUDITOR (Ananya D.)</option>
          </select>
        </div>

        {/* Current User Badge */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800">{activeUser.name}</div>
            <div className="text-[11px] font-medium text-slate-500">{activeUser.desc}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {activeUser.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
