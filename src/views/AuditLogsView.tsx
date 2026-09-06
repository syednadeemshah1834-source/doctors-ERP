import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { 
  ShieldAlert, Search, Filter, Clock, User, 
  Trash2, ShieldCheck, Tag
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, clearAuditLogs } = useClinic();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');

  const modules = Array.from(new Set(auditLogs.map(l => l.module)));

  const filteredLogs = auditLogs.filter(log => {
    if (filterModule !== 'all' && log.module !== filterModule) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details?.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-teal-600" />
            HIPAA & Regulatory Clinical Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of clinical charts opened, prescriptions dispensed, invoices collected, and user sessions.
          </p>
        </div>

        {auditLogs.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Clear system audit logs?')) {
                clearAuditLogs();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Audit Log History</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search logs by staff name, action, or details..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-600"
          />
        </div>

        <div>
          <select
            value={filterModule}
            onChange={e => setFilterModule(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-teal-600"
          >
            <option value="all">Module: All Modules</option>
            {modules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex justify-between text-xs font-semibold text-slate-600">
          <span>{filteredLogs.length} Security & Clinical Activity Entries</span>
          <span>Automatic audit trail recording active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">User & Role</th>
                <th className="py-3 px-4 font-semibold">Module</th>
                <th className="py-3 px-4 font-semibold">Action Executed</th>
                <th className="py-3 px-4 font-semibold">Technical Particulars</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-sans text-xs">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-slate-900 text-xs">{log.userName}</div>
                      <div className="text-[10px] text-teal-700 font-semibold uppercase">{log.userRole}</div>
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {log.module}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                      {log.action}
                    </td>

                    <td className="py-3 px-4 text-slate-500 max-w-md truncate" title={log.details}>
                      {log.details || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
