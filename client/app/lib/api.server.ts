import { data } from "react-router";

import type { Patient, PatientFields, Visit } from "./types";

// Only loaders and actions call this module, so the API only has to be reachable from the React Router server.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5174";

async function callApi<T>(path: string, method = "GET", payload?: unknown): Promise<T> {
  const response = await fetch(new URL(path, apiBaseUrl), {
    method,
    headers: payload === undefined ? undefined : { "Content-Type": "application/json" },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
  if (!response.ok) {
    throw data(await response.text(), { status: response.status, statusText: response.statusText });
  }
  return (response.status === 204 ? undefined : await response.json()) as T;
}

const patientPath = (patientId: string) => `/patients/${encodeURIComponent(patientId)}`;

export const listPatients = (search = "") => callApi<Patient[]>(`/patients?${new URLSearchParams({ search })}`);

export const getPatient = (patientId: string) => callApi<Patient>(patientPath(patientId));

export const registerPatient = (fields: PatientFields) => callApi<Patient>("/patients", "POST", fields);

export const updatePatient = (patientId: string, fields: PatientFields) =>
  callApi<Patient>(patientPath(patientId), "PATCH", fields);

export const recordVisit = (patientId: string, visit: Visit) =>
  callApi<Patient>(`${patientPath(patientId)}/visits`, "POST", visit);

export const removePatient = (patientId: string) => callApi<void>(patientPath(patientId), "DELETE");
