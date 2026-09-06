import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { 
  BarChart3, Calendar, Download, Printer, TrendingUp, 
  TrendingDown, DollarSign, Users, Stethoscope, CheckCircle2, 
  Filter, FileText, ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';

export const ReportsView: React.FC = () => {
  const { 
    invoices, expenses, consultations, appointments, patients, 
    medicines, doctors, settings 
  } = useClinic();

  const [dateRange, setDateRange] = useState<'today' | 'this_month' | 'all'>('this_month');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('all');

  // Revenue & Expense Calculations
  const totalRevenue = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balanceAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Monthly Financial Breakdown
  const financialMonthlyData = [
    { month: 'May', revenue: 3800, expenses: 1900 },
    { month: 'Jun', revenue: 4200, expenses: 2100 },
    { month: 'Jul', revenue: 4900, expenses: 2300 },
    { month: 'Aug', revenue: 5600, expenses: 2450 },
    { month: 'Sep (Current)', revenue: totalRevenue, expenses: totalExpenses }
  ];

  // Top Diagnoses Breakdown
  const diagnosisCounts: Record<string, number> = {};
  consultations.forEach(c => {
    const key = c.diagnosis.split('-')[0].trim();
    diagnosisCounts[key] = (diagnosisCounts[key] || 0) + 1;
  });

  const diagnosisPieData = Object.entries(diagnosisCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0d9488', '#0284c7', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];

  // Export to CSV helper
  const handleExportCsv = () => {
    const headers = ['Invoice Number', 'Patient MRN', 'Date', 'Total Amount', 'Paid Amount', 'Balance', 'Status'];
    const rows = invoices.map(i => [
      i.invoiceNumber,
      i.patientId,
      i.date,
      i.totalAmount.toFixed(2),
      i.paidAmount.toFixed(2),
      i.balanceAmount.toFixed(2),
      i.paymentStatus
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Clinic_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Clinic Intelligence, Audits & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-sectional clinical diagnostics, revenue stream breakdown, and profit/loss audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settled Collections</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
            {settings.currencySymbol}{totalRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Billed total: ${totalBilled.toFixed(2)}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clinic Expenditures</span>
          <div className="text-2xl font-bold text-rose-700 mt-1 font-mono">
            {settings.currencySymbol}{totalExpenses.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Operating overheads</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Operating Surplus</span>
          <div className={`text-2xl font-bold mt-1 font-mono ${netProfit >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
            {settings.currencySymbol}{netProfit.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Revenue minus expenditures</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clinical Consultations</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {consultations.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Across {patients.length} registered patients</div>
        </div>

      </div>

      {/* Visual Charts: Financial Flow & Diagnosis Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue vs Expense Trend Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Monthly Revenue vs. Expense Flow ({settings.currencySymbol})</h3>
              <p className="text-xs text-slate-400 mt-0.5">Comparative operating margin performance</p>
            </div>
            <span className="text-xs font-semibold text-teal-700">FY 2026</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialMonthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(val: any) => [`$${val}`, '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" name="Settled Revenue ($)" fill="#0d9488" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenditure ($)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diagnosis Spectrum Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Top Outpatient Diagnoses Spectrum</h3>
            <p className="text-xs text-slate-400 mt-0.5">Prevalence of recorded medical conditions</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {diagnosisPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diagnosisPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {diagnosisPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`${val} Cases`, 'Encounters']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No diagnosis records logged.</div>
            )}
          </div>
        </div>

      </div>

      {/* Doctor Performance Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 font-bold text-xs text-slate-800">
          Physician Consultation & Clinical Encounter Volume
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Doctor</th>
                <th className="py-3 px-4 font-semibold">Specialization</th>
                <th className="py-3 px-4 font-semibold">Scheduled Appointments</th>
                <th className="py-3 px-4 font-semibold">Completed Consultations</th>
                <th className="py-3 px-4 font-semibold">Standard Consultation Fee</th>
                <th className="py-3 px-4 font-semibold text-right">Attributed Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.map(doc => {
                const docApts = appointments.filter(a => a.doctorId === doc.id);
                const docConsults = consultations.filter(c => c.doctorId === doc.id);
                const estimatedRev = docConsults.length * doc.consultationFee;

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[10px] text-slate-400">{doc.licenseNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-teal-700 font-medium">{doc.specialization}</td>
                    <td className="py-3 px-4 font-mono">{docApts.length} bookings</td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-700">{docConsults.length} seen</td>
                    <td className="py-3 px-4 font-mono">${doc.consultationFee.toFixed(2)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right">
                      ${estimatedRev.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
