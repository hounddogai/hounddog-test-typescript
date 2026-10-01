import type { PatientFields, Visit } from "./types";

const patientFieldNames = [
  "firstName",
  "lastName",
  "mrn",
  "dob",
  "address",
  "phoneNumber",
  "bloodType",
  "notes",
] as const satisfies readonly (keyof PatientFields)[];

const readText = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
};

/** Reads the patient form, ignoring anything that is not a known demographic field. */
export function readPatientFields(formData: FormData): PatientFields {
  return Object.fromEntries(patientFieldNames.map((name) => [name, readText(formData, name)]));
}

export function readVisit(formData: FormData): Visit {
  return {
    date: readText(formData, "date"),
    vitalSigns: readText(formData, "vitalSigns"),
    patientSymptoms: readText(formData, "patientSymptoms"),
    medicalDiagnosis: readText(formData, "medicalDiagnosis"),
    medicalTreatment: readText(formData, "medicalTreatment"),
  };
}
