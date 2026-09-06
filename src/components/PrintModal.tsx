import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Printer, X, ShieldCheck, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';
import { Prescription, Invoice, PatientLabOrder, Patient } from '../types';

export const PrintModal: React.FC = () => {
  const { printModalData, closePrintModal, settings, getPatient, getDoctor } = useClinic();

  if (!printModalData) return null;

  const { type, data } = printModalData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-slate-900 capitalize">
              Print Preview: {type.replace('_', ' ')}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              onClick={closePrintModal}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white printable-card text-slate-900 font-sans">
          
          {/* Clinic Official Letterhead */}
          <div className="border-b-2 border-teal-600 pb-5 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                    +
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{settings.clinicName}</h1>
                    <p className="text-xs text-teal-700 font-medium">{settings.tagline}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                  <div>{settings.address}</div>
                  <div>Phone: {settings.phone} • Email: {settings.email} • Web: {settings.website}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block px-3 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider">
                  Official Medical Document
                </div>
                <div className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* PRESCRIPTION VIEW */}
          {type === 'prescription' && (() => {
            const rx = data as Prescription;
            const patient = getPatient(rx.patientId);
            const doctor = getDoctor(rx.doctorId);

            return (
              <div className="space-y-6">
                {/* Doctor & Patient Info Bar */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{doctor?.name}</div>
                    <div className="text-teal-700 font-medium">{doctor?.specialization}</div>
                    <div className="text-slate-500">{doctor?.qualification} • Lic: {doctor?.licenseNumber}</div>
                    <div className="text-slate-500">{doctor?.roomNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800 text-sm">{patient?.fullName}</div>
                    <div className="text-slate-600">MRN: <span className="font-mono font-semibold text-slate-800">{patient?.mrn}</span></div>
                    <div className="text-slate-500">Age / Gender: {patient?.age} yrs • {patient?.gender}</div>
                    <div className="text-slate-500">Date: {rx.date}</div>
                  </div>
                </div>

                {/* Patient Allergies Warning Banner if present */}
                {patient?.allergies && patient.allergies.length > 0 && (
                  <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                    <span className="font-bold">ALLERGIES RECORDED:</span>
                    <span>{patient.allergies.join(', ')}</span>
                  </div>
                )}

                {/* Clinical Diagnosis */}
                <div className="border-b border-slate-200 pb-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Clinical Diagnosis</div>
                  <div className="text-base font-semibold text-slate-800">{rx.diagnosis}</div>
                </div>

                {/* Rx Symbol and Medications */}
                <div>
                  <div className="flex items-center gap-2 text-2xl font-serif font-black text-teal-800 mb-3">
                    <span>℞</span>
                    <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-500">Prescribed Medications</span>
                  </div>

                  <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">#</th>
                        <th className="py-2.5 px-3 font-semibold">Medicine & Strength</th>
                        <th className="py-2.5 px-3 font-semibold">Dosage / Form</th>
                        <th className="py-2.5 px-3 font-semibold">Frequency</th>
                        <th className="py-2.5 px-3 font-semibold">Duration</th>
                        <th className="py-2.5 px-3 font-semibold">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rx.medicines.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {item.medicineName}
                            {item.genericName && <div className="text-[10px] text-slate-400 font-normal">{item.genericName}</div>}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-700">{item.dosage}</td>
                          <td className="py-2.5 px-3 text-slate-700">{item.frequency}</td>
                          <td className="py-2.5 px-3 text-slate-700">{item.duration}</td>
                          <td className="py-2.5 px-3 text-teal-800 italic">{item.instructions || 'As directed'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recommended Tests & Advice */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {rx.laboratoryTestsRecommended && rx.laboratoryTestsRecommended.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-700 mb-1">Recommended Laboratory Investigations:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                        {rx.laboratoryTestsRecommended.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rx.adviceNotes && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-700 mb-1">General Advice & Dietary Notes:</div>
                      <p className="text-slate-600 leading-relaxed">{rx.adviceNotes}</p>
                    </div>
                  )}
                </div>

                {/* Follow-up & Doctor Signature Block */}
                <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
                  <div className="text-xs">
                    {rx.followUpDate ? (
                      <div className="text-slate-700">
                        <span className="font-bold">Next Follow-up Date:</span>{' '}
                        <span className="text-teal-800 font-semibold">{rx.followUpDate}</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic">Follow-up as needed.</div>
                    )}
                    <div className="text-[10px] text-slate-400 mt-1 max-w-sm">
                      {settings.prescriptionHeaderNote}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-serif italic text-base text-slate-800 pb-1">
                      {doctor?.signatureText || doctor?.name}
                    </div>
                    <div className="border-t border-slate-400 pt-1 text-xs font-semibold text-slate-700">
                      Physician Signature
                    </div>
                    <div className="text-[10px] text-slate-400">{settings.doctorSignatureNote}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* INVOICE VIEW */}
          {type === 'invoice' && (() => {
            const inv = data as Invoice;
            const patient = getPatient(inv.patientId);

            return (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Billed To</div>
                    <div className="text-base font-bold text-slate-800 mt-1">{patient?.fullName}</div>
                    <div className="text-xs text-slate-500">MRN: {patient?.mrn}</div>
                    <div className="text-xs text-slate-500">{patient?.phone} • {patient?.address}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-lg font-bold text-teal-800">{inv.invoiceNumber}</div>
                    <div className="text-slate-500">Date: {inv.date}</div>
                    <div className="text-slate-500">Due Date: {inv.dueDate}</div>
                    <div className={`mt-2 inline-block px-2.5 py-0.5 rounded font-bold uppercase text-[11px] ${
                      inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      inv.paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      Status: {inv.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">#</th>
                      <th className="py-2.5 px-3 font-semibold">Service / Description</th>
                      <th className="py-2.5 px-3 font-semibold">Category</th>
                      <th className="py-2.5 px-3 text-center font-semibold">Qty</th>
                      <th className="py-2.5 px-3 text-right font-semibold">Unit Price ({settings.currencySymbol})</th>
                      <th className="py-2.5 px-3 text-right font-semibold">Total ({settings.currencySymbol})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inv.items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{item.description}</td>
                        <td className="py-2.5 px-3 text-slate-500">{item.category}</td>
                        <td className="py-2.5 px-3 text-center text-slate-700">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700">{settings.currencySymbol}{item.unitPrice.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">{settings.currencySymbol}{item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Calculation Summary */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{settings.currencySymbol}{inv.subtotal.toFixed(2)}</span>
                    </div>
                    {inv.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount ({inv.discountPercentage}%):</span>
                        <span>-{settings.currencySymbol}{inv.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Tax ({inv.taxPercentage}%):</span>
                      <span className="font-semibold">{settings.currencySymbol}{inv.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-300 pt-1.5 flex justify-between text-sm font-bold text-slate-900">
                      <span>Grand Total:</span>
                      <span className="text-teal-800">{settings.currencySymbol}{inv.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Amount Paid ({inv.paymentMethod}):</span>
                      <span className="font-semibold text-emerald-700">{settings.currencySymbol}{inv.paidAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dashed border-slate-300 pt-1.5 flex justify-between font-bold text-xs">
                      <span>Remaining Balance:</span>
                      <span className={inv.balanceAmount > 0 ? 'text-rose-600' : 'text-slate-800'}>
                        {settings.currencySymbol}{inv.balanceAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex justify-between items-center">
                  <div>{settings.invoiceFooterNote}</div>
                  <div className="font-medium text-slate-700">Authorized Front Desk Officer</div>
                </div>
              </div>
            );
          })()}

          {/* LABORATORY REPORT VIEW */}
          {type === 'lab' && (() => {
            const order = data as PatientLabOrder;
            const patient = getPatient(order.patientId);
            const doctor = getDoctor(order.doctorId);

            return (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{patient?.fullName}</div>
                    <div className="text-slate-600">MRN: {patient?.mrn}</div>
                    <div className="text-slate-600">Age: {patient?.age} • Gender: {patient?.gender}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">Order #: {order.orderNumber}</div>
                    <div className="text-slate-600">Referred by: {doctor?.name}</div>
                    <div className="text-slate-600">Date: {order.requestedDate}</div>
                    <div className="text-teal-700 font-semibold uppercase mt-1">Status: {order.status}</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{order.testName}</h4>
                      <span className="text-xs text-slate-500 font-medium">Category: {order.category}</span>
                    </div>
                    <div className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-800 rounded">
                      Clinical Pathology Report
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Test Results & Findings</div>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs text-slate-800 whitespace-pre-wrap border border-slate-200">
                      {order.resultsSummary || 'Sample under examination. Quantitative values pending laboratory completion.'}
                    </div>
                  </div>

                  {order.normalRange && (
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Standard Biological Reference Range: </span>
                      {order.normalRange}
                    </div>
                  )}

                  {order.findings && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Pathologist Interpretation</div>
                      <p className="text-xs text-slate-700 leading-relaxed">{order.findings}</p>
                    </div>
                  )}
                </div>

                <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-xs text-slate-500">
                  <div>Results verified by Automated Clinical Analyzer.</div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">Chief Clinical Pathologist</div>
                    <div>Apex Diagnostics Laboratory Services</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* PATIENT SUMMARY CARD */}
          {type === 'patient_summary' && (() => {
            const patient = data as Patient;
            return (
              <div className="space-y-5 text-xs">
                <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{patient.fullName}</h3>
                    <div className="text-teal-800 font-semibold font-mono">Medical Record Number: {patient.mrn}</div>
                    <div className="text-slate-600 mt-1">{patient.gender} • DOB: {patient.dob} ({patient.age} yrs) • Blood Group: <span className="font-bold text-slate-900">{patient.bloodGroup}</span></div>
                  </div>
                  <div className="text-right text-slate-600">
                    <div>Phone: {patient.phone}</div>
                    <div>Email: {patient.email}</div>
                    <div>Emergency: {patient.emergencyContactName} ({patient.emergencyContactPhone})</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
                    <div className="font-bold text-rose-900 mb-1">Documented Allergies</div>
                    <div className="text-rose-800">
                      {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'No known drug allergies (NKDA)'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="font-bold text-slate-800 mb-1">Chronic Medical Conditions</div>
                    <div className="text-slate-700">
                      {patient.existingConditions.length > 0 ? patient.existingConditions.join(', ') : 'None recorded'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="font-bold text-slate-800 mb-1">Previous Surgeries / Interventions</div>
                    <div className="text-slate-700">
                      {patient.previousSurgeries.length > 0 ? patient.previousSurgeries.join(', ') : 'No surgical history'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="font-bold text-slate-800 mb-1">Active Routine Medications</div>
                    <div className="text-slate-700">
                      {patient.currentMedications.length > 0 ? patient.currentMedications.join(', ') : 'No active continuous medications'}
                    </div>
                  </div>
                </div>

                {patient.familyHistory && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="font-bold text-slate-800 mb-1">Family Medical History</div>
                    <div className="text-slate-700">{patient.familyHistory}</div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200 text-slate-400 text-center text-[11px]">
                  Confidential Medical Record. Authorized for clinical reference only.
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
};
