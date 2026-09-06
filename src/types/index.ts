export type UserRole = 'admin' | 'doctor' | 'receptionist';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  doctorId?: string; // linked if doctor
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Doctor {
  id: string;
  userId?: string;
  name: string;
  specialization: string;
  qualification: string;
  licenseNumber: string;
  phone: string;
  email: string;
  consultationFee: number;
  roomNumber: string;
  workingDays: string[];
  workingHours: string;
  avatar?: string;
  signatureText?: string;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number (e.g. MRN-2026-001)
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  emergencyContactName: string;
  emergencyContactPhone: string;
  allergies: string[];
  existingConditions: string[];
  previousSurgeries: string[];
  familyHistory: string;
  currentMedications: string[];
  notes: string;
  photoUrl?: string;
  createdAt: string;
  isArchived: boolean;
}

export type AppointmentStatus = 'Waiting' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';
export type AppointmentType = 'General Consultation' | 'Follow-up' | 'Emergency' | 'Routine Checkup' | 'Diagnostic Review';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  type: AppointmentType;
  reason: string;
  status: AppointmentStatus;
  tokenNumber?: number;
  notes?: string;
  createdAt: string;
}

export interface Vitals {
  bpSystolic: number;
  bpDiastolic: number;
  pulse: number;
  temperature: number; // in Fahrenheit
  respiratoryRate: number;
  spo2: number; // percentage
  weight: number; // kg
  height: number; // cm
  bmi: number;
}

export interface Consultation {
  id: string;
  consultationNumber: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  vitals: Vitals;
  chiefComplaint: string;
  symptoms: string[];
  presentIllness: string;
  pastHistorySummary?: string;
  physicalExamination: string;
  diagnosis: string;
  doctorNotes: string;
  followUpDate?: string;
  prescriptionId?: string;
  createdAt: string;
}

export interface PrescriptionItem {
  id?: string;
  medicineId?: string;
  medicineName: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity?: number;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  consultationId?: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionItem[];
  laboratoryTestsRecommended?: string[];
  adviceNotes?: string;
  followUpDate?: string;
  createdAt: string;
}

export type MedicineCategory = 
  | 'Antibiotic' 
  | 'Analgesic' 
  | 'Antipyretic' 
  | 'Antihypertensive' 
  | 'Antidiabetic' 
  | 'Antihistamine' 
  | 'Cardiovascular' 
  | 'Gastrointestinal' 
  | 'Vitamins & Supplements' 
  | 'Respiratory'
  | 'Topical' 
  | 'Other';

export type DosageForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Inhaler' | 'Drops';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandName: string;
  category: MedicineCategory;
  strength: string;
  dosageForm: DosageForm;
  manufacturer: string;
  availableQuantity: number;
  minStockLevel: number;
  expiryDate: string; // YYYY-MM-DD
  purchasePrice: number;
  salePrice: number;
  batchNumber: string;
  description?: string;
}

export interface LabTestCatalog {
  id: string;
  testCode: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Radiology' | 'Microbiology' | 'Pathology' | 'Cardiology' | 'Other';
  normalRange?: string;
  price: number;
  turnaroundTime: string;
  description?: string;
}

export type LabOrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface PatientLabOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  doctorId: string;
  testCatalogId: string;
  testName: string;
  category: string;
  requestedDate: string;
  status: LabOrderStatus;
  resultsSummary?: string;
  normalRange?: string;
  findings?: string;
  completedDate?: string;
  price: number;
  results?: { parameter: string; value: string; unit: string; normalRange: string; isAbnormal: boolean }[];
  technicianNotes?: string;
}

export type LabOrder = PatientLabOrder;

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Laboratory' | 'Pharmacy' | 'Procedure' | 'Other';
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Insurance' | 'Digital Wallet';
export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  appointmentId?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  category: 'Rent' | 'Electricity & Utilities' | 'Internet & Phone' | 'Staff Salary' | 'Medical Supplies' | 'Equipment & Maintenance' | 'Office Expenses' | 'Other';
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  recordedByUserId: string;
  recordedByName: string;
  notes?: string;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  title: string;
  documentType: 'Laboratory Report' | 'X-Ray' | 'Scan' | 'Discharge Summary' | 'External Prescription' | 'Insurance Document' | 'Other';
  date: string;
  fileData?: string; // base64 or simulated file text
  fileSize?: string;
  uploadedBy: string;
  notes?: string;
}

export interface FollowUp {
  id: string;
  patientId: string;
  doctorId: string;
  consultationId?: string;
  followUpDate: string;
  reason: string;
  previousDiagnosis: string;
  status: 'Pending' | 'Attended' | 'Missed' | 'Cancelled';
  notes?: string;
  appointmentId?: string;
}

export interface ClinicNotification {
  id: string;
  type: 'appointment' | 'missed_appointment' | 'follow_up' | 'low_stock' | 'expiring_medicine' | 'unpaid_invoice' | 'system';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  date: string;
  isRead: boolean;
  linkTab?: string;
  linkId?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  recordAffected: string;
  timestamp: string;
  details?: string;
}

export interface ClinicSettings {
  clinicName: string;
  tagline: string;
  logoUrl?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  workingDays: string[];
  openTime: string;
  closeTime: string;
  defaultAppointmentDuration: number;
  currency: string;
  currencySymbol: string;
  taxRatePercentage: number;
  invoicePrefix: string;
  prescriptionPrefix: string;
  mrnPrefix: string;
  doctorSignatureNote: string;
  prescriptionHeaderNote: string;
  invoiceFooterNote: string;
}

export interface DatabaseBackup {
  version: string;
  exportedAt: string;
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

export type MainNavTab = 
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'consultations'
  | 'prescriptions'
  | 'medicines'
  | 'laboratory'
  | 'billing'
  | 'expenses'
  | 'reports'
  | 'documents'
  | 'notifications'
  | 'users'
  | 'settings'
  | 'backup'
  | 'audit';
