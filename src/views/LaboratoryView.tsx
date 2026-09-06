import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { PatientLabOrder, LabTestCatalog } from '../types';
import { 
  FlaskConical, Plus, Search, Filter, Printer, 
  CheckCircle2, Clock, AlertTriangle, FileText, 
  ChevronRight, X, Edit, Eye
} from 'lucide-react';

export const LaboratoryView: React.FC = () => {
  const { 
    labOrders, labCatalog, patients, doctors, addLabOrder, 
    updateLabOrder, openPrintModal, getPatient, getDoctor, settings 
  } = useClinic();

  const [activeTab, setActiveTabLocal] = useState<'orders' | 'catalog'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'In Progress' | 'Completed'>('all');

  // Results Modal State
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<PatientLabOrder | null>(null);
  const [resultsList, setResultsList] = useState<{ parameter: string; value: string; unit: string; normalRange: string; isAbnormal: boolean }[]>([]);
  const [technicianNotes, setTechnicianNotes] = useState('');

  // New Lab Order Modal
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderPatientId, setNewOrderPatientId] = useState(patients[0]?.id || '');
  const [newOrderDoctorId, setNewOrderDoctorId] = useState(doctors[0]?.id || '');
  const [newOrderTestName, setNewOrderTestName] = useState(labCatalog[0]?.testName || '');

  // Filter Orders
  const filteredOrders = labOrders.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const pat = getPatient(order.patientId);
      const doc = getDoctor(order.doctorId);
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.testName.toLowerCase().includes(q) ||
        pat?.fullName.toLowerCase().includes(q) ||
        pat?.mrn.toLowerCase().includes(q) ||
        doc?.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenEnterResults = (order: PatientLabOrder) => {
    setActiveOrder(order);
    setTechnicianNotes(order.technicianNotes || '');

    // If order already has results, use them, otherwise prefill from catalog
    if (order.results && order.results.length > 0) {
      setResultsList(order.results);
    } else {
      const catalogItem = labCatalog.find(t => t.testName === order.testName);
      setResultsList([
        {
          parameter: catalogItem?.testName || 'Primary Reading',
          value: '',
          unit: 'mg/dL',
          normalRange: catalogItem?.normalRange || 'Normal',
          isAbnormal: false
        }
      ]);
    }
    setIsResultModalOpen(true);
  };

  const handleAddResultParameter = () => {
    setResultsList(prev => [
      ...prev,
      { parameter: '', value: '', unit: '', normalRange: '', isAbnormal: false }
    ]);
  };

  const handleUpdateResultParameter = (idx: number, field: string, val: any) => {
    const updated = [...resultsList];
    updated[idx] = { ...updated[idx], [field]: val };
    setResultsList(updated);
  };

  const handleSaveResultsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrder) {
      updateLabOrder(activeOrder.id, {
        results: resultsList,
        technicianNotes,
        status: 'Completed',
        completedDate: new Date().toISOString().split('T')[0],
        resultsSummary: resultsList.map(r => `${r.parameter}: ${r.value} ${r.unit}`).join(', ')
      });
      setIsResultModalOpen(false);
    }
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogItem = labCatalog.find(c => c.testName === newOrderTestName);
    addLabOrder({
      patientId: newOrderPatientId,
      doctorId: newOrderDoctorId,
      testCatalogId: catalogItem?.id || 'catalog-1',
      testName: newOrderTestName,
      category: catalogItem?.category || 'Hematology',
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      price: catalogItem?.price || 35
    });
    setIsNewOrderModalOpen(false);
  };

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    'In Progress': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Cancelled: 'bg-rose-100 text-rose-800 border-rose-200'
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-600" />
            Diagnostic Laboratory & Investigations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test requisition, specimen tracking, clinical findings entry, and printable diagnostic reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              onClick={() => setActiveTabLocal('orders')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'orders' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Test Orders ({labOrders.length})
            </button>
            <button
              onClick={() => setActiveTabLocal('catalog')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Test Catalog ({labCatalog.length})
            </button>
          </div>

          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Order Lab Test</span>
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <>
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search orders by test name, order number, patient, or physician..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-600"
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-indigo-600"
              >
                <option value="all">Status: All Statuses</option>
                <option value="Pending">Pending Specimen</option>
                <option value="In Progress">In Progress (Testing)</option>
                <option value="Completed">Completed (Results Ready)</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex justify-between text-xs font-semibold text-slate-600">
              <span>{filteredOrders.length} Laboratory Orders</span>
              <span>Click 'Enter Results' or 'Print Report'</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Order ID</th>
                    <th className="py-3 px-4 font-semibold">Diagnostic Test</th>
                    <th className="py-3 px-4 font-semibold">Patient</th>
                    <th className="py-3 px-4 font-semibold">Referring Physician</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No laboratory orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      const pat = getPatient(order.patientId);
                      const doc = getDoctor(order.doctorId);

                      return (
                        <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                          
                          {/* Order ID */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 font-mono text-xs">{order.orderNumber}</div>
                            <div className="text-[10px] text-slate-400">{order.requestedDate}</div>
                          </td>

                          {/* Test Name */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800 text-sm">{order.testName}</div>
                            {order.results && order.results.length > 0 && (
                              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                                ✓ {order.results.length} parameters measured
                              </div>
                            )}
                          </td>

                          {/* Patient */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">{pat?.fullName}</div>
                            <div className="text-[11px] text-slate-500">
                              MRN: <span className="font-mono text-slate-700">{pat?.mrn}</span> • {pat?.age}y ({pat?.gender})
                            </div>
                          </td>

                          {/* Doctor */}
                          <td className="py-3 px-4">
                            <div className="text-slate-800">Dr. {doc?.name}</div>
                            <div className="text-[10px] text-slate-400">{doc?.specialization}</div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {order.status !== 'Completed' ? (
                                <button
                                  onClick={() => handleOpenEnterResults(order)}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs shadow-2xs transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Enter Findings</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => openPrintModal('lab', order)}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-semibold text-xs border border-teal-200 transition-colors"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>Print Report</span>
                                </button>
                              )}
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
        </>
      ) : (
        /* Catalog Tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 font-semibold text-xs text-slate-700">
            Clinic Diagnostic Test Master Directory
          </div>

          <div className="divide-y divide-slate-100">
            {labCatalog.map(test => (
              <div key={test.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{test.testName}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {test.testCode}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {test.category}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-1">
                    Reference Normal: <strong className="text-slate-700">{test.normalRange || 'Standard reference baseline'}</strong> • TAT: {test.turnaroundTime}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Standard Fee</span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {settings.currencySymbol}{test.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enter Results Modal Dialog */}
      {isResultModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Record Laboratory Results</h3>
                <p className="text-xs text-slate-500">
                  {activeOrder.testName} ({activeOrder.orderNumber}) for {getPatient(activeOrder.patientId)?.fullName}
                </p>
              </div>
              <button
                onClick={() => setIsResultModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResultsSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-700">Measured Test Parameters</span>
                <button
                  type="button"
                  onClick={handleAddResultParameter}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  + Add Parameter
                </button>
              </div>

              {resultsList.map((res, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Parameter Name</label>
                      <input
                        type="text"
                        required
                        value={res.parameter}
                        onChange={e => handleUpdateResultParameter(i, 'parameter', e.target.value)}
                        placeholder="e.g. Fasting Glucose"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Measured Value *</label>
                      <input
                        type="text"
                        required
                        value={res.value}
                        onChange={e => handleUpdateResultParameter(i, 'value', e.target.value)}
                        placeholder="e.g. 104"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Unit</label>
                      <input
                        type="text"
                        value={res.unit}
                        onChange={e => handleUpdateResultParameter(i, 'unit', e.target.value)}
                        placeholder="e.g. mg/dL"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Normal Reference Range</label>
                      <input
                        type="text"
                        value={res.normalRange}
                        onChange={e => handleUpdateResultParameter(i, 'normalRange', e.target.value)}
                        placeholder="e.g. 70 - 99"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id={`abn-${i}`}
                      checked={res.isAbnormal}
                      onChange={e => handleUpdateResultParameter(i, 'isAbnormal', e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <label htmlFor={`abn-${i}`} className="text-[11px] font-semibold text-rose-700">
                      Flag as Abnormal / Out-of-Range Clinical Value
                    </label>
                  </div>
                </div>
              ))}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Technician / Pathologist Verified Remarks
                </label>
                <textarea
                  rows={2}
                  value={technicianNotes}
                  onChange={e => setTechnicianNotes(e.target.value)}
                  placeholder="Specimen condition, analytical method, remarks..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResultModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Verify & Mark Completed
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* New Lab Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Create Diagnostic Lab Order</h3>
            <p className="text-xs text-slate-500 mb-4">Requisition diagnostic test for outpatient analysis</p>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  value={newOrderPatientId}
                  onChange={e => setNewOrderPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-indigo-600"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.mrn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Referring Physician *</label>
                <select
                  value={newOrderDoctorId}
                  onChange={e => setNewOrderDoctorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-indigo-600"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Investigation Test *</label>
                <select
                  value={newOrderTestName}
                  onChange={e => setNewOrderTestName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-indigo-600"
                >
                  {labCatalog.map(t => (
                    <option key={t.id} value={t.testName}>{t.testName} — ${t.price} ({t.category})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
