import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { Appointment, AppointmentStatus, AppointmentType } from '../types';
import { 
  Calendar, Clock, Plus, Search, Filter, Stethoscope, 
  CheckCircle2, AlertCircle, X, ChevronLeft, ChevronRight, 
  User, Check, AlertTriangle, ShieldCheck
} from 'lucide-react';

export const AppointmentsView: React.FC = () => {
  const { 
    appointments, patients, doctors, addAppointment, updateAppointment, 
    setAppointmentStatus, deleteAppointment, setActiveTab, getPatient, 
    getDoctor, checkDoctorAvailability, settings 
  } = useClinic();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'all'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-06');
  const [filterDoctorId, setFilterDoctorId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // New Appointment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formPatientId, setFormPatientId] = useState(patients[0]?.id || '');
  const [formDoctorId, setFormDoctorId] = useState(doctors[0]?.id || '');
  const [formDate, setFormDate] = useState('2026-09-06');
  const [formTime, setFormTime] = useState('11:00');
  const [formDuration, setFormDuration] = useState(30);
  const [formType, setFormType] = useState<AppointmentType>('General Consultation');
  const [formReason, setFormReason] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    if (viewMode === 'daily' && apt.date !== selectedDate) return false;
    if (filterDoctorId !== 'all' && apt.doctorId !== filterDoctorId) return false;
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const pat = getPatient(apt.patientId);
      const doc = getDoctor(apt.doctorId);
      return (
        apt.appointmentNumber.toLowerCase().includes(q) ||
        pat?.fullName.toLowerCase().includes(q) ||
        pat?.mrn.toLowerCase().includes(q) ||
        doc?.name.toLowerCase().includes(q) ||
        apt.reason.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => a.time.localeCompare(b.time));

  // Time navigation
  const handleDateShift = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Check collision in form
  const handleTimeOrDoctorChange = (docId: string, dt: string, tm: string, dur: number) => {
    const check = checkDoctorAvailability(docId, dt, tm, dur);
    if (!check.available) {
      setConflictWarning(`Collision Alert: Doctor has appointment ${check.conflictingAppointment?.appointmentNumber} scheduled at ${check.conflictingAppointment?.time}. Double booking prevented!`);
    } else {
      setConflictWarning(null);
    }
  };

  const handleCreateAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const res = addAppointment({
      patientId: formPatientId,
      doctorId: formDoctorId,
      date: formDate,
      time: formTime,
      durationMinutes: formDuration,
      type: formType,
      reason: formReason || 'General Consultation Checkup',
      status: 'Confirmed',
      notes: formNotes
    });

    if (res.success) {
      setIsModalOpen(false);
      setFormReason('');
      setFormNotes('');
      setConflictWarning(null);
    } else if (res.error) {
      setConflictWarning(res.error);
    }
  };

  const statusColors: Record<AppointmentStatus, string> = {
    Waiting: 'bg-amber-100 text-amber-800 border-amber-200',
    Confirmed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
    'No-show': 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            Clinic Appointment Scheduling & Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time outpatient schedule with double-booking prevention and quick patient check-in.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setConflictWarning(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* Control Bar: View Switcher, Date Selector, Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Daily Date Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDateShift(-1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-teal-600"
            />
            <button
              onClick={() => handleDateShift(1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate('2026-09-06')}
              className="px-2.5 py-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200"
            >
              Today
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'daily' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Day Schedule
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              All Appointments
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filter by patient name, MRN, reason..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-600"
            />
          </div>

          <select
            value={filterDoctorId}
            onChange={e => setFilterDoctorId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-teal-600"
          >
            <option value="all">Filter Doctor: All Specialists</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-teal-600"
          >
            <option value="all">Status: All Statuses</option>
            <option value="Waiting">Waiting (Checked In)</option>
            <option value="Confirmed">Confirmed (Scheduled)</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No-show">No-show</option>
          </select>
        </div>

      </div>

      {/* Appointments Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600 font-semibold">
          <span>{filteredAppointments.length} Appointments Found</span>
          <span>Click status to update check-in state</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Token / Time</th>
                <th className="py-3 px-4 font-semibold">Patient</th>
                <th className="py-3 px-4 font-semibold">Assigned Doctor</th>
                <th className="py-3 px-4 font-semibold">Visit Type & Reason</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No appointments matching the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(apt => {
                  const patient = getPatient(apt.patientId);
                  const doctor = getDoctor(apt.doctorId);

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Time & Token */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{apt.time}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <span>Token #{apt.tokenNumber || 1}</span>
                          <span>• {apt.durationMinutes}m</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{apt.date}</div>
                      </td>

                      {/* Patient */}
                      <td className="py-3 px-4">
                        <div 
                          onClick={() => { setActiveTab('patients', { patientId: patient?.id }); }}
                          className="font-bold text-slate-800 hover:text-teal-700 cursor-pointer text-sm"
                        >
                          {patient?.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          MRN: <span className="font-mono text-slate-700">{patient?.mrn}</span> • {patient?.gender}, {patient?.age}y
                        </div>
                        <div className="text-[10px] text-slate-400">{patient?.phone}</div>
                      </td>

                      {/* Doctor */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{doctor?.name}</div>
                        <div className="text-[11px] text-teal-700">{doctor?.specialization}</div>
                        <div className="text-[10px] text-slate-400">{doctor?.roomNumber}</div>
                      </td>

                      {/* Type & Reason */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="inline-block px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 text-[11px]">
                          {apt.type}
                        </div>
                        <div className="text-slate-600 mt-1 truncate" title={apt.reason}>
                          {apt.reason}
                        </div>
                        {apt.notes && <div className="text-[10px] text-slate-400 italic truncate">{apt.notes}</div>}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-4">
                        <select
                          value={apt.status}
                          onChange={e => setAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-hidden ${statusColors[apt.status]}`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Waiting">Waiting (In Lounge)</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="No-show">No-show</option>
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status !== 'Completed' && (
                            <button
                              onClick={() => setActiveTab('consultations', { appointmentId: apt.id, patientId: apt.patientId })}
                              className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-xs shadow-2xs transition-colors"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>Consult</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteAppointment(apt.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel / Remove Appointment"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book New Appointment Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Schedule New Appointment</h3>
                <p className="text-xs text-slate-500">Preventing doctor conflicts & double-booking</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointmentSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Conflict Warning Box */}
              {conflictWarning && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div>{conflictWarning}</div>
                </div>
              )}

              {/* Patient Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={formPatientId}
                  onChange={e => setFormPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 text-slate-800"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.mrn}) • Phone: {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Doctor *</label>
                <select
                  required
                  value={formDoctorId}
                  onChange={e => {
                    setFormDoctorId(e.target.value);
                    handleTimeOrDoctorChange(e.target.value, formDate, formTime, formDuration);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 text-slate-800"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization} ({settings.currencySymbol}{d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={e => {
                      setFormDate(e.target.value);
                      handleTimeOrDoctorChange(formDoctorId, e.target.value, formTime, formDuration);
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={e => {
                      setFormTime(e.target.value);
                      handleTimeOrDoctorChange(formDoctorId, formDate, e.target.value, formDuration);
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Min)</label>
                  <select
                    value={formDuration}
                    onChange={e => {
                      setFormDuration(Number(e.target.value));
                      handleTimeOrDoctorChange(formDoctorId, formDate, formTime, Number(e.target.value));
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                  </select>
                </div>
              </div>

              {/* Type & Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Type</label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  >
                    <option value="General Consultation">General Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Routine Checkup">Routine Checkup</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Diagnostic Review">Diagnostic Review</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chief Reason for Visit *</label>
                  <input
                    type="text"
                    required
                    value={formReason}
                    onChange={e => setFormReason(e.target.value)}
                    placeholder="e.g. Severe headache, BP refill"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Special instructions or accommodations..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Confirm Booking
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
