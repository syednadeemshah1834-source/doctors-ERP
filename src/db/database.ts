import { 
  User, Doctor, Patient, Appointment, Consultation, Prescription, 
  Medicine, LabTestCatalog, PatientLabOrder, Invoice, Expense, 
  MedicalDocument, FollowUp, ClinicNotification, AuditLog, ClinicSettings,
  DatabaseBackup, AppointmentStatus
} from '../types';
import { 
  initialSettings, initialUsers, initialDoctors, initialPatients, 
  initialAppointments, initialConsultations, initialPrescriptions, 
  initialMedicines, initialLabCatalog, initialLabOrders, initialInvoices, 
  initialExpenses, initialDocuments, initialFollowUps, initialNotifications, 
  initialAuditLogs 
} from './seedData';

const DB_STORAGE_KEY = 'CLINICOS_DB_STATE_V1';

export interface DatabaseState {
  users: User[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  consultations: Consultation[];
  prescriptions: Prescription[];
  medicines: Medicine[];
  labCatalog: LabTestCatalog[];
  labOrders: PatientLabOrder[];
  invoices: Invoice[];
  expenses: Expense[];
  documents: MedicalDocument[];
  followUps: FollowUp[];
  notifications: ClinicNotification[];
  auditLogs: AuditLog[];
  settings: ClinicSettings;
}

export function getInitialDatabaseState(): DatabaseState {
  try {
    const stored = localStorage.getItem(DB_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.patients) && Array.isArray(parsed.appointments)) {
        // Upgrade legacy currency from USD ($) to PKR if present in existing user localStorage
        if (parsed.settings) {
          if (!parsed.settings.currency || parsed.settings.currency === 'USD' || parsed.settings.currencySymbol === '$') {
            parsed.settings.currency = 'PKR';
            parsed.settings.currencySymbol = 'PKR ';

            // If doctors still had USD fees (< 500), update default catalogs to PKR
            if (parsed.doctors && parsed.doctors[0] && parsed.doctors[0].consultationFee < 500) {
              parsed.doctors = initialDoctors;
              parsed.medicines = initialMedicines;
              parsed.labCatalog = initialLabCatalog;
              parsed.invoices = initialInvoices;
              parsed.expenses = initialExpenses;
            }
            localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(parsed));
          }
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading clinic database from localStorage:', e);
  }

  return {
    users: initialUsers,
    doctors: initialDoctors,
    patients: initialPatients,
    appointments: initialAppointments,
    consultations: initialConsultations,
    prescriptions: initialPrescriptions,
    medicines: initialMedicines,
    labCatalog: initialLabCatalog,
    labOrders: initialLabOrders,
    invoices: initialInvoices,
    expenses: initialExpenses,
    documents: initialDocuments,
    followUps: initialFollowUps,
    notifications: initialNotifications,
    auditLogs: initialAuditLogs,
    settings: initialSettings
  };
}

export function saveDatabaseState(state: DatabaseState): void {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving clinic database state:', e);
  }
}

export function clearDatabaseState(): void {
  try {
    localStorage.removeItem(DB_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing clinic database state:', e);
  }
}
