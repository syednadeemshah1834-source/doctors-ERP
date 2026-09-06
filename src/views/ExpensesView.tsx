import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Expense } from '../types';
import { 
  TrendingDown, Plus, Search, Filter, Trash2, 
  DollarSign, Calendar, X, Tag
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, settings } = useClinic();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Medical Supplies');
  const [amount, setAmount] = useState(150);
  const [date, setDate] = useState('2026-09-06');
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer');
  const [notes, setNotes] = useState('');

  const categories: Expense['category'][] = [
    'Rent', 
    'Electricity & Utilities', 
    'Internet & Phone', 
    'Staff Salary', 
    'Medical Supplies', 
    'Equipment & Maintenance', 
    'Office Expenses', 
    'Other'
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      description,
      category,
      amount: Number(amount),
      date,
      paymentMethod,
      notes
    });
    setIsModalOpen(false);
    setDescription('');
    setNotes('');
  };

  const filteredExpenses = expenses.filter(exp => {
    if (filterCategory !== 'all' && exp.category !== filterCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return exp.description.toLowerCase().includes(q) || exp.expenseNumber?.toLowerCase().includes(q);
    }
    return true;
  });

  const totalExpenseAmount = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-rose-600" />
            Clinic Expenditure & Operating Costs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log overheads, utilities, staff payroll, medical supply requisitions, and operational costs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Recorded Clinic Expenditure</span>
          <div className="text-3xl font-bold text-rose-700 mt-1 font-mono">
            {settings.currencySymbol}{totalExpenseAmount.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Across {expenses.length} operating vouchers
          </div>
        </div>

        {/* Quick category distribution badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map(c => {
            const catTotal = expenses.filter(e => e.category === c).reduce((acc, i) => acc + i.amount, 0);
            if (catTotal === 0) return null;
            return (
              <div key={c} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500">{c}:</span>{' '}
                <strong className="text-slate-800 font-mono">${catTotal.toFixed(0)}</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by expense description, voucher reference..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-rose-600"
          />
        </div>

        <div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-rose-600"
          >
            <option value="all">Category: All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex justify-between text-xs font-semibold text-slate-600">
          <span>{filteredExpenses.length} Expense Records</span>
          <span>Financial Operating Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Date & Voucher #</th>
                <th className="py-3 px-4 font-semibold">Expense Description</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Payment Mode</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No matching expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs">
                      <div className="font-bold text-slate-800">{exp.date}</div>
                      <div className="text-[10px] text-slate-400">{exp.expenseNumber}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{exp.description}</div>
                      {exp.notes && <div className="text-[10px] text-slate-400 italic">{exp.notes}</div>}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full font-medium text-[11px] bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {exp.paymentMethod}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-rose-700 text-sm">
                      {settings.currencySymbol}{exp.amount.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Expense Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Record Clinic Expense</h3>
            <p className="text-xs text-slate-500 mb-4">Log operational outlays and clinic disbursements</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Biomedical waste disposal fee"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-rose-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-rose-600"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-sm focus:outline-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Supplier</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Supplier name or voucher details..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg"
                >
                  Save Expense Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
