import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Medicine } from '../types';
import { 
  Pill, Plus, Search, AlertCircle, AlertTriangle, 
  Edit, Trash2, CheckCircle2, X, ArrowUpRight, 
  Filter, Package, RefreshCw
} from 'lucide-react';

export const MedicinesView: React.FC = () => {
  const { medicines, addMedicine, updateMedicine, deleteMedicine, adjustMedicineStock, settings } = useClinic();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'low' | 'expiring'>('all');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [stockAdjustmentQuantity, setStockAdjustmentQuantity] = useState(20);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brandName: '',
    category: 'Antibiotic',
    strength: '500mg',
    dosageForm: 'Tablet' as Medicine['dosageForm'],
    manufacturer: 'Pfizer Inc.',
    availableQuantity: 50,
    minStockLevel: 20,
    expiryDate: '2027-12-31',
    purchasePrice: 0.50,
    salePrice: 1.50,
    batchNumber: 'BATCH-2026-X',
    description: ''
  });

  const handleOpenAdd = () => {
    setSelectedMed(null);
    setFormData({
      name: '',
      genericName: '',
      brandName: '',
      category: 'Antibiotic',
      strength: '500mg',
      dosageForm: 'Tablet',
      manufacturer: '',
      availableQuantity: 50,
      minStockLevel: 20,
      expiryDate: '2027-12-31',
      purchasePrice: 0.50,
      salePrice: 1.50,
      batchNumber: `BATCH-${Date.now().toString().slice(-5)}`,
      description: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (med: Medicine) => {
    setSelectedMed(med);
    setFormData({
      name: med.name,
      genericName: med.genericName,
      brandName: med.brandName,
      category: med.category,
      strength: med.strength,
      dosageForm: med.dosageForm,
      manufacturer: med.manufacturer,
      availableQuantity: med.availableQuantity,
      minStockLevel: med.minStockLevel,
      expiryDate: med.expiryDate,
      purchasePrice: med.purchasePrice,
      salePrice: med.salePrice,
      batchNumber: med.batchNumber,
      description: med.description || ''
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMed) {
      updateMedicine(selectedMed.id, formData);
    } else {
      addMedicine(formData);
    }
    setIsFormOpen(false);
  };

  const handleStockAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMed) {
      adjustMedicineStock(selectedMed.id, Number(stockAdjustmentQuantity), 'Manual inventory adjustment / replenishment');
      setIsStockModalOpen(false);
    }
  };

  // Filter medicines
  const filteredMedicines = medicines.filter(m => {
    const isLowStock = m.availableQuantity <= m.minStockLevel;
    const isExpiringSoon = new Date(m.expiryDate).getTime() - new Date().getTime() < 180 * 24 * 60 * 60 * 1000;

    if (filterStockStatus === 'low' && !isLowStock) return false;
    if (filterStockStatus === 'expiring' && !isExpiringSoon) return false;

    if (filterCategory !== 'all' && m.category !== filterCategory) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.brandName.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.batchNumber.toLowerCase().includes(q)
      );
    }

    return true;
  });

  // Extract categories
  const categories = Array.from(new Set(medicines.map(m => m.category)));
  const lowStockCount = medicines.filter(m => m.availableQuantity <= m.minStockLevel).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            Clinic Pharmacy & Medicine Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stock control, batch monitoring, expiry surveillance, and pricing management.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Medicine</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-4 text-xs text-rose-900">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              <strong>{lowStockCount} Medicine{lowStockCount > 1 ? 's are' : ' is'} below minimum safe threshold.</strong> Restock needed to prevent prescription dispensing interruptions.
            </span>
          </div>
          <button
            onClick={() => setFilterStockStatus(filterStockStatus === 'low' ? 'all' : 'low')}
            className="px-3 py-1 bg-rose-200/70 hover:bg-rose-200 text-rose-900 font-bold rounded-lg shrink-0 transition-colors"
          >
            {filterStockStatus === 'low' ? 'Show All Items' : 'Filter Low Stock Items'}
          </button>
        </div>
      )}

      {/* Control Bar: Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search medicine by brand, generic name, batch, or manufacturer..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-600"
          />
        </div>

        <div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-teal-600"
          >
            <option value="all">Category: All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <select
            value={filterStockStatus}
            onChange={e => setFilterStockStatus(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-teal-600"
          >
            <option value="all">Stock Filter: All Items</option>
            <option value="low">Critical Low Stock Only</option>
            <option value="expiring">Expiring Soon Only</option>
          </select>
        </div>

      </div>

      {/* Master Medicines Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex justify-between text-xs font-semibold text-slate-600">
          <span>{filteredMedicines.length} Medicines in Dispensary Catalog</span>
          <span>Automatic stock decrement upon consultation dispensing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Medicine / Brand</th>
                <th className="py-3 px-4 font-semibold">Generic & Category</th>
                <th className="py-3 px-4 font-semibold">Form & Strength</th>
                <th className="py-3 px-4 font-semibold">Batch & Expiry</th>
                <th className="py-3 px-4 font-semibold">Stock Level</th>
                <th className="py-3 px-4 font-semibold">Unit Price</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No medications found matching search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map(med => {
                  const isLow = med.availableQuantity <= med.minStockLevel;

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{med.brandName || med.name}</div>
                        <div className="text-[11px] text-slate-400">{med.manufacturer}</div>
                      </td>

                      {/* Generic & Category */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{med.genericName}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          {med.category}
                        </span>
                      </td>

                      {/* Form & Strength */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{med.strength}</span>
                        <div className="text-[11px] text-slate-500">{med.dosageForm}</div>
                      </td>

                      {/* Batch & Expiry */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="text-slate-700">{med.batchNumber}</div>
                        <div className="text-slate-400 text-[10px]">Exp: {med.expiryDate}</div>
                      </td>

                      {/* Stock Level with Badge */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full border ${
                            isLow ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          }`}>
                            {med.availableQuantity} units
                          </span>
                          {isLow && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Min Safe: {med.minStockLevel}</div>
                      </td>

                      {/* Unit Price */}
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-slate-900">{settings.currencySymbol}{med.salePrice.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400">Cost: {settings.currencySymbol}{med.purchasePrice.toFixed(2)}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedMed(med);
                              setStockAdjustmentQuantity(20);
                              setIsStockModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Adjust / Replenish Stock"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(med)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Medicine Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMedicine(med.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Medicine"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Medicine Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedMed ? `Edit Medicine: ${selectedMed.name}` : 'Add Medicine to Inventory'}
                </h3>
                <p className="text-xs text-slate-500">Dispensary particulars and pricing details</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Generic Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.genericName}
                    onChange={e => setFormData({ ...formData, genericName: e.target.value, name: formData.name || e.target.value })}
                    placeholder="e.g. Amoxicillin"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="e.g. Amoxil"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Therapeutic Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Antibiotic, Antihypertensive"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
                  <select
                    value={formData.dosageForm}
                    onChange={e => setFormData({ ...formData, dosageForm: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Drops">Drops</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Strength (Dosage)</label>
                  <input
                    type="text"
                    value={formData.strength}
                    onChange={e => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="e.g. 500mg, 10ml, 5mg/ml"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g. Pfizer, GSK, Novartis"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>

              {/* Stock, Expiry, Batch */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.availableQuantity}
                    onChange={e => setFormData({ ...formData, availableQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Minimum Alert Level</label>
                  <input
                    type="number"
                    value={formData.minStockLevel}
                    onChange={e => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purchase / Cost Price ({settings.currencySymbol.trim()})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={e => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling / Retail Price ({settings.currencySymbol.trim()})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={e => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
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
                  {selectedMed ? 'Save Changes' : 'Add to Inventory'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isStockModalOpen && selectedMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 animate-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base mb-1">Adjust Inventory Stock</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add or remove stock for <strong>{selectedMed.brandName || selectedMed.name}</strong>. Current level: {selectedMed.availableQuantity} units.
            </p>

            <form onSubmit={handleStockAdjustSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Adjustment Units (+ to restock, - to write off)
                </label>
                <input
                  type="number"
                  required
                  value={stockAdjustmentQuantity}
                  onChange={e => setStockAdjustmentQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm focus:outline-teal-600 font-bold"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600">
                New resulting inventory balance will be:{' '}
                <strong className="text-teal-700 font-mono text-xs">
                  {selectedMed.availableQuantity + Number(stockAdjustmentQuantity)} units
                </strong>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
                >
                  Apply Stock Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
