import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useClinic();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none no-print">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-teal-600 shrink-0" />
        };

        const borders = {
          success: 'border-emerald-200 bg-white text-slate-800 shadow-lg shadow-emerald-500/10',
          warning: 'border-amber-200 bg-white text-slate-800 shadow-lg shadow-amber-500/10',
          error: 'border-rose-200 bg-white text-slate-800 shadow-lg shadow-rose-500/10',
          info: 'border-teal-200 bg-white text-slate-800 shadow-lg shadow-teal-500/10'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borders[toast.type]} transition-all animate-in slide-in-from-bottom-2 fade-in duration-200`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-sm">
              {toast.title && <div className="font-semibold text-slate-900 mb-0.5">{toast.title}</div>}
              <div className="text-slate-600">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors -mr-1 -mt-1 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
