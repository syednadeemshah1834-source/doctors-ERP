import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { 
  Database, Download, Upload, RotateCcw, ShieldCheck, 
  AlertTriangle, CheckCircle2, FileJson, Server
} from 'lucide-react';

export const BackupRestoreView: React.FC = () => {
  const { 
    exportDatabaseJSON, importDatabaseJSON, resetDatabase,
    patients, appointments, consultations, prescriptions, medicines, invoices, expenses
  } = useClinic();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleExport = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ApexCare_EMR_Snapshot_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importDatabaseJSON(content);
        if (success) {
          setImportStatus('Database successfully restored! All modules reloaded.');
          setTimeout(() => setImportStatus(null), 4000);
        } else {
          setImportStatus('Error: Invalid database snapshot format.');
        }
      } catch (err) {
        setImportStatus('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetDatabase();
    setIsResetConfirmOpen(false);
    setImportStatus('Database successfully reset to clinical demo state.');
    setTimeout(() => setImportStatus(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-teal-600" />
          Clinical Database Backup, Disaster Recovery & Snapshot Vault
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Safeguard patient electronic health records (EHR), financial ledgers, and pharmacy inventory snapshots.
        </p>
      </div>

      {importStatus && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Database Footprint Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <Server className="w-4 h-4 text-teal-600" />
          <span>Active Practice Storage Footprint</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Patients</span>
            <span className="font-mono font-bold text-base text-slate-900">{patients.length} records</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Notes</span>
            <span className="font-mono font-bold text-base text-slate-900">{consultations.length} records</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pharmacy Catalog</span>
            <span className="font-mono font-bold text-base text-slate-900">{medicines.length} items</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Invoices & Expenses</span>
            <span className="font-mono font-bold text-base text-slate-900">{invoices.length + expenses.length} vouchers</span>
          </div>
        </div>
      </div>

      {/* Backup & Restore Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Export Complete Clinical Snapshot</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Downloads an encrypted JSON backup file containing all patient medical histories, prescription archives, diagnostic lab tests, invoices, and clinic configurations.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download JSON Backup</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Restore Practice from Snapshot</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Upload a previously exported `.json` snapshot file to completely restore clinic operations, appointments, inventory quantities, and accounting trails.
            </p>
          </div>

          <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload Backup JSON File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-5 space-y-3">
        <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Danger Zone: Re-seed Demo Practice Data</span>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Resetting the database replaces all current operational edits with the default comprehensive clinic demo dataset. This action cannot be undone unless you export a backup first.
        </p>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Practice to Initial Demo State</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Confirm Database Reset</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to reset the database? All records will revert to the default clinical baseline dataset.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
              >
                Yes, Reset Database
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
