import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { MainNavTab } from '../types';
import { 
  LayoutDashboard, Users, Calendar, Stethoscope, FileCheck2, 
  Pill, FlaskConical, Receipt, TrendingDown, BarChart3, 
  FolderOpen, Bell, UserCog, Settings, Database, History,
  PlusCircle, Sparkles, ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, appointments, medicines, notifications, labOrders, settings } = useClinic();
  const { currentUser, isDoctor, isAdmin } = useAuth();

  // Badges calculation
  const waitingAppointmentsCount = appointments.filter(a => a.status === 'Waiting').length;
  const lowStockMedicinesCount = medicines.filter(m => m.availableQuantity <= m.minStockLevel).length;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  const pendingLabOrdersCount = labOrders.filter(l => l.status === 'Pending' || l.status === 'In Progress').length;

  interface NavItem {
    tab: MainNavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
    adminOnly?: boolean;
    doctorOnly?: boolean;
  }

  const navItems: NavItem[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" /> },
    { 
      tab: 'appointments', 
      label: 'Appointments', 
      icon: <Calendar className="w-4 h-4" />,
      badge: waitingAppointmentsCount > 0 ? waitingAppointmentsCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { tab: 'consultations', label: 'Consultations (EMR)', icon: <Stethoscope className="w-4 h-4" /> },
    { tab: 'prescriptions', label: 'Prescriptions', icon: <FileCheck2 className="w-4 h-4" /> },
    { 
      tab: 'medicines', 
      label: 'Medicines', 
      icon: <Pill className="w-4 h-4" />,
      badge: lowStockMedicinesCount > 0 ? lowStockMedicinesCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    { 
      tab: 'laboratory', 
      label: 'Laboratory', 
      icon: <FlaskConical className="w-4 h-4" />,
      badge: pendingLabOrdersCount > 0 ? pendingLabOrdersCount : undefined,
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    { tab: 'billing', label: 'Billing & Payments', icon: <Receipt className="w-4 h-4" /> },
    { tab: 'expenses', label: 'Expenses', icon: <TrendingDown className="w-4 h-4" /> },
    { tab: 'reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { tab: 'documents', label: 'Medical Documents', icon: <FolderOpen className="w-4 h-4" /> },
    { 
      tab: 'notifications', 
      label: 'Notifications', 
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    { tab: 'users', label: 'Users & Roles', icon: <UserCog className="w-4 h-4" />, adminOnly: true },
    { tab: 'settings', label: 'Clinic Settings', icon: <Settings className="w-4 h-4" />, adminOnly: true },
    { tab: 'backup', label: 'Backup & Restore', icon: <Database className="w-4 h-4" />, adminOnly: true },
    { tab: 'audit', label: 'Audit Logs', icon: <History className="w-4 h-4" />, adminOnly: true },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 no-print select-none">
      
      {/* Brand & Clinic Identity (Bento Grid Theme) */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          C+
        </div>
        <div className="overflow-hidden">
          <div className="font-bold text-white text-base tracking-tight truncate">
            {settings.clinicName ? settings.clinicName.split(' ')[0] + ' Clinic' : 'ClinicPro EMR'}
          </div>
          <div className="text-[10px] text-sky-400 font-medium flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ClinicPro EMR System
          </div>
        </div>
      </div>

      {/* Quick Action Clinical Banner */}
      <div className="px-3 pt-3">
        <button
          onClick={() => setActiveTab('consultations')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 text-white font-semibold text-xs shadow-sm hover:from-sky-500 hover:to-sky-400 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-sky-200 group-hover:scale-110 transition-transform" />
            <span>Doctor EMR / Consult</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-sky-200" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 text-xs font-medium custom-scrollbar">
        <div className="px-3 pb-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500">
          Clinical Operations
        </div>

        {navItems.map((item, idx) => {
          // Hide admin only items if not admin
          if (item.adminOnly && !isAdmin) return null;

          const isActive = activeTab === item.tab;

          return (
            <React.Fragment key={item.tab}>
              {/* Insert subtle section dividers */}
              {idx === 7 && (
                <div className="pt-3 pb-1 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Finance & Administration
                </div>
              )}
              {idx === 12 && (
                <div className="pt-3 pb-1 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Governance & System
                </div>
              )}

              <button
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#334155] text-white font-semibold border-l-4 border-sky-500 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-sky-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-sky-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Bottom User Footprint (Bento Grid Profile Footprint) */}
      <div className="p-3 border-t border-slate-800 bg-[#1e293b]">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-slate-800/80 border border-slate-700/50 text-xs">
          <div className="w-8 h-8 rounded-full bg-sky-400 text-slate-900 flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'SS'}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="font-bold text-white text-xs truncate">{currentUser?.name || 'Dr. Sarah Smith'}</div>
            <div className="text-[10px] text-slate-400 capitalize truncate">{currentUser?.role || 'Clinical Director'}</div>
          </div>
        </div>
      </div>

    </aside>
  );
};
