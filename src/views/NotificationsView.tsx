import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { 
  Bell, CheckCircle2, AlertTriangle, AlertCircle, 
  Info, Trash2, Check, ArrowRight, Filter
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveTab } = useClinic();

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'info' | 'warning' | 'critical'>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filterSeverity !== 'all' && n.severity !== filterSeverity) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600" />
            Clinic Alerts & Automated Clinical Surveillance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts for appointment check-ins, critical pharmacy stock, and overdue balances.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4 text-teal-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>

        <button
          onClick={() => setFilterSeverity('all')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            filterSeverity === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setFilterSeverity('critical')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            filterSeverity === 'critical' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          Critical ({notifications.filter(n => n.severity === 'critical').length})
        </button>

        <button
          onClick={() => setFilterSeverity('warning')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            filterSeverity === 'warning' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          Warnings ({notifications.filter(n => n.severity === 'warning').length})
        </button>

        <button
          onClick={() => setFilterSeverity('info')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            filterSeverity === 'info' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
          }`}
        >
          Info ({notifications.filter(n => n.severity === 'info').length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden divide-y divide-slate-100">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No clinical alerts or notifications found.
          </div>
        ) : (
          filteredNotifs.map(notif => {
            const severityIcon = {
              critical: <AlertCircle className="w-5 h-5 text-rose-600" />,
              warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
              info: <Info className="w-5 h-5 text-teal-600" />
            }[notif.severity];

            const severityBorder = {
              critical: 'border-l-4 border-l-rose-600 bg-rose-50/20',
              warning: 'border-l-4 border-l-amber-500 bg-amber-50/20',
              info: 'border-l-4 border-l-teal-600 bg-teal-50/20'
            }[notif.severity];

            return (
              <div
                key={notif.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  !notif.isRead ? severityBorder : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-100 mt-0.5">
                    {severityIcon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{notif.title}</span>
                      {!notif.isRead && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-teal-600 text-white uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">{notif.message}</p>
                    <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-2 font-mono">
                      <span>{notif.date}</span>
                      <span>• Category: {notif.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.linkTab && (
                    <button
                      onClick={() => {
                        markNotificationRead(notif.id);
                        setActiveTab(notif.linkTab as any);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!notif.isRead && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
