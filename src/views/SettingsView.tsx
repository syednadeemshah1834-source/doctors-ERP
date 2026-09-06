import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Settings, Save, CheckCircle2, Building2, Clock, DollarSign, FileText } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useClinic();
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-600" />
            Clinic Profile, Billing & Practice Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure letterhead branding, operating hours, consultation slot duration, and tax rules.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Clinic Profile & Letterhead */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>1. Clinic Identity & Official Letterhead</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinic Legal Name *</label>
              <input
                type="text"
                required
                value={formData.clinicName}
                onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinic Phone / Hotline *</label>
              <input
                type="text"
                required
                value={formData.clinicPhone}
                onChange={e => setFormData({ ...formData, clinicPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email Address *</label>
              <input
                type="email"
                required
                value={formData.clinicEmail}
                onChange={e => setFormData({ ...formData, clinicEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
              <input
                type="text"
                value={formData.clinicWebsite}
                onChange={e => setFormData({ ...formData, clinicWebsite: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Clinic Physical Address *</label>
              <input
                type="text"
                required
                value={formData.clinicAddress}
                onChange={e => setFormData({ ...formData, clinicAddress: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Operational Hours & Appointment Slot Duration */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>2. Practice Operational Timings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Working Days</label>
              <input
                type="text"
                value={formData.workingDays}
                onChange={e => setFormData({ ...formData, workingDays: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Working Hours</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Slot Duration (Minutes)</label>
              <input
                type="number"
                value={formData.slotDurationMinutes}
                onChange={e => setFormData({ ...formData, slotDurationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Financial & Invoice Standards */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>3. Billing Standards & Tax Prefixes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Billing Currency Code</label>
              <input
                type="text"
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Standard Tax Rate (%)</label>
              <input
                type="number"
                step="0.5"
                value={formData.taxRatePercent}
                onChange={e => setFormData({ ...formData, taxRatePercent: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Prescription Legal Disclaimer */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>4. Prescription Legal Disclaimer & Instructions</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Prescription Footer Notice (Printed on every Rx)</label>
            <textarea
              rows={3}
              value={formData.prescriptionDisclaimer}
              onChange={e => setFormData({ ...formData, prescriptionDisclaimer: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Clinic Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
