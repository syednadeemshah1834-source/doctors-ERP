/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PrintModal } from './components/PrintModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Views
import { DashboardView } from './views/DashboardView';
import { PatientsView } from './views/PatientsView';
import { AppointmentsView } from './views/AppointmentsView';
import { ConsultationView } from './views/ConsultationView';
import { PrescriptionsView } from './views/PrescriptionsView';
import { MedicinesView } from './views/MedicinesView';
import { LaboratoryView } from './views/LaboratoryView';
import { BillingView } from './views/BillingView';
import { ExpensesView } from './views/ExpensesView';
import { ReportsView } from './views/ReportsView';
import { DocumentsView } from './views/DocumentsView';
import { NotificationsView } from './views/NotificationsView';
import { UsersView } from './views/UsersView';
import { SettingsView } from './views/SettingsView';
import { BackupRestoreView } from './views/BackupRestoreView';
import { AuditLogsView } from './views/AuditLogsView';

const ClinicAppContent: React.FC = () => {
  const { activeTab } = useClinic();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'patients':
        return <PatientsView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'consultations':
      case 'consultation' as any:
        return <ConsultationView />;
      case 'prescriptions':
        return <PrescriptionsView />;
      case 'medicines':
        return <MedicinesView />;
      case 'laboratory':
        return <LaboratoryView />;
      case 'billing':
        return <BillingView />;
      case 'expenses':
        return <ExpensesView />;
      case 'reports':
        return <ReportsView />;
      case 'documents':
        return <DocumentsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'users':
        return <UsersView />;
      case 'settings':
        return <SettingsView />;
      case 'backup':
        return <BackupRestoreView />;
      case 'audit':
        return <AuditLogsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Clinic Left Navigation Shell */}
      <Sidebar />

      {/* Main Clinical Operational Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Universal Action Header */}
        <Header onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Dynamic Viewport Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Quick Search & Omni-navigator (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* High-Fidelity Medical Document Printing Modal */}
      <PrintModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ClinicProvider>
        <ClinicAppContent />
      </ClinicProvider>
    </AuthProvider>
  );
}
