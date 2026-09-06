import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Prescription } from '../types';
import { 
  FileCheck2, Search, Printer, User, Stethoscope, 
  Calendar, Eye, Pill, Plus, ChevronRight, X
} from 'lucide-react';

export const PrescriptionsView: React.FC = () => {
  const { prescriptions, getPatient, getDoctor, openPrintModal, setActiveTab } = useClinic();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(prescriptions[0] || null);

  const filtered = prescriptions.filter(rx => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const pat = getPatient(rx.patientId);
    const doc = getDoctor(rx.doctorId);
    return (
      rx.prescriptionNumber.toLowerCase().includes(q) ||
      pat?.fullName.toLowerCase().includes(q) ||
      pat?.mrn.toLowerCase().includes(q) ||
      doc?.name.toLowerCase().includes(q) ||
      rx.diagnosis.toLowerCase().includes(q) ||
      rx.medicines.some(m => m.medicineName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-600" />
            Electronic Prescriptions (Rx)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived digital prescriptions with medicine instructions, dosage frequency, and print records.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('consultations')}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Stethoscope className="w-4 h-4" />
          <span>New Consultation & Rx</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Rx number, patient name, doctor, diagnosis, or medicine name..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-teal-600"
          />
        </div>
      </div>

      {/* Two Column Layout: List & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Prescription List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between text-xs font-semibold text-slate-600">
            <span>{filtered.length} Prescriptions</span>
            <span>Click to preview</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching prescriptions found.
              </div>
            ) : (
              filtered.map(rx => {
                const pat = getPatient(rx.patientId);
                const doc = getDoctor(rx.doctorId);
                const isSelected = selectedRx?.id === rx.id;

                return (
                  <div
                    key={rx.id}
                    onClick={() => setSelectedRx(rx)}
                    className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected ? 'bg-teal-50/80 border-l-4 border-l-teal-600' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs truncate">{rx.prescriptionNumber}</span>
                        <span className="text-[10px] text-slate-400">{rx.date}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                        {pat?.fullName} <span className="text-slate-400 font-normal">({pat?.mrn})</span>
                      </div>
                      <div className="text-[11px] text-teal-700 font-medium truncate">
                        {rx.diagnosis}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Dr. {doc?.name} • {rx.medicines.length} medicine{rx.medicines.length === 1 ? '' : 's'}
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-teal-600' : 'text-slate-300'}`} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Prescription Detail & Print Preview (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedRx ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              
              {/* Top Banner with Print Button */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{selectedRx.prescriptionNumber}</div>
                  <div className="text-xs text-slate-500">Issued on {selectedRx.date}</div>
                </div>

                <button
                  onClick={() => openPrintModal('prescription', selectedRx)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Formal Rx</span>
                </button>
              </div>

              <div className="p-6 space-y-6 text-xs">
                
                {/* Doctor & Patient Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Prescribing Physician</span>
                    <div className="font-bold text-slate-900 text-xs">Dr. {getDoctor(selectedRx.doctorId)?.name}</div>
                    <div className="text-slate-600">{getDoctor(selectedRx.doctorId)?.specialization}</div>
                    <div className="text-slate-400 font-mono text-[10px]">License: {getDoctor(selectedRx.doctorId)?.licenseNumber}</div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Patient Details</span>
                    <div className="font-bold text-slate-900 text-xs">{getPatient(selectedRx.patientId)?.fullName}</div>
                    <div className="text-slate-600">{getPatient(selectedRx.patientId)?.gender}, {getPatient(selectedRx.patientId)?.age} yrs • Blood: {getPatient(selectedRx.patientId)?.bloodGroup}</div>
                    <div className="text-slate-400 font-mono text-[10px]">MRN: {getPatient(selectedRx.patientId)?.mrn}</div>
                  </div>
                </div>

                {/* Clinical Diagnosis */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Diagnosis</span>
                  <div className="font-bold text-slate-900 text-sm p-3 bg-teal-50/60 border border-teal-200 rounded-xl text-teal-950">
                    {selectedRx.diagnosis}
                  </div>
                </div>

                {/* Medications List */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Prescribed Medications (Rx)</span>
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {selectedRx.medicines.map((m, idx) => (
                      <div key={idx} className="p-3.5 bg-white flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">
                              {m.medicineName} <span className="font-normal text-slate-500">({m.dosage})</span>
                            </div>
                            <div className="text-emerald-800 font-semibold text-[11px] mt-0.5">
                              Frequency: {m.frequency} • Duration: {m.duration}
                            </div>
                            <div className="text-slate-500 text-[11px] mt-0.5 italic">
                              Directions: {m.instructions}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 block">Quantity</span>
                          <span className="font-mono font-bold text-slate-800">{m.quantity} units</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Clinical Advice & Follow-up */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedRx.generalAdvice && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">General Health Advice</span>
                      <div className="text-slate-700">{selectedRx.generalAdvice}</div>
                    </div>
                  )}

                  {selectedRx.followUpDate && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Next Follow-Up Encounter</span>
                      <div className="font-bold text-slate-900">{selectedRx.followUpDate}</div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Select a prescription to preview details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
