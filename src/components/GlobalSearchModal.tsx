import React, { useState, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Search, User, Calendar, Pill, Receipt, ArrowRight, X } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, setIsGlobalSearchOpen, 
    patients, appointments, medicines, invoices,
    setActiveTab, setSelectedPatientId, getPatient, getDoctor 
  } = useClinic();

  const [query, setQuery] = useState('');

  // Handle keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredPatients = trimmed 
    ? patients.filter(p => 
        p.fullName.toLowerCase().includes(trimmed) ||
        p.mrn.toLowerCase().includes(trimmed) ||
        p.phone.includes(trimmed)
      ).slice(0, 5)
    : [];

  const filteredAppointments = trimmed
    ? appointments.filter(a => {
        const pat = getPatient(a.patientId);
        const doc = getDoctor(a.doctorId);
        return a.appointmentNumber.toLowerCase().includes(trimmed) ||
               pat?.fullName.toLowerCase().includes(trimmed) ||
               doc?.name.toLowerCase().includes(trimmed);
      }).slice(0, 4)
    : [];

  const filteredMedicines = trimmed
    ? medicines.filter(m => 
        m.name.toLowerCase().includes(trimmed) ||
        m.brandName.toLowerCase().includes(trimmed) ||
        m.genericName.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const filteredInvoices = trimmed
    ? invoices.filter(inv => {
        const pat = getPatient(inv.patientId);
        return inv.invoiceNumber.toLowerCase().includes(trimmed) ||
               pat?.fullName.toLowerCase().includes(trimmed);
      }).slice(0, 4)
    : [];

  const hasResults = filteredPatients.length > 0 || 
                     filteredAppointments.length > 0 || 
                     filteredMedicines.length > 0 || 
                     filteredInvoices.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients by name, MRN, phone, medicines, appointments, invoices..."
            className="w-full bg-transparent border-none text-slate-800 text-sm focus:outline-hidden placeholder-slate-400"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setIsGlobalSearchOpen(false)}
            className="ml-2 text-xs bg-slate-200/80 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded-md font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!trimmed ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type at least 1 character to search across all clinical records.
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching patients, appointments, medicines, or invoices found for "{query}".
            </div>
          ) : (
            <>
              {/* Patients */}
              {filteredPatients.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    Patients ({filteredPatients.length})
                  </div>
                  <div className="space-y-1">
                    {filteredPatients.map(pat => (
                      <div
                        key={pat.id}
                        onClick={() => {
                          setSelectedPatientId(pat.id);
                          setActiveTab('patients');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50/70 border border-transparent hover:border-teal-200 cursor-pointer transition-colors group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800 group-hover:text-teal-900">{pat.fullName}</div>
                          <div className="text-xs text-slate-500">
                            MRN: <span className="font-mono text-slate-700">{pat.mrn}</span> • Phone: {pat.phone} • {pat.age} yrs ({pat.gender})
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointments */}
              {filteredAppointments.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    Appointments ({filteredAppointments.length})
                  </div>
                  <div className="space-y-1">
                    {filteredAppointments.map(apt => {
                      const pat = getPatient(apt.patientId);
                      const doc = getDoctor(apt.doctorId);
                      return (
                        <div
                          key={apt.id}
                          onClick={() => {
                            setActiveTab('appointments');
                            setIsGlobalSearchOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 border border-transparent hover:border-indigo-200 cursor-pointer transition-colors group"
                        >
                          <div>
                            <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-900">
                              {apt.appointmentNumber} — {pat?.fullName}
                            </div>
                            <div className="text-xs text-slate-500">
                              Dr. {doc?.name} • {apt.date} at {apt.time} • Status: <span className="font-medium text-slate-700">{apt.status}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Medicines */}
              {filteredMedicines.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-600" />
                    Pharmacy Medicines ({filteredMedicines.length})
                  </div>
                  <div className="space-y-1">
                    {filteredMedicines.map(med => (
                      <div
                        key={med.id}
                        onClick={() => {
                          setActiveTab('medicines');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 cursor-pointer transition-colors group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-900">
                            {med.brandName || med.name} <span className="text-xs font-normal text-slate-500">({med.strength})</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Generic: {med.genericName} • Stock: <span className={med.availableQuantity <= med.minStockLevel ? 'font-bold text-rose-600' : 'text-slate-700'}>{med.availableQuantity} units</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {filteredInvoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-amber-600" />
                    Invoices ({filteredInvoices.length})
                  </div>
                  <div className="space-y-1">
                    {filteredInvoices.map(inv => {
                      const pat = getPatient(inv.patientId);
                      return (
                        <div
                          key={inv.id}
                          onClick={() => {
                            setActiveTab('billing');
                            setIsGlobalSearchOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200 cursor-pointer transition-colors group"
                        >
                          <div>
                            <div className="text-sm font-semibold text-slate-800 group-hover:text-amber-900">
                              {inv.invoiceNumber} — {pat?.fullName}
                            </div>
                            <div className="text-xs text-slate-500">
                              Total: ${inv.totalAmount.toFixed(2)} • Status: <span className="font-semibold text-slate-800">{inv.paymentStatus}</span> (Balance: ${inv.balanceAmount.toFixed(2)})
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Tip: Press <kbd className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">Ctrl + K</kbd> or <kbd className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">⌘ + K</kbd> anywhere</span>
          <span>Click any item to navigate</span>
        </div>
      </div>
    </div>
  );
};
