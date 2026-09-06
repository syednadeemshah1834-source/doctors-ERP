import React, { useState, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { PrescriptionItem, Vitals } from '../types';
import { 
  Stethoscope, User, AlertTriangle, Heart, Activity, 
  Pill, FlaskConical, Calendar, FileText, CheckCircle2, 
  Plus, Trash2, Printer, Search, ShieldCheck, Clock, Check
} from 'lucide-react';

export const ConsultationView: React.FC = () => {
  const { 
    patients = [], 
    doctors = [], 
    appointments = [], 
    medicines = [], 
    labCatalog = [], 
    consultations = [],
    saveConsultationWorkflow, 
    selectedPatientId, 
    setSelectedPatientId, 
    getPatient,
    getDoctor, 
    openPrintModal, 
    setActiveTab, 
    activeConsultationAppointmentId,
    settings 
  } = useClinic();
  
  const { currentUser, isDoctor } = useAuth();
  const currencySymbol = settings?.currencySymbol || 'PKR ';

  // Find waiting appointments for today
  const waitingAppointments = appointments.filter(a => a.status === 'Waiting');

  // Selected patient ID
  const [activePatientId, setActivePatientId] = useState<string>(() => {
    return selectedPatientId || waitingAppointments[0]?.patientId || patients[0]?.id || '';
  });

  // Selected doctor ID
  const defaultDoctorId = (isDoctor && currentUser?.doctorId) ? currentUser.doctorId : (doctors[0]?.id || '');
  const [activeDoctorId, setActiveDoctorId] = useState<string>(defaultDoctorId);

  // Sync state when incoming selection changes
  useEffect(() => {
    if (selectedPatientId) {
      setActivePatientId(selectedPatientId);
      const linked = appointments.find(a => a.patientId === selectedPatientId && (a.status === 'Waiting' || a.status === 'Confirmed'));
      if (linked) {
        if (linked.reason) setChiefComplaint(linked.reason);
        if (linked.doctorId) setActiveDoctorId(linked.doctorId);
      }
    } else if (activeConsultationAppointmentId) {
      const apt = appointments.find(a => a.id === activeConsultationAppointmentId);
      if (apt) {
        setActivePatientId(apt.patientId);
        if (apt.doctorId) setActiveDoctorId(apt.doctorId);
        if (apt.reason) setChiefComplaint(apt.reason);
      }
    } else if (!activePatientId && patients.length > 0) {
      setActivePatientId(patients[0].id);
    }
  }, [selectedPatientId, activeConsultationAppointmentId, appointments, patients, activePatientId]);

  // Linked appointment if any
  const linkedAppointment = appointments.find(
    a => a.patientId === activePatientId && (a.status === 'Waiting' || a.status === 'Confirmed')
  );

  // Vitals State
  const [vitals, setVitals] = useState<Vitals>({
    bpSystolic: 120,
    bpDiastolic: 80,
    pulse: 74,
    temperature: 98.6,
    respiratoryRate: 16,
    spo2: 98,
    weight: 70,
    height: 172,
    bmi: 23.7
  });

  // Calculate BMI dynamically
  const calculateBmi = (w: number, h: number): number => {
    if (h <= 0 || w <= 0) return 0;
    const heightInMeters = h / 100;
    const rawBmi = w / (heightInMeters * heightInMeters);
    return Math.round(rawBmi * 10) / 10;
  };

  const handleWeightChange = (weight: number) => {
    const bmi = calculateBmi(weight, vitals.height);
    setVitals(prev => ({ ...prev, weight, bmi }));
  };

  const handleHeightChange = (height: number) => {
    const bmi = calculateBmi(vitals.weight, height);
    setVitals(prev => ({ ...prev, height, bmi }));
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'bg-amber-100 text-amber-800' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'bg-emerald-100 text-emerald-800' };
    if (bmi < 30) return { label: 'Overweight', color: 'bg-amber-100 text-amber-800' };
    return { label: 'Obese Class', color: 'bg-rose-100 text-rose-800' };
  };

  // Clinical Notes State
  const [chiefComplaint, setChiefComplaint] = useState(linkedAppointment?.reason || 'Routine follow-up & clinical checkup');
  const [symptoms, setSymptoms] = useState<string[]>(['Fatigue']);
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState('Patient presents with 4 days of progressive symptoms.');
  const [physicalExamination, setPhysicalExamination] = useState('Chest clear to auscultation, S1/S2 regular, no peripheral edema.');
  const [diagnosis, setDiagnosis] = useState('Essential Hypertension - Grade 1');
  const [doctorNotes, setDoctorNotes] = useState('Counselled on reduced dietary sodium and daily light exercise.');

  // Electronic Prescription Medicines List
  const [rxMedicines, setRxMedicines] = useState<PrescriptionItem[]>([
    {
      medicineId: medicines[0]?.id || 'med-1',
      medicineName: medicines[0]?.name || 'Amoxicillin 500mg',
      dosage: medicines[0]?.strength || '500mg',
      frequency: '1-0-1 (BD)',
      duration: '7 Days',
      instructions: 'Take orally after meals with plenty of water',
      quantity: 14
    }
  ]);

  // Recommended Labs
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([]);

  // Follow-up recommendation
  const [followUpDate, setFollowUpDate] = useState<string>('2026-09-20');

  // Common quick symptom chips
  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Chest Discomfort', 'Fatigue', 
    'Dizziness', 'Shortness of breath', 'Joint pain', 'Sore throat', 'Palpitations'
  ];

  const toggleSymptom = (sym: string) => {
    if (symptoms.includes(sym)) {
      setSymptoms(symptoms.filter(s => s !== sym));
    } else {
      setSymptoms([...symptoms, sym]);
    }
  };

  // Prescription Medicine Helper
  const handleAddMedicineRow = () => {
    const med = medicines[0];
    setRxMedicines(prev => [
      ...prev,
      {
        medicineId: med?.id || '',
        medicineName: med?.name || 'Panadol Extra 500mg',
        dosage: med?.strength || '500mg',
        frequency: '1-0-1 (BD)',
        duration: '5 Days',
        instructions: 'Take after meals',
        quantity: 10
      }
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setRxMedicines(rxMedicines.filter((_, i) => i !== index));
  };

  const handleUpdateMedicineRow = (index: number, field: keyof PrescriptionItem, value: any) => {
    const updated = [...rxMedicines];
    updated[index] = { ...updated[index], [field]: value };
    setRxMedicines(updated);
  };

  const handleMedicineSelect = (index: number, medId: string) => {
    const chosen = medicines.find(m => m.id === medId);
    if (!chosen) return;
    const updated = [...rxMedicines];
    updated[index] = {
      ...updated[index],
      medicineId: chosen.id,
      medicineName: `${chosen.brandName || chosen.name} (${chosen.strength})`,
      dosage: chosen.strength,
      instructions: chosen.dosageForm === 'Tablet' || chosen.dosageForm === 'Capsule' ? 'Take orally after meals' : 'Apply or use as instructed'
    };
    setRxMedicines(updated);
  };

  const activePatient = getPatient(activePatientId);
  const activeDoctor = getDoctor(activeDoctorId) || doctors[0];

  // Past consultations for this patient
  const pastConsultations = consultations.filter(c => c.patientId === activePatientId);

  // Handle Save & Complete
  const handleCompleteConsultation = () => {
    if (!activePatient) return;

    const res = saveConsultationWorkflow({
      patientId: activePatient.id,
      doctorId: activeDoctorId,
      appointmentId: linkedAppointment?.id,
      vitals,
      chiefComplaint,
      symptoms,
      presentIllness: historyOfPresentIllness,
      physicalExamination,
      diagnosis,
      doctorNotes,
      followUpDate: followUpDate || undefined,
      prescriptions: rxMedicines,
      laboratoryTestsRecommended: selectedLabTests,
    });

    // Offer to print prescription immediately
    if (res?.prescription) {
      openPrintModal('prescription', res.prescription);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Attending Doctor Selector */}
      <div className="bento-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">Electronic Medical Record</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-sky-600" />
            Physician Outpatient Consultation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Document vitals, SOAP clinical notes, electronic Rx prescriptions, and lab orders in one integrated workflow.
          </p>
        </div>

        {/* Doctor selector */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 rounded-xl p-2">
          <span className="font-semibold text-slate-700 whitespace-nowrap">Attending Doctor:</span>
          <select
            value={activeDoctorId}
            onChange={e => setActiveDoctorId(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-sky-500 text-xs shadow-2xs"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialization}) — {currencySymbol}{d.consultationFee}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Waiting Room Patient Queue (Fast Switcher) */}
      {waitingAppointments.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              Reception Waiting Lounge ({waitingAppointments.length} patient{waitingAppointments.length === 1 ? '' : 's'} arrived)
            </span>
            <span className="text-amber-700 text-[11px]">Click a patient to load examination:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {waitingAppointments.map(apt => {
              const p = getPatient(apt.patientId);
              const isCurrent = activePatientId === apt.patientId;

              return (
                <button
                  key={apt.id}
                  type="button"
                  onClick={() => {
                    setActivePatientId(apt.patientId);
                    if (apt.reason) setChiefComplaint(apt.reason);
                    if (apt.doctorId) setActiveDoctorId(apt.doctorId);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white border border-amber-200 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <span className="font-mono">Token #{apt.tokenNumber || 1}</span>
                  <span>{p?.fullName || 'Patient'}</span>
                  <span className="opacity-75 text-[10px]">({apt.time})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Patient Summary Header Card */}
      {activePatient ? (
        <div className="bento-card p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Patient Identity */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-sky-500 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                {activePatient.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{activePatient.fullName}</h2>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {activePatient.mrn}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-bold">
                    Blood: {activePatient.bloodGroup || 'N/A'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3">
                  <span>{activePatient.gender}, {activePatient.age} yrs (DOB: {activePatient.dob})</span>
                  <span>Phone: {activePatient.phone}</span>
                  <span>Active Meds: {(activePatient.currentMedications || []).join(', ') || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Change Patient Picker */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 whitespace-nowrap">Switch Patient:</span>
              <select
                value={activePatientId}
                onChange={e => {
                  setActivePatientId(e.target.value);
                  const linked = appointments.find(a => a.patientId === e.target.value && a.status === 'Waiting');
                  if (linked?.reason) setChiefComplaint(linked.reason);
                }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-sky-500"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.mrn})</option>
                ))}
              </select>
            </div>

          </div>

          {/* Critical Allergy & Warning Banner */}
          {(activePatient.allergies || []).length > 0 && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-2 text-rose-900 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>SAFETY ALERT — DOCUMENTED ALLERGIES:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-rose-300 text-rose-700">
                {(activePatient.allergies || []).join(', ')}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="bento-card p-6 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">No patient selected.</p>
          <p className="mt-1">Please select an arrived patient or register a new patient to begin consultation.</p>
        </div>
      )}

      {/* Main Clinical Documentation Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Vitals, SOAP Notes, Prescriptions & Diagnostics */}
        <div className="lg:col-span-8 space-y-6">

          {/* Section 1: Objective Clinical Vitals */}
          <div className="bento-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <Activity className="w-4 h-4 text-sky-500" />
                <span>1. Objective Physical Vitals</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getBmiCategory(vitals.bmi).color}`}>
                BMI: {vitals.bmi} ({getBmiCategory(vitals.bmi).label})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              
              {/* Blood Pressure */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1">Blood Pressure (mmHg)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={vitals.bpSystolic}
                    onChange={e => setVitals({ ...vitals, bpSystolic: Number(e.target.value) })}
                    className="w-14 px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800"
                    placeholder="120"
                  />
                  <span className="text-slate-400">/</span>
                  <input
                    type="number"
                    value={vitals.bpDiastolic}
                    onChange={e => setVitals({ ...vitals, bpDiastolic: Number(e.target.value) })}
                    className="w-14 px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800"
                    placeholder="80"
                  />
                </div>
              </div>

              {/* Pulse Rate */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1">Pulse Rate (bpm)</label>
                <input
                  type="number"
                  value={vitals.pulse}
                  onChange={e => setVitals({ ...vitals, pulse: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800"
                />
              </div>

              {/* Temperature */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1">Temp (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={e => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800"
                />
              </div>

              {/* SpO2 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1">SpO2 Oxygen (%)</label>
                <input
                  type="number"
                  value={vitals.spo2}
                  onChange={e => setVitals({ ...vitals, spo2: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800"
                />
              </div>

              {/* Weight */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={vitals.weight}
                  onChange={e => handleWeightChange(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800"
                />
              </div>

              {/* Height */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={vitals.height}
                  onChange={e => handleHeightChange(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800"
                />
              </div>

              {/* Respiratory Rate */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-slate-500 font-semibold mb-1">Resp. Rate (/min)</label>
                <input
                  type="number"
                  value={vitals.respiratoryRate}
                  onChange={e => setVitals({ ...vitals, respiratoryRate: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800"
                />
              </div>

              {/* Auto BMI */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex flex-col justify-between">
                <span className="text-slate-500 font-semibold">Body Mass Index</span>
                <span className="font-mono font-bold text-base text-slate-900">{vitals.bmi} kg/m²</span>
              </div>

            </div>
          </div>

          {/* Section 2: Clinical SOAP Findings & Diagnosis */}
          <div className="bento-card p-5 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>2. Clinical SOAP Notes & Working Diagnosis</span>
            </div>

            {/* Quick Symptom Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Presenting Symptoms (Click to toggle):</label>
              <div className="flex flex-wrap gap-1.5">
                {commonSymptoms.map(sym => {
                  const isSelected = symptoms.includes(sym);
                  return (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-sky-500 text-white font-semibold shadow-xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chief Complaint */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chief Complaint *</label>
              <input
                type="text"
                required
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-sky-500"
                placeholder="Reason for today's visit"
              />
            </div>

            {/* History of Present Illness & Physical Examination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">History of Present Illness (HPI)</label>
                <textarea
                  rows={3}
                  value={historyOfPresentIllness}
                  onChange={e => setHistoryOfPresentIllness(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-sky-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Examination Findings</label>
                <textarea
                  rows={3}
                  value={physicalExamination}
                  onChange={e => setPhysicalExamination(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-sky-500 text-xs"
                />
              </div>
            </div>

            {/* Working Diagnosis & Medical Advice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-sky-900 mb-1">Working Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 bg-sky-50/50 border border-sky-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-sky-500"
                  placeholder="e.g. Essential Hypertension Grade 1"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physician Advice / Counseling</label>
                <input
                  type="text"
                  value={doctorNotes}
                  onChange={e => setDoctorNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-sky-500"
                  placeholder="Dietary, lifestyle and medication precautions"
                />
              </div>
            </div>

          </div>

          {/* Section 3: Electronic Prescription Builder */}
          <div className="bento-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <Pill className="w-4 h-4 text-sky-500" />
                <span>3. Electronic Prescription (Rx Generator)</span>
              </div>
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs rounded-xl border border-sky-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medication</span>
              </button>
            </div>

            {/* Prescriptions rows */}
            <div className="space-y-3">
              {rxMedicines.map((row, index) => (
                <div key={index} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2 text-xs">
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                      Medication #{index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={rxMedicines.length === 1}
                      onClick={() => handleRemoveMedicineRow(index)}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-500 font-semibold mb-0.5">Select Drug from Dispensary</label>
                      <select
                        value={row.medicineId}
                        onChange={e => handleMedicineSelect(index, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        {medicines.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.brandName ? `${m.brandName} (${m.name})` : m.name} — {m.strength} • Stock: {m.availableQuantity} • {currencySymbol}{m.salePrice}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-0.5">Strength / Dosage</label>
                      <input
                        type="text"
                        value={row.dosage}
                        onChange={e => handleUpdateMedicineRow(index, 'dosage', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        placeholder="e.g. 500mg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-0.5">Frequency</label>
                      <select
                        value={row.frequency}
                        onChange={e => handleUpdateMedicineRow(index, 'frequency', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="1-0-0 (OD Morning)">1-0-0 (OD Morning)</option>
                        <option value="0-0-1 (OD Night)">0-0-1 (OD Night)</option>
                        <option value="1-0-1 (BD)">1-0-1 (BD / Twice Daily)</option>
                        <option value="1-1-1 (TDS)">1-1-1 (TDS / Thrice Daily)</option>
                        <option value="1-1-1-1 (QID)">1-1-1-1 (QID)</option>
                        <option value="SOS (As needed)">SOS (As needed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={row.duration}
                        onChange={e => handleUpdateMedicineRow(index, 'duration', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        placeholder="e.g. 7 Days"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-0.5">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={e => handleUpdateMedicineRow(index, 'quantity', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-0.5">Meal Timing</label>
                      <input
                        type="text"
                        value={row.instructions}
                        onChange={e => handleUpdateMedicineRow(index, 'instructions', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        placeholder="After food"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Section 4: Recommended Lab Investigations */}
          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
              <FlaskConical className="w-4 h-4 text-sky-600" />
              <span>4. Diagnostic Laboratory Investigations</span>
            </div>
            <p className="text-xs text-slate-500">
              Select tests to auto-generate lab requests and add charges to patient invoice:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(labCatalog || []).map(lt => {
                const isSelected = selectedLabTests.includes(lt.testName);
                return (
                  <button
                    type="button"
                    key={lt.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedLabTests(selectedLabTests.filter(t => t !== lt.testName));
                      } else {
                        setSelectedLabTests([...selectedLabTests, lt.testName]);
                      }
                    }}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-1">
                      <span className="truncate">{lt.testName}</span>
                      <span className="font-mono text-[10px] text-slate-500 shrink-0">{currencySymbol}{lt.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Follow-Up Schedule */}
          <div className="bento-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>5. Recommended Follow-Up Encounter</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Creates a reminder tracking entry in the follow-up module.</p>
            </div>
            <input
              type="date"
              value={followUpDate}
              onChange={e => setFollowUpDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            />
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 cursor-pointer"
            >
              Cancel / Back
            </button>
            <button
              type="button"
              onClick={handleCompleteConsultation}
              className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Complete Consultation (Print Rx)</span>
            </button>
          </div>

        </div>

        {/* Right 4 Cols: Patient's Past Encounters & Clinical Automation Summary */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Past Consultations Card */}
          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Prior Encounters ({pastConsultations.length})
              </h3>
            </div>

            {pastConsultations.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No past consultations for this patient yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto custom-scrollbar">
                {pastConsultations.map(con => (
                  <div key={con.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{con.date}</span>
                      <span className="text-sky-700 font-medium">{con.consultationNumber}</span>
                    </div>
                    <div className="font-semibold text-slate-900">{con.diagnosis}</div>
                    <div className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-200 font-mono">
                      {con.vitals 
                        ? `BP: ${con.vitals.bpSystolic}/${con.vitals.bpDiastolic} • Pulse: ${con.vitals.pulse} • BMI: ${con.vitals.bmi}`
                        : 'Vitals recorded'
                      }
                    </div>
                    <div className="text-[11px] text-slate-600 truncate">
                      Complaints: {con.chiefComplaint}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Doctor Guidance / Checklist */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 text-xs space-y-3 border border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sky-400">
              <ShieldCheck className="w-4 h-4" />
              <span>EMR Automation Active</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              When you click "Save & Complete Consultation", the clinic engine immediately:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-300">
              <li>Marks appointment status as "Completed"</li>
              <li>Generates an official printable electronic Rx</li>
              <li>Dispatches lab orders to the Laboratory module</li>
              <li>Adds doctor fee ({currencySymbol}{activeDoctor?.consultationFee || 2000}) to billing</li>
              <li>Saves longitudinal vitals for health charts</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
