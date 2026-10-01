import { Link } from "react-router";

import { buttonClass, Panel } from "~/components/ui";
import { listPatients } from "~/lib/api.server";
import { displayName, formatDate } from "~/lib/format";

import type { Route } from "./+types/dashboard";

export const meta: Route.MetaFunction = () => [{ title: "Dashboard | Avocado Doctors Portal" }];

export async function loader() {
  const patients = await listPatients();
  const recentVisits = patients
    .flatMap((patient) => patient.visits.map((visit) => ({ patientId: patient.id, name: displayName(patient), visit })))
    .toSorted((a, b) => b.visit.date.localeCompare(a.visit.date))
    .slice(0, 5);
  return {
    patientCount: patients.length,
    visitCount: patients.reduce((total, patient) => total + patient.visits.length, 0),
    recentVisits,
  };
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-emerald-800">{value}</p>
    </div>
  );
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { patientCount, visitCount, recentVisits } = loaderData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Good day, Dr. Doe</h1>
          <p className="mt-1 text-sm text-slate-600">
            A test healthcare app for the HoundDog.ai scanner. See{" "}
            <a href="https://docs.hounddog.ai" className="text-emerald-700 underline" target="_blank" rel="noreferrer">
              the HoundDog.ai docs
            </a>
            .
          </p>
        </div>
        <Link to="/patients/new" className={buttonClass()}>
          Register a patient
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Patients under care" value={patientCount} />
        <Stat label="Visits on file" value={visitCount} />
      </div>

      <Panel
        title="Recent visits"
        actions={
          <Link to="/patients" className="text-sm font-medium text-emerald-700 hover:underline">
            All patients
          </Link>
        }
      >
        {recentVisits.length ? (
          <ul className="divide-y divide-slate-100">
            {recentVisits.map(({ patientId, name, visit }, position) => (
              <li key={`${patientId}-${position}`} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <Link to={`/patients/${patientId}/visits`} className="font-medium hover:text-emerald-700">
                    {name}
                  </Link>
                  <p className="text-sm text-slate-500">{visit.medicalDiagnosis || "No diagnosis recorded"}</p>
                </div>
                <time dateTime={visit.date} className="text-sm whitespace-nowrap text-slate-500">
                  {formatDate(visit.date)}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No visits have been recorded yet.</p>
        )}
      </Panel>
    </div>
  );
}
