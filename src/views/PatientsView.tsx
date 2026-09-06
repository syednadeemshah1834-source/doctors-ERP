import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { Patient } from '../types';
import { 
  Users, UserPlus, Search, Filter, Phone, Mail, MapPin, 
  Heart, AlertTriangle, FileText, Calendar, Stethoscope, 
  Printer, Edit, Trash2, Archive, ChevronRight, X, Plus, 
  Clock, ShieldAlert, ArrowLeft, Pill, FlaskConical, FolderOpen
} from 'lucide-react';

export const PatientsView: React.FC = () => {
  const { 
    patients, addPatient, updatePatient, deletePatient, archivePatient,
    selectedPatientId, setSelectedPatientId, appointments, consultations,
    prescriptions, labOrders, documents, followUps, openPrintModal,
    setActiveTab, getDoctor 
  } = useClinic();
  
  const { isDoctor, isReceptionist } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form input state
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male' as Patient['gender'],
    dob: '1985-05-15',
    age: 41,
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+' as Patient['bloodGroup'],
    emergencyContactName: '',
    emergencyContactPhone: '',
    allergies: '' as string,
    existingConditions: '' as string,
    previousSurgeries: '' as string,
    familyHistory: '',
    currentMedications: '' as string,
    notes: ''
  });

  // Calculate age from DOB
  const handleDobChange = (dob: string) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    setFormData(prev => ({
      ...prev,
      dob,
      age: isNaN(calculatedAge) ? prev.age : calculatedAge
    }));
  };

  const handleOpenAddForm = () => {
    setEditingPatient(null);
    setFormData({
      fullName: '',
      gender: 'Male',
      dob: '1990-01-01',
      age: 36,
      phone: '',
      email: '',
      address: '',
      bloodGroup: 'O+',
      emergencyContactName: '',
      emergencyContactPhone: '',
      allergies: '',
      existingConditions: '',
      previousSurgeries: '',
      familyHistory: '',
      currentMedications: '',
      notes: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (pat: Patient) => {
    setEditingPatient(pat);
    setFormData({
      fullName: pat.fullName,
      gender: pat.gender,
      dob: pat.dob,
      age: pat.age,
      phone: pat.phone,
      email: pat.email,
      address: pat.address,
      bloodGroup: pat.bloodGroup,
      emergencyContactName: pat.emergencyContactName,
      emergencyContactPhone: pat.emergencyContactPhone,
      allergies: pat.allergies.join(', '),
      existingConditions: pat.existingConditions.join(', '),
      previousSurgeries: pat.previousSurgeries.join(', '),
      familyHistory: pat.familyHistory,
      currentMedications: pat.currentMedications.join(', '),
      notes: pat.notes
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parseList = (str: string) => str.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      fullName: formData.fullName,
      gender: formData.gender,
      dob: formData.dob,
      age: Number(formData.age),
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      bloodGroup: formData.bloodGroup,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      allergies: parseList(formData.allergies),
      existingConditions: parseList(formData.existingConditions),
      previousSurgeries: parseList(formData.previousSurgeries),
      familyHistory: formData.familyHistory,
      currentMedications: parseList(formData.currentMedications),
      notes: formData.notes
    };

    if (editingPatient) {
      updatePatient(editingPatient.id, payload);
    } else {
      const created = addPatient(payload);
      setSelectedPatientId(created.id);
    }

    setIsFormOpen(false);
  };

  // Filter patients
  const filteredPatients = patients.filter(p => {
    if (!showArchived && p.isArchived) return false;
    if (showArchived && !p.isArchived) return false;

    if (filterBloodGroup !== 'all' && p.bloodGroup !== filterBloodGroup) return false;
    if (filterGender !== 'all' && p.gender !== filterGender) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = p.fullName.toLowerCase().includes(q);
      const matchMrn = p.mrn.toLowerCase().includes(q);
      const matchPhone = p.phone.includes(q);
      const matchCondition = p.existingConditions.some(c => c.toLowerCase().includes(q));
      return matchName || matchMrn || matchPhone || matchCondition;
    }

    return true;
  });

  const activePatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) : null;

  // Selected Patient's Relational History
  const patientAppointments = activePatient ? appointments.filter(a => a.patientId === activePatient.id) : [];
  const patientConsultations = activePatient ? consultations.filter(c => c.patientId === activePatient.id) : [];
  const patientPrescriptions = activePatient ? prescriptions.filter(p => p.patientId === activePatient.id) : [];
  const patientLabOrders = activePatient ? labOrders.filter(l => l.patientId === activePatient.id) : [];
  const patientDocuments = activePatient ? documents.filter(d => d.patientId === activePatient.id) : [];
  const patientFollowUps = activePatient ? followUps.filter(f => f.patientId === activePatient.id) : [];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Patient Records & Clinical Histories
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized outpatient registry with complete medical history and vitals tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              showArchived ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showArchived ? 'Viewing Archived' : 'Show Archived'}
          </button>
          <button
            onClick={handleOpenAddForm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {/* Main Split: Directory on left / Detailed Patient Dossier on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Directory & Filters (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search & Quick Filters */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name, MRN, phone, or condition..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-600"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex gap-2 text-xs">
              <select
                value={filterBloodGroup}
                onChange={e => setFilterBloodGroup(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs focus:outline-teal-600"
              >
                <option value="all">Blood: All Groups</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

              <select
                value={filterGender}
                onChange={e => setFilterGender(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs focus:outline-teal-600"
              >
                <option value="all">Gender: All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Patients List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{filteredPatients.length} Patient{filteredPatients.length === 1 ? '' : 's'}</span>
              <span>Click to view profile</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto custom-scrollbar">
              {filteredPatients.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching patients found.
                </div>
              ) : (
                filteredPatients.map(pat => {
                  const isSelected = selectedPatientId === pat.id;
                  const hasAllergies = pat.allergies && pat.allergies.length > 0;

                  return (
                    <div
                      key={pat.id}
                      onClick={() => setSelectedPatientId(pat.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected ? 'bg-teal-50/80 border-l-4 border-l-teal-600' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {pat.fullName.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-xs truncate">{pat.fullName}</span>
                            <span className="font-mono text-[10px] text-teal-800 font-semibold px-1.5 py-0.2 bg-teal-50 rounded">
                              {pat.mrn}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {pat.gender}, {pat.age} yrs • Blood: <span className="font-semibold text-slate-700">{pat.bloodGroup}</span>
                          </div>

                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            Phone: {pat.phone}
                          </div>

                          {/* Allergy Tag if present */}
                          {hasAllergies && (
                            <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                              <AlertTriangle className="w-3 h-3" />
                              <span className="truncate max-w-[180px]">{pat.allergies.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-teal-600 translate-x-0.5' : 'text-slate-300'
                      }`} />
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Detailed Patient Dossier (7 Cols) */}
        <div className="lg:col-span-7">
          {activePatient ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-6">
              
              {/* Profile Card Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-teal-950 text-white relative">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
                      {activePatient.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold tracking-tight">{activePatient.fullName}</h2>
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/15 text-teal-200 font-semibold">
                          {activePatient.mrn}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>{activePatient.gender} • {activePatient.age} yrs (DOB: {activePatient.dob})</span>
                        <span>Blood: <strong className="text-teal-300">{activePatient.bloodGroup}</strong></span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>Phone: {activePatient.phone}</span>
                        <span>Email: {activePatient.email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Header Bar */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openPrintModal('patient_summary', activePatient)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                      title="Print Patient Medical Summary Card"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEditForm(activePatient)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                      title="Edit Patient Info"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => archivePatient(activePatient.id)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                      title="Archive Patient"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Clinical Workflow Shortcuts */}
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveTab('appointments', { createNew: true, patientId: activePatient.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-teal-300" />
                    <span>Book Appointment</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('consultations', { patientId: activePatient.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Start Consultation</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('billing', { createNew: true, patientId: activePatient.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                    <span>Create Invoice</span>
                  </button>
                </div>
              </div>

              {/* Medical Critical Facts Section */}
              <div className="px-6 space-y-4">
                
                {/* Allergies Highlight (Critical for patient safety) */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>DOCUMENTED ALLERGIES & ADVERSE DRUG REACTIONS</span>
                  </div>
                  <div className="text-xs text-rose-900 font-medium">
                    {activePatient.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {activePatient.allergies.map((all, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-rose-300 font-semibold shadow-2xs">
                            ⚠️ {all}
                          </span>
                        ))}
                      </div>
                    ) : (
                      'No Known Drug Allergies (NKDA)'
                    )}
                  </div>
                </div>

                {/* Emergency Contact & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Emergency Contact</span>
                    <div className="font-bold text-slate-800 mt-1">{activePatient.emergencyContactName || 'None recorded'}</div>
                    <div className="text-slate-500 font-mono mt-0.5">{activePatient.emergencyContactPhone || 'No phone'}</div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Residential Address</span>
                    <div className="text-slate-800 font-medium mt-1">{activePatient.address || 'No address on file'}</div>
                  </div>
                </div>

                {/* Chronic Conditions, Surgical & Family History */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Chronic Medical Conditions</span>
                    <div className="text-slate-800 font-medium mt-1">
                      {activePatient.existingConditions.length > 0 ? (
                        <ul className="list-disc list-inside space-y-0.5">
                          {activePatient.existingConditions.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      ) : 'No chronic conditions recorded.'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Active Regular Medications</span>
                    <div className="text-slate-800 font-medium mt-1">
                      {activePatient.currentMedications.length > 0 ? (
                        <ul className="list-disc list-inside space-y-0.5">
                          {activePatient.currentMedications.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      ) : 'None reported.'}
                    </div>
                  </div>
                </div>

                {activePatient.previousSurgeries.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Previous Surgeries</span>
                    <div className="text-slate-800 font-medium mt-1">{activePatient.previousSurgeries.join(' • ')}</div>
                  </div>
                )}

                {activePatient.familyHistory && (
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Family Medical History</span>
                    <div className="text-slate-700 leading-relaxed mt-1">{activePatient.familyHistory}</div>
                  </div>
                )}
              </div>

              {/* Patient Timeline & Relational Modules */}
              <div className="border-t border-slate-200 px-6 py-4">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Clinical Timeline & Encounters</h3>

                {/* Consultations History */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    Consultations & Doctor Notes ({patientConsultations.length})
                  </div>

                  {patientConsultations.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
                      No consultations recorded yet. Start a consultation to log patient vitals, diagnosis, and prescription.
                    </div>
                  ) : (
                    patientConsultations.map(con => {
                      const doc = getDoctor(con.doctorId);
                      return (
                        <div key={con.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{con.consultationNumber} — {con.date} ({con.time})</span>
                            <span className="text-teal-700 font-medium">Physician: {doc?.name}</span>
                          </div>

                          <div className="grid grid-cols-4 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-center text-[11px]">
                            <div><span className="text-slate-400">BP:</span> <strong className="text-slate-800">{con.vitals.bpSystolic}/{con.vitals.bpDiastolic}</strong></div>
                            <div><span className="text-slate-400">Pulse:</span> <strong className="text-slate-800">{con.vitals.pulse} bpm</strong></div>
                            <div><span className="text-slate-400">SpO2:</span> <strong className="text-slate-800">{con.vitals.spo2}%</strong></div>
                            <div><span className="text-slate-400">BMI:</span> <strong className="text-slate-800">{con.vitals.bmi}</strong></div>
                          </div>

                          <div className="text-slate-700">
                            <strong className="text-slate-900">Diagnosis:</strong> {con.diagnosis}
                          </div>
                          <div className="text-slate-600">
                            <strong className="text-slate-900">Clinical Exam:</strong> {con.physicalExamination}
                          </div>
                          {con.doctorNotes && (
                            <div className="text-slate-600 italic">
                              <strong className="text-slate-900 not-italic">Notes:</strong> {con.doctorNotes}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Prescriptions Issued */}
                <div className="mt-5 space-y-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-600" />
                    Prescriptions ({patientPrescriptions.length})
                  </div>

                  {patientPrescriptions.map(rx => (
                    <div key={rx.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{rx.prescriptionNumber} — {rx.diagnosis}</div>
                        <div className="text-slate-500">{rx.medicines.length} medications • Issued {rx.date}</div>
                      </div>
                      <button
                        onClick={() => openPrintModal('prescription', rx)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-medium"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Rx</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Lab Orders */}
                {patientLabOrders.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                      Laboratory Tests ({patientLabOrders.length})
                    </div>
                    {patientLabOrders.map(lo => (
                      <div key={lo.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{lo.testName} ({lo.orderNumber})</div>
                          <div className="text-slate-500">Status: <span className="font-semibold text-slate-700">{lo.status}</span> • Requested: {lo.requestedDate}</div>
                        </div>
                        {lo.status === 'Completed' && (
                          <button
                            onClick={() => openPrintModal('lab', lo)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>View Report</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-semibold text-slate-600 text-sm">No Patient Selected</div>
              <p className="text-xs max-w-sm mx-auto">
                Select a patient from the list on the left to review their complete clinical dossier, medical history, and prescriptions.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Register / Edit Patient Modal Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingPatient ? `Edit Patient: ${editingPatient.fullName}` : 'Register New Patient'}
                </h3>
                <p className="text-xs text-slate-500">Enter complete biographical and medical safety particulars.</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleFormSubmit} className="overflow-y-auto p-6 space-y-5 text-xs flex-1">
              
              {/* Personal Details */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 text-teal-700">
                  1. Patient Demographics & Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={e => handleDobChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Blood Group *</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="patient@example.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street, City, State"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 text-teal-700">
                  2. Emergency Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Name & Relationship</label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="e.g. John Hayes (Spouse)"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Medical History & Safety (CRITICAL) */}
              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  3. Clinical Background & Drug Allergies
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-rose-800 mb-1">
                      Documented Drug & Food Allergies (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="e.g. Penicillin, Sulfa, Latex, Aspirin (or leave blank if NKDA)"
                      className="w-full px-3 py-2 border border-rose-300 bg-rose-50/40 rounded-lg focus:outline-rose-600 text-rose-950 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Existing Conditions (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.existingConditions}
                        onChange={e => setFormData({ ...formData, existingConditions: e.target.value })}
                        placeholder="e.g. Hypertension, Type 2 Diabetes"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Previous Surgeries (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.previousSurgeries}
                        onChange={e => setFormData({ ...formData, previousSurgeries: e.target.value })}
                        placeholder="e.g. Appendectomy (2014)"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Current Regular Medications (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.currentMedications}
                        onChange={e => setFormData({ ...formData, currentMedications: e.target.value })}
                        placeholder="e.g. Amlodipine 5mg OD"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Family Medical History
                      </label>
                      <input
                        type="text"
                        value={formData.familyHistory}
                        onChange={e => setFormData({ ...formData, familyHistory: e.target.value })}
                        placeholder="e.g. Paternal cardiac history"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Clinical Registration Notes</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Special instructions, dietary restrictions, preferred appointment times..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  {editingPatient ? 'Save Changes' : 'Register Patient'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
