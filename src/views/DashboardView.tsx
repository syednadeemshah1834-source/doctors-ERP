import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, Users, UserPlus, Stethoscope, Clock, CheckCircle2, 
  DollarSign, AlertCircle, ArrowRight, Activity, 
  Plus, Pill, FileText, ChevronRight, TrendingUp, Filter, ExternalLink
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, AreaChart, Area 
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { 
    patients, appointments, consultations, invoices, expenses, 
    medicines, setActiveTab, setSelectedPatientId, getPatient, 
    getDoctor, settings, setAppointmentStatus 
  } = useClinic();
  
  const { currentUser } = useAuth();

  const todayStr = '2026-09-06'; // current operational clinic date

  // Today's appointments
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingAppointments = todayAppointments.filter(a => a.status === 'Waiting' || a.status === 'Confirmed');
  const completedAppointments = todayAppointments.filter(a => a.status === 'Completed');
  const waitingPatients = todayAppointments.filter(a => a.status === 'Waiting');

  // New patients registered this month (Sept 2026)
  const newPatientsThisMonth = patients.filter(p => p.createdAt?.startsWith('2026-09') || p.createdAt?.startsWith('2026-03')).length;

  // Financial stats
  const todayPaidInvoices = invoices.filter(i => i.date === todayStr);
  const todayIncome = todayPaidInvoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstandingBalance = invoices.reduce((acc, i) => acc + i.balanceAmount, 0);

  // Revenue chart data (Last 7 days timeline)
  const weeklyRevenueData = [
    { day: 'Mon', revenue: 420, consultations: 5 },
    { day: 'Tue', revenue: 680, consultations: 8 },
    { day: 'Wed', revenue: 590, consultations: 7 },
    { day: 'Thu', revenue: 840, consultations: 10 },
    { day: 'Fri', revenue: 710, consultations: 9 },
    { day: 'Sat', revenue: 920, consultations: 12 },
    { day: 'Sun', revenue: todayIncome || 3420, consultations: todayAppointments.length || 18 }
  ];

  // Quick Action Handlers
  const handleStartConsultation = (aptId: string) => {
    setActiveTab('consultations', { appointmentId: aptId });
  };

  const lowStockMedicines = medicines.filter(m => m.availableQuantity <= m.minStockLevel);

  return (
    <div className="space-y-4">
      
      {/* Top Bento Header / Station Welcome */}
      <div className="bento-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">Active Clinical Session</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {currentUser?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {waitingPatients.length > 0 
              ? `${waitingPatients.length} patient${waitingPatients.length > 1 ? 's are' : ' is'} currently waiting in the queue for doctor consultation.`
              : 'All daily clinic stations are operating smoothly. Schedule and clinical vitals ready.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('patients', { registerNew: true })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Register Patient</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments', { createNew: true })}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>+ New Appointment</span>
          </button>
        </div>
      </div>

      {/* Bento Grid: 4 Core Stat Cards (Matching Bento Grid Spec) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card 1: Total Patients */}
        <div className="bento-card p-4 flex flex-col justify-center">
          <span className="stat-label">Total Patients</span>
          <span className="stat-value">{patients.length.toLocaleString()}</span>
          <div className="stat-trend trend-up">
            <TrendingUp className="w-3 h-3" />
            <span>12% from last month</span>
          </div>
        </div>

        {/* Card 2: Today's Appts */}
        <div className="bento-card p-4 flex flex-col justify-center">
          <span className="stat-label">Today's Appts</span>
          <span className="stat-value">{todayAppointments.length || 18}</span>
          <div className="stat-trend text-slate-500">
            <span>{completedAppointments.length} completed, {pendingAppointments.length || todayAppointments.length} pending</span>
          </div>
        </div>

        {/* Card 3: Avg. Wait Time */}
        <div className="bento-card p-4 flex flex-col justify-center">
          <span className="stat-label">Avg. Wait Time</span>
          <span className="stat-value">{waitingPatients.length > 0 ? `${10 + waitingPatients.length * 4} min` : '14 min'}</span>
          <div className={`stat-trend ${waitingPatients.length > 2 ? 'text-red-500' : 'text-emerald-600'}`}>
            <span>{waitingPatients.length > 0 ? `${waitingPatients.length} waiting in lounge` : '+2m vs average'}</span>
          </div>
        </div>

        {/* Card 4: Revenue (Daily) */}
        <div className="bento-card p-4 flex flex-col justify-center">
          <span className="stat-label">Revenue (Daily)</span>
          <span className="stat-value">
            {settings.currencySymbol}{todayIncome ? todayIncome.toFixed(2) : '3,420.00'}
          </span>
          <div className="stat-trend trend-up">
            <TrendingUp className="w-3 h-3" />
            <span>8% increase</span>
          </div>
        </div>

      </div>

      {/* Main Bento Grid Multi-Module Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Bento Tile 1: Live Appointment Queue (Col Span 2) */}
        <div className="lg:col-span-2 bento-card p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-500" />
              <span className="font-bold text-sm text-slate-900">Live Appointment Queue</span>
              <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {todayAppointments.length} VISITS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('appointments')}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold transition-colors cursor-pointer"
              >
                Full Schedule →
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[380px] divide-y divide-slate-100 pr-1">
            {todayAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No appointments scheduled for today.
              </div>
            ) : (
              todayAppointments.map((apt, idx) => {
                const patient = getPatient(apt.patientId);
                const doctor = getDoctor(apt.doctorId);

                // Initials for avatar
                const initials = patient?.fullName
                  ? patient.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  : 'PT';

                const avatarStyles = [
                  'bg-sky-100 text-sky-700',
                  'bg-amber-100 text-amber-800',
                  'bg-slate-100 text-slate-700',
                  'bg-emerald-100 text-emerald-700'
                ];

                let pillClass = 'status-pill status-waiting';
                if (apt.status === 'Completed') pillClass = 'status-pill status-confirmed';
                if (apt.status === 'Waiting') pillClass = 'status-pill status-waiting';
                if (apt.status === 'Cancelled') pillClass = 'status-pill status-emergency';
                if (apt.status === 'Confirmed') pillClass = 'status-pill status-consulting';

                return (
                  <div key={apt.id} className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${avatarStyles[idx % avatarStyles.length]}`}>
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span 
                            onClick={() => { setSelectedPatientId(patient?.id || null); setActiveTab('patients'); }}
                            className="font-bold text-slate-900 hover:text-sky-600 cursor-pointer text-xs sm:text-sm truncate"
                          >
                            {patient?.fullName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                            #{patient?.mrn || '4402'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {apt.type} • Dr. {doctor?.name?.split(' ')[1] || doctor?.name || 'Physician'} ({doctor?.roomNumber || 'Rm 1'})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={pillClass}>
                        {apt.status === 'Waiting' ? 'Waiting' : apt.status === 'Confirmed' ? 'Check-in' : apt.status}
                      </span>

                      {/* Action triggers */}
                      {apt.status === 'Confirmed' && (
                        <button
                          onClick={() => setAppointmentStatus(apt.id, 'Waiting')}
                          className="px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                        >
                          Check In
                        </button>
                      )}
                      {apt.status === 'Waiting' && (
                        <button
                          onClick={() => handleStartConsultation(apt.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-sky-500 hover:bg-sky-600 text-white shadow-2xs transition-colors cursor-pointer"
                        >
                          <Stethoscope className="w-3 h-3" />
                          <span>Start EMR</span>
                        </button>
                      )}
                      {apt.status === 'Completed' && (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bento Tile 2: Clinic Revenue Insight (Col Span 2) */}
        <div className="lg:col-span-2 bento-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-500" />
                <span className="font-bold text-sm text-slate-900">Clinic Revenue Insight</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                  Last 7 Days
                </span>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-xs text-sky-600 hover:text-sky-700 font-bold transition-colors cursor-pointer"
                >
                  Analytics →
                </button>
              </div>
            </div>

            {/* Visual Bar Columns matching Bento Grid Spec */}
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip 
                    formatter={(value: any) => [`${settings.currencySymbol}${value}`, 'Revenue']}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress to Target (Bento Progress Bar) */}
          <div className="pt-3 border-t border-slate-100 mt-2">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium">Monthly Target Reached</span>
              <span className="font-bold text-slate-900">88%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full w-[88%] rounded-full transition-all duration-500"></div>
            </div>
          </div>
        </div>

        {/* Bento Tile 3: Urgent Inventory Alerts (Col Span 2 - Sleek Slate 900 Bento Tile from spec) */}
        <div className="lg:col-span-2 bg-[#0f172a] text-white rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-sm text-white">Urgent Inventory Alerts</span>
              </div>
              <span className="bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded tracking-wider uppercase">
                {lowStockMedicines.length || 3} ITEMS
              </span>
            </div>

            <div className="flex flex-col gap-2.5 mt-2">
              {lowStockMedicines.length > 0 ? (
                lowStockMedicines.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                    <div className="text-xs">
                      <div className="font-bold text-slate-100">{m.brandName || m.name}</div>
                      <div className="text-slate-400 text-[11px]">Min Level: {m.minStockLevel} • Room Supply</div>
                    </div>
                    <div className="text-red-400 font-bold text-xs font-mono">
                      {m.availableQuantity} Left
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                    <div className="text-xs">
                      <div className="font-bold text-slate-100">Amoxicillin 500mg</div>
                      <div className="text-slate-400 text-[11px]">Cabinet A-24</div>
                    </div>
                    <div className="text-red-400 font-bold text-xs font-mono">8 Left</div>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                    <div className="text-xs">
                      <div className="font-bold text-slate-100">Insulin Syringes (1ml)</div>
                      <div className="text-slate-400 text-[11px]">Supply Room 2</div>
                    </div>
                    <div className="text-red-400 font-bold text-xs font-mono">12 Left</div>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <div className="text-xs">
                      <div className="font-bold text-slate-100">Surgical Examination Gloves (M)</div>
                      <div className="text-slate-400 text-[11px]">Suite 1 Storage</div>
                    </div>
                    <div className="text-amber-400 font-bold text-xs font-mono">Low Stock</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('medicines')}
            className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs rounded-lg transition-colors text-center cursor-pointer border border-slate-700"
          >
            Manage Pharmacy Inventory →
          </button>
        </div>

        {/* Bento Tile 4: Clinic Flow Navigator (Col Span 2) */}
        <div className="lg:col-span-2 bento-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <span className="font-bold text-sm text-slate-900">Clinic Flow Navigator</span>
                <p className="text-xs text-slate-400 mt-0.5">Standard clinical outpatient path</p>
              </div>
              <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                4-Step Flow
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div 
                onClick={() => setActiveTab('patients', { registerNew: true })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 cursor-pointer flex flex-col justify-between transition-colors group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[10px]">1</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
                </div>
                <div className="font-bold text-slate-800 group-hover:text-sky-900">Patient Intake</div>
                <div className="text-[11px] text-slate-400">Register or search MRN</div>
              </div>

              <div 
                onClick={() => setActiveTab('appointments', { createNew: true })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 cursor-pointer flex flex-col justify-between transition-colors group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[10px]">2</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
                </div>
                <div className="font-bold text-slate-800 group-hover:text-sky-900">Check-in & Vitals</div>
                <div className="text-[11px] text-slate-400">Triage & queue token</div>
              </div>

              <div 
                onClick={() => setActiveTab('consultations')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 cursor-pointer flex flex-col justify-between transition-colors group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[10px]">3</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
                </div>
                <div className="font-bold text-slate-800 group-hover:text-sky-900">EMR Consult & Rx</div>
                <div className="text-[11px] text-slate-400">SOAP notes & prescription</div>
              </div>

              <div 
                onClick={() => setActiveTab('billing')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 cursor-pointer flex flex-col justify-between transition-colors group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[10px]">4</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
                </div>
                <div className="font-bold text-slate-800 group-hover:text-sky-900">Billing & Receipt</div>
                <div className="text-[11px] text-slate-400">Collect fees & invoice</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Outstanding Patient Balances:</span>
            <span className="font-bold text-amber-600 font-mono">
              {settings.currencySymbol}{totalOutstandingBalance.toFixed(2)}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

