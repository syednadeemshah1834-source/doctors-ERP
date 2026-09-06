import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { MedicalDocument } from '../types';
import { 
  FolderOpen, Plus, Search, Filter, FileText, 
  Trash2, Download, User, Calendar, X, Tag
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, patients, addMedicalDocument, deleteMedicalDocument, getPatient, showToast } = useClinic();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<MedicalDocument['documentType']>('Laboratory Report');
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [notes, setNotes] = useState('');

  const docTypes: MedicalDocument['documentType'][] = [
    'Laboratory Report', 
    'X-Ray', 
    'Scan', 
    'Discharge Summary', 
    'External Prescription', 
    'Insurance Document', 
    'Other'
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicalDocument({
      title,
      documentType,
      patientId,
      date: new Date().toISOString().split('T')[0],
      fileSize: '1.4 MB',
      notes
    });
    showToast('Medical document uploaded & encrypted in vault', 'success');
    setIsModalOpen(false);
    setTitle('');
    setNotes('');
  };

  const filteredDocs = documents.filter(doc => {
    if (filterType !== 'all' && doc.documentType !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const pat = getPatient(doc.patientId);
      return doc.title.toLowerCase().includes(q) || pat?.fullName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-teal-600" />
            Medical Documents & Diagnostic Vault
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Archival records, radiology reports, referral correspondence, and clinical consent paperwork.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Medical Document</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search documents by document title, patient name..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-600"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-teal-600"
          >
            <option value="all">Document Type: All Types</option>
            {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
            No medical documents found matching your filter criteria.
          </div>
        ) : (
          filteredDocs.map(doc => {
            const pat = getPatient(doc.patientId);

            return (
              <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-teal-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                      {doc.documentType}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">PDF • {doc.fileSize || '1.2 MB'}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-2.5 leading-snug">{doc.title}</h3>

                  <div className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{pat?.fullName || 'Registered Patient'}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({pat?.mrn || 'MRN'})</span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Uploaded: {doc.date}</span>
                  </div>

                  {doc.notes && (
                    <div className="text-[11px] text-slate-500 mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100 italic">
                      "{doc.notes}"
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Verified File
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => showToast(`Document ${doc.title} downloaded securely`, 'info')}
                      className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                      title="Download Medical Record"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        deleteMedicalDocument(doc.id);
                        showToast('Document removed from vault', 'warning');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Upload Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Upload Patient Document</h3>
            <p className="text-xs text-slate-500 mb-4">Store external diagnostic reports or medical imagery</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Brain MRI Radiology Report"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.mrn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Classification</label>
                <select
                  value={documentType}
                  onChange={e => setDocumentType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                >
                  {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Upload Drop Zone Simulation */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <div className="font-semibold text-slate-700">Drag and drop file here, or click to browse</div>
                <div className="text-[10px] text-slate-400 mt-0.5">PDF, PNG, JPG, DICOM up to 25MB</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Remarks / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Referring laboratory, key findings..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
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
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
                >
                  Archive Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
