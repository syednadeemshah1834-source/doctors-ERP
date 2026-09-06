import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Invoice, InvoiceItem, PaymentMethod, PaymentStatus } from '../types';
import { 
  Receipt, Plus, Search, Filter, Printer, DollarSign, 
  CreditCard, CheckCircle2, AlertCircle, Clock, Trash2, 
  X, ChevronRight, ArrowDownRight, Wallet
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const { 
    invoices, patients, doctors, addInvoice, recordPayment, 
    openPrintModal, getPatient, settings 
  } = useClinic();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | PaymentStatus>('all');

  // New Invoice Modal
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [invPatientId, setInvPatientId] = useState(patients[0]?.id || '');
  const [invDiscount, setInvDiscount] = useState(0);
  const [invTax, setInvTax] = useState(0);
  const [invNotes, setInvNotes] = useState('');
  const [invItems, setInvItems] = useState<InvoiceItem[]>([
    { description: 'Physician Outpatient Consultation', quantity: 1, unitPrice: 50, amount: 50 }
  ]);

  // Record Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus !== 'all' && inv.paymentStatus !== filterStatus) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const pat = getPatient(inv.patientId);
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        pat?.fullName.toLowerCase().includes(q) ||
        pat?.mrn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate totals for new invoice
  const invSubtotal = invItems.reduce((acc, it) => acc + it.amount, 0);
  const invTotal = Math.max(0, invSubtotal - invDiscount + invTax);

  const handleAddItemRow = () => {
    setInvItems([...invItems, { description: 'Procedure or Diagnostic Fee', quantity: 1, unitPrice: 30, amount: 30 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setInvItems(invItems.filter((_, i) => i !== index));
  };

  const handleUpdateItemRow = (index: number, field: keyof InvoiceItem, val: any) => {
    const updated = [...invItems];
    const current = { ...updated[index], [field]: val };
    if (field === 'quantity' || field === 'unitPrice') {
      current.amount = Number(current.quantity) * Number(current.unitPrice);
    }
    updated[index] = current;
    setInvItems(updated);
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addInvoice({
      patientId: invPatientId,
      date: '2026-09-06',
      items: invItems,
      discount: Number(invDiscount),
      tax: Number(invTax),
      paidAmount: 0,
      paymentMethod: 'Cash',
      notes: invNotes
    });

    setIsNewInvoiceModalOpen(false);
    openPrintModal('invoice', created);
  };

  const handleOpenRecordPayment = (inv: Invoice) => {
    setActiveInvoice(inv);
    setPaymentAmount(inv.balanceAmount);
    setPaymentMethod(inv.paymentMethod || 'Cash');
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeInvoice && paymentAmount > 0) {
      recordPayment(activeInvoice.id, Number(paymentAmount), paymentMethod);
      setIsPaymentModalOpen(false);
    }
  };

  // Financial summary
  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balanceAmount, 0);

  const statusColors: Record<PaymentStatus, string> = {
    Paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Partial: 'bg-amber-100 text-amber-800 border-amber-200',
    Unpaid: 'bg-rose-100 text-rose-800 border-rose-200'
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-600" />
            Billing, Invoices & Revenue Settlement
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated billing for consultations, pharmacy dispensation, laboratory tests, and receipt printing.
          </p>
        </div>

        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Financial Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Billed Invoices</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {settings.currencySymbol}{totalBilled.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{invoices.length} invoices generated</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue Settled</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {settings.currencySymbol}{totalCollected.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Collected via Cash, Card & Insurance</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outstanding Accounts Receivable</span>
          <div className="text-2xl font-bold text-rose-700 mt-1">
            {settings.currencySymbol}{totalOutstanding.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Unpaid or partially settled balance</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by invoice number, patient name, MRN..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-600"
          />
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-amber-600"
          >
            <option value="all">Payment Status: All</option>
            <option value="Paid">Paid in Full</option>
            <option value="Partial">Partial Settlement</option>
            <option value="Unpaid">Unpaid Balance</option>
          </select>
        </div>
      </div>

      {/* Invoices Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex justify-between text-xs font-semibold text-slate-600">
          <span>{filteredInvoices.length} Invoices</span>
          <span>Click 'Record Payment' or 'Print Receipt'</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Invoice ID</th>
                <th className="py-3 px-4 font-semibold">Patient</th>
                <th className="py-3 px-4 font-semibold">Billed Items</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Paid / Balance</th>
                <th className="py-3 px-4 font-semibold">Status & Method</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => {
                  const pat = getPatient(inv.patientId);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Invoice ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 font-mono text-xs">{inv.invoiceNumber}</div>
                        <div className="text-[10px] text-slate-400">{inv.date}</div>
                      </td>

                      {/* Patient */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{pat?.fullName}</div>
                        <div className="text-[10px] text-slate-400">MRN: {pat?.mrn} • Phone: {pat?.phone}</div>
                      </td>

                      {/* Items breakdown */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-slate-700 truncate" title={inv.items.map(i => i.description).join(', ')}>
                          {inv.items.map(i => i.description).join(', ')}
                        </div>
                        <div className="text-[10px] text-slate-400">{inv.items.length} line item{inv.items.length === 1 ? '' : 's'}</div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                        {settings.currencySymbol}{inv.totalAmount.toFixed(2)}
                      </td>

                      {/* Paid & Balance */}
                      <td className="py-3 px-4 font-mono">
                        <div className="text-emerald-700 font-bold">
                          Paid: {settings.currencySymbol}{inv.paidAmount.toFixed(2)}
                        </div>
                        {inv.balanceAmount > 0 && (
                          <div className="text-rose-700 font-semibold text-[11px]">
                            Bal: {settings.currencySymbol}{inv.balanceAmount.toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${statusColors[inv.paymentStatus]}`}>
                          {inv.paymentStatus}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 capitalize">{inv.paymentMethod}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.balanceAmount > 0 && (
                            <button
                              onClick={() => handleOpenRecordPayment(inv)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-xs shadow-2xs transition-colors"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Collect</span>
                            </button>
                          )}
                          <button
                            onClick={() => openPrintModal('invoice', inv)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs transition-colors"
                            title="Print Official Invoice / Tax Receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
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

      {/* Create New Invoice Modal */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 text-xs">
            
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Generate Clinic Invoice</h3>
                <p className="text-xs text-slate-500">Bill outpatient consultations, diagnostics, or procedures</p>
              </div>
              <button
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={invPatientId}
                  onChange={e => setInvPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-amber-600 text-slate-800"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.mrn}) • Phone: {p.phone}</option>
                  ))}
                </select>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-700">Billed Services & Charges</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-amber-700 font-semibold hover:underline"
                  >
                    + Add Charge Item
                  </button>
                </div>

                <div className="space-y-2">
                  {invItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={e => handleUpdateItemRow(idx, 'description', e.target.value)}
                          placeholder="Service description"
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div className="w-16">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => handleUpdateItemRow(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-center"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          step="0.5"
                          required
                          value={item.unitPrice}
                          onChange={e => handleUpdateItemRow(idx, 'unitPrice', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                        />
                      </div>
                      <div className="w-20 text-right font-mono font-bold text-slate-800 text-xs">
                        ${item.amount.toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={invItems.length === 1}
                        className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount, Tax & Totals */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Amount ($)</label>
                  <input
                    type="number"
                    value={invDiscount}
                    onChange={e => setInvDiscount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tax / Surcharge ($)</label>
                  <input
                    type="number"
                    value={invTax}
                    onChange={e => setInvTax(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-amber-900">Total Payable Amount:</span>
                <span className="font-mono font-bold text-lg text-amber-950">
                  {settings.currencySymbol}{invTotal.toFixed(2)}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Save & Print Invoice
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && activeInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Record Patient Payment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Invoice #{activeInvoice.invoiceNumber} • Remaining Balance: <strong>${activeInvoice.balanceAmount.toFixed(2)}</strong>
            </p>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Receiving ($)</label>
                <input
                  type="number"
                  step="0.5"
                  max={activeInvoice.balanceAmount}
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-base focus:outline-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-amber-600 font-medium"
                >
                  <option value="Cash">Cash (Over the counter)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Insurance">Health Insurance</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg"
                >
                  Confirm Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
