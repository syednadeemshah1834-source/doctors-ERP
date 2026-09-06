import { 
  User, Doctor, Patient, Appointment, Consultation, Prescription, 
  Medicine, LabTestCatalog, PatientLabOrder, Invoice, Expense, 
  MedicalDocument, FollowUp, ClinicNotification, AuditLog, ClinicSettings 
} from '../types';

export const initialSettings: ClinicSettings = {
  clinicName: 'Apex Family & Specialty Medical Clinic',
  tagline: 'Comprehensive Outpatient Healthcare & Diagnostic Center',
  logoUrl: '',
  address: '742 Medical Plaza Parkway, Suite 300, Metropolis',
  phone: '+1 (555) 234-8900',
  email: 'care@apexclinicmed.com',
  website: 'https://apexclinicmed.com',
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  openTime: '08:00',
  closeTime: '18:00',
  defaultAppointmentDuration: 30,
  currency: 'PKR',
  currencySymbol: 'PKR ',
  taxRatePercentage: 5,
  invoicePrefix: 'INV-2026-',
  prescriptionPrefix: 'RX-2026-',
  mrnPrefix: 'MRN-2026-',
  doctorSignatureNote: 'Digitally authenticated under licensed clinical supervision.',
  prescriptionHeaderNote: 'Please present this prescription when collecting medications from registered pharmacies.',
  invoiceFooterNote: 'Thank you for entrusting Apex Medical with your care. For clinical inquiries, call +1 (555) 234-8900.'
};

export const initialUsers: User[] = [
  {
    id: 'u-1',
    username: 'admin',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@apexclinicmed.com',
    role: 'admin',
    phone: '+1 (555) 019-2831',
    doctorId: 'doc-3',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    lastLogin: '2026-09-06T08:15:00Z'
  },
  {
    id: 'u-2',
    username: 'drmarcus',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@apexclinicmed.com',
    role: 'doctor',
    phone: '+1 (555) 019-3344',
    doctorId: 'doc-1',
    isActive: true,
    createdAt: '2026-01-05T09:00:00Z',
    lastLogin: '2026-09-06T08:45:00Z'
  },
  {
    id: 'u-3',
    username: 'dremily',
    name: 'Dr. Emily Chen',
    email: 'emily.chen@apexclinicmed.com',
    role: 'doctor',
    phone: '+1 (555) 019-7711',
    doctorId: 'doc-2',
    isActive: true,
    createdAt: '2026-01-10T10:00:00Z',
    lastLogin: '2026-09-05T17:20:00Z'
  },
  {
    id: 'u-4',
    username: 'reception',
    name: 'Olivia Perez',
    email: 'olivia.perez@apexclinicmed.com',
    role: 'receptionist',
    phone: '+1 (555) 019-9922',
    isActive: true,
    createdAt: '2026-02-01T08:30:00Z',
    lastLogin: '2026-09-06T07:55:00Z'
  }
];

export const initialDoctors: Doctor[] = [
  {
    id: 'doc-1',
    userId: 'u-2',
    name: 'Dr. Marcus Vance',
    specialization: 'Cardiovascular & Internal Medicine',
    qualification: 'MD, FACC, Board Certified',
    licenseNumber: 'MD-NY-78291',
    phone: '+1 (555) 019-3344',
    email: 'marcus.vance@apexclinicmed.com',
    consultationFee: 2500,
    roomNumber: 'Consultation Suite 101',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '08:30 - 16:30',
    signatureText: 'Dr. Marcus Vance, MD, FACC'
  },
  {
    id: 'doc-2',
    userId: 'u-3',
    name: 'Dr. Emily Chen',
    specialization: 'Endocrinology & Diabetology',
    qualification: 'MD, FACE, Fellowship Endocrine',
    licenseNumber: 'MD-NY-94302',
    phone: '+1 (555) 019-7711',
    email: 'emily.chen@apexclinicmed.com',
    consultationFee: 2800,
    roomNumber: 'Consultation Suite 102',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    workingHours: '09:00 - 17:00',
    signatureText: 'Dr. Emily Chen, MD, FACE'
  },
  {
    id: 'doc-3',
    userId: 'u-1',
    name: 'Dr. Sarah Jenkins',
    specialization: 'General Medicine & Family Practice',
    qualification: 'MBBS, MD (Family Med), Medical Director',
    licenseNumber: 'MD-NY-61029',
    phone: '+1 (555) 019-2831',
    email: 'sarah.jenkins@apexclinicmed.com',
    consultationFee: 2200,
    roomNumber: 'Executive Suite 103',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    workingHours: '08:00 - 15:00',
    signatureText: 'Dr. Sarah Jenkins, MD, Medical Director'
  }
];

export const initialPatients: Patient[] = [
  {
    id: 'pat-1',
    mrn: 'MRN-2026-001',
    fullName: 'Johnathan Hayes',
    gender: 'Male',
    dob: '1972-04-14',
    age: 54,
    phone: '+1 (555) 831-2940',
    email: 'j.hayes@providermail.com',
    address: '142 Elmwood Terrace, Apt 4B, Metropolis',
    bloodGroup: 'O+',
    emergencyContactName: 'Clara Hayes (Wife)',
    emergencyContactPhone: '+1 (555) 831-2945',
    allergies: ['Penicillin', 'Sulfa drugs'],
    existingConditions: ['Essential Hypertension', 'Mild Hyperlipidemia'],
    previousSurgeries: ['Appendectomy (2014)'],
    familyHistory: 'Father had myocardial infarction at age 60; Mother had Type 2 Diabetes.',
    currentMedications: ['Amlodipine 5mg OD', 'Atorvastatin 10mg HS'],
    notes: 'Compliant with medications. Prefers morning appointments.',
    createdAt: '2026-01-12T10:00:00Z',
    isArchived: false
  },
  {
    id: 'pat-2',
    mrn: 'MRN-2026-002',
    fullName: 'Eleanor Vance',
    gender: 'Female',
    dob: '1988-11-20',
    age: 37,
    phone: '+1 (555) 442-1892',
    email: 'eleanor.v@cloudweb.com',
    address: '89 Northridge Boulevard, Metropolis',
    bloodGroup: 'A+',
    emergencyContactName: 'Thomas Vance (Brother)',
    emergencyContactPhone: '+1 (555) 442-9900',
    allergies: ['NSAIDs (Aspirin)', 'Latex'],
    existingConditions: ['Moderate Persistent Asthma', 'Allergic Rhinitis'],
    previousSurgeries: ['Cesarean section (2020)'],
    familyHistory: 'Maternal history of asthma and seasonal allergies.',
    currentMedications: ['Salbutamol Inhaler PRN', 'Cetirizine 10mg OD'],
    notes: 'Exacerbation noted during pollen season. Peak flow monitored.',
    createdAt: '2026-01-20T11:30:00Z',
    isArchived: false
  },
  {
    id: 'pat-3',
    mrn: 'MRN-2026-003',
    fullName: 'Michael Chen',
    gender: 'Male',
    dob: '1964-08-05',
    age: 62,
    phone: '+1 (555) 902-3341',
    email: 'm.chen64@fastinbox.net',
    address: '304 Riverdale Crescent, Metropolis',
    bloodGroup: 'B+',
    emergencyContactName: 'Grace Chen (Daughter)',
    emergencyContactPhone: '+1 (555) 902-3349',
    allergies: ['None known'],
    existingConditions: ['Type 2 Diabetes Mellitus (HbA1c 7.8%)', 'Diabetic Neuropathy'],
    previousSurgeries: ['Coronary angioplasty with DES stent (2022)'],
    familyHistory: 'Strong familial predisposition to coronary artery disease.',
    currentMedications: ['Metformin 850mg BD', 'Aspirin 81mg OD', 'Empagliflozin 10mg OD'],
    notes: 'Quarterly diabetic foot checks and nephropathy screening active.',
    createdAt: '2026-02-02T14:15:00Z',
    isArchived: false
  },
  {
    id: 'pat-4',
    mrn: 'MRN-2026-004',
    fullName: 'Sophia Rodriguez',
    gender: 'Female',
    dob: '1997-03-18',
    age: 29,
    phone: '+1 (555) 310-8821',
    email: 'sophia.r@designerstudios.com',
    address: '517 High Street, Floor 3, Metropolis',
    bloodGroup: 'O-',
    emergencyContactName: 'Carlos Rodriguez (Father)',
    emergencyContactPhone: '+1 (555) 310-8800',
    allergies: ['Amoxicillin (Skin rash)'],
    existingConditions: ['Chronic Episodic Migraines', 'Iron Deficiency Anemia'],
    previousSurgeries: ['Tonsillectomy (2010)'],
    familyHistory: 'Mother suffers from classic migraines with visual aura.',
    currentMedications: ['Ferrous Sulfate 200mg OD', 'Sumatriptan 50mg PRN'],
    notes: 'Triggered by stress and irregular sleep. Responds well to hydration.',
    createdAt: '2026-02-14T09:00:00Z',
    isArchived: false
  },
  {
    id: 'pat-5',
    mrn: 'MRN-2026-005',
    fullName: 'David Kim',
    gender: 'Male',
    dob: '1981-06-30',
    age: 45,
    phone: '+1 (555) 773-6190',
    email: 'david.kim@fintechgroup.org',
    address: '12 West Oak Avenue, Metropolis',
    bloodGroup: 'AB+',
    emergencyContactName: 'Hanna Kim (Spouse)',
    emergencyContactPhone: '+1 (555) 773-6199',
    allergies: ['None known'],
    existingConditions: ['Hyperuricemia / Gout', 'Metabolic Syndrome'],
    previousSurgeries: ['Knee arthroscopy (2018)'],
    familyHistory: 'Paternal hyperuricemia and gouty arthritis.',
    currentMedications: ['Allopurinol 100mg OD'],
    notes: 'Advised on dietary purine restriction and adequate fluid intake.',
    createdAt: '2026-02-28T16:00:00Z',
    isArchived: false
  },
  {
    id: 'pat-6',
    mrn: 'MRN-2026-006',
    fullName: 'Aaliyah Patel',
    gender: 'Female',
    dob: '1975-09-12',
    age: 51,
    phone: '+1 (555) 629-4411',
    email: 'aaliyah.patel@educatorshub.org',
    address: '772 Maplewood Way, Metropolis',
    bloodGroup: 'A-',
    emergencyContactName: 'Dev Patel (Son)',
    emergencyContactPhone: '+1 (555) 629-4419',
    allergies: ['Ciprofloxacin'],
    existingConditions: ['Primary Hypothyroidism', 'Bilateral Knee Osteoarthritis'],
    previousSurgeries: ['Gallbladder cholecystectomy (2019)'],
    familyHistory: 'Thyroid disorder prevalent on maternal side.',
    currentMedications: ['Levothyroxine 75mcg OD (empty stomach)', 'Glucosamine 500mg'],
    notes: 'TSH labs every 6 months. Currently euthyroid.',
    createdAt: '2026-03-01T10:45:00Z',
    isArchived: false
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    appointmentNumber: 'APT-2026-001',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    date: '2026-09-06',
    time: '09:00',
    durationMinutes: 30,
    type: 'Routine Checkup',
    reason: 'Hypertension follow-up and prescription refill',
    status: 'Completed',
    tokenNumber: 1,
    notes: 'BP stabilized on current dose',
    createdAt: '2026-09-01T09:00:00Z'
  },
  {
    id: 'apt-2',
    appointmentNumber: 'APT-2026-002',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    date: '2026-09-06',
    time: '09:45',
    durationMinutes: 30,
    type: 'General Consultation',
    reason: 'Wheezing and chest tightness for 3 days',
    status: 'Completed',
    tokenNumber: 2,
    notes: 'Peak flow measured at 360 L/min',
    createdAt: '2026-09-02T11:00:00Z'
  },
  {
    id: 'apt-3',
    appointmentNumber: 'APT-2026-003',
    patientId: 'pat-3',
    doctorId: 'doc-2',
    date: '2026-09-06',
    time: '10:30',
    durationMinutes: 30,
    type: 'Follow-up',
    reason: 'Glycemic control review and quarterly lab assessment',
    status: 'Waiting',
    tokenNumber: 3,
    notes: 'Patient checked in at reception desk, vitals pending',
    createdAt: '2026-09-03T14:20:00Z'
  },
  {
    id: 'apt-4',
    appointmentNumber: 'APT-2026-004',
    patientId: 'pat-4',
    doctorId: 'doc-3',
    date: '2026-09-06',
    time: '11:15',
    durationMinutes: 30,
    type: 'General Consultation',
    reason: 'Severe throbbing headache with photophobia',
    status: 'Confirmed',
    tokenNumber: 4,
    notes: 'Arriving with accompanied driver',
    createdAt: '2026-09-04T16:00:00Z'
  },
  {
    id: 'apt-5',
    appointmentNumber: 'APT-2026-005',
    patientId: 'pat-5',
    doctorId: 'doc-1',
    date: '2026-09-06',
    time: '14:00',
    durationMinutes: 30,
    type: 'Follow-up',
    reason: 'Left great toe joint pain, suspected gout flare',
    status: 'Confirmed',
    tokenNumber: 5,
    createdAt: '2026-09-05T10:00:00Z'
  },
  {
    id: 'apt-6',
    appointmentNumber: 'APT-2026-006',
    patientId: 'pat-6',
    doctorId: 'doc-2',
    date: '2026-09-06',
    time: '15:00',
    durationMinutes: 30,
    type: 'Routine Checkup',
    reason: 'Six-month thyroid review and fatigue assessment',
    status: 'Confirmed',
    tokenNumber: 6,
    createdAt: '2026-09-05T11:30:00Z'
  }
];

export const initialConsultations: Consultation[] = [
  {
    id: 'con-1',
    consultationNumber: 'CON-2026-001',
    appointmentId: 'apt-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    date: '2026-09-06',
    time: '09:25',
    vitals: {
      bpSystolic: 128,
      bpDiastolic: 82,
      pulse: 72,
      temperature: 98.4,
      respiratoryRate: 16,
      spo2: 99,
      weight: 84.5,
      height: 178,
      bmi: 26.7
    },
    chiefComplaint: 'Routine blood pressure review, reports occasional mild evening ankle swelling.',
    symptoms: ['Mild bilateral ankle edema', 'No chest pain', 'No shortness of breath'],
    presentIllness: 'Known hypertensive patient on Amlodipine 5mg. Taking meds regularly. Home BP readings averaging 125-132 systolic.',
    pastHistorySummary: 'Hypertension diagnosed 2021. Penicillin allergy.',
    physicalExamination: 'Cardiovascular: S1, S2 audible, no murmurs. Lungs: Clear to auscultation bilaterally. Extremities: Trace pretibial edema +1.',
    diagnosis: 'Primary Essential Hypertension (Well Controlled) with mild peripheral vasodilatory edema',
    doctorNotes: 'BP well managed. Mild edema likely Amlodipine-related. Consider adding low-dose ARB if swelling persists.',
    followUpDate: '2026-10-06',
    prescriptionId: 'rx-1',
    createdAt: '2026-09-06T09:25:00Z'
  },
  {
    id: 'con-2',
    consultationNumber: 'CON-2026-002',
    appointmentId: 'apt-2',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    date: '2026-09-06',
    time: '10:10',
    vitals: {
      bpSystolic: 118,
      bpDiastolic: 76,
      pulse: 88,
      temperature: 98.8,
      respiratoryRate: 20,
      spo2: 97,
      weight: 62.0,
      height: 165,
      bmi: 22.8
    },
    chiefComplaint: 'Mild wheeze, non-productive cough, chest tightness worsened at night.',
    symptoms: ['Expiratory wheezing', 'Nocturnal cough', 'Throat tickle'],
    presentIllness: 'Symptoms started 3 days ago following yard cleanup. Used rescue inhaler twice with moderate relief.',
    pastHistorySummary: 'Moderate bronchial asthma. Allergic to Aspirin.',
    physicalExamination: 'Chest: Bilateral scattered expiratory wheezes, no crackles. Good air entry. ENT: Pharyngeal injection without exudate.',
    diagnosis: 'Acute Mild Exacerbation of Bronchial Asthma (Allergen induced)',
    doctorNotes: 'Short 5-day course of inhaled corticosteroid combination suggested to suppress airway hyperresponsiveness.',
    followUpDate: '2026-09-13',
    prescriptionId: 'rx-2',
    createdAt: '2026-09-06T10:10:00Z'
  }
];

export const initialPrescriptions: Prescription[] = [
  {
    id: 'rx-1',
    prescriptionNumber: 'RX-2026-001',
    consultationId: 'con-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    date: '2026-09-06',
    diagnosis: 'Primary Essential Hypertension (Well Controlled)',
    medicines: [
      {
        id: 'rxi-1',
        medicineId: 'med-3',
        medicineName: 'Amlodipine Besylate',
        genericName: 'Amlodipine',
        dosage: '5 mg',
        frequency: '1-0-0 (Once daily in morning)',
        duration: '30 Days',
        instructions: 'Take with or after breakfast with full glass of water.'
      },
      {
        id: 'rxi-2',
        medicineId: 'med-4',
        medicineName: 'Atorvastatin Calcium',
        genericName: 'Atorvastatin',
        dosage: '10 mg',
        frequency: '0-0-1 (At bedtime)',
        duration: '30 Days',
        instructions: 'Take at night before sleep.'
      }
    ],
    laboratoryTestsRecommended: ['Lipid Panel Profile', 'Serum Creatinine & Electrolytes'],
    adviceNotes: 'Continue low-sodium DASH diet. Keep a twice-weekly blood pressure log.',
    followUpDate: '2026-10-06',
    createdAt: '2026-09-06T09:25:00Z'
  },
  {
    id: 'rx-2',
    prescriptionNumber: 'RX-2026-002',
    consultationId: 'con-2',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    date: '2026-09-06',
    diagnosis: 'Acute Mild Exacerbation of Bronchial Asthma',
    medicines: [
      {
        id: 'rxi-3',
        medicineId: 'med-7',
        medicineName: 'Salbutamol HFA Inhaler',
        genericName: 'Albuterol / Salbutamol',
        dosage: '100 mcg (2 Puffs)',
        frequency: 'As needed (PRN) every 4-6 hours',
        duration: '14 Days',
        instructions: 'Rinse mouth after each use. Use spacer for optimal delivery.'
      },
      {
        id: 'rxi-4',
        medicineId: 'med-10',
        medicineName: 'Cetirizine HCl',
        genericName: 'Cetirizine',
        dosage: '10 mg',
        frequency: '0-0-1 (Nightly)',
        duration: '7 Days',
        instructions: 'Take at night; may cause mild drowsiness.'
      }
    ],
    laboratoryTestsRecommended: ['Peak Expiratory Flow Rate Log'],
    adviceNotes: 'Avoid known allergens and cold air exposure. Seek urgent care if breathless at rest.',
    followUpDate: '2026-09-13',
    createdAt: '2026-09-06T10:10:00Z'
  }
];

export const initialMedicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'Amoxil 500',
    genericName: 'Amoxicillin Trihydrate',
    brandName: 'Amoxil',
    category: 'Antibiotic',
    strength: '500 mg',
    dosageForm: 'Capsule',
    manufacturer: 'GlaxoSmithKline',
    availableQuantity: 120,
    minStockLevel: 25,
    expiryDate: '2027-05-30',
    purchasePrice: 70,
    salePrice: 160,
    batchNumber: 'AMX-2025-09'
  },
  {
    id: 'med-2',
    name: 'Glucophage 850',
    genericName: 'Metformin Hydrochloride',
    brandName: 'Glucophage',
    category: 'Antidiabetic',
    strength: '850 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Merck Healthcare',
    availableQuantity: 240,
    minStockLevel: 50,
    expiryDate: '2027-11-15',
    purchasePrice: 45,
    salePrice: 110,
    batchNumber: 'GLU-2025-44'
  },
  {
    id: 'med-3',
    name: 'Norvasc 5',
    genericName: 'Amlodipine Besylate',
    brandName: 'Norvasc',
    category: 'Antihypertensive',
    strength: '5 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Pfizer Inc.',
    availableQuantity: 180,
    minStockLevel: 40,
    expiryDate: '2028-02-28',
    purchasePrice: 60,
    salePrice: 140,
    batchNumber: 'NOR-2025-18'
  },
  {
    id: 'med-4',
    name: 'Lipitor 20',
    genericName: 'Atorvastatin Calcium',
    brandName: 'Lipitor',
    category: 'Cardiovascular',
    strength: '20 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Viatris Pharmaceuticals',
    availableQuantity: 150,
    minStockLevel: 30,
    expiryDate: '2027-08-30',
    purchasePrice: 120,
    salePrice: 260,
    batchNumber: 'LIP-2025-11'
  },
  {
    id: 'med-5',
    name: 'Panadol Extra',
    genericName: 'Paracetamol / Acetaminophen',
    brandName: 'Panadol',
    category: 'Antipyretic',
    strength: '500 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Haleon Medical',
    availableQuantity: 400,
    minStockLevel: 80,
    expiryDate: '2028-04-10',
    purchasePrice: 15,
    salePrice: 35,
    batchNumber: 'PAN-2025-88'
  },
  {
    id: 'med-6',
    name: 'Losec 20',
    genericName: 'Omeprazole Delayed-Release',
    brandName: 'Losec',
    category: 'Gastrointestinal',
    strength: '20 mg',
    dosageForm: 'Capsule',
    manufacturer: 'AstraZeneca',
    availableQuantity: 95,
    minStockLevel: 30,
    expiryDate: '2027-03-20',
    purchasePrice: 110,
    salePrice: 240,
    batchNumber: 'LOS-2025-02'
  },
  {
    id: 'med-7',
    name: 'Ventolin HFA',
    genericName: 'Salbutamol Sulfate',
    brandName: 'Ventolin',
    category: 'Respiratory',
    strength: '100 mcg / dose',
    dosageForm: 'Inhaler',
    manufacturer: 'GlaxoSmithKline',
    availableQuantity: 4, // LOW STOCK TRIGGER!
    minStockLevel: 15,
    expiryDate: '2026-12-15',
    purchasePrice: 350,
    salePrice: 650,
    batchNumber: 'VEN-2024-91'
  },
  {
    id: 'med-8',
    name: 'Zithromax 500',
    genericName: 'Azithromycin Dihydrate',
    brandName: 'Zithromax',
    category: 'Antibiotic',
    strength: '500 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Pfizer Inc.',
    availableQuantity: 65,
    minStockLevel: 20,
    expiryDate: '2026-09-28', // EXPIRING SOON TRIGGER! (within 30 days)
    purchasePrice: 280,
    salePrice: 520,
    batchNumber: 'ZIT-2024-12'
  },
  {
    id: 'med-9',
    name: 'Brufen 400',
    genericName: 'Ibuprofen',
    brandName: 'Brufen',
    category: 'Analgesic',
    strength: '400 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Abbott Laboratories',
    availableQuantity: 210,
    minStockLevel: 50,
    expiryDate: '2027-10-10',
    purchasePrice: 25,
    salePrice: 65,
    batchNumber: 'BRU-2025-63'
  },
  {
    id: 'med-10',
    name: 'Zyrtec 10',
    genericName: 'Cetirizine Hydrochloride',
    brandName: 'Zyrtec',
    category: 'Antihistamine',
    strength: '10 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Johnson & Johnson',
    availableQuantity: 140,
    minStockLevel: 30,
    expiryDate: '2027-09-01',
    purchasePrice: 40,
    salePrice: 95,
    batchNumber: 'ZYR-2025-39'
  },
  {
    id: 'med-11',
    name: 'Cozaar 50',
    genericName: 'Losartan Potassium',
    brandName: 'Cozaar',
    category: 'Antihypertensive',
    strength: '50 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Organon',
    availableQuantity: 110,
    minStockLevel: 25,
    expiryDate: '2028-01-20',
    purchasePrice: 110,
    salePrice: 230,
    batchNumber: 'COZ-2025-72'
  },
  {
    id: 'med-12',
    name: 'Synthroid 50',
    genericName: 'Levothyroxine Sodium',
    brandName: 'Synthroid',
    category: 'Other',
    strength: '50 mcg',
    dosageForm: 'Tablet',
    manufacturer: 'AbbVie Inc.',
    availableQuantity: 8, // LOW STOCK TRIGGER!
    minStockLevel: 20,
    expiryDate: '2027-06-18',
    purchasePrice: 90,
    salePrice: 190,
    batchNumber: 'SYN-2025-05'
  }
];

export const initialLabCatalog: LabTestCatalog[] = [
  {
    id: 'lab-cat-1',
    testCode: 'CBC-01',
    testName: 'Complete Blood Count (CBC) with Diff',
    category: 'Hematology',
    normalRange: 'WBC: 4.5-11.0 k/uL, RBC: 4.3-5.9 M/uL, Hb: 13.5-17.5 g/dL, PLT: 150-450 k/uL',
    price: 950,
    turnaroundTime: '2-4 hours',
    description: 'Screening for anemia, infection, inflammation, and leukemia'
  },
  {
    id: 'lab-cat-2',
    testCode: 'GLU-02',
    testName: 'Fasting Blood Glucose (FBS)',
    category: 'Biochemistry',
    normalRange: '70 - 99 mg/dL',
    price: 450,
    turnaroundTime: '1-2 hours',
    description: 'Primary diagnostic test for diabetes mellitus and impaired glucose tolerance'
  },
  {
    id: 'lab-cat-3',
    testCode: 'HBA1C-03',
    testName: 'Hemoglobin A1c (Glycated Hb)',
    category: 'Biochemistry',
    normalRange: '< 5.7% (Normal), 5.7-6.4% (Prediabetes), >= 6.5% (Diabetes)',
    price: 1600,
    turnaroundTime: '3 hours',
    description: 'Evaluates long-term glycemic control over past 90-120 days'
  },
  {
    id: 'lab-cat-4',
    testCode: 'LIP-04',
    testName: 'Lipid Profile Comprehensive',
    category: 'Biochemistry',
    normalRange: 'Total Chol < 200 mg/dL, Triglycerides < 150 mg/dL, HDL > 40 mg/dL, LDL < 100 mg/dL',
    price: 1800,
    turnaroundTime: '4 hours',
    description: 'Cardiovascular risk stratification and dyslipidemia diagnosis'
  },
  {
    id: 'lab-cat-5',
    testCode: 'RFT-05',
    testName: 'Renal Function Test (BUN, Creatinine, eGFR, Electrolytes)',
    category: 'Biochemistry',
    normalRange: 'BUN: 7-20 mg/dL, Serum Creatinine: 0.7-1.3 mg/dL, eGFR > 60 mL/min',
    price: 1400,
    turnaroundTime: '3-5 hours',
    description: 'Assessment of glomerular filtration rate and electrolyte balance'
  },
  {
    id: 'lab-cat-6',
    testCode: 'TSH-06',
    testName: 'Thyroid Stimulating Hormone (Ultra-sensitive TSH)',
    category: 'Biochemistry',
    normalRange: '0.45 - 4.50 uIU/mL',
    price: 1500,
    turnaroundTime: '4-6 hours',
    description: 'Primary screening test for hypothyroidism and hyperthyroidism'
  },
  {
    id: 'lab-cat-7',
    testCode: 'ECG-07',
    testName: '12-Lead Diagnostic Electrocardiogram (ECG)',
    category: 'Cardiology',
    normalRange: 'Normal Sinus Rhythm, PR interval 120-200ms, QRS < 120ms',
    price: 1200,
    turnaroundTime: 'Instant (< 30 min)',
    description: 'Detects cardiac arrhythmias, ischemia, and conduction abnormalities'
  },
  {
    id: 'lab-cat-8',
    testCode: 'XRAY-08',
    testName: 'Chest Radiograph X-Ray (PA & Lateral)',
    category: 'Radiology',
    normalRange: 'Clear lung fields, cardiothoracic ratio < 0.5, clear costophrenic angles',
    price: 2000,
    turnaroundTime: '1-2 hours',
    description: 'Evaluates lungs, airway, heart size, and thoracic bony cage'
  }
];

export const initialLabOrders: PatientLabOrder[] = [
  {
    id: 'lbo-1',
    orderNumber: 'LAB-2026-001',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    testCatalogId: 'lab-cat-4',
    testName: 'Lipid Profile Comprehensive',
    category: 'Biochemistry',
    requestedDate: '2026-09-06',
    status: 'Completed',
    resultsSummary: 'Total Cholesterol: 188 mg/dL | Triglycerides: 142 mg/dL | HDL: 46 mg/dL | LDL: 114 mg/dL',
    findings: 'Mild LDL elevation compared to target (<100 mg/dL). Statins therapy effective.',
    completedDate: '2026-09-06T11:45:00Z',
    price: 1800
  },
  {
    id: 'lbo-2',
    orderNumber: 'LAB-2026-002',
    patientId: 'pat-3',
    doctorId: 'doc-2',
    testCatalogId: 'lab-cat-3',
    testName: 'Hemoglobin A1c (Glycated Hb)',
    category: 'Biochemistry',
    requestedDate: '2026-09-06',
    status: 'In Progress',
    resultsSummary: 'Sample collected at 10:40 AM. Processing in chemistry analyzer.',
    price: 1600
  },
  {
    id: 'lbo-3',
    orderNumber: 'LAB-2026-003',
    patientId: 'pat-6',
    doctorId: 'doc-2',
    testCatalogId: 'lab-cat-6',
    testName: 'Thyroid Stimulating Hormone (Ultra-sensitive TSH)',
    category: 'Biochemistry',
    requestedDate: '2026-09-05',
    status: 'Completed',
    resultsSummary: 'TSH: 2.15 uIU/mL (Optimal reference: 0.45 - 4.50 uIU/mL)',
    findings: 'Patient is clinically and biochemically euthyroid on current Levothyroxine 75mcg.',
    completedDate: '2026-09-05T15:30:00Z',
    price: 1500
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    patientId: 'pat-1',
    appointmentId: 'apt-1',
    date: '2026-09-06',
    dueDate: '2026-09-06',
    items: [
      { id: 'ii-1', description: 'Specialist Consultation - Dr. Marcus Vance', category: 'Consultation', quantity: 1, unitPrice: 2500, total: 2500 },
      { id: 'ii-2', description: 'Lipid Profile Comprehensive Lab Analysis', category: 'Laboratory', quantity: 1, unitPrice: 1800, total: 1800 }
    ],
    subtotal: 4300,
    discountPercentage: 0,
    discountAmount: 0,
    taxPercentage: 5,
    taxAmount: 215,
    totalAmount: 4515,
    paidAmount: 4515,
    balanceAmount: 0,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    notes: 'Paid at desk via Visa ending 4019',
    createdAt: '2026-09-06T09:40:00Z'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    patientId: 'pat-2',
    appointmentId: 'apt-2',
    date: '2026-09-06',
    dueDate: '2026-09-06',
    items: [
      { id: 'ii-3', description: 'Specialist Consultation - Dr. Marcus Vance', category: 'Consultation', quantity: 1, unitPrice: 2500, total: 2500 },
      { id: 'ii-4', description: 'Peak Flow Spirometry Measurement', category: 'Procedure', quantity: 1, unitPrice: 800, total: 800 }
    ],
    subtotal: 3300,
    discountPercentage: 10,
    discountAmount: 330,
    taxPercentage: 5,
    taxAmount: 148.50,
    totalAmount: 3118.50,
    paidAmount: 3118.50,
    balanceAmount: 0,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    notes: 'Cash payment received with receipt generated',
    createdAt: '2026-09-06T10:20:00Z'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    patientId: 'pat-4',
    appointmentId: 'apt-4',
    date: '2026-09-06',
    dueDate: '2026-09-20',
    items: [
      { id: 'ii-5', description: 'Family Practice Consultation - Dr. Sarah Jenkins', category: 'Consultation', quantity: 1, unitPrice: 2200, total: 2200 }
    ],
    subtotal: 2200,
    discountPercentage: 0,
    discountAmount: 0,
    taxPercentage: 5,
    taxAmount: 110,
    totalAmount: 2310,
    paidAmount: 0,
    balanceAmount: 2310,
    paymentMethod: 'Insurance',
    paymentStatus: 'Unpaid',
    notes: 'Awaiting insurance pre-authorization claim settlement',
    createdAt: '2026-09-06T08:30:00Z'
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-004',
    patientId: 'pat-5',
    date: '2026-09-05',
    dueDate: '2026-09-12',
    items: [
      { id: 'ii-6', description: 'Diagnostic Uric Acid & Renal Test Panel', category: 'Laboratory', quantity: 1, unitPrice: 1200, total: 1200 },
      { id: 'ii-7', description: 'Allopurinol Dispensation 30-Day Pack', category: 'Pharmacy', quantity: 1, unitPrice: 550, total: 550 }
    ],
    subtotal: 1750,
    discountPercentage: 0,
    discountAmount: 0,
    taxPercentage: 5,
    taxAmount: 87.50,
    totalAmount: 1837.50,
    paidAmount: 1000,
    balanceAmount: 837.50,
    paymentMethod: 'Debit Card',
    paymentStatus: 'Partial',
    notes: 'Partial payment made, balance due on follow-up visit',
    createdAt: '2026-09-05T16:45:00Z'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    expenseNumber: 'EXP-2026-001',
    category: 'Rent',
    description: 'Monthly Clinic Suite Lease - September 2026',
    amount: 85000,
    date: '2026-09-01',
    paymentMethod: 'Bank Wire',
    recordedByUserId: 'u-1',
    recordedByName: 'Dr. Sarah Jenkins',
    notes: 'Transferred to Metro Commercial Realty LLC'
  },
  {
    id: 'exp-2',
    expenseNumber: 'EXP-2026-002',
    category: 'Electricity & Utilities',
    description: 'Electric & HVAC Central Utility Bill',
    amount: 22000,
    date: '2026-09-02',
    paymentMethod: 'Direct Debit',
    recordedByUserId: 'u-4',
    recordedByName: 'Olivia Perez',
    notes: 'Power & Utility Authority'
  },
  {
    id: 'exp-3',
    expenseNumber: 'EXP-2026-003',
    category: 'Medical Supplies',
    description: 'Sterile PPE, Nitrile Gloves, Syringes & Gauze Restock',
    amount: 34000,
    date: '2026-09-03',
    paymentMethod: 'Credit Card',
    recordedByUserId: 'u-4',
    recordedByName: 'Olivia Perez',
    notes: 'MedSupply Direct invoice #MS-88129'
  },
  {
    id: 'exp-4',
    expenseNumber: 'EXP-2026-004',
    category: 'Internet & Phone',
    description: 'High-speed Fiber Broadband & Clinical Telephony',
    amount: 8500,
    date: '2026-09-04',
    paymentMethod: 'Credit Card',
    recordedByUserId: 'u-1',
    recordedByName: 'Dr. Sarah Jenkins',
    notes: 'Dedicated Clinical IP line'
  }
];

export const initialDocuments: MedicalDocument[] = [
  {
    id: 'doc-item-1',
    patientId: 'pat-1',
    title: 'Lipid Panel Laboratory Report (Automated Chemiluminescence)',
    documentType: 'Laboratory Report',
    date: '2026-09-06',
    fileSize: '340 KB',
    uploadedBy: 'Olivia Perez (Reception)',
    notes: 'Apex Diagnostic Labs certified electronic document'
  },
  {
    id: 'doc-item-2',
    patientId: 'pat-3',
    title: 'Coronary Angiography Post-Stent Procedural Discharge Note',
    documentType: 'Discharge Summary',
    date: '2022-04-10',
    fileSize: '1.2 MB',
    uploadedBy: 'Dr. Marcus Vance',
    notes: 'Cardiology Center of Excellence - DES Stent placed in LAD'
  },
  {
    id: 'doc-item-3',
    patientId: 'pat-2',
    title: 'Chest Radiograph PA & Lateral (No infiltrates)',
    documentType: 'X-Ray',
    date: '2026-01-20',
    fileSize: '3.4 MB',
    uploadedBy: 'Dr. Marcus Vance',
    notes: 'Routine baseline chest imaging'
  }
];

export const initialFollowUps: FollowUp[] = [
  {
    id: 'fol-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    consultationId: 'con-1',
    followUpDate: '2026-10-06',
    reason: 'Hypertension maintenance check & evaluate ankle swelling',
    previousDiagnosis: 'Primary Essential Hypertension',
    status: 'Pending',
    notes: 'Check home BP log and evaluate if Amlodipine dose adjustment needed'
  },
  {
    id: 'fol-2',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    consultationId: 'con-2',
    followUpDate: '2026-09-13',
    reason: 'Post-exacerbation asthma recovery review & peak flow re-test',
    previousDiagnosis: 'Acute Mild Exacerbation of Bronchial Asthma',
    status: 'Pending',
    notes: 'Verify cessation of nocturnal wheezing'
  },
  {
    id: 'fol-3',
    patientId: 'pat-5',
    doctorId: 'doc-1',
    followUpDate: '2026-09-15',
    reason: 'Serum Uric Acid level re-check after 4 weeks of Allopurinol',
    previousDiagnosis: 'Hyperuricemia with Gouty Arthropathy',
    status: 'Pending',
    notes: 'Patient reminded to come fasting for lab draw'
  }
];

export const initialNotifications: ClinicNotification[] = [
  {
    id: 'notif-1',
    type: 'low_stock',
    title: 'Low Medicine Stock: Ventolin Inhaler',
    message: 'Only 4 units left of Ventolin HFA (Min threshold: 15). Place reorder immediately.',
    severity: 'critical',
    date: '2026-09-06T08:00:00Z',
    isRead: false,
    linkTab: 'medicines',
    linkId: 'med-7'
  },
  {
    id: 'notif-2',
    type: 'expiring_medicine',
    title: 'Expiring Medicine: Zithromax 500mg',
    message: 'Batch ZIT-2024-12 expires on 2026-09-28 (22 days remaining).',
    severity: 'warning',
    date: '2026-09-06T08:05:00Z',
    isRead: false,
    linkTab: 'medicines',
    linkId: 'med-8'
  },
  {
    id: 'notif-3',
    type: 'appointment',
    title: 'Patient Checked In: Michael Chen',
    message: 'Patient is waiting in Reception Area for Dr. Emily Chen (Token #3).',
    severity: 'info',
    date: '2026-09-06T10:15:00Z',
    isRead: false,
    linkTab: 'appointments',
    linkId: 'apt-3'
  },
  {
    id: 'notif-4',
    type: 'unpaid_invoice',
    title: 'Outstanding Patient Balance: David Kim',
    message: 'Invoice INV-2026-004 has an unpaid balance of PKR 837.50 due on follow-up.',
    severity: 'warning',
    date: '2026-09-05T17:00:00Z',
    isRead: true,
    linkTab: 'billing',
    linkId: 'inv-4'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    userId: 'u-1',
    userName: 'Dr. Sarah Jenkins',
    userRole: 'admin',
    action: 'SYSTEM_BOOTSTRAP',
    module: 'System',
    recordAffected: 'ClinicOS Relational Engine',
    timestamp: '2026-09-06T07:30:00Z',
    details: 'Relational tables, foreign constraints, and initial schema loaded successfully.'
  },
  {
    id: 'aud-2',
    userId: 'u-4',
    userName: 'Olivia Perez',
    userRole: 'receptionist',
    action: 'USER_LOGIN',
    module: 'Authentication',
    recordAffected: 'Session u-4',
    timestamp: '2026-09-06T07:55:12Z',
    details: 'Reception station authenticated from FrontDesk-Terminal-1.'
  },
  {
    id: 'aud-3',
    userId: 'u-2',
    userName: 'Dr. Marcus Vance',
    userRole: 'doctor',
    action: 'CONSULTATION_SAVED',
    module: 'EMR / Consultation',
    recordAffected: 'CON-2026-001 (Patient: Johnathan Hayes)',
    timestamp: '2026-09-06T09:25:34Z',
    details: 'Recorded patient vitals, diagnosis of Essential HTN, and generated Rx-2026-001.'
  },
  {
    id: 'aud-4',
    userId: 'u-4',
    userName: 'Olivia Perez',
    userRole: 'receptionist',
    action: 'INVOICE_GENERATED',
    module: 'Billing',
    recordAffected: 'INV-2026-001 (PKR 4,515.00 Paid)',
    timestamp: '2026-09-06T09:40:19Z',
    details: 'Recorded credit card payment for consultation and lab tests.'
  },
  {
    id: 'aud-5',
    userId: 'u-4',
    userName: 'Olivia Perez',
    userRole: 'receptionist',
    action: 'PATIENT_CHECKIN',
    module: 'Appointments',
    recordAffected: 'APT-2026-003 (Michael Chen)',
    timestamp: '2026-09-06T10:15:02Z',
    details: 'Status switched to Waiting for Dr. Emily Chen.'
  }
];
