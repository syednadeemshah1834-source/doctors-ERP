import React, { useState, useRef, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Bell, Plus, User, ShieldCheck, Stethoscope, 
  Users, Calendar, Receipt, LogOut, ChevronDown, CheckCircle2,
  KeyRound, AlertCircle, Building2, Check
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    setIsGlobalSearchOpen, notifications, markNotificationRead, 
    markAllNotificationsRead, setActiveTab, settings, appointments 
  } = useClinic();
  
  const { currentUser, usersList, switchUser, changePassword, updateCurrentUserProfile } = useAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.isRead);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) {
        setIsQuickActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.trim().length >= 4) {
      changePassword(newPasswordInput);
      setPasswordChangeSuccess(true);
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordChangeSuccess(false);
        setNewPasswordInput('');
      }, 1200);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 no-print z-30">
      
      {/* Left side: Clinic Context */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800 text-sm tracking-tight">{settings.clinicName}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Practice
            </span>
          </div>
          <div className="text-xs text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Middle: Bento Omni Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#f1f5f9] hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-transparent hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white text-xs transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-sky-500" />
            <span>Search patient name, ID or record...</span>
          </div>
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right side: Quick Action + Notifications + Role Switcher / Profile */}
      <div className="flex items-center gap-3">
        
        {/* Quick Actions Dropdown */}
        <div className="relative" ref={quickActionsRef}>
          <button
            onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Appointment</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {isQuickActionsOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 text-xs">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400">Main Clinic Workflow</div>
              <button
                onClick={() => { setActiveTab('patients', { registerNew: true }); setIsQuickActionsOpen(false); }}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-sky-50 text-slate-700 hover:text-sky-800 text-left"
              >
                <Users className="w-4 h-4 text-sky-500" />
                <span>1. Register New Patient</span>
              </button>
              <button
                onClick={() => { setActiveTab('appointments', { createNew: true }); setIsQuickActionsOpen(false); }}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-sky-50 text-slate-700 hover:text-sky-800 text-left"
              >
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>2. Book Appointment</span>
              </button>
              <button
                onClick={() => { setActiveTab('consultations'); setIsQuickActionsOpen(false); }}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-sky-50 text-slate-700 hover:text-sky-800 text-left"
              >
                <Stethoscope className="w-4 h-4 text-sky-500" />
                <span>3. Start Doctor Consultation</span>
              </button>
              <button
                onClick={() => { setActiveTab('billing', { createNew: true }); setIsQuickActionsOpen(false); }}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-sky-50 text-slate-700 hover:text-sky-800 text-left"
              >
                <Receipt className="w-4 h-4 text-amber-600" />
                <span>4. Generate Invoice & Bill</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover with red indicator badge */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 relative transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100 text-xs">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <span>Clinical Alerts & Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No notifications</div>
                ) : (
                  notifications.slice(0, 8).map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkTab) setActiveTab(notif.linkTab as any);
                        setIsNotifOpen(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                        !notif.isRead ? 'bg-sky-50/40' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        notif.severity === 'critical' ? 'bg-rose-500' :
                        notif.severity === 'warning' ? 'bg-amber-500' : 'bg-sky-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 text-xs">{notif.title}</div>
                        <div className="text-slate-600 text-[11px] mt-0.5">{notif.message}</div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                <button
                  onClick={() => { setActiveTab('notifications'); setIsNotifOpen(false); }}
                  className="text-xs text-sky-700 font-semibold hover:underline"
                >
                  View All Notifications Center →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile & Role Switcher */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2 pr-2.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shadow-2xs">
              {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'SS'}
            </div>
            <div className="text-left hidden md:block">
              <div className="font-semibold text-slate-800 text-xs leading-none">{currentUser?.name}</div>
              <div className="text-[10px] text-slate-500 capitalize font-medium mt-0.5">{currentUser?.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-100 text-xs">
              {/* Current Profile Card */}
              <div className="px-4 py-2.5 border-b border-slate-100">
                <div className="font-bold text-slate-900 text-sm">{currentUser?.name}</div>
                <div className="text-xs text-slate-500">{currentUser?.email}</div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-sky-600" />
                  Role: {currentUser?.role}
                </div>
              </div>

              {/* Demo Role Switcher Section (Allows testing Admin, Doctor, Receptionist instantly) */}
              <div className="px-3 py-2 bg-slate-50/80 border-b border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                  Switch Active Role (Testing)
                </div>
                <div className="space-y-1">
                  {usersList.map(u => (
                    <button
                      key={u.id}
                      onClick={() => { switchUser(u.id); setIsUserMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                        currentUser?.id === u.id 
                          ? 'bg-sky-500 text-white font-semibold' 
                          : 'hover:bg-slate-200/70 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-medium truncate">{u.name}</div>
                        <div className={`text-[10px] capitalize ${currentUser?.id === u.id ? 'text-sky-100' : 'text-slate-400'}`}>
                          {u.role} {u.doctorId ? '• Physician' : ''}
                        </div>
                      </div>
                      {currentUser?.id === u.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Options */}
              <div className="py-1">
                <button
                  onClick={() => { setIsPasswordModalOpen(true); setIsUserMenuOpen(false); }}
                  className="w-full px-4 py-2 flex items-center gap-2 hover:bg-slate-50 text-slate-700 text-left cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setIsUserMenuOpen(false); }}
                  className="w-full px-4 py-2 flex items-center gap-2 hover:bg-slate-50 text-slate-700 text-left cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Clinic Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-200 animate-in zoom-in-95">
            <h3 className="font-bold text-slate-800 text-base mb-1">Change Account Password</h3>
            <p className="text-xs text-slate-500 mb-4">Update login credentials for {currentUser?.name}.</p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={e => setNewPasswordInput(e.target.value)}
                  placeholder="Enter at least 4 characters"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-sky-500"
                  required
                />
              </div>

              {passwordChangeSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Password changed successfully!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-medium hover:bg-sky-600 cursor-pointer"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </header>
  );
};
