/** Demographic fields a doctor can enter when registering or editing a patient. */
export type PatientFields = {
  firstName?: string;
  lastName?: string;
  mrn?: string;
  dob?: string;
  address?: string;
  phoneNumber?: string;
  bloodType?: string;
  notes?: string;
};

export type Visit = {
  date: string;
  vitalSigns?: string;
  patientSymptoms?: string;
  medicalDiagnosis?: string;
  medicalTreatment?: string;
};

export type Patient = PatientFields & {
  id: string;
  registeredAt: string;
  visits: Visit[];
};

declare global {
  interface Window {
    /** Google Tag Manager event queue. */
    dataLayer?: Record<string, unknown>[];
  }
}
