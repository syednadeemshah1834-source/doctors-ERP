import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClinic } from '../context/ClinicContext';
import { UserRole } from '../types';
import { 
  UserCog, Plus, ShieldCheck, Stethoscope, Users, 
  KeyRound, CheckCircle2, Lock, X, Check, ArrowRight
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { usersList, currentUser, switchUser, addUser } = useAuth();
  const { doctors, settings } = useClinic();

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('doctor');
  const [newSpecialization, setNewSpecialization] = useState('General Practice');
  const [newLicense, setNewLicense] = useState('MD-98211');
  const [newFee, setNewFee] = useState(2500);

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      name: newName,
      email: newEmail,
      role: newRole,
      password: 'password123',
      isActive: true,
      doctorId: newRole === 'doctor' ? `doc-${Date.now()}` : undefined
    });
    setIsAddUserModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const roleBadges: Record<UserRole, { label: string; color: string }> = {
    admin: { label: 'Medical Administrator', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    doctor: { label: 'Attending Physician', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    receptionist: { label: 'Clinic Reception & Billing', color: 'bg-amber-100 text-amber-800 border-amber-200' }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCog className="w-5 h-5 text-teal-600" />
            Clinic Staff Access & Role-Based Permissions (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage provider logins, clinical privilege levels, and receptionist workstation access.
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Account</span>
        </button>
      </div>

      {/* Role Matrix Explanation Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Privileges</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Full governance access: Financial reports, staff management, audit logs, clinic settings, and database backups.
          </p>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="font-bold text-teal-300 flex items-center gap-1.5 mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Doctor / Physician Privileges</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Clinical EMR access: Patient SOAP notes, electronic prescriptions, vitals recording, and diagnostic lab orders.
          </p>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
            <Users className="w-4 h-4" />
            <span>Receptionist Privileges</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Front-desk operations: Patient registration, appointment booking, patient lounge check-in, and invoice billing.
          </p>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex justify-between text-xs font-semibold text-slate-700">
          <span>Active Staff Accounts ({usersList.length})</span>
          <span>Click 'Switch to this Account' to test system under different role views</span>
        </div>

        <div className="divide-y divide-slate-100">
          {usersList.map(u => {
            const isSelf = currentUser?.id === u.id;
            const doc = doctors.find(d => d.id === u.doctorId);

            return (
              <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{u.name}</span>
                      {isSelf && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active Session
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{u.email}</div>
                    {doc && (
                      <div className="text-[10px] text-teal-700 font-medium mt-0.5">
                        {doc.specialization} • Room {doc.roomNumber} • Fee: {settings.currencySymbol}{doc.consultationFee}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadges[u.role].color}`}>
                    {roleBadges[u.role].label}
                  </span>

                  {!isSelf && (
                    <button
                      onClick={() => switchUser(u.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
                    >
                      Switch to this User
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Add Clinic Staff Account</h3>
            <p className="text-xs text-slate-500 mb-4">Provision role-based access for clinic team member</p>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Alexander Bell"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Login Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="name@clinic.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Role *</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                >
                  <option value="doctor">Doctor (Clinical EMR & Rx)</option>
                  <option value="receptionist">Receptionist (Front Desk & Billing)</option>
                  <option value="admin">Administrator (Full Governance)</option>
                </select>
              </div>

              {newRole === 'doctor' && (
                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
                  <span className="font-bold text-teal-900 text-xs">Physician Credentials</span>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Clinical Specialization</label>
                    <input
                      type="text"
                      value={newSpecialization}
                      onChange={e => setNewSpecialization(e.target.value)}
                      placeholder="e.g. Dermatology"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Standard Consultation Fee ({settings.currencySymbol.trim()})</label>
                    <input
                      type="number"
                      value={newFee}
                      onChange={e => setNewFee(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
