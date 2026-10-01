// In-memory patient registry. Records live only as long as the process, which is all this fixture needs.

const patientFields = ["firstName", "lastName", "mrn", "dob", "address", "phoneNumber", "bloodType", "notes"];
const visitFields = ["date", "vitalSigns", "patientSymptoms", "medicalDiagnosis", "medicalTreatment"];

/** Copies the allowed string fields from an untrusted request body. */
const pickText = (source, fieldNames) =>
  Object.fromEntries(
    fieldNames.filter((name) => typeof source?.[name] === "string").map((name) => [name, source[name].trim()]),
  );

const sortKey = (patient) => `${patient.lastName ?? ""}\u0000${patient.firstName ?? ""}`.toLowerCase();

export class PatientRegistry {
  #records = new Map();
  #sequence = 0;

  register(fields) {
    this.#sequence += 1;
    const id = `pt-${String(this.#sequence).padStart(4, "0")}`;
    const record = { id, registeredAt: new Date().toISOString(), ...pickText(fields, patientFields), visits: [] };
    this.#records.set(id, record);
    return structuredClone(record);
  }

  find(id) {
    const record = this.#records.get(id);
    return record ? structuredClone(record) : null;
  }

  /** Patients whose name or MRN contains the search text, ordered by last name and then first name. */
  search(text = "") {
    const needle = text.trim().toLowerCase();
    return [...this.#records.values()]
      .filter(
        (record) =>
          !needle ||
          [record.firstName, record.lastName, record.mrn].some((value) => value?.toLowerCase().includes(needle)),
      )
      .toSorted((a, b) => sortKey(a).localeCompare(sortKey(b)))
      .map((record) => structuredClone(record));
  }

  update(id, fields) {
    const record = this.#records.get(id);
    if (!record) {
      return null;
    }
    Object.assign(record, pickText(fields, patientFields));
    return structuredClone(record);
  }

  addVisit(id, visit) {
    const record = this.#records.get(id);
    if (!record) {
      return null;
    }
    record.visits.push(pickText(visit, visitFields));
    return structuredClone(record);
  }

  remove(id) {
    return this.#records.delete(id);
  }
}

// Fake people for local development. None of them exist.
const seedRecords = [
  {
    firstName: "Maria",
    lastName: "Alvarez",
    mrn: "104-552-318",
    dob: "1961-07-14",
    address: "48 Willow Lane, Riverton, OR 97001",
    phoneNumber: "555-014-2290",
    bloodType: "O-",
    notes: "Type 2 diabetes, managed with metformin. Allergic to sulfa drugs.",
    visits: [
      {
        date: "2026-03-02",
        vitalSigns: "BP 138/86, HR 76, Temp 98.4 F",
        patientSymptoms: "Tingling in both feet",
        medicalDiagnosis: "Early peripheral neuropathy",
        medicalTreatment: "Foot care plan, HbA1c recheck in 3 months",
      },
    ],
  },
  {
    firstName: "Daniel",
    lastName: "Okafor",
    mrn: "207-981-460",
    dob: "1988-11-30",
    address: "1290 Harbor View Rd, Apt 5C, Riverton, OR 97003",
    phoneNumber: "555-018-7741",
    bloodType: "B+",
    visits: [
      {
        date: "2026-01-19",
        vitalSigns: "BP 122/78, HR 88, Temp 101.2 F",
        patientSymptoms: "Fever, body aches, dry cough",
        medicalDiagnosis: "Influenza A",
        medicalTreatment: "Oseltamivir 75mg twice daily for 5 days",
      },
      {
        date: "2026-05-07",
        vitalSigns: "BP 118/76, HR 64, Temp 98.6 F",
        patientSymptoms: "Right ankle pain after a run",
        medicalDiagnosis: "Grade 1 ankle sprain",
        medicalTreatment: "Rest, ice, compression, ibuprofen 400mg as needed",
      },
    ],
  },
  {
    firstName: "Hannah",
    lastName: "Lindqvist",
    mrn: "315-240-907",
    dob: "2004-02-08",
    address: "7 Orchard Court, Riverton, OR 97002",
    phoneNumber: "555-012-3365",
    bloodType: "A+",
    notes: "Seasonal allergies. Prefers text message reminders.",
    visits: [],
  },
  {
    firstName: "Samuel",
    lastName: "Reyes",
    mrn: "422-673-115",
    dob: "1975-09-21",
    address: "860 Cedar Ridge Dr, Riverton, OR 97004",
    phoneNumber: "555-019-5502",
    bloodType: "AB+",
    visits: [
      {
        date: "2026-04-11",
        vitalSigns: "BP 146/94, HR 80",
        patientSymptoms: "Morning headaches",
        medicalDiagnosis: "Stage 2 hypertension",
        medicalTreatment: "Lisinopril 10mg daily, low sodium diet",
      },
    ],
  },
];

/** A registry pre-filled with the fake patients, with IDs `pt-0001` to `pt-0004` in the order above. */
export function createSeededRegistry() {
  const registry = new PatientRegistry();
  for (const { visits, ...fields } of seedRecords) {
    const { id } = registry.register(fields);
    for (const visit of visits) {
      registry.addVisit(id, visit);
    }
  }
  return registry;
}
