import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Patient, Doctor, Appointment, Consultation, Prescription, PrescriptionItem,
  Medicine, LabTestCatalog, PatientLabOrder, Invoice, InvoiceItem, Expense, 
  MedicalDocument, FollowUp, ClinicNotification, AuditLog, ClinicSettings,
  MainNavTab, DatabaseBackup, AppointmentStatus, Vitals, PaymentMethod
} from '../types';
import { 
  getInitialDatabaseState, saveDatabaseState, DatabaseState, clearDatabaseState 
} from '../db/database';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  title?: string;
}

export interface PrintModalData {
  type: 'prescription' | 'invoice' | 'lab' | 'patient_summary';
  data: any;
}

interface ClinicContextType {
  // Navigation & UI state
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab, meta?: any) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  activeConsultationAppointmentId: string | null;
  setActiveConsultationAppointmentId: (id: string | null) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  
  // Modals & Overlays
  printModalData: PrintModalData | null;
  openPrintModal: (type: PrintModalData['type'], data: any) => void;
  closePrintModal: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  removeToast: (id: string) => void;

  // Database collections
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  consultations: Consultation[];
  prescriptions: Prescription[];
  medicines: Medicine[];
  labCatalog: LabTestCatalog[];
  labTests: LabTestCatalog[];
  labOrders: PatientLabOrder[];
  invoices: Invoice[];
  expenses: Expense[];
  documents: MedicalDocument[];
  followUps: FollowUp[];
  notifications: ClinicNotification[];
  auditLogs: AuditLog[];
  settings: ClinicSettings;

  // Relational lookups
  getPatient: (id: string) => Patient | undefined;
  getDoctor: (id: string) => Doctor | undefined;
  getAppointment: (id: string) => Appointment | undefined;
  getConsultation: (id: string) => Consultation | undefined;
  getPrescription: (id: string) => Prescription | undefined;

  // Patient Actions
  addPatient: (patient: Omit<Patient, 'id' | 'mrn' | 'createdAt' | 'isArchived'>) => Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  archivePatient: (id: string) => void;

  // Appointment Actions
  checkDoctorAvailability: (doctorId: string, date: string, time: string, duration?: number, excludeId?: string) => { available: boolean; conflictingAppointment?: Appointment };
  addAppointment: (apt: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt'>) => { success: boolean; appointment?: Appointment; error?: string };
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  setAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;

  // Consultation & EMR Actions
  saveConsultationWorkflow: (payload: {
    appointmentId?: string;
    patientId: string;
    doctorId: string;
    vitals: Vitals;
    chiefComplaint: string;
    symptoms: string[];
    presentIllness: string;
    physicalExamination: string;
    diagnosis: string;
    doctorNotes: string;
    followUpDate?: string;
    prescriptions: Omit<PrescriptionItem, 'id'>[];
    laboratoryTestsRecommended?: string[];
    adviceNotes?: string;
    createInvoice?: boolean;
  }) => { consultation: Consultation; prescription?: Prescription };
  addConsultation: (payload: any) => { consultation: Consultation; prescription?: Prescription };

  // Prescription Actions
  addPrescription: (prescription: Omit<Prescription, 'id' | 'prescriptionNumber' | 'createdAt'>) => Prescription;
  updatePrescription: (id: string, data: Partial<Prescription>) => void;

  // Medicine Actions
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Medicine;
  updateMedicine: (id: string, data: Partial<Medicine>) => void;
  adjustMedicineStock: (id: string, deltaQty: number, reason: string) => void;
  deleteMedicine: (id: string) => void;

  // Laboratory Actions
  addLabOrder: (order: Omit<PatientLabOrder, 'id' | 'orderNumber'>) => PatientLabOrder;
  updateLabOrder: (id: string, data: Partial<PatientLabOrder>) => void;
  addLabCatalogItem: (item: Omit<LabTestCatalog, 'id'>) => void;

  // Billing Actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => Invoice;
  recordInvoicePayment: (invoiceId: string, amount: number, method: PaymentMethod, notes?: string) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // Expense Actions
  addExpense: (expense: Omit<Expense, 'id' | 'expenseNumber' | 'recordedByUserId' | 'recordedByName'>) => Expense;
  deleteExpense: (id: string) => void;

  // Document Actions
  addMedicalDocument: (doc: Omit<MedicalDocument, 'id' | 'uploadedBy'>) => MedicalDocument;
  deleteMedicalDocument: (id: string) => void;

  // FollowUp Actions
  addFollowUp: (followUp: Omit<FollowUp, 'id'>) => FollowUp;
  updateFollowUpStatus: (id: string, status: FollowUp['status']) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // Settings
  updateSettings: (newSettings: Partial<ClinicSettings>) => void;

  // Backup & Restore
  exportBackup: () => string;
  restoreBackup: (backupJson: string) => { success: boolean; error?: string };
  resetToInitialSeeds: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [dbState, setDbState] = useState<DatabaseState>(getInitialDatabaseState);

  // Navigation state
  const [activeTab, setActiveTabState] = useState<MainNavTab>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [activeConsultationAppointmentId, setActiveConsultationAppointmentId] = useState<string | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Modals & Toasts
  const [printModalData, setPrintModalData] = useState<PrintModalData | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist dbState
  useEffect(() => {
    saveDatabaseState(dbState);
  }, [dbState]);

  // Periodic stock & expiry notification check
  useEffect(() => {
    const today = new Date();
    const newNotifications: ClinicNotification[] = [];

    // Check low stock
    dbState.medicines.forEach(med => {
      if (med.availableQuantity <= med.minStockLevel) {
        const alreadyExists = dbState.notifications.some(
          n => n.type === 'low_stock' && n.linkId === med.id && !n.isRead
        );
        if (!alreadyExists) {
          newNotifications.push({
            id: `notif-stock-${med.id}-${Date.now()}`,
            type: 'low_stock',
            title: `Low Medicine Stock: ${med.brandName || med.name}`,
            message: `Only ${med.availableQuantity} units left (threshold: ${med.minStockLevel}). Place reorder.`,
            severity: 'critical',
            date: new Date().toISOString(),
            isRead: false,
            linkTab: 'medicines',
            linkId: med.id
          });
        }
      }

      // Check expiry within 30 days
      const expDate = new Date(med.expiryDate);
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30 && diffDays > 0) {
        const alreadyExists = dbState.notifications.some(
          n => n.type === 'expiring_medicine' && n.linkId === med.id && !n.isRead
        );
        if (!alreadyExists) {
          newNotifications.push({
            id: `notif-exp-${med.id}-${Date.now()}`,
            type: 'expiring_medicine',
            title: `Expiring Medicine: ${med.brandName || med.name}`,
            message: `Batch ${med.batchNumber} expires in ${diffDays} days (${med.expiryDate}).`,
            severity: 'warning',
            date: new Date().toISOString(),
            isRead: false,
            linkTab: 'medicines',
            linkId: med.id
          });
        }
      }
    });

    if (newNotifications.length > 0) {
      setDbState(prev => ({
        ...prev,
        notifications: [...newNotifications, ...prev.notifications]
      }));
    }
  }, [dbState.medicines]);

  // Toast helpers
  const showToast = (message: string, type: ToastMessage['type'] = 'info', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setActiveTab = (tab: MainNavTab | string, meta?: any) => {
    const normalizedTab = (tab === 'consultation' ? 'consultations' : tab) as MainNavTab;
    if (meta?.patientId) {
      setSelectedPatientId(meta.patientId);
    }
    if (meta?.appointmentId) {
      setActiveConsultationAppointmentId(meta.appointmentId);
    }
    setActiveTabState(normalizedTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPrintModal = (type: PrintModalData['type'], data: any) => {
    setPrintModalData({ type, data });
  };

  const closePrintModal = () => {
    setPrintModalData(null);
  };

  // Helper audit logger
  const logAudit = (action: string, module: string, recordAffected: string, details?: string) => {
    const audit: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser?.id || 'system',
      userName: currentUser?.name || 'System User',
      userRole: currentUser?.role || 'staff',
      action,
      module,
      recordAffected,
      timestamp: new Date().toISOString(),
      details
    };
    setDbState(prev => ({
      ...prev,
      auditLogs: [audit, ...prev.auditLogs]
    }));
  };

  // Lookups
  const getPatient = (id: string) => dbState.patients.find(p => p.id === id);
  const getDoctor = (id: string) => dbState.doctors.find(d => d.id === id);
  const getAppointment = (id: string) => dbState.appointments.find(a => a.id === id);
  const getConsultation = (id: string) => dbState.consultations.find(c => c.id === id);
  const getPrescription = (id: string) => dbState.prescriptions.find(p => p.id === id);

  // Patient CRUD
  const addPatient = (patientData: Omit<Patient, 'id' | 'mrn' | 'createdAt' | 'isArchived'>): Patient => {
    const count = dbState.patients.length + 1;
    const mrn = `${dbState.settings.mrnPrefix}${String(count).padStart(3, '0')}`;
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      mrn,
      createdAt: new Date().toISOString(),
      isArchived: false
    };

    setDbState(prev => ({
      ...prev,
      patients: [newPatient, ...prev.patients]
    }));

    logAudit('CREATE_PATIENT', 'Patients', `${newPatient.fullName} (${mrn})`, 'New patient registered in clinic');
    showToast(`Patient ${newPatient.fullName} registered successfully with ID ${mrn}`, 'success', 'Patient Created');
    return newPatient;
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    const target = dbState.patients.find(p => p.id === id);
    if (!target) return;
    setDbState(prev => ({
      ...prev,
      patients: prev.patients.map(p => p.id === id ? { ...p, ...data } : p)
    }));
    logAudit('UPDATE_PATIENT', 'Patients', `${target.fullName} (${target.mrn})`, 'Patient profile and medical record updated');
    showToast(`Updated record for ${target.fullName}`, 'success');
  };

  const deletePatient = (id: string) => {
    const target = dbState.patients.find(p => p.id === id);
    if (!target) return;
    setDbState(prev => ({
      ...prev,
      patients: prev.patients.filter(p => p.id !== id)
    }));
    logAudit('DELETE_PATIENT', 'Patients', `${target.fullName} (${target.mrn})`, 'Permanently deleted patient record');
    showToast(`Patient ${target.fullName} deleted`, 'warning');
  };

  const archivePatient = (id: string) => {
    const target = dbState.patients.find(p => p.id === id);
    if (!target) return;
    setDbState(prev => ({
      ...prev,
      patients: prev.patients.map(p => p.id === id ? { ...p, isArchived: !p.isArchived } : p)
    }));
    logAudit('ARCHIVE_PATIENT', 'Patients', `${target.fullName} (${target.mrn})`, `Toggled archive status to ${!target.isArchived}`);
    showToast(`Patient ${target.fullName} ${target.isArchived ? 'unarchived' : 'archived'}`, 'info');
  };

  // Appointment Double Booking Check & CRUD
  const checkDoctorAvailability = (doctorId: string, date: string, time: string, duration = 30, excludeId?: string) => {
    const parseMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const reqStart = parseMinutes(time);
    const reqEnd = reqStart + duration;

    const conflict = dbState.appointments.find(apt => {
      if (apt.id === excludeId) return false;
      if (apt.doctorId !== doctorId) return false;
      if (apt.date !== date) return false;
      if (apt.status === 'Cancelled') return false;

      const aptStart = parseMinutes(apt.time);
      const aptEnd = aptStart + (apt.durationMinutes || 30);

      // Overlap check
      return (reqStart < aptEnd && reqEnd > aptStart);
    });

    return {
      available: !conflict,
      conflictingAppointment: conflict
    };
  };

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt'>) => {
    const availability = checkDoctorAvailability(aptData.doctorId, aptData.date, aptData.time, aptData.durationMinutes);
    if (!availability.available) {
      const doctor = getDoctor(aptData.doctorId);
      return {
        success: false,
        error: `Doctor ${doctor?.name || ''} already has an active appointment at ${availability.conflictingAppointment?.time} on this date. Double booking prevented.`
      };
    }

    const count = dbState.appointments.length + 1;
    const aptNumber = `APT-2026-${String(count).padStart(3, '0')}`;
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      appointmentNumber: aptNumber,
      tokenNumber: count,
      createdAt: new Date().toISOString()
    };

    setDbState(prev => ({
      ...prev,
      appointments: [newApt, ...prev.appointments]
    }));

    const pat = getPatient(aptData.patientId);
    const doc = getDoctor(aptData.doctorId);
    logAudit('CREATE_APPOINTMENT', 'Appointments', `${aptNumber} (${pat?.fullName || 'Patient'})`, `Scheduled with ${doc?.name || 'Doctor'} on ${aptData.date} ${aptData.time}`);
    showToast(`Appointment ${aptNumber} scheduled for ${pat?.fullName || 'Patient'}`, 'success', 'Appointment Confirmed');
    return { success: true, appointment: newApt };
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    setDbState(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === id ? { ...a, ...data } : a)
    }));
    logAudit('UPDATE_APPOINTMENT', 'Appointments', `Appointment ${id}`, 'Updated appointment schedule or notes');
    showToast('Appointment updated successfully', 'success');
  };

  const setAppointmentStatus = (id: string, status: AppointmentStatus) => {
    const apt = dbState.appointments.find(a => a.id === id);
    if (!apt) return;
    setDbState(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === id ? { ...a, status } : a)
    }));
    logAudit('APPOINTMENT_STATUS_CHANGE', 'Appointments', apt.appointmentNumber, `Status changed from ${apt.status} to ${status}`);
    showToast(`Appointment status updated to ${status}`, 'info');
  };

  const deleteAppointment = (id: string) => {
    const apt = dbState.appointments.find(a => a.id === id);
    if (!apt) return;
    setDbState(prev => ({
      ...prev,
      appointments: prev.appointments.filter(a => a.id !== id)
    }));
    logAudit('DELETE_APPOINTMENT', 'Appointments', apt.appointmentNumber, 'Cancelled and removed appointment');
    showToast('Appointment deleted', 'warning');
  };

  // Comprehensive Doctor Consultation / EMR Workflow
  const saveConsultationWorkflow = (payload: {
    appointmentId?: string;
    patientId: string;
    doctorId: string;
    vitals: Vitals;
    chiefComplaint: string;
    symptoms: string[];
    presentIllness: string;
    physicalExamination: string;
    diagnosis: string;
    doctorNotes: string;
    followUpDate?: string;
    prescriptions: Omit<PrescriptionItem, 'id'>[];
    laboratoryTestsRecommended?: string[];
    adviceNotes?: string;
    createInvoice?: boolean;
  }) => {
    const conCount = dbState.consultations.length + 1;
    const conNumber = `CON-2026-${String(conCount).padStart(3, '0')}`;
    const conId = `con-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const currentDate = nowIso.split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let createdPrescription: Prescription | undefined = undefined;

    // 1. Create Prescription if medicines prescribed
    if (payload.prescriptions.length > 0) {
      const rxCount = dbState.prescriptions.length + 1;
      const rxNumber = `${dbState.settings.prescriptionPrefix}${String(rxCount).padStart(3, '0')}`;
      const rxId = `rx-${Date.now()}`;

      createdPrescription = {
        id: rxId,
        prescriptionNumber: rxNumber,
        consultationId: conId,
        patientId: payload.patientId,
        doctorId: payload.doctorId,
        date: currentDate,
        diagnosis: payload.diagnosis,
        medicines: payload.prescriptions.map((item, idx) => ({
          ...item,
          id: `rxi-${Date.now()}-${idx}`
        })),
        laboratoryTestsRecommended: payload.laboratoryTestsRecommended,
        adviceNotes: payload.adviceNotes,
        followUpDate: payload.followUpDate,
        createdAt: nowIso
      };

      // Deduct medicine inventory if linked to catalog
      payload.prescriptions.forEach(pItem => {
        if (pItem.medicineId) {
          adjustMedicineStock(pItem.medicineId, -1, `Prescribed in ${rxNumber}`);
        }
      });
    }

    // 2. Create Consultation object
    const newConsultation: Consultation = {
      id: conId,
      consultationNumber: conNumber,
      appointmentId: payload.appointmentId,
      patientId: payload.patientId,
      doctorId: payload.doctorId,
      date: currentDate,
      time: currentTime,
      vitals: payload.vitals,
      chiefComplaint: payload.chiefComplaint,
      symptoms: payload.symptoms,
      presentIllness: payload.presentIllness,
      physicalExamination: payload.physicalExamination,
      diagnosis: payload.diagnosis,
      doctorNotes: payload.doctorNotes,
      followUpDate: payload.followUpDate,
      prescriptionId: createdPrescription?.id,
      createdAt: nowIso
    };

    // 3. Create Lab Orders if tests requested
    const newLabOrders: PatientLabOrder[] = [];
    if (payload.laboratoryTestsRecommended && payload.laboratoryTestsRecommended.length > 0) {
      payload.laboratoryTestsRecommended.forEach((testName, i) => {
        const catalogMatch = dbState.labCatalog.find(c => c.testName.toLowerCase() === testName.toLowerCase());
        newLabOrders.push({
          id: `lbo-${Date.now()}-${i}`,
          orderNumber: `LAB-2026-${String(dbState.labOrders.length + i + 1).padStart(3, '0')}`,
          patientId: payload.patientId,
          doctorId: payload.doctorId,
          testCatalogId: catalogMatch?.id || `custom-${i}`,
          testName: testName,
          category: catalogMatch?.category || 'General',
          requestedDate: currentDate,
          status: 'Pending',
          price: catalogMatch?.price || 30
        });
      });
    }

    // 4. Create FollowUp if follow-up date specified
    let newFollowUp: FollowUp | undefined;
    if (payload.followUpDate) {
      newFollowUp = {
        id: `fol-${Date.now()}`,
        patientId: payload.patientId,
        doctorId: payload.doctorId,
        consultationId: conId,
        followUpDate: payload.followUpDate,
        reason: `Review after consultation: ${payload.diagnosis}`,
        previousDiagnosis: payload.diagnosis,
        status: 'Pending',
        notes: payload.doctorNotes || 'Routine clinical follow-up'
      };
    }

    // 5. Automatic Billing Invoice generation
    let newInvoice: Invoice | undefined;
    if (payload.createInvoice !== false) {
      const doc = getDoctor(payload.doctorId);
      const invoiceItems: InvoiceItem[] = [
        {
          id: `ii-con-${Date.now()}`,
          description: `Doctor Consultation - ${doc?.name || 'Physician'} (${payload.diagnosis})`,
          category: 'Consultation',
          quantity: 1,
          unitPrice: doc?.consultationFee || 75,
          total: doc?.consultationFee || 75
        }
      ];

      // Add lab tests to invoice
      newLabOrders.forEach(lo => {
        invoiceItems.push({
          id: `ii-lab-${lo.id}`,
          description: `Diagnostic Lab: ${lo.testName}`,
          category: 'Laboratory',
          quantity: 1,
          unitPrice: lo.price,
          total: lo.price
        });
      });

      const subtotal = invoiceItems.reduce((acc, it) => acc + it.total, 0);
      const taxRate = dbState.settings.taxRatePercentage || 5;
      const taxAmount = Number(((subtotal * taxRate) / 100).toFixed(2));
      const totalAmount = Number((subtotal + taxAmount).toFixed(2));

      newInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `${dbState.settings.invoicePrefix}${String(dbState.invoices.length + 1).padStart(3, '0')}`,
        patientId: payload.patientId,
        appointmentId: payload.appointmentId,
        date: currentDate,
        dueDate: currentDate,
        items: invoiceItems,
        subtotal,
        discountPercentage: 0,
        discountAmount: 0,
        taxPercentage: taxRate,
        taxAmount,
        totalAmount,
        paidAmount: 0,
        balanceAmount: totalAmount,
        paymentMethod: 'Cash',
        paymentStatus: 'Unpaid',
        notes: `Generated automatically from Consultation ${conNumber}`,
        createdAt: nowIso
      };
    }

    // Atomic State Update
    setDbState(prev => {
      const updatedAppointments = payload.appointmentId 
        ? prev.appointments.map(a => a.id === payload.appointmentId ? { ...a, status: 'Completed' as AppointmentStatus } : a)
        : prev.appointments;

      return {
        ...prev,
        consultations: [newConsultation, ...prev.consultations],
        prescriptions: createdPrescription ? [createdPrescription, ...prev.prescriptions] : prev.prescriptions,
        labOrders: newLabOrders.length > 0 ? [...newLabOrders, ...prev.labOrders] : prev.labOrders,
        followUps: newFollowUp ? [newFollowUp, ...prev.followUps] : prev.followUps,
        invoices: newInvoice ? [newInvoice, ...prev.invoices] : prev.invoices,
        appointments: updatedAppointments
      };
    });

    const pat = getPatient(payload.patientId);
    logAudit('SAVE_CONSULTATION', 'Consultations', `${conNumber} (${pat?.fullName || 'Patient'})`, `Diagnosis: ${payload.diagnosis}. Rx and billing initialized.`);
    showToast(`Consultation ${conNumber} saved successfully for ${pat?.fullName || 'Patient'}`, 'success', 'Consultation Completed');

    return {
      consultation: newConsultation,
      prescription: createdPrescription
    };
  };

  // Prescription CRUD
  const addPrescription = (rxData: Omit<Prescription, 'id' | 'prescriptionNumber' | 'createdAt'>): Prescription => {
    const rxCount = dbState.prescriptions.length + 1;
    const rxNumber = `${dbState.settings.prescriptionPrefix}${String(rxCount).padStart(3, '0')}`;
    const newRx: Prescription = {
      ...rxData,
      id: `rx-${Date.now()}`,
      prescriptionNumber: rxNumber,
      createdAt: new Date().toISOString()
    };
    setDbState(prev => ({
      ...prev,
      prescriptions: [newRx, ...prev.prescriptions]
    }));
    logAudit('CREATE_PRESCRIPTION', 'Prescriptions', rxNumber, `Issued for patient ID ${rxData.patientId}`);
    showToast(`Prescription ${rxNumber} generated`, 'success');
    return newRx;
  };

  const updatePrescription = (id: string, data: Partial<Prescription>) => {
    setDbState(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.map(p => p.id === id ? { ...p, ...data } : p)
    }));
    logAudit('UPDATE_PRESCRIPTION', 'Prescriptions', id, 'Prescription items or notes revised');
    showToast('Prescription updated', 'success');
  };

  // Medicine Inventory CRUD
  const addMedicine = (medData: Omit<Medicine, 'id'>): Medicine => {
    const newMed: Medicine = {
      ...medData,
      id: `med-${Date.now()}`
    };
    setDbState(prev => ({
      ...prev,
      medicines: [newMed, ...prev.medicines]
    }));
    logAudit('ADD_MEDICINE', 'Pharmacy', newMed.name, `Added to catalog with batch ${newMed.batchNumber}`);
    showToast(`Medicine ${newMed.brandName || newMed.name} added to pharmacy catalog`, 'success');
    return newMed;
  };

  const updateMedicine = (id: string, data: Partial<Medicine>) => {
    setDbState(prev => ({
      ...prev,
      medicines: prev.medicines.map(m => m.id === id ? { ...m, ...data } : m)
    }));
    logAudit('UPDATE_MEDICINE', 'Pharmacy', id, 'Medicine details or pricing updated');
    showToast('Medicine details updated', 'success');
  };

  const adjustMedicineStock = (id: string, deltaQty: number, reason: string) => {
    setDbState(prev => ({
      ...prev,
      medicines: prev.medicines.map(m => {
        if (m.id === id) {
          const newQty = Math.max(0, m.availableQuantity + deltaQty);
          return { ...m, availableQuantity: newQty };
        }
        return m;
      })
    }));
    logAudit('STOCK_ADJUSTMENT', 'Pharmacy', id, `Adjusted by ${deltaQty > 0 ? '+' : ''}${deltaQty}. Reason: ${reason}`);
  };

  const deleteMedicine = (id: string) => {
    const med = dbState.medicines.find(m => m.id === id);
    if (!med) return;
    setDbState(prev => ({
      ...prev,
      medicines: prev.medicines.filter(m => m.id !== id)
    }));
    logAudit('DELETE_MEDICINE', 'Pharmacy', med.name, 'Removed from inventory');
    showToast(`Medicine ${med.name} removed`, 'warning');
  };

  // Lab Orders & Catalog
  const addLabOrder = (orderData: Omit<PatientLabOrder, 'id' | 'orderNumber'>): PatientLabOrder => {
    const orderNumber = `LAB-2026-${String(dbState.labOrders.length + 1).padStart(3, '0')}`;
    const newOrder: PatientLabOrder = {
      ...orderData,
      id: `lbo-${Date.now()}`,
      orderNumber
    };
    setDbState(prev => ({
      ...prev,
      labOrders: [newOrder, ...prev.labOrders]
    }));
    logAudit('CREATE_LAB_ORDER', 'Laboratory', orderNumber, `Ordered test: ${orderData.testName}`);
    showToast(`Lab order ${orderNumber} created`, 'success');
    return newOrder;
  };

  const updateLabOrder = (id: string, data: Partial<PatientLabOrder>) => {
    setDbState(prev => ({
      ...prev,
      labOrders: prev.labOrders.map(lo => lo.id === id ? { ...lo, ...data } : lo)
    }));
    logAudit('UPDATE_LAB_ORDER', 'Laboratory', id, 'Updated test results or status');
    showToast('Lab test order updated', 'success');
  };

  const addLabCatalogItem = (itemData: Omit<LabTestCatalog, 'id'>) => {
    const newItem: LabTestCatalog = {
      ...itemData,
      id: `lab-cat-${Date.now()}`
    };
    setDbState(prev => ({
      ...prev,
      labCatalog: [...prev.labCatalog, newItem]
    }));
    logAudit('ADD_LAB_TEST_CATALOG', 'Laboratory', newItem.testName, 'Added new test to laboratory catalog');
    showToast(`Lab test ${newItem.testName} added`, 'success');
  };

  // Billing & Payments
  const addInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>): Invoice => {
    const invNumber = `${dbState.settings.invoicePrefix}${String(dbState.invoices.length + 1).padStart(3, '0')}`;
    const newInvoice: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      createdAt: new Date().toISOString()
    };
    setDbState(prev => ({
      ...prev,
      invoices: [newInvoice, ...prev.invoices]
    }));
    logAudit('CREATE_INVOICE', 'Billing', invNumber, `Invoice generated for patient ID ${invData.patientId}. Total: $${invData.totalAmount}`);
    showToast(`Invoice ${invNumber} created`, 'success', 'Invoice Generated');
    return newInvoice;
  };

  const recordInvoicePayment = (invoiceId: string, amount: number, method: PaymentMethod, notes?: string) => {
    const inv = dbState.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    const newPaid = Number((inv.paidAmount + amount).toFixed(2));
    const newBalance = Math.max(0, Number((inv.totalAmount - newPaid).toFixed(2)));
    const status: Invoice['paymentStatus'] = newBalance <= 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';

    setDbState(prev => ({
      ...prev,
      invoices: prev.invoices.map(i => i.id === invoiceId ? {
        ...i,
        paidAmount: newPaid,
        balanceAmount: newBalance,
        paymentStatus: status,
        paymentMethod: method,
        notes: notes ? `${i.notes ? i.notes + ' | ' : ''}${notes}` : i.notes
      } : i)
    }));

    logAudit('RECORD_PAYMENT', 'Billing', inv.invoiceNumber, `Recorded payment of $${amount} via ${method}. Remaining balance: $${newBalance}`);
    showToast(`Payment of $${amount} recorded for ${inv.invoiceNumber} (${status})`, 'success', 'Payment Accepted');
  };

  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    setDbState(prev => ({
      ...prev,
      invoices: prev.invoices.map(i => i.id === id ? { ...i, ...data } : i)
    }));
    logAudit('UPDATE_INVOICE', 'Billing', id, 'Revised invoice particulars');
    showToast('Invoice details updated', 'success');
  };

  const deleteInvoice = (id: string) => {
    const inv = dbState.invoices.find(i => i.id === id);
    if (!inv) return;
    setDbState(prev => ({
      ...prev,
      invoices: prev.invoices.filter(i => i.id !== id)
    }));
    logAudit('DELETE_INVOICE', 'Billing', inv.invoiceNumber, 'Deleted invoice record');
    showToast('Invoice deleted', 'warning');
  };

  // Expenses CRUD
  const addExpense = (expData: Omit<Expense, 'id' | 'expenseNumber' | 'recordedByUserId' | 'recordedByName'>): Expense => {
    const expNumber = `EXP-2026-${String(dbState.expenses.length + 1).padStart(3, '0')}`;
    const newExp: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
      expenseNumber: expNumber,
      recordedByUserId: currentUser?.id || 'u-1',
      recordedByName: currentUser?.name || 'Clinic Staff'
    };
    setDbState(prev => ({
      ...prev,
      expenses: [newExp, ...prev.expenses]
    }));
    logAudit('ADD_EXPENSE', 'Expenses', expNumber, `Logged expense $${newExp.amount} for ${newExp.category}`);
    showToast(`Expense ${expNumber} ($${newExp.amount}) recorded`, 'success');
    return newExp;
  };

  const deleteExpense = (id: string) => {
    const exp = dbState.expenses.find(e => e.id === id);
    if (!exp) return;
    setDbState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
    logAudit('DELETE_EXPENSE', 'Expenses', exp.expenseNumber, 'Deleted expense entry');
    showToast('Expense removed', 'warning');
  };

  // Medical Documents
  const addMedicalDocument = (docData: Omit<MedicalDocument, 'id' | 'uploadedBy'>): MedicalDocument => {
    const newDoc: MedicalDocument = {
      ...docData,
      id: `doc-item-${Date.now()}`,
      uploadedBy: currentUser?.name || 'Clinic Staff'
    };
    setDbState(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents]
    }));
    logAudit('UPLOAD_DOCUMENT', 'Documents', newDoc.title, `Uploaded document for patient ID ${newDoc.patientId}`);
    showToast(`Document "${newDoc.title}" attached`, 'success');
    return newDoc;
  };

  const deleteMedicalDocument = (id: string) => {
    const doc = dbState.documents.find(d => d.id === id);
    if (!doc) return;
    setDbState(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
    logAudit('DELETE_DOCUMENT', 'Documents', doc.title, 'Removed medical attachment');
    showToast('Document deleted', 'warning');
  };

  // Follow-ups
  const addFollowUp = (folData: Omit<FollowUp, 'id'>): FollowUp => {
    const newFol: FollowUp = {
      ...folData,
      id: `fol-${Date.now()}`
    };
    setDbState(prev => ({
      ...prev,
      followUps: [newFol, ...prev.followUps]
    }));
    logAudit('SCHEDULE_FOLLOW_UP', 'Follow-up', `Date: ${folData.followUpDate}`, `Patient ID: ${folData.patientId}`);
    showToast(`Follow-up scheduled for ${folData.followUpDate}`, 'success');
    return newFol;
  };

  const updateFollowUpStatus = (id: string, status: FollowUp['status']) => {
    setDbState(prev => ({
      ...prev,
      followUps: prev.followUps.map(f => f.id === id ? { ...f, status } : f)
    }));
    logAudit('UPDATE_FOLLOW_UP', 'Follow-up', id, `Status updated to ${status}`);
    showToast(`Follow-up status marked as ${status}`, 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setDbState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }));
  };

  const markAllNotificationsRead = () => {
    setDbState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, isRead: true }))
    }));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id: string) => {
    setDbState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  };

  // Settings
  const updateSettings = (newSettings: Partial<ClinicSettings>) => {
    setDbState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
    logAudit('UPDATE_SETTINGS', 'Settings', 'Clinic Configuration', 'Updated clinic profile and preferences');
    showToast('Clinic settings updated successfully', 'success');
  };

  // Backup & Restore
  const exportBackup = (): string => {
    const backup: DatabaseBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      ...dbState
    };
    logAudit('DATABASE_BACKUP_EXPORT', 'Backup & Restore', 'Full Database Snapshot', 'Exported JSON backup archive');
    return JSON.stringify(backup, null, 2);
  };

  const restoreBackup = (backupJson: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(backupJson);
      if (!parsed || !Array.isArray(parsed.patients) || !Array.isArray(parsed.appointments)) {
        return { success: false, error: 'Invalid backup file format. Required relational tables are missing.' };
      }
      setDbState({
        users: parsed.users || dbState.users,
        doctors: parsed.doctors || dbState.doctors,
        patients: parsed.patients,
        appointments: parsed.appointments,
        consultations: parsed.consultations || [],
        prescriptions: parsed.prescriptions || [],
        medicines: parsed.medicines || [],
        labCatalog: parsed.labCatalog || [],
        labOrders: parsed.labOrders || [],
        invoices: parsed.invoices || [],
        expenses: parsed.expenses || [],
        documents: parsed.documents || [],
        followUps: parsed.followUps || [],
        notifications: parsed.notifications || [],
        auditLogs: [
          {
            id: `aud-${Date.now()}`,
            userId: currentUser?.id || 'system',
            userName: currentUser?.name || 'Admin',
            userRole: currentUser?.role || 'admin',
            action: 'DATABASE_RESTORE',
            module: 'Backup & Restore',
            recordAffected: 'All Tables',
            timestamp: new Date().toISOString(),
            details: `Restored database from snapshot exported at ${parsed.exportedAt || 'unknown'}`
          },
          ...(parsed.auditLogs || [])
        ],
        settings: parsed.settings || dbState.settings
      });
      showToast('Database successfully restored from backup', 'success', 'Restore Completed');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to parse JSON backup file.' };
    }
  };

  const resetToInitialSeeds = () => {
    clearDatabaseState();
    const fresh = getInitialDatabaseState();
    setDbState(fresh);
    logAudit('SYSTEM_RESET', 'Backup & Restore', 'Factory Reset', 'Database reset to initial clinical seeds');
    showToast('Clinic database reset to initial demonstration state', 'info', 'Database Reset');
  };

  return (
    <ClinicContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedPatientId,
      setSelectedPatientId,
      activeConsultationAppointmentId,
      setActiveConsultationAppointmentId,
      isGlobalSearchOpen,
      setIsGlobalSearchOpen,
      printModalData,
      openPrintModal,
      closePrintModal,
      toasts,
      showToast,
      removeToast,

      patients: dbState.patients,
      doctors: dbState.doctors,
      appointments: dbState.appointments,
      consultations: dbState.consultations,
      prescriptions: dbState.prescriptions,
      medicines: dbState.medicines,
      labCatalog: dbState.labCatalog,
      labTests: dbState.labCatalog,
      labOrders: dbState.labOrders,
      invoices: dbState.invoices,
      expenses: dbState.expenses,
      documents: dbState.documents,
      followUps: dbState.followUps,
      notifications: dbState.notifications,
      auditLogs: dbState.auditLogs,
      settings: dbState.settings,

      getPatient,
      getDoctor,
      getAppointment,
      getConsultation,
      getPrescription,

      addPatient,
      updatePatient,
      deletePatient,
      archivePatient,

      checkDoctorAvailability,
      addAppointment,
      updateAppointment,
      setAppointmentStatus,
      deleteAppointment,

      saveConsultationWorkflow,
      addConsultation: saveConsultationWorkflow,
      addPrescription,
      updatePrescription,

      addMedicine,
      updateMedicine,
      adjustMedicineStock,
      deleteMedicine,

      addLabOrder,
      updateLabOrder,
      addLabCatalogItem,

      addInvoice,
      recordInvoicePayment,
      updateInvoice,
      deleteInvoice,

      addExpense,
      deleteExpense,

      addMedicalDocument,
      deleteMedicalDocument,

      addFollowUp,
      updateFollowUpStatus,

      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,

      updateSettings,
      exportBackup,
      restoreBackup,
      resetToInitialSeeds
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
